/**
 * Scraper for decisions.court.gov.il
 * The sole data source for court judgments
 * Uses NTLM authentication (Windows/IIS)
 *
 * Structure:
 *   decisions.court.gov.il/
 *     2026-5-12/
 *       {hexhash}.pdf
 *       {hexhash}.docx
 *     2026-6-18/
 *       ...
 */

import { createSlug } from './judgment-store';
import { analyzeJudgment } from './gemini';
import { detectCategory } from './scrapers';

const GOV_BASE_URL = 'https://decisions.court.gov.il';

// NTLM Auth credentials (from environment variables)
const GOV_USERNAME = process.env.GOV_USERNAME || '';
const GOV_PASSWORD = process.env.GOV_PASSWORD || '';

// Rate limiting
const DELAY_BETWEEN_REQUESTS = 3000; // 3 seconds
const MAX_FILES_PER_RUN = 100;

// Blacklisted case numbers - court-ordered confidential cases
// These will never be imported or published
const BLACKLISTED_CASES = new Set([
  '26544-03-26',
  'ת"א 26544-03-26',
]);

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Make an NTLM-authenticated GET request
 */
async function ntlmGet(url: string): Promise<{ statusCode: number; body: string; buffer?: Buffer }> {
  const httpntlm = await import('httpntlm');
  return new Promise((resolve, reject) => {
    httpntlm.get({
      url,
      username: GOV_USERNAME,
      password: GOV_PASSWORD,
    }, (err: Error | null, res: { statusCode: number; body: string }) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

/**
 * Download a binary file with NTLM auth
 */
async function ntlmDownload(url: string): Promise<Buffer> {
  const httpntlm = await import('httpntlm');
  return new Promise((resolve, reject) => {
    httpntlm.get({
      url,
      username: GOV_USERNAME,
      password: GOV_PASSWORD,
      binary: true,
    }, (err: Error | null, res: { statusCode: number; body: Buffer }) => {
      if (err) reject(err);
      else if (res.statusCode === 401 || res.statusCode === 403) reject(new Error(`Auth failed: HTTP ${res.statusCode} - check GOV_USERNAME/GOV_PASSWORD`));
      else if (res.statusCode !== 200) reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      else resolve(Buffer.from(res.body));
    });
  });
}

export interface GovDecisionItem {
  title: string;
  slug: string;
  caseNumber: string;
  courtName: string;
  procedureType: string;
  judgmentDate: string;
  judge: string;
  plaintiff: string;
  defendant: string;
  parties: string;
  summary: string;
  fullText: string;
  firstPageText: string;
  sourceUrl: string;
  pdfUrl: string;
  sourceName: string;
  category: string;
  status: string;
  govFileId: string;
  govFolderDate: string;
  pdfPageCount: number;
}

/**
 * Fetch the root directory listing and return date folder names
 */
async function fetchDateFolders(): Promise<string[]> {
  const res = await ntlmGet(GOV_BASE_URL + '/');

  if (res.statusCode === 401 || res.statusCode === 403) {
    throw new Error(`Auth failed: HTTP ${res.statusCode} - NTLM credentials may be expired`);
  }
  if (res.statusCode !== 200) {
    throw new Error(`Failed to fetch root listing: HTTP ${res.statusCode}`);
  }

  const html = res.body;
  console.log(`[gov-scraper] Root listing size: ${html.length} chars`);
  const folderPattern = /href="\/(\d{4}-\d{1,2}-\d{1,2})\/?"/gi;
  const folders: string[] = [];
  let match;

  while ((match = folderPattern.exec(html)) !== null) {
    folders.push(match[1]);
  }

  // Sort by date descending (newest first)
  folders.sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateB.getTime() - dateA.getTime();
  });

  return folders;
}

/**
 * Fetch file listing for a specific date folder
 * Returns only PDF filenames (skip DOCX)
 */
async function fetchFolderFiles(folderDate: string): Promise<string[]> {
  const res = await ntlmGet(`${GOV_BASE_URL}/${folderDate}/`);

  if (res.statusCode !== 200) {
    throw new Error(`Failed to fetch folder ${folderDate}: HTTP ${res.statusCode}`);
  }

  const html = res.body;
  // HREF includes full path like /2026-6-18/abc123.pdf (case-insensitive)
  const filePattern = /HREF="[^"]*\/([0-9a-f]+\.pdf)"/gi;
  const files: string[] = [];
  let match;

  while ((match = filePattern.exec(html)) !== null) {
    files.push(match[1]);
  }

  return files;
}

/**
 * Download a PDF and extract text using pdf-parse
 */
// Track last PDF parse error for debugging
let lastPdfParseError = '';

async function downloadAndParsePDF(folderDate: string, filename: string): Promise<{
  fullText: string;
  firstPageText: string;
  pageCount: number;
} | null> {
  const url = `${GOV_BASE_URL}/${folderDate}/${filename}`;

  try {
    const buffer = await ntlmDownload(url);

    // Verify we got a real PDF (starts with %PDF)
    const header = buffer.slice(0, 5).toString('ascii');
    if (!header.startsWith('%PDF')) {
      const preview = buffer.slice(0, 200).toString('utf-8');
      lastPdfParseError = `Not a PDF (header: ${header}). Preview: ${preview.slice(0, 80)}`;
      console.error(`[gov-scraper] ${filename}: ${lastPdfParseError}`);
      return null;
    }

    console.log(`[gov-scraper] ${filename}: Downloaded ${buffer.length} bytes, valid PDF`);

    // Polyfills for Alpine/Docker environments (required by pdfjs-dist)
    if (typeof globalThis.DOMMatrix === 'undefined') {
      globalThis.DOMMatrix = class DOMMatrix {
        a=1;b=0;c=0;d=1;e=0;f=0;is2D=true;isIdentity=true;
        m11=1;m12=0;m13=0;m14=0;m21=0;m22=1;m23=0;m24=0;
        m31=0;m32=0;m33=1;m34=0;m41=0;m42=0;m43=0;m44=1;
        constructor() {}
        inverse() { return new DOMMatrix(); }
        multiply() { return new DOMMatrix(); }
        translate() { return new DOMMatrix(); }
        scale() { return new DOMMatrix(); }
        rotate() { return new DOMMatrix(); }
        transformPoint(p: any) { return p || {x:0,y:0}; }
        toString() { return 'matrix(1,0,0,1,0,0)'; }
        static fromMatrix() { return new DOMMatrix(); }
        static fromFloat32Array() { return new DOMMatrix(); }
        static fromFloat64Array() { return new DOMMatrix(); }
      } as unknown as typeof DOMMatrix;
    }
    if (typeof (globalThis as any).Path2D === 'undefined') {
      (globalThis as any).Path2D = class Path2D {
        constructor() {}
        addPath() {}
        closePath() {}
        moveTo() {}
        lineTo() {}
        bezierCurveTo() {}
        quadraticCurveTo() {}
        arc() {}
        arcTo() {}
        ellipse() {}
        rect() {}
      };
    }

    // Extract text from PDF - try multiple approaches for Alpine compatibility
    let fullText = '';
    let firstPageText = '';
    let pageCount = 1;

    // Approach 1: pdf-parse (most reliable in Docker/Alpine)
    try {
      const pdfParseModule = await import('pdf-parse');
      const pdfParse = (pdfParseModule as any).default || pdfParseModule;
      const result = await pdfParse(buffer);
      fullText = result.text || '';
      pageCount = result.numpages || 1;
      firstPageText = fullText.slice(0, 3000);
    } catch (e1) {
      console.warn(`[gov-scraper] pdf-parse failed for ${filename}: ${String(e1).slice(0, 200)}`);

      // Approach 2: pdf2json fallback
      try {
        const { default: PDFParser } = await import('pdf2json');
        const result = await new Promise<{ text: string; pages: number }>((resolve, reject) => {
          const parser = new PDFParser();
          parser.on('pdfParser_dataReady', (data: any) => {
            const text = data.Pages.map((p: any) =>
              p.Texts.map((t: any) => decodeURIComponent(t.R[0]?.T || '')).join(' ')
            ).join('\n');
            resolve({ text, pages: data.Pages.length });
          });
          parser.on('pdfParser_dataError', (err: any) => reject(err));
          parser.parseBuffer(buffer);
        });
        fullText = result.text;
        pageCount = result.pages;
        firstPageText = fullText.split('\n')[0]?.slice(0, 2000) || fullText.slice(0, 2000);
      } catch (e2) {
        lastPdfParseError = `pdf-parse: ${String(e1).slice(0, 80)} | pdf2json: ${String(e2).slice(0, 80)}`;
        console.error(`[gov-scraper] All parsers failed for ${filename}: ${lastPdfParseError}`);
        return null;
      }
    }

    // If text is empty or just page separators, log it
    const cleanText = fullText.replace(/--\s*\d+\s*of\s*\d+\s*--/g, '').trim();
    if (!cleanText) {
      lastPdfParseError = `Empty text after extraction (${pageCount} pages, ${buffer.length} bytes - scanned/image PDF?)`;
      console.warn(`[gov-scraper] ${filename}: ${lastPdfParseError}`);
      return null;
    }

    return { fullText: cleanText, firstPageText: firstPageText || cleanText.slice(0, 2000), pageCount };
  } catch (e) {
    lastPdfParseError = `Download/outer error: ${String(e).slice(0, 100)}`;
    console.error(`[gov-scraper] ${filename}: ${lastPdfParseError}`);
    return null;
  }
}

/**
 * Convert folder date string to ISO date
 * "2026-5-12" -> "2026-05-12"
 */
function folderDateToISO(folderDate: string): string {
  const parts = folderDate.split('-');
  if (parts.length !== 3) return new Date().toISOString().split('T')[0];
  const [year, month, day] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Main scraper function - fetches new judgments from decisions.court.gov.il
 */
export async function scrapeGovDecisions(existingGovFileIds: Set<string>, confidentialCaseNumbers: Set<string> = new Set()): Promise<{
  items: GovDecisionItem[];
  errors: string[];
  processedFolders: string[];
}> {
  const items: GovDecisionItem[] = [];
  const errors: string[] = [];
  const processedFolders: string[] = [];
  let totalProcessed = 0;

  if (!GOV_USERNAME || !GOV_PASSWORD) {
    errors.push('decisions.court.gov.il: חסרים פרטי התחברות (GOV_USERNAME / GOV_PASSWORD)');
    console.error('[gov-scraper] Missing GOV_USERNAME or GOV_PASSWORD environment variables');
    return { items, errors, processedFolders };
  }

  try {
    // Step 1: Get all date folders
    console.log('[gov-scraper] Fetching date folders with NTLM auth...');
    const folders = await fetchDateFolders();
    console.log(`[gov-scraper] Found ${folders.length} date folders`);

    if (folders.length === 0) {
      errors.push('decisions.court.gov.il: לא נמצאו תיקיות תאריך');
      return { items, errors, processedFolders };
    }

    // Step 2: Process folders (newest first)
    let skippedExisting = 0;
    for (const folder of folders) {
      if (totalProcessed >= MAX_FILES_PER_RUN) {
        console.log(`[gov-scraper] Reached max files limit (${MAX_FILES_PER_RUN})`);
        break;
      }

      try {
        await sleep(DELAY_BETWEEN_REQUESTS);
        const files = await fetchFolderFiles(folder);
        const newFiles = files.filter(f => !existingGovFileIds.has(f.replace('.pdf', '')));
        console.log(`[gov-scraper] Folder ${folder}: ${files.length} PDFs (${newFiles.length} new, ${files.length - newFiles.length} existing)`);
        processedFolders.push(folder);

        // Skip folder entirely if no new files
        if (newFiles.length === 0) {
          skippedExisting += files.length;
          continue;
        }

        // Step 3: Process each PDF file
        for (const filename of files) {
          if (totalProcessed >= MAX_FILES_PER_RUN) break;

          const fileId = filename.replace('.pdf', '');

          // Skip if already in DB
          if (existingGovFileIds.has(fileId)) {
            continue;
          }

          console.log(`[gov-scraper] Processing ${folder}/${filename}...`);
          await sleep(DELAY_BETWEEN_REQUESTS);

          // Download and parse PDF
          const parsed = await downloadAndParsePDF(folder, filename);
          if (!parsed) {
            errors.push(`${folder}/${filename}: ${lastPdfParseError || 'PDF parse failed'}`);
            totalProcessed++;
            continue;
          }
          if (!parsed.firstPageText) {
            errors.push(`${folder}/${filename}: טקסט ריק לאחר חילוץ`);
            totalProcessed++;
            continue;
          }

          // Use Gemini AI to extract metadata from first page text
          let metadata = {
            judge: '',
            plaintiff: '',
            defendant: '',
            procedureType: 'אזרחי',
            category: 'אזרחי',
            summary: '',
            decisionType: 'פסק דין',
            courtName: 'בית משפט',
            caseNumber: '',
            date: folderDateToISO(folder),
          };

          try {
            const aiResult = await analyzeJudgment(parsed.firstPageText);
            if (aiResult) {
              metadata = {
                judge: aiResult.judge || '',
                plaintiff: aiResult.plaintiff || '',
                defendant: aiResult.defendant || '',
                procedureType: aiResult.procedureType || 'אזרחי',
                category: aiResult.category || detectCategory(aiResult.procedureType || '', aiResult.courtName || '', parsed.firstPageText),
                summary: aiResult.summary || '',
                decisionType: aiResult.decisionType || 'פסק דין',
                courtName: aiResult.courtName || 'בית משפט',
                caseNumber: '',
                date: aiResult.date || folderDateToISO(folder),
              };
            }
          } catch (e) {
            console.error(`[gov-scraper] Gemini analysis failed for ${filename}:`, e);
          }

          // Try to extract case number from text
          const caseNumber = extractCaseNumber(parsed.firstPageText) || `GOV-${fileId.slice(0, 8)}`;

          // Skip blacklisted (confidential) cases - hardcoded + dynamic from DB
          const isBlacklisted = BLACKLISTED_CASES.has(caseNumber)
            || [...BLACKLISTED_CASES].some(bc => caseNumber.includes(bc))
            || confidentialCaseNumbers.has(caseNumber)
            || [...confidentialCaseNumbers].some(cc => caseNumber.includes(cc) || cc.includes(caseNumber));
          if (isBlacklisted) {
            console.log(`[gov-scraper] Skipping confidential/blacklisted case: ${caseNumber}`);
            totalProcessed++;
            continue;
          }

          // Skip promotional/junk PDFs that are not real judgments
          const junkPatterns = ['רוצים לדעת איך צפוי', 'חיפוש עורך דין', 'עורכי דין לפי', 'בוט משפטי חכם'];
          if (caseNumber.startsWith('PD-') || junkPatterns.some(p => parsed.firstPageText.includes(p) && !parsed.firstPageText.includes('פסק דין'))) {
            console.log(`[gov-scraper] Skipping junk/promotional PDF: ${filename}`);
            totalProcessed++;
            continue;
          }

          const parties = metadata.plaintiff && metadata.defendant
            ? `${metadata.plaintiff} נגד ${metadata.defendant}`
            : '';
          const title = parties
            ? `${caseNumber} - ${parties}`
            : `${caseNumber} - ${metadata.courtName}`;

          items.push({
            title: title.slice(0, 200),
            slug: createSlug(`gov-${caseNumber}-${metadata.defendant || fileId.slice(0, 8)}`),
            caseNumber,
            courtName: metadata.courtName,
            procedureType: metadata.procedureType,
            judgmentDate: metadata.date,
            judge: metadata.judge,
            plaintiff: metadata.plaintiff,
            defendant: metadata.defendant,
            parties,
            summary: metadata.summary || parsed.firstPageText.slice(0, 300),
            fullText: parsed.fullText,
            firstPageText: parsed.firstPageText,
            sourceUrl: `${GOV_BASE_URL}/${folder}/${filename}`,
            pdfUrl: `${GOV_BASE_URL}/${folder}/${filename}`,
            sourceName: 'decisions.court.gov.il',
            category: metadata.category,
            status: 'PUBLISHED',
            govFileId: fileId,
            govFolderDate: folder,
            pdfPageCount: parsed.pageCount,
          });

          totalProcessed++;
          console.log(`[gov-scraper] Processed ${totalProcessed}/${MAX_FILES_PER_RUN}: ${caseNumber}`);
        }
      } catch (e) {
        errors.push(`תיקייה ${folder}: ${String(e)}`);
        console.error(`[gov-scraper] Error processing folder ${folder}:`, e);
      }
    }
  } catch (e) {
    errors.push(`decisions.court.gov.il: ${String(e)}`);
  }

  console.log(`[gov-scraper] Done. ${items.length} items, ${errors.length} errors`);
  return { items, errors, processedFolders };
}

/**
 * Extract case number from Hebrew legal text
 */
function extractCaseNumber(text: string): string {
  if (!text) return '';

  const patterns = [
    /([א-ת"׳]{1,8}(?:\s*\([^)]+\))?\s+\d[\d\/-]+\d{2,4})/,
    /(\d{3,6}-\d{2}-\d{2,4})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }

  return '';
}

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
const MAX_FILES_PER_RUN = 50;

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
      console.error(`[gov-scraper] ${filename}: Not a PDF (header: ${header}). Preview: ${preview.slice(0, 100)}`);
      return null;
    }

    console.log(`[gov-scraper] ${filename}: Downloaded ${buffer.length} bytes, valid PDF`);

    // Use pdfjs-dist directly for text extraction (works in Node.js/Alpine without browser APIs)
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    const doc = await loadingTask.promise;
    const pageCount = doc.numPages;

    let fullText = '';
    let firstPageText = '';

    for (let i = 1; i <= pageCount; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .filter((item: any) => 'str' in item)
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
      if (i === 1) firstPageText = pageText;
    }

    await doc.destroy();

    // If text is empty or just page separators, log it
    const cleanText = fullText.replace(/--\s*\d+\s*of\s*\d+\s*--/g, '').trim();
    if (!cleanText) {
      console.warn(`[gov-scraper] ${filename}: PDF has ${pageCount} pages but no extractable text (scanned/image PDF?). Buffer size: ${buffer.length}`);
      return null;
    }

    return { fullText: cleanText, firstPageText: firstPageText || cleanText.slice(0, 2000), pageCount };
  } catch (e) {
    console.error(`[gov-scraper] Error parsing PDF ${filename}:`, String(e));
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
export async function scrapeGovDecisions(existingGovFileIds: Set<string>): Promise<{
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
    for (const folder of folders) {
      if (totalProcessed >= MAX_FILES_PER_RUN) {
        console.log(`[gov-scraper] Reached max files limit (${MAX_FILES_PER_RUN})`);
        break;
      }

      try {
        await sleep(DELAY_BETWEEN_REQUESTS);
        const files = await fetchFolderFiles(folder);
        console.log(`[gov-scraper] Folder ${folder}: ${files.length} PDF files`);
        processedFolders.push(folder);

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
            errors.push(`${folder}/${filename}: לא ניתן לחלץ טקסט (PDF ריק, סרוק או לא תקין)`);
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

          // Skip blacklisted (confidential) cases
          if (BLACKLISTED_CASES.has(caseNumber) || [...BLACKLISTED_CASES].some(bc => caseNumber.includes(bc))) {
            console.log(`[gov-scraper] Skipping blacklisted case: ${caseNumber}`);
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

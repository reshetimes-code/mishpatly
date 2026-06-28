import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { analyzeJudgment } from '@/lib/gemini';
import { createSlug } from '@/lib/judgment-store';
import { detectCategory } from '@/lib/scrapers';

// Blacklisted confidential cases - never publish
const BLACKLISTED_CASES = new Set(['26544-03-26', 'ת"א 26544-03-26']);

function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const user = verifyToken(authHeader.substring(7));
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

/**
 * Upload PDF files from GOV.IL
 * Accepts multipart form data with one or more PDF files
 * Extracts text, uses Gemini for metadata, saves to DB
 */
export async function POST(request: NextRequest) {
  const user = authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const folderDate = formData.get('folderDate') as string || new Date().toISOString().split('T')[0];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'לא נבחרו קבצים' }, { status: 400 });
    }

    const results: { filename: string; status: string; caseNumber?: string; error?: string }[] = [];

    for (const file of files) {
      try {
        // Only process PDFs
        if (!file.name.endsWith('.pdf')) {
          results.push({ filename: file.name, status: 'skipped', error: 'לא קובץ PDF' });
          continue;
        }

        const fileId = file.name.replace('.pdf', '');

        // Check if already exists
        const existing = await prisma.judgment.findFirst({
          where: { govFileId: fileId },
        });

        if (existing) {
          results.push({ filename: file.name, status: 'exists', caseNumber: existing.caseNumber });
          continue;
        }

        // Read file buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract text using pdf-parse
        let fullText = '';
        let firstPageText = '';
        let pageCount = 1;

        try {
          const { PDFParse } = await import('pdf-parse');
          const parser = new PDFParse({ data: new Uint8Array(buffer) });
          const textResult = await parser.getText();
          fullText = textResult.text || '';
          pageCount = textResult.total || 1;

          if (textResult.pages && textResult.pages.length > 0) {
            firstPageText = textResult.pages[0]?.text || '';
          }
          if (!firstPageText) {
            firstPageText = fullText.slice(0, 2000);
          }

          await parser.destroy().catch(() => {});
        } catch (e) {
          console.error(`[upload] PDF parse error for ${file.name}:`, e);
          // Try to continue with empty text
          results.push({ filename: file.name, status: 'error', error: 'שגיאה בקריאת PDF' });
          continue;
        }

        if (!firstPageText && !fullText) {
          results.push({ filename: file.name, status: 'error', error: 'לא נמצא טקסט ב-PDF' });
          continue;
        }

        // Use Gemini to extract metadata
        let metadata = {
          judge: '',
          plaintiff: '',
          defendant: '',
          procedureType: 'אזרחי',
          category: 'אזרחי',
          summary: '',
          decisionType: 'פסק דין',
          courtName: 'בית משפט',
          date: folderDate,
          caseNumber: '',
        };

        try {
          const aiResult = await analyzeJudgment(firstPageText);
          if (aiResult) {
            metadata = {
              judge: aiResult.judge || '',
              plaintiff: aiResult.plaintiff || '',
              defendant: aiResult.defendant || '',
              procedureType: aiResult.procedureType || 'אזרחי',
              category: aiResult.category || detectCategory(aiResult.procedureType || '', aiResult.courtName || '', firstPageText),
              summary: aiResult.summary || '',
              decisionType: aiResult.decisionType || 'פסק דין',
              courtName: aiResult.courtName || 'בית משפט',
              date: aiResult.date || folderDate,
              caseNumber: '',
            };
          }
        } catch (e) {
          console.error(`[upload] Gemini error for ${file.name}:`, e);
        }

        // Extract case number from text
        const caseNumber = extractCaseNumber(firstPageText) || `GOV-${fileId.slice(0, 8)}`;

        // Skip blacklisted (confidential) cases
        if (BLACKLISTED_CASES.has(caseNumber) || [...BLACKLISTED_CASES].some(bc => caseNumber.includes(bc))) {
          results.push({ filename: file.name, status: 'skipped', error: 'תיק חסוי - לא לפרסום' });
          continue;
        }

        const parties = metadata.plaintiff && metadata.defendant
          ? `${metadata.plaintiff} נגד ${metadata.defendant}`
          : '';
        const title = parties
          ? `${caseNumber} - ${parties}`
          : `${caseNumber} - ${metadata.courtName}`;

        // Create unique slug
        let slug = createSlug(`gov-${caseNumber}-${metadata.defendant || fileId.slice(0, 8)}`);
        let counter = 1;
        while (await prisma.judgment.findFirst({ where: { slug } })) {
          slug = `${slug}-${counter++}`;
        }

        // Save to DB
        await prisma.judgment.create({
          data: {
            title: title.slice(0, 200),
            slug,
            caseNumber,
            courtName: metadata.courtName,
            procedureType: metadata.procedureType || null,
            judgmentDate: parseDate(metadata.date),
            judge: metadata.judge || null,
            plaintiff: metadata.plaintiff || null,
            defendant: metadata.defendant || null,
            parties: parties || null,
            summary: metadata.summary || firstPageText.slice(0, 300),
            fullText: fullText || null,
            firstPageText: firstPageText || null,
            sourceUrl: `https://decisions.court.gov.il/${folderDate}/${file.name}`,
            pdfUrl: `https://decisions.court.gov.il/${folderDate}/${file.name}`,
            sourceName: 'decisions.court.gov.il',
            category: metadata.category || null,
            govFileId: fileId,
            govFolderDate: folderDate,
            pdfPageCount: pageCount,
            status: 'PUBLISHED',
            isIndexable: true,
          },
        });

        results.push({
          filename: file.name,
          status: 'success',
          caseNumber,
        });

        // Small delay between Gemini calls
        await new Promise(r => setTimeout(r, 500));
      } catch (e) {
        results.push({ filename: file.name, status: 'error', error: String(e) });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const existsCount = results.filter(r => r.status === 'exists').length;
    const errorCount = results.filter(r => r.status === 'error').length;

    return NextResponse.json({
      message: `עובד: ${successCount} חדשים, ${existsCount} קיימים, ${errorCount} שגיאות`,
      total: files.length,
      success: successCount,
      exists: existsCount,
      errors: errorCount,
      results,
    });
  } catch (error) {
    console.error('[upload] Error:', error);
    return NextResponse.json(
      { error: 'שגיאה בהעלאת קבצים', details: String(error) },
      { status: 500 }
    );
  }
}

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

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

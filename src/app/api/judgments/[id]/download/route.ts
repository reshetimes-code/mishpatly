import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const GOV_USERNAME = process.env.GOV_USERNAME || '';
const GOV_PASSWORD = process.env.GOV_PASSWORD || '';

/**
 * Download PDF via NTLM auth (same method as the scraper)
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
      else if (res.statusCode !== 200) reject(new Error(`HTTP ${res.statusCode}`));
      else resolve(Buffer.from(res.body));
    });
  });
}

/**
 * Full PDF download API
 * Downloads PDF from GOV.IL using NTLM auth, falls back to HTML
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const judgmentId = Number(id);

    // Get judgment (temporarily free during site construction)
    const judgment = await prisma.judgment.findUnique({
      where: { id: judgmentId },
    });

    if (!judgment) {
      return NextResponse.json(
        { error: 'פסק הדין לא נמצא' },
        { status: 404 }
      );
    }

    const safeId = String(judgment.caseNumber || judgment.id).replace(/[^\w.-]/g, '_');
    const filename = `psak-din-${safeId}.pdf`;
    const encodedFilename = encodeURIComponent(`פסק-דין-${judgment.caseNumber || judgment.id}.pdf`);

    // Try to download PDF from decisions.court.gov.il via NTLM
    if (judgment.pdfUrl) {
      try {
        console.log(`[download] Fetching PDF via NTLM: ${judgment.pdfUrl}`);
        const pdfBuffer = await ntlmDownload(judgment.pdfUrl);

        // Verify it's actually a PDF (starts with %PDF)
        if (pdfBuffer.length > 100 && pdfBuffer[0] === 0x25 && pdfBuffer[1] === 0x50) {
          console.log(`[download] PDF fetched successfully: ${pdfBuffer.byteLength} bytes`);
          return new NextResponse(pdfBuffer as unknown as BodyInit, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
              'Content-Length': String(pdfBuffer.byteLength),
            },
          });
        } else {
          console.error('[download] Response is not a valid PDF');
        }
      } catch (err) {
        console.error('[download] NTLM download failed:', err);
      }

      // Fallback: try direct fetch (in case it's not a GOV.IL URL)
      try {
        const directRes = await fetch(judgment.pdfUrl, { signal: AbortSignal.timeout(15000) });
        if (directRes.ok) {
          const contentType = directRes.headers.get('content-type') || '';
          if (contentType.includes('pdf')) {
            const pdfBuffer = Buffer.from(await directRes.arrayBuffer());
            return new NextResponse(pdfBuffer as unknown as BodyInit, {
              headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
                'Content-Length': String(pdfBuffer.byteLength),
              },
            });
          }
        }
      } catch (err) {
        console.error('[download] Direct fetch failed:', err);
      }
    }

    // Fallback: Generate HTML document from fullText
    const textContent = judgment.fullText
      || judgment.summary
      || judgment.title
      || 'אין תוכן זמין';

    const htmlFilename = `psak-din-${safeId}.html`;
    const encodedHtmlFilename = encodeURIComponent(`פסק-דין-${judgment.caseNumber || judgment.id}.html`);

    const htmlContent = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<title>${judgment.caseNumber || 'פסק דין'} - ${judgment.title || ''}</title>
<style>
  body { font-family: 'David', 'Noto Sans Hebrew', 'Arial', sans-serif; font-size: 14px; line-height: 1.8; margin: 40px; direction: rtl; color: #1a1a1a; }
  h1 { font-size: 18px; text-align: center; margin-bottom: 20px; }
  .meta { text-align: center; color: #555; margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 15px; }
  .content { white-space: pre-wrap; text-align: justify; }
  .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 11px; color: #999; }
  @media print { body { margin: 20mm; } }
</style>
</head>
<body>
<h1>${(judgment.title || judgment.caseNumber || 'פסק דין').replace(/</g, '\&lt;').replace(/>/g, '\&gt;')}</h1>
<div class="meta">
  ${judgment.caseNumber ? `<div>מספר תיק: ${judgment.caseNumber}</div>` : ''}
  ${judgment.judgmentDate ? `<div>תאריך: ${new Date(judgment.judgmentDate).toLocaleDateString('he-IL')}</div>` : ''}
  ${judgment.courtName ? `<div>בית משפט: ${judgment.courtName}</div>` : ''}
</div>
<div class="content">${(textContent || '').replace(/</g, '\&lt;').replace(/>/g, '\&gt;')}</div>
<div class="footer">משפטלי - מאגר פסקי דין | mishpatly.co.il</div>
</body>
</html>`;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${htmlFilename}"; filename*=UTF-8''${encodedHtmlFilename}`,
      },
    });
  } catch (error) {
    console.error('[download] Unexpected error:', error);
    return NextResponse.json(
      { error: 'לא ניתן להוריד את המסמך כרגע. צוות האתר יטפל בבקשתך.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

/**
 * Download PDF preview or full PDF for admin
 * ?full=true + admin token = full PDF download
 * Otherwise returns first page only (free preview)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const judgmentId = Number(id);
    const fullDownload = new URL(request.url).searchParams.get('full') === 'true';

    // Check admin auth for full download
    let isAdmin = false;
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const user = verifyToken(authHeader.substring(7));
      if (user?.role === 'ADMIN') isAdmin = true;
    }

    const judgment = await prisma.judgment.findUnique({
      where: { id: judgmentId },
    });

    if (!judgment || !judgment.pdfUrl) {
      return NextResponse.json({ error: 'המסמך לא נמצא' }, { status: 404 });
    }

    // Try to get the PDF - direct fetch first, then NTLM
    let pdfBuffer: Buffer | null = null;

    // 1. Direct fetch
    try {
      const directRes = await fetch(judgment.pdfUrl, { signal: AbortSignal.timeout(15000) });
      if (directRes.ok) {
        const contentType = directRes.headers.get('content-type') || '';
        if (contentType.includes('pdf')) {
          pdfBuffer = Buffer.from(await directRes.arrayBuffer());
        }
      }
    } catch (err) {
      console.error('[preview] Direct fetch failed:', err);
    }

    // 2. NTLM proxy (GOV.IL) - dynamic import
    if (!pdfBuffer) {
      try {
        const httpntlm = await import('httpntlm');
        const ntlmGet = httpntlm.default?.get || httpntlm.get;
        if (ntlmGet) {
          pdfBuffer = await new Promise((resolve, reject) => {
            ntlmGet({
              url: judgment.pdfUrl!,
              username: process.env.GOV_USERNAME || '',
              password: process.env.GOV_PASSWORD || '',
              binary: true,
            }, (err: Error | null, res: { statusCode: number; body: Buffer }) => {
              if (err) reject(err);
              else if (res.statusCode !== 200) reject(new Error(`HTTP ${res.statusCode}`));
              else resolve(Buffer.from(res.body));
            });
          });
        }
      } catch (err) {
        console.error('[preview] NTLM proxy failed:', err);
      }
    }

    if (!pdfBuffer || pdfBuffer.length < 100) {
      return NextResponse.json({ error: 'לא ניתן להוריד את המסמך מהמקור' }, { status: 502 });
    }

    // Admin with ?full=true gets the complete PDF
    if (fullDownload && isAdmin) {
      const safeFilename = `full-${judgment.caseNumber || judgment.id}.pdf`
        .replace(/[^\w.-]/g, '_');

      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${safeFilename}"`,
          'Content-Length': String(pdfBuffer.byteLength),
        },
      });
    }

    // Extract only first page using pdf-lib
    const { PDFDocument } = await import('pdf-lib');
    const srcDoc = await PDFDocument.load(pdfBuffer);
    const newDoc = await PDFDocument.create();
    const [firstPage] = await newDoc.copyPages(srcDoc, [0]);
    newDoc.addPage(firstPage);
    const firstPagePdf = await newDoc.save();

    const safeFilename = `preview-${judgment.id}.pdf`;

    return new NextResponse(firstPagePdf as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Content-Length': String(firstPagePdf.byteLength),
      },
    });
  } catch (error) {
    console.error('[preview] Unexpected error:', error);
    return NextResponse.json(
      { error: 'שגיאה בהורדת המסמך' },
      { status: 500 }
    );
  }
}

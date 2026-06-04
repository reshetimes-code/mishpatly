import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { searchJudgmentsFromDB, addJudgment, createSlug } from '@/lib/judgment-store';

function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return verifyToken(authHeader.substring(7));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const query = searchParams.get('query') || searchParams.get('q') || searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const source = searchParams.get('source') || '';
  const category = searchParams.get('category') || '';

  const result = await searchJudgmentsFromDB({
    query,
    status,
    source,
    category,
    page,
    limit,
  });

  return NextResponse.json({
    judgments: result.judgments,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
  });
}

export async function POST(request: NextRequest) {
  const user = authenticateRequest(request);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || !body.caseNumber) {
      return NextResponse.json({ error: 'שדות חובה חסרים: title, caseNumber' }, { status: 400 });
    }

    const judgment = await addJudgment({
      title: body.title,
      slug: body.slug || createSlug(body.title),
      caseNumber: body.caseNumber,
      courtName: body.courtName || '',
      procedureType: body.procedureType || 'אזרחי',
      judgmentDate: body.judgmentDate || new Date().toISOString().split('T')[0],
      judge: body.judge || '',
      plaintiff: body.plaintiff || '',
      defendant: body.defendant || '',
      parties: body.parties || '',
      summary: body.summary || '',
      fullText: body.fullText || '',
      sourceUrl: body.sourceUrl || '',
      pdfUrl: body.pdfUrl || '',
      sourceName: body.sourceName || 'ידני',
      category: body.category || 'אזרחי',
      status: body.status || 'DRAFT',
    });

    return NextResponse.json(judgment, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'שגיאה בעיבוד הבקשה' }, { status: 400 });
  }
}

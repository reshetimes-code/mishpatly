import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { runDailyImport, getImportHistory } from '@/lib/daily-import';
import { runFullSeoProcess } from '@/lib/seo-engine';

function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const user = verifyToken(authHeader.substring(7));
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

// GET - view import history
export async function GET(request: NextRequest) {
  const user = authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  const history = await getImportHistory();
  return NextResponse.json({ history, total: history.length });
}

// POST - trigger import now
export async function POST(request: NextRequest) {
  const user = authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  try {
    const result = await runDailyImport();

    // Auto-run SEO after import
    const seoResult = await runFullSeoProcess();

    return NextResponse.json({
      message: `ייבוא הושלם - ${result.count} פסקי דין, ${result.newItems} חדשים. SEO: ${seoResult.indexing.newlySubmitted} URLs נשלחו לאינדוקס`,
      result,
      seo: seoResult,
    });
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה בייבוא', details: String(error) }, { status: 500 });
  }
}

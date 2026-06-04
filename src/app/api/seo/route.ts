import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { runFullSeoProcess, getSeoLog, getPersonNameIndex, generateSeoReport } from '@/lib/seo-engine';

function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const user = verifyToken(authHeader.substring(7));
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

export async function GET(request: NextRequest) {
  const user = authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const view = searchParams.get('view') || 'status';

  if (view === 'names') {
    const names = await getPersonNameIndex();
    return NextResponse.json({ names, total: names.length });
  }

  if (view === 'log') {
    const log = getSeoLog();
    return NextResponse.json({ log, total: log.length });
  }

  if (view === 'report') {
    const html = await generateSeoReport();
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const names = await getPersonNameIndex();
  const log = getSeoLog();
  return NextResponse.json({
    totalNames: names.length,
    topNames: names.slice(0, 10),
    recentActions: log.slice(0, 5),
  });
}

export async function POST(request: NextRequest) {
  const user = authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  try {
    const result = await runFullSeoProcess();

    let emailSent = false;
    try {
      await sendEmailReport('info@reshetimes.co.il');
      emailSent = await sendEmailReport('reshetimes@gmail.com');
    } catch {
      emailSent = false;
    }

    return NextResponse.json({
      message: `SEO: ${result.indexing.newlySubmitted} URLs חדשים נשלחו, ${result.personNames} שמות מאונדקסים`,
      result,
      emailSent,
      reportUrl: '/api/seo?view=report',
    });
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה בתהליך SEO', details: String(error) }, { status: 500 });
  }
}

async function sendEmailReport(to: string): Promise<boolean> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${to}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `דוח SEO יומי - משפטלי - ${new Date().toLocaleDateString('he-IL')}`,
        message: `דוח SEO יומי זמין בקישור: https://mishpatly.co.il/api/seo?view=report`,
        _template: 'box',
        _captcha: 'false',
      }),
      signal: AbortSignal.timeout(10000),
    });

    return res.ok;
  } catch {
    return false;
  }
}

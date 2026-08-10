import { NextRequest, NextResponse } from 'next/server';
import { runSeoMonitor, sendSeoReport } from '@/lib/seo-monitor';

const CRON_SECRET = process.env.CRON_SECRET || 'mishpatli-cron-secret-2026';

/**
 * SEO Monitor cron — runs daily at 12:00 PM
 * Checks Google rankings for target keywords and sends email report
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const urlSecret = new URL(request.url).searchParams.get('secret');

  if (authHeader !== `Bearer ${CRON_SECRET}` && urlSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rankings = await runSeoMonitor();
    const emailSent = await sendSeoReport(rankings);

    const ranked = rankings.filter(r => r.position !== null);
    const changes = rankings.filter(r => r.change !== 'same');

    return NextResponse.json({
      message: `SEO Monitor: ${ranked.length}/${rankings.length} keywords ranked, ${changes.length} changes`,
      timestamp: new Date().toISOString(),
      ranked: ranked.length,
      total: rankings.length,
      changes: changes.length,
      emailSent,
      rankings: rankings.map(r => ({
        keyword: r.keyword,
        position: r.position,
        change: r.change,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'SEO Monitor failed', details: String(error) },
      { status: 500 }
    );
  }
}

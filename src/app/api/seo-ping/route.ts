import { NextRequest, NextResponse } from 'next/server';
import { pingSitemapToSearchEngines, submitUrlsViaIndexNow } from '@/lib/seo-engine';
import { prisma } from '@/lib/db';

const CRON_SECRET = process.env.CRON_SECRET || 'mishpatli-cron-secret-2026';
const SITE_URL = 'https://mishpatly.co.il';

/**
 * Lightweight SEO cron endpoint — can be called every 2-4 hours by Cloud Scheduler.
 * 1. Pings Google, Bing, and Yandex about sitemap updates
 * 2. Submits any recently added/updated pages via IndexNow
 * 3. Does NOT do heavy imports — just SEO pinging
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const urlSecret = new URL(request.url).searchParams.get('secret');

  if (authHeader !== `Bearer ${CRON_SECRET}` && urlSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Ping sitemap to all search engines
    const pingResults = await pingSitemapToSearchEngines();

    // 2. Find recently updated judgments (last 6 hours) and submit via IndexNow
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const recentJudgments = await prisma.judgment.findMany({
      where: {
        status: 'PUBLISHED',
        updatedAt: { gte: sixHoursAgo },
      },
      select: { slug: true },
    });

    const recentLawyers = await prisma.lawyer.findMany({
      where: {
        isActive: true,
        updatedAt: { gte: sixHoursAgo },
      },
      select: { slug: true },
    });

    const urls = [
      ...recentJudgments.map(j => `${SITE_URL}/judgment/${encodeURIComponent(j.slug)}`),
      ...recentLawyers.map(l => `${SITE_URL}/lawyers/${encodeURIComponent(l.slug)}`),
    ];

    let indexNowSubmitted = 0;
    if (urls.length > 0) {
      indexNowSubmitted = await submitUrlsViaIndexNow(urls);
    }

    return NextResponse.json({
      message: 'SEO ping completed',
      timestamp: new Date().toISOString(),
      pingResults,
      recentPages: urls.length,
      indexNowSubmitted,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'SEO ping failed', details: String(error) },
      { status: 500 }
    );
  }
}

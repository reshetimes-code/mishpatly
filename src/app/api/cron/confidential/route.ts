import { NextRequest, NextResponse } from 'next/server';
import { checkConfidentialCases } from '@/lib/confidential-monitor';

const CRON_SECRET = process.env.CRON_SECRET || 'mishpatli-cron-secret-2026';

/**
 * Confidential case monitor - checks Gmail for court confidentiality orders
 * and automatically removes matching cases from the site.
 *
 * Called by Cloud Scheduler or manually via:
 * GET /api/cron/confidential?secret=...
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const urlSecret = new URL(request.url).searchParams.get('secret');

  if (authHeader !== `Bearer ${CRON_SECRET}` && urlSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await checkConfidentialCases();

    return NextResponse.json({
      message: 'Confidential case check completed',
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    console.error('[confidential-cron] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check confidential cases', details: String(error) },
      { status: 500 }
    );
  }
}

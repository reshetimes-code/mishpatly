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

  // Debug mode: check GOV scraper connectivity
  const debug = new URL(request.url).searchParams.get('debug');
  if (debug === 'gov') {
    const results: Record<string, unknown> = {};
    results.envCheck = {
      GOV_USERNAME: process.env.GOV_USERNAME ? `set (${process.env.GOV_USERNAME.length} chars)` : 'MISSING',
      GOV_PASSWORD: process.env.GOV_PASSWORD ? `set (${process.env.GOV_PASSWORD.length} chars)` : 'MISSING',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? `set (${process.env.GEMINI_API_KEY.length} chars)` : 'MISSING',
    };
    try {
      const httpntlm = await import('httpntlm');
      const res = await new Promise<{ statusCode: number; body: string }>((resolve, reject) => {
        httpntlm.get({
          url: 'https://decisions.court.gov.il/',
          username: process.env.GOV_USERNAME || '',
          password: process.env.GOV_PASSWORD || '',
        }, (err: Error | null, res: { statusCode: number; body: string }) => {
          if (err) reject(err);
          else resolve(res);
        });
      });
      results.govConnection = {
        statusCode: res.statusCode,
        bodyLength: res.body?.length || 0,
        bodyPreview: res.body?.slice(0, 500) || '',
        hasFolders: /href="\/\d{4}-\d{1,2}-\d{1,2}/i.test(res.body || ''),
      };
    } catch (e) {
      results.govConnection = { error: String(e) };
    }
    return NextResponse.json(results);
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

import { NextRequest, NextResponse } from 'next/server';

const CRON_SECRET = process.env.CRON_SECRET || 'mishpatli-cron-secret-2026';

/**
 * Debug endpoint to test the GOV scraper connectivity
 * GET /api/debug-import?secret=...
 */
export async function GET(request: NextRequest) {
  const urlSecret = new URL(request.url).searchParams.get('secret');
  if (urlSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  // Check environment variables
  results.envCheck = {
    GOV_USERNAME: process.env.GOV_USERNAME ? `set (${process.env.GOV_USERNAME.length} chars)` : 'MISSING',
    GOV_PASSWORD: process.env.GOV_PASSWORD ? `set (${process.env.GOV_PASSWORD.length} chars)` : 'MISSING',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? `set (${process.env.GEMINI_API_KEY.length} chars)` : 'MISSING',
  };

  // Try to connect to decisions.court.gov.il
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
      bodyPreview: res.body?.slice(0, 300) || '',
      hasFolders: /href="\/\d{4}-\d{1,2}-\d{1,2}/i.test(res.body || ''),
    };
  } catch (e) {
    results.govConnection = { error: String(e) };
  }

  return NextResponse.json(results);
}

import { NextResponse } from 'next/server';

export async function GET() {
  const serpApiKey = process.env.SERPAPI_KEY;
  const result: Record<string, unknown> = {
    hasKey: !!serpApiKey,
    keyLen: serpApiKey?.length || 0,
  };

  try {
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent('משפטלי')}&google_domain=google.co.il&gl=il&hl=he&num=100&api_key=${serpApiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    result.status = res.status;
    result.ok = res.ok;
    const text = await res.text();
    result.bodyPreview = text.slice(0, 500);
    try {
      const data = JSON.parse(text);
      const results = data.organic_results || [];
      result.organicCount = results.length;
      result.found = results.find((r: { link?: string }) => r.link?.includes('mishpatly.co.il')) || null;
    } catch { /* not json */ }
  } catch (e) {
    result.fetchError = String(e);
  }

  return NextResponse.json(result);
}

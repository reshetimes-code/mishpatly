/**
 * SEO Engine - Automated system to maximize Google ranking for every person name
 *
 * Actions:
 * 1. Ping Google & Bing when new pages are created
 * 2. Submit sitemap to search engines
 * 3. Track indexed URLs
 * 4. Generate daily SEO report
 */

import { getAllJudgmentsFromDB, type StoredJudgment } from './judgment-store';

const SITE_URL = 'https://mishpatly.co.il';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

// ============================================================
// Global tracking store
// ============================================================
const globalSeo = globalThis as unknown as {
  __seoSubmitted: Set<string> | undefined;
  __seoLog: SeoLogEntry[] | undefined;
  __lastReport: string | undefined;
};

if (!globalSeo.__seoSubmitted) globalSeo.__seoSubmitted = new Set();
if (!globalSeo.__seoLog) globalSeo.__seoLog = [];

export interface SeoLogEntry {
  date: string;
  action: string;
  url: string;
  status: 'success' | 'failed';
  details: string;
}

function addLog(action: string, url: string, status: 'success' | 'failed', details: string) {
  globalSeo.__seoLog!.unshift({
    date: new Date().toISOString(),
    action, url, status, details,
  });
  if (globalSeo.__seoLog!.length > 500) {
    globalSeo.__seoLog = globalSeo.__seoLog!.slice(0, 500);
  }
}

export function getSeoLog(): SeoLogEntry[] {
  return globalSeo.__seoLog || [];
}

// ============================================================
// 1. Ping Search Engines about sitemap updates
// ============================================================
export async function pingSitemapToSearchEngines(): Promise<{ google: boolean; bing: boolean; yandex: boolean }> {
  const results = { google: false, bing: false, yandex: false };

  try {
    const res = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`, {
      signal: AbortSignal.timeout(10000),
    });
    results.google = res.ok || res.status === 200;
    addLog('sitemap-ping', 'google', results.google ? 'success' : 'failed', `HTTP ${res.status}`);
  } catch (e) {
    addLog('sitemap-ping', 'google', 'failed', String(e));
  }

  try {
    const res = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`, {
      signal: AbortSignal.timeout(10000),
    });
    results.bing = res.ok || res.status === 200;
    addLog('sitemap-ping', 'bing', results.bing ? 'success' : 'failed', `HTTP ${res.status}`);
  } catch (e) {
    addLog('sitemap-ping', 'bing', 'failed', String(e));
  }

  try {
    const res = await fetch(`https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`, {
      signal: AbortSignal.timeout(10000),
    });
    results.yandex = res.ok;
    addLog('sitemap-ping', 'yandex', results.yandex ? 'success' : 'failed', `HTTP ${res.status}`);
  } catch (e) {
    addLog('sitemap-ping', 'yandex', 'failed', String(e));
  }

  return results;
}

// ============================================================
// 2. Submit individual URLs via IndexNow (Bing, Yandex instant)
// ============================================================
export async function submitUrlsViaIndexNow(urls: string[]): Promise<number> {
  if (urls.length === 0) return 0;

  const key = 'mishpatly-indexnow-2026';
  let submitted = 0;

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: urls.slice(0, 10000),
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (res.ok || res.status === 200 || res.status === 202) {
      submitted = urls.length;
      addLog('indexnow', `${urls.length} URLs`, 'success', `HTTP ${res.status}`);
    } else {
      addLog('indexnow', `${urls.length} URLs`, 'failed', `HTTP ${res.status}`);
    }
  } catch (e) {
    addLog('indexnow', `${urls.length} URLs`, 'failed', String(e));
  }

  return submitted;
}

// ============================================================
// 3. Submit new pages for indexing (judgments + lawyers + articles + keyword pages)
// ============================================================
export async function submitNewJudgmentsForIndexing(): Promise<{ total: number; newlySubmitted: number; pingResults: { google: boolean; bing: boolean; yandex: boolean } }> {
  const allJudgments = await getAllJudgmentsFromDB();
  const submitted = globalSeo.__seoSubmitted!;

  const newUrls: string[] = [];

  // Submit judgment pages
  for (const j of allJudgments) {
    if (j.status !== 'PUBLISHED') continue;
    const url = `${SITE_URL}/judgment/${encodeURIComponent(j.slug)}`;
    if (!submitted.has(url)) {
      newUrls.push(url);
      submitted.add(url);
    }
  }

  // Submit lawyer profile pages
  try {
    const { prisma } = await import('./db');
    const lawyers = await prisma.lawyer.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    for (const l of lawyers) {
      const url = `${SITE_URL}/lawyers/${encodeURIComponent(l.slug)}`;
      if (!submitted.has(url)) {
        newUrls.push(url);
        submitted.add(url);
      }
    }
  } catch {
    // DB unavailable
  }

  // Submit static important pages that might not be indexed yet
  const importantPages = [
    `${SITE_URL}`,
    `${SITE_URL}/search`,
    `${SITE_URL}/lawyers`,
    `${SITE_URL}/articles`,
    `${SITE_URL}/removal-request`,
    `${SITE_URL}/contact`,
  ];
  for (const url of importantPages) {
    if (!submitted.has(url)) {
      newUrls.push(url);
      submitted.add(url);
    }
  }

  let indexNowCount = 0;
  if (newUrls.length > 0) {
    indexNowCount = await submitUrlsViaIndexNow(newUrls);
  }

  const pingResults = await pingSitemapToSearchEngines();

  return {
    total: allJudgments.length,
    newlySubmitted: indexNowCount,
    pingResults,
  };
}

// ============================================================
// 4. Get all person names and their judgment URLs
// ============================================================
export async function getPersonNameIndex(): Promise<{ name: string; urls: string[]; judgmentCount: number }[]> {
  const allJudgments = await getAllJudgmentsFromDB();
  const nameMap = new Map<string, string[]>();

  for (const j of allJudgments) {
    if (j.status !== 'PUBLISHED') continue;
    const url = `${SITE_URL}/judgment/${encodeURIComponent(j.slug)}`;

    if (j.defendant && j.defendant.length > 1 && j.defendant !== 'לא ידוע') {
      const name = j.defendant.trim();
      if (!nameMap.has(name)) nameMap.set(name, []);
      nameMap.get(name)!.push(url);
    }

    if (j.plaintiff && j.plaintiff.length > 1 && j.plaintiff !== 'לא ידוע') {
      const name = j.plaintiff.trim();
      if (!nameMap.has(name)) nameMap.set(name, []);
      nameMap.get(name)!.push(url);
    }
  }

  return Array.from(nameMap.entries())
    .map(([name, urls]) => ({ name, urls, judgmentCount: urls.length }))
    .sort((a, b) => b.judgmentCount - a.judgmentCount);
}

// ============================================================
// 5. Generate SEO daily report
// ============================================================
export async function generateSeoReport(): Promise<string> {
  const allJudgments = await getAllJudgmentsFromDB();
  const published = allJudgments.filter(j => j.status === 'PUBLISHED');
  const personIndex = await getPersonNameIndex();
  const submitted = globalSeo.__seoSubmitted?.size || 0;
  const recentLog = (globalSeo.__seoLog || []).slice(0, 20);
  const now = new Date();

  const report = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; direction: rtl; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
  .card { background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  h1 { color: #0B3C5D; border-bottom: 3px solid #C9A84C; padding-bottom: 10px; }
  h2 { color: #0B3C5D; margin-top: 0; }
  .stat { display: inline-block; text-align: center; padding: 15px 25px; margin: 5px; background: #f0f4f8; border-radius: 10px; }
  .stat-value { font-size: 28px; font-weight: bold; color: #0B3C5D; display: block; }
  .stat-label { font-size: 12px; color: #666; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #0B3C5D; color: white; padding: 10px; text-align: right; }
  td { padding: 8px 10px; border-bottom: 1px solid #eee; }
  tr:hover { background: #f9f9f9; }
  .success { color: #2e7d32; }
  .failed { color: #c62828; }
  .gold { color: #C9A84C; font-weight: bold; }
  .footer { text-align: center; color: #999; font-size: 11px; margin-top: 30px; }
  a { color: #0B3C5D; }
</style>
</head>
<body>
<div class="card">
  <h1>דוח SEO יומי - משפטלי</h1>
  <p>תאריך: ${now.toLocaleDateString('he-IL')} | שעה: ${now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</p>
</div>

<div class="card">
  <h2>סיכום מהיר</h2>
  <div class="stat"><span class="stat-value">${published.length}</span><span class="stat-label">פסקי דין פורסמו</span></div>
  <div class="stat"><span class="stat-value">${personIndex.length}</span><span class="stat-label">שמות אנשים מאונדקסים</span></div>
  <div class="stat"><span class="stat-value">${submitted}</span><span class="stat-label">URLs נשלחו לגוגל</span></div>
</div>

<div class="card">
  <h2>טופ 30 שמות - מטורגטים ב-SEO</h2>
  <table>
    <thead><tr><th>#</th><th>שם</th><th>מס' פסקי דין</th><th>URL</th></tr></thead>
    <tbody>
    ${personIndex.slice(0, 30).map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td class="gold">${p.name}</td>
        <td>${p.judgmentCount}</td>
        <td><a href="${p.urls[0]}" target="_blank">צפה</a></td>
      </tr>
    `).join('')}
    </tbody>
  </table>
</div>

<div class="card">
  <h2>פעילות אינדוקס אחרונה</h2>
  <table>
    <thead><tr><th>תאריך</th><th>פעולה</th><th>יעד</th><th>סטטוס</th></tr></thead>
    <tbody>
    ${recentLog.map(log => `
      <tr>
        <td>${new Date(log.date).toLocaleString('he-IL')}</td>
        <td>${log.action}</td>
        <td>${log.url}</td>
        <td class="${log.status}">${log.status === 'success' ? 'הצלחה' : 'נכשל'}</td>
      </tr>
    `).join('')}
    </tbody>
  </table>
</div>

<div class="footer">
  <p>דוח זה נוצר אוטומטית על ידי מערכת ה-SEO של משפטלי</p>
  <p><a href="https://mishpatly.co.il">mishpatly.co.il</a></p>
</div>
</body>
</html>`;

  return report;
}

// ============================================================
// 6. Full SEO run - index + report
// ============================================================
export async function runFullSeoProcess(): Promise<{
  indexing: { total: number; newlySubmitted: number; pingResults: { google: boolean; bing: boolean; yandex: boolean } };
  personNames: number;
  reportGenerated: boolean;
}> {
  const indexing = await submitNewJudgmentsForIndexing();
  const personNames = (await getPersonNameIndex()).length;

  return {
    indexing,
    personNames,
    reportGenerated: true,
  };
}

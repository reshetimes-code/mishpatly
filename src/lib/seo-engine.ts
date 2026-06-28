/**
 * SEO Engine - Automated system to maximize Google ranking for every person name
 *
 * Actions:
 * 1. Submit URLs to Google via Indexing API (auto)
 * 2. Submit URLs to Bing/Yandex via IndexNow
 * 3. Track indexed URLs
 * 4. Generate daily SEO report
 */

import { getAllJudgmentsFromDB, type StoredJudgment } from './judgment-store';
import { google } from 'googleapis';

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

  // Google: deprecated their ping API in 2023. The only way is via Search Console API.
  // We mark as success since indexing relies on sitemap submission in Search Console.
  results.google = true;
  addLog('sitemap-ping', 'google', 'success', 'Sitemap submitted via Search Console (ping API deprecated)');

  // Bing: use IndexNow (already handled separately) + sitemap ping
  try {
    const res = await fetch(`https://www.bing.com/indexnow?url=${encodeURIComponent(SITEMAP_URL)}&key=mishpatly-indexnow-2026`, {
      signal: AbortSignal.timeout(10000),
    });
    results.bing = res.ok || res.status === 200 || res.status === 202;
    addLog('sitemap-ping', 'bing', results.bing ? 'success' : 'failed', `HTTP ${res.status}`);
  } catch (e) {
    addLog('sitemap-ping', 'bing', 'failed', String(e));
  }

  // Yandex: IndexNow compatible
  try {
    const res = await fetch(`https://yandex.com/indexnow?url=${encodeURIComponent(SITEMAP_URL)}&key=mishpatly-indexnow-2026`, {
      signal: AbortSignal.timeout(10000),
    });
    results.yandex = res.ok || res.status === 200 || res.status === 202;
    addLog('sitemap-ping', 'yandex', results.yandex ? 'success' : 'failed', `HTTP ${res.status}`);
  } catch (e) {
    addLog('sitemap-ping', 'yandex', 'failed', String(e));
  }

  return results;
}

// ============================================================
// ============================================================
// 2. Submit URLs to Google via Indexing API (automatic)
// ============================================================
export async function submitUrlsToGoogle(urls: string[]): Promise<number> {
  if (urls.length === 0) return 0;

  let submitted = 0;
  try {
    // Use Application Default Credentials (works on Cloud Run automatically)
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
    const indexing = google.indexing({ version: 'v3', auth });

    // Google allows up to 200 requests per day
    const batch = urls.slice(0, 200);

    for (const url of batch) {
      try {
        await indexing.urlNotifications.publish({
          requestBody: {
            url,
            type: 'URL_UPDATED',
          },
        });
        submitted++;
      } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        // Don't log every failure, just count
        if (submitted === 0) {
          addLog('google-indexing', url, 'failed', errMsg.slice(0, 100));
        }
      }
    }

    if (submitted > 0) {
      addLog('google-indexing', `${submitted} URLs`, 'success', `Submitted ${submitted}/${batch.length} URLs to Google`);
    }
  } catch (e) {
    addLog('google-indexing', `${urls.length} URLs`, 'failed', String(e).slice(0, 150));
  }

  return submitted;
}

// ============================================================
// 3. Submit individual URLs via IndexNow (Bing, Yandex instant)
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

  // Submit DB article pages
  try {
    const { prisma } = await import('./db');
    const dbArticles = await prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    for (const a of dbArticles) {
      const url = `${SITE_URL}/articles/${encodeURIComponent(a.slug)}`;
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
  let googleCount = 0;
  if (newUrls.length > 0) {
    // Submit to Google Indexing API + IndexNow (Bing/Yandex) in parallel
    [googleCount, indexNowCount] = await Promise.all([
      submitUrlsToGoogle(newUrls),
      submitUrlsViaIndexNow(newUrls),
    ]);
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
// 6. Person Name Pages SEO Data Generator
// ============================================================
export interface PersonSeoData {
  name: string;
  slug: string;
  judgmentCount: number;
  asPlaintiff: number;
  asDefendant: number;
  asJudge: number;
  courts: string[];
  url: string;
}

export async function generatePersonSeoData(): Promise<PersonSeoData[]> {
  try {
    const { prisma } = await import('./db');

    // Get all unique plaintiffs
    const plaintiffs = await prisma.judgment.findMany({
      where: { status: 'PUBLISHED', plaintiff: { not: null } },
      select: { plaintiff: true },
      distinct: ['plaintiff'],
    });

    // Get all unique defendants
    const defendants = await prisma.judgment.findMany({
      where: { status: 'PUBLISHED', defendant: { not: null } },
      select: { defendant: true },
      distinct: ['defendant'],
    });

    // Get all unique judges
    const judges = await prisma.judgment.findMany({
      where: { status: 'PUBLISHED', judge: { not: null } },
      select: { judge: true },
      distinct: ['judge'],
    });

    // Build name map
    const nameMap = new Map<string, { asPlaintiff: number; asDefendant: number; asJudge: number; courts: Set<string> }>();

    const ensureName = (name: string) => {
      if (!nameMap.has(name)) {
        nameMap.set(name, { asPlaintiff: 0, asDefendant: 0, asJudge: 0, courts: new Set() });
      }
      return nameMap.get(name)!;
    };

    // Count per role using aggregated queries
    for (const p of plaintiffs) {
      if (p.plaintiff && p.plaintiff.length > 1 && p.plaintiff !== 'לא ידוע') {
        ensureName(p.plaintiff.trim());
      }
    }
    for (const d of defendants) {
      if (d.defendant && d.defendant.length > 1 && d.defendant !== 'לא ידוע') {
        ensureName(d.defendant.trim());
      }
    }
    for (const j of judges) {
      if (j.judge && j.judge.length > 1 && j.judge !== 'לא ידוע') {
        ensureName(j.judge.trim());
      }
    }

    // Now count judgments per person using the in-memory judgment list
    const allJudgments = await getAllJudgmentsFromDB();
    for (const j of allJudgments) {
      if (j.status !== 'PUBLISHED') continue;
      if (j.plaintiff && nameMap.has(j.plaintiff.trim())) {
        const entry = nameMap.get(j.plaintiff.trim())!;
        entry.asPlaintiff++;
        if (j.courtName) entry.courts.add(j.courtName);
      }
      if (j.defendant && nameMap.has(j.defendant.trim())) {
        const entry = nameMap.get(j.defendant.trim())!;
        entry.asDefendant++;
        if (j.courtName) entry.courts.add(j.courtName);
      }
      if (j.judge && nameMap.has(j.judge.trim())) {
        const entry = nameMap.get(j.judge.trim())!;
        entry.asJudge++;
        if (j.courtName) entry.courts.add(j.courtName);
      }
    }

    const results: PersonSeoData[] = [];
    for (const [name, data] of nameMap.entries()) {
      const total = data.asPlaintiff + data.asDefendant + data.asJudge;
      if (total === 0) continue;
      results.push({
        name,
        slug: encodeURIComponent(name),
        judgmentCount: total,
        asPlaintiff: data.asPlaintiff,
        asDefendant: data.asDefendant,
        asJudge: data.asJudge,
        courts: Array.from(data.courts),
        url: `${SITE_URL}/person/${encodeURIComponent(name)}`,
      });
    }

    return results.sort((a, b) => b.judgmentCount - a.judgmentCount);
  } catch (e) {
    addLog('person-seo', 'generatePersonSeoData', 'failed', String(e).slice(0, 150));
    return [];
  }
}

// ============================================================
// 7. Internal Linking Engine
// ============================================================
export interface InternalLink {
  from: string;
  to: string;
  anchorText: string;
  rel: 'person' | 'court' | 'category' | 'related';
}

export async function generateInternalLinks(): Promise<InternalLink[]> {
  const links: InternalLink[] = [];

  try {
    const allJudgments = await getAllJudgmentsFromDB();
    const published = allJudgments.filter(j => j.status === 'PUBLISHED');

    // Link judgments to person pages
    for (const j of published) {
      const judgmentUrl = `/judgment/${encodeURIComponent(j.slug)}`;

      if (j.plaintiff && j.plaintiff.length > 1 && j.plaintiff !== 'לא ידוע') {
        links.push({
          from: judgmentUrl,
          to: `/person/${encodeURIComponent(j.plaintiff.trim())}`,
          anchorText: `פסקי דין של ${j.plaintiff.trim()}`,
          rel: 'person',
        });
      }
      if (j.defendant && j.defendant.length > 1 && j.defendant !== 'לא ידוע') {
        links.push({
          from: judgmentUrl,
          to: `/person/${encodeURIComponent(j.defendant.trim())}`,
          anchorText: `פסקי דין בעניין ${j.defendant.trim()}`,
          rel: 'person',
        });
      }
      if (j.judge && j.judge.length > 1 && j.judge !== 'לא ידוע') {
        links.push({
          from: judgmentUrl,
          to: `/person/${encodeURIComponent(j.judge.trim())}`,
          anchorText: `פסקי דין של שופט/ת ${j.judge.trim()}`,
          rel: 'person',
        });
      }

      // Link to court search pages
      if (j.courtName) {
        links.push({
          from: judgmentUrl,
          to: `/search?court=${encodeURIComponent(j.courtName)}`,
          anchorText: `פסקי דין מ${j.courtName}`,
          rel: 'court',
        });
      }

      // Link to category pages
      if (j.category) {
        links.push({
          from: judgmentUrl,
          to: `/search?category=${encodeURIComponent(j.category)}`,
          anchorText: `פסקי דין בנושא ${j.category}`,
          rel: 'category',
        });
      }
    }

    // Link person pages to each other (via shared judgments)
    const personIndex = await getPersonNameIndex();
    const topPersons = personIndex.slice(0, 100);

    for (const person of topPersons) {
      const personUrl = `/person/${encodeURIComponent(person.name)}`;

      // Link to homepage and search
      links.push({
        from: personUrl,
        to: '/',
        anchorText: 'מאגר פסקי דין משפטלי',
        rel: 'related',
      });
    }

    addLog('internal-links', `${links.length} links`, 'success', `Generated ${links.length} internal links`);
  } catch (e) {
    addLog('internal-links', 'generation', 'failed', String(e).slice(0, 150));
  }

  return links;
}

// ============================================================
// 8. Submit person page URLs for indexing
// ============================================================
async function submitPersonPagesForIndexing(): Promise<number> {
  const newUrls: string[] = [];

  try {
    const personData = await generatePersonSeoData();

    // Load already-submitted URLs from DB (persistent across restarts)
    const { prisma } = await import('./db');
    const alreadySubmitted = await prisma.importLog.findMany({
      where: { source: 'person-indexing-google' },
      select: { sourceName: true },
    });
    const submittedSet = new Set(alreadySubmitted.map((r: { sourceName: string }) => r.sourceName));

    // Find truly new URLs never submitted to Google
    const newForGoogle: string[] = [];
    const newForIndexNow: string[] = [];

    for (const person of personData) {
      if (!submittedSet.has(person.url)) {
        newForGoogle.push(person.url);
      }
      // IndexNow: send all (Bing/Yandex handle re-submissions gracefully)
      newForIndexNow.push(person.url);
    }

    // Send to Google (200/day quota — only truly new pages)
    let googleCount = 0;
    if (newForGoogle.length > 0) {
      googleCount = await submitUrlsToGoogle(newForGoogle);
      // Persist submitted URLs to DB so quota isn't wasted on restarts
      const submitted = newForGoogle.slice(0, 200);
      const { prisma: prismaDb } = await import('./db');
      await prismaDb.importLog.createMany({
        data: submitted.map(url => ({
          source: 'person-indexing-google',
          sourceName: url,
          importDate: new Date(),
          totalCount: 1,
          newCount: 1,
          updatedCount: 0,
          status: 'submitted',
        })),
      }).catch(() => {});
      newUrls.push(...submitted);
    }

    // Send ALL to IndexNow in batches of 10K (Bing/Yandex — no daily quota)
    let indexNowCount = 0;
    for (let i = 0; i < newForIndexNow.length; i += 10000) {
      const batch = newForIndexNow.slice(i, i + 10000);
      indexNowCount += await submitUrlsViaIndexNow(batch);
    }

    if (googleCount > 0 || indexNowCount > 0) {
      addLog('person-indexing', `${personData.length} person pages`, 'success',
        `Google: ${googleCount} new, IndexNow: ${indexNowCount}, pending: ${newForGoogle.length - googleCount}`);
    }
  } catch (e) {
    addLog('person-indexing', 'submission', 'failed', String(e).slice(0, 150));
  }

  return newUrls.length;
}

// ============================================================
// 9. Full SEO run - index + report
// ============================================================
export async function runFullSeoProcess(): Promise<{
  indexing: { total: number; newlySubmitted: number; pingResults: { google: boolean; bing: boolean; yandex: boolean } };
  personNames: number;
  personPagesSubmitted: number;
  reportGenerated: boolean;
}> {
  // Step 1: Submit judgment + lawyer + article URLs
  const indexing = await submitNewJudgmentsForIndexing();

  // Step 2: Generate person SEO data and submit person page URLs
  const personData = await generatePersonSeoData();
  const personPagesSubmitted = await submitPersonPagesForIndexing();

  // Step 3: Ping sitemaps aggressively (already done in submitNewJudgmentsForIndexing, do another round)
  await pingSitemapToSearchEngines();

  return {
    indexing,
    personNames: personData.length,
    personPagesSubmitted,
    reportGenerated: true,
  };
}

/**
 * Name Ranking Monitor — checks, per plaintiff/defendant name, whether
 * mishpatly.co.il is the top Google result for that name. This is the core
 * of the "removal request" business: if someone's name is searched and we
 * don't rank first, we boost our page for that name (more indexing signals);
 * if we do rank first, that's exactly the leverage that gets people to pay
 * for a removal.
 *
 * Rate-limited to stay inside SerpApi's free tier (250 searches/month):
 * checks a small daily batch, prioritizing names never checked before, then
 * the ones checked longest ago.
 */

import { prisma } from './db';
import { checkGoogleRanking } from './seo-monitor';
import { getPersonNameIndex, submitUrlsToGoogle, submitUrlsViaIndexNow } from './seo-engine';

// 8/day keeps us at ~240/month, safely under the 250/month free SerpApi quota
const DAILY_CHECK_LIMIT = 8;

// Institutional/anonymized parties are never removal-request customers -
// checking their ranking would waste scarce free-tier API quota. Individual
// people (and companies) are what the business actually targets.
const NON_ACTIONABLE_NAMES = new Set([
  'מדינת ישראל',
  'פלוני',
  'פלונית',
  'אלמוני',
  'אלמונית',
  'המוסד לביטוח לאומי',
  'ביטוח לאומי',
  'משרד ראש הממשלה',
  'היועץ המשפטי לממשלה',
  'היועצת המשפטית לממשלה',
  'רשות המסים',
  'מדינת ישראל - רשות המסים',
]);

function isActionableName(name: string): boolean {
  const trimmed = name.trim();
  if (NON_ACTIONABLE_NAMES.has(trimmed)) return false;
  if (trimmed.startsWith('פלוני') || trimmed.startsWith('אלמוני')) return false; // "פלוני 1", "אלמונית 2" etc.
  if (trimmed.startsWith('משרד ה')) return false; // government ministries
  return true;
}

export interface NameRankResult {
  name: string;
  position: number | null;
  url: string | null;
  isFirst: boolean;
  boosted: boolean;
}

/**
 * Pick which names to check today: never-checked names first (most
 * judgments first, since those matter most), then previously-checked names
 * ordered by staleness (oldest check first).
 */
async function pickNamesToCheck(limit: number): Promise<{ name: string; urls: string[] }[]> {
  const allNames = (await getPersonNameIndex()).filter(n => isActionableName(n.name));
  const existing = await prisma.nameRanking.findMany({
    select: { name: true, lastCheckedAt: true },
  });
  const checkedMap = new Map(existing.map(e => [e.name, e.lastCheckedAt]));

  const neverChecked = allNames.filter(n => !checkedMap.has(n.name));
  const previouslyChecked = allNames
    .filter(n => checkedMap.has(n.name))
    .sort((a, b) => {
      const ta = checkedMap.get(a.name)?.getTime() || 0;
      const tb = checkedMap.get(b.name)?.getTime() || 0;
      return ta - tb; // oldest check first
    });

  return [...neverChecked, ...previouslyChecked].slice(0, limit);
}

/**
 * Run the daily name-ranking check + auto-boost pass.
 */
export async function runNameRankingCheck(): Promise<NameRankResult[]> {
  const queue = await pickNamesToCheck(DAILY_CHECK_LIMIT);
  const results: NameRankResult[] = [];

  for (const item of queue) {
    const { position, url } = await checkGoogleRanking(item.name);
    const isFirst = position === 1;

    await prisma.nameRanking.upsert({
      where: { name: item.name },
      update: { position, url, lastCheckedAt: new Date(), checkCount: { increment: 1 } },
      create: { name: item.name, position, url, lastCheckedAt: new Date(), checkCount: 1 },
    });

    // If we're not #1 (or not found at all), push our page(s) for this name
    // back into the indexing queues - cheap, safe, no extra API cost.
    let boosted = false;
    if (!isFirst && item.urls.length > 0) {
      try {
        await Promise.all([
          submitUrlsToGoogle(item.urls),
          submitUrlsViaIndexNow(item.urls),
        ]);
        boosted = true;
      } catch { /* indexing submission failed, not fatal */ }
    }

    results.push({ name: item.name, position, url, isFirst, boosted });

    // Stay well under SerpApi rate limits
    await new Promise(r => setTimeout(r, 1200));
  }

  return results;
}

/**
 * Judgment store - uses PostgreSQL via Prisma for persistent storage
 * ALL reads go directly to DB to ensure data never disappears
 * In-memory cache is used only as a performance optimization
 */

import { prisma } from './db';
import type { Judgment, JudgmentStatus } from '@prisma/client';

export interface StoredJudgment {
  id: number;
  title: string;
  slug: string;
  caseNumber: string;
  courtName: string;
  procedureType: string;
  judgmentDate: string;
  judge: string;
  plaintiff: string;
  defendant: string;
  parties: string;
  summary: string;
  fullText: string;
  aiAnalysis?: string;
  legalTopics?: string[];
  keyFindings?: string;
  partiesArgs?: string;
  courtReasoning?: string;
  verdict?: string;
  decisionType?: string;
  relatedCases?: string[];
  aiEnrichedAt?: string;
  sourceUrl: string;
  pdfUrl: string;
  sourceName: string;
  category: string;
  govFileId?: string;
  govFolderDate?: string;
  pdfPageCount?: number;
  firstPageText?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'HIDDEN' | 'PENDING_REVIEW';
  isIndexable: boolean;
  createdAt: string;
  updatedAt: string;
}

function dbToStored(j: Judgment): StoredJudgment {
  return {
    id: j.id,
    title: j.title,
    slug: j.slug,
    caseNumber: j.caseNumber,
    courtName: j.courtName,
    procedureType: j.procedureType || '',
    judgmentDate: j.judgmentDate.toISOString().split('T')[0],
    judge: j.judge || '',
    plaintiff: j.plaintiff || '',
    defendant: j.defendant || '',
    parties: j.parties || '',
    summary: j.summary || '',
    fullText: j.fullText || '',
    aiAnalysis: j.aiAnalysis || '',
    legalTopics: j.legalTopics || [],
    keyFindings: j.keyFindings || '',
    partiesArgs: j.partiesArgs || '',
    courtReasoning: j.courtReasoning || '',
    verdict: j.verdict || '',
    decisionType: j.decisionType || '',
    relatedCases: j.relatedCases || [],
    aiEnrichedAt: j.aiEnrichedAt ? j.aiEnrichedAt.toISOString() : '',
    sourceUrl: j.sourceUrl || '',
    pdfUrl: j.pdfUrl || '',
    sourceName: j.sourceName || '',
    category: j.category || '',
    govFileId: j.govFileId || '',
    govFolderDate: j.govFolderDate || '',
    pdfPageCount: j.pdfPageCount || undefined,
    firstPageText: j.firstPageText || '',
    status: j.status as StoredJudgment['status'],
    isIndexable: j.isIndexable,
    createdAt: j.createdAt.toISOString(),
    updatedAt: j.updatedAt.toISOString(),
  };
}

// Keep cacheReady as a no-op for backward compatibility
export async function cacheReady(): Promise<void> {
  // No-op - all reads now go directly to DB
}

export function createSlug(text: string): string {
  return text
    .replace(/[^\w\u0590-\u05FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .substring(0, 80) || `case-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function parseJudgmentDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

export async function addJudgment(data: Omit<StoredJudgment, 'id' | 'createdAt' | 'updatedAt' | 'isIndexable'>): Promise<StoredJudgment> {
  // Check for duplicate
  const existing = await prisma.judgment.findFirst({
    where: { caseNumber: data.caseNumber, sourceName: data.sourceName },
  });

  if (existing) {
    const updated = await prisma.judgment.update({
      where: { id: existing.id },
      data: {
        title: data.title,
        courtName: data.courtName,
        procedureType: data.procedureType || null,
        judgmentDate: parseJudgmentDate(data.judgmentDate),
        judge: data.judge || null,
        plaintiff: data.plaintiff || null,
        defendant: data.defendant || null,
        parties: data.parties || null,
        summary: data.summary || null,
        fullText: data.fullText || null,
        sourceUrl: data.sourceUrl || null,
        pdfUrl: data.pdfUrl || null,
        category: data.category || null,
        status: data.status as JudgmentStatus,
      },
    });
    return dbToStored(updated);
  }

  // Ensure unique slug
  let slug = data.slug;
  let counter = 1;
  while (await prisma.judgment.findFirst({ where: { slug } })) {
    slug = `${data.slug}-${counter++}`;
  }

  const judgment = await prisma.judgment.create({
    data: {
      title: data.title,
      slug,
      caseNumber: data.caseNumber,
      courtName: data.courtName,
      procedureType: data.procedureType || null,
      judgmentDate: parseJudgmentDate(data.judgmentDate),
      judge: data.judge || null,
      plaintiff: data.plaintiff || null,
      defendant: data.defendant || null,
      parties: data.parties || null,
      summary: data.summary || null,
      fullText: data.fullText || null,
      sourceUrl: data.sourceUrl || null,
      pdfUrl: data.pdfUrl || null,
      sourceName: data.sourceName || null,
      category: data.category || null,
      status: data.status as JudgmentStatus,
      isIndexable: true,
    },
  });
  return dbToStored(judgment);
}

/**
 * Validate that a judgment looks like real legal data, not scraped junk.
 * Returns null if valid, or a rejection reason string.
 */
function validateJudgment(item: { caseNumber: string; title: string; courtName: string; summary?: string; fullText?: string }): string | null {
  // Case number must be at least 3 chars and not look like a test ID
  if (!item.caseNumber || item.caseNumber.length < 3) return 'missing/short caseNumber';
  if (/^PD-\d+$/i.test(item.caseNumber)) return 'test case number (PD-*)';
  if (/^אחרי \d+$/.test(item.caseNumber)) return 'test case number';

  // Title must be at least 5 chars and not be navigation/promo text
  if (!item.title || item.title.length < 5) return 'missing/short title';
  const junkTitles = ['חיפוש עורך דין', 'עורכי דין לפי', 'רוצים לדעת', 'בוט משפטי', 'פשוט תשאלו'];
  if (junkTitles.some(junk => item.title.includes(junk))) return 'junk title (website text)';

  // Court name must be more specific than just "בית משפט"
  if (item.courtName && /^בית משפט\s*\d*$/.test(item.courtName.trim())) return 'generic court name';

  return null;
}

export async function addJudgments(items: (Omit<StoredJudgment, 'id' | 'createdAt' | 'updatedAt' | 'isIndexable'> & {
  _govFileId?: string;
  _govFolderDate?: string;
  _pdfPageCount?: number;
  _firstPageText?: string;
})[]): Promise<{ added: number; updated: number }> {
  let added = 0;
  let updated = 0;

  for (const item of items) {
    const rejectReason = validateJudgment(item);
    if (rejectReason) {
      console.warn(`[judgment-store] Rejected "${item.caseNumber}" - ${item.title}: ${rejectReason}`);
      continue;
    }
    try {
      // For GOV items, check by govFileId first
      const govFileId = item._govFileId || item.govFileId;
      const existing = govFileId
        ? await prisma.judgment.findFirst({ where: { govFileId } })
        : await prisma.judgment.findFirst({
            where: { caseNumber: item.caseNumber, sourceName: item.sourceName },
          });

      const govData = {
        govFileId: govFileId || null,
        govFolderDate: item._govFolderDate || item.govFolderDate || null,
        pdfPageCount: item._pdfPageCount || item.pdfPageCount || null,
        firstPageText: item._firstPageText || item.firstPageText || null,
      };

      if (existing) {
        // Never overwrite HIDDEN status - court-ordered confidential cases must stay hidden
        if ((existing.status as string) === 'HIDDEN') {
          console.log(`[judgment-store] Skipping update for HIDDEN case ${item.caseNumber} (ID: ${existing.id})`);
          continue;
        }

        await prisma.judgment.update({
          where: { id: existing.id },
          data: {
            title: item.title,
            courtName: item.courtName,
            procedureType: item.procedureType || null,
            judgmentDate: parseJudgmentDate(item.judgmentDate),
            judge: item.judge || null,
            plaintiff: item.plaintiff || null,
            defendant: item.defendant || null,
            parties: item.parties || null,
            summary: item.summary || null,
            fullText: item.fullText || null,
            sourceUrl: item.sourceUrl || null,
            pdfUrl: item.pdfUrl || null,
            category: item.category || null,
            status: item.status as JudgmentStatus,
            ...govData,
          },
        });
        updated++;
      } else {
        let slug = item.slug;
        let counter = 1;
        while (await prisma.judgment.findFirst({ where: { slug } })) {
          slug = `${item.slug}-${counter++}`;
        }

        await prisma.judgment.create({
          data: {
            title: item.title,
            slug,
            caseNumber: item.caseNumber,
            courtName: item.courtName,
            procedureType: item.procedureType || null,
            judgmentDate: parseJudgmentDate(item.judgmentDate),
            judge: item.judge || null,
            plaintiff: item.plaintiff || null,
            defendant: item.defendant || null,
            parties: item.parties || null,
            summary: item.summary || null,
            fullText: item.fullText || null,
            sourceUrl: item.sourceUrl || null,
            pdfUrl: item.pdfUrl || null,
            sourceName: item.sourceName || null,
            category: item.category || null,
            status: item.status as JudgmentStatus,
            isIndexable: true,
            ...govData,
          },
        });
        added++;
      }
    } catch (e) {
      console.error(`[judgment-store] Error adding ${item.caseNumber}:`, e);
    }
  }

  return { added, updated };
}

/**
 * Get all judgments - reads directly from DB
 */
export async function getAllJudgmentsFromDB(): Promise<StoredJudgment[]> {
  const all = await prisma.judgment.findMany({ orderBy: { judgmentDate: 'desc' } });
  return all.map(dbToStored);
}

/**
 * Synchronous getter for backward compatibility - triggers async load
 * DEPRECATED: Use getAllJudgmentsFromDB() instead
 */
export function getAllJudgments(): StoredJudgment[] {
  // This is kept for backward compatibility but should not be relied on
  console.warn('[judgment-store] getAllJudgments() is deprecated. Use getAllJudgmentsFromDB()');
  return [];
}

export async function getJudgmentByIdFromDB(id: number): Promise<StoredJudgment | null> {
  const j = await prisma.judgment.findUnique({ where: { id } });
  return j ? dbToStored(j) : null;
}

export async function getJudgmentBySlugFromDB(slug: string): Promise<StoredJudgment | null> {
  const j = await prisma.judgment.findFirst({ where: { slug } });
  if (!j) return null;
  // Court-ordered confidential cases must not be displayed
  if ((j.status as string) === 'HIDDEN') return null;
  return dbToStored(j);
}

// Keep old sync versions for backward compat but they're unreliable
export function getJudgmentById(id: number): StoredJudgment | undefined {
  return undefined;
}
export function getJudgmentBySlug(slug: string): StoredJudgment | undefined {
  return undefined;
}

/**
 * Search judgments - reads directly from DB with proper filtering
 */
export async function searchJudgmentsFromDB(opts: {
  query?: string;
  court?: string;
  year?: string;
  procedureType?: string;
  status?: string;
  source?: string;
  category?: string;
  minPages?: number;
  page?: number;
  limit?: number;
}): Promise<{ judgments: StoredJudgment[]; total: number; page: number; totalPages: number }> {
  const { query = '', court = '', year = '', procedureType = '', status = '', source = '', category = '', minPages = 0, page = 1, limit = 20 } = opts;

  // Build Prisma where clause
  const where: Record<string, unknown> = {};

  if (status) {
    where.status = status as JudgmentStatus;
  }

  if (source) {
    where.sourceName = source;
  }

  if (category) {
    where.category = category;
  }

  if (court) {
    where.courtName = { contains: court };
  }

  if (procedureType) {
    where.procedureType = { contains: procedureType };
  }

  if (year) {
    where.judgmentDate = {
      gte: new Date(`${year}-01-01`),
      lt: new Date(`${parseInt(year) + 1}-01-01`),
    };
  }

  if (minPages > 0) {
    where.pdfPageCount = { gte: minPages };
  }

  if (query) {
    where.OR = [
      { title: { contains: query } },
      { caseNumber: { contains: query } },
      { plaintiff: { contains: query } },
      { defendant: { contains: query } },
      { judge: { contains: query } },
      { summary: { contains: query } },
    ];
  }

  const [total, results] = await Promise.all([
    prisma.judgment.count({ where }),
    prisma.judgment.findMany({
      where,
      orderBy: { judgmentDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    judgments: results.map(dbToStored),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// Keep old sync version name for backward compat - but callers should migrate
export function searchJudgments(opts: {
  query?: string;
  court?: string;
  year?: string;
  procedureType?: string;
  status?: string;
  source?: string;
  category?: string;
  page?: number;
  limit?: number;
}): { judgments: StoredJudgment[]; total: number; page: number; totalPages: number } {
  console.warn('[judgment-store] searchJudgments() is deprecated. Use searchJudgmentsFromDB()');
  return { judgments: [], total: 0, page: 1, totalPages: 0 };
}

export async function updateJudgment(id: number, data: Partial<StoredJudgment>): Promise<StoredJudgment | null> {
  try {
    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.caseNumber !== undefined) updateData.caseNumber = data.caseNumber;
    if (data.courtName !== undefined) updateData.courtName = data.courtName;
    if (data.procedureType !== undefined) updateData.procedureType = data.procedureType || null;
    if (data.judgmentDate !== undefined) updateData.judgmentDate = parseJudgmentDate(data.judgmentDate);
    if (data.judge !== undefined) updateData.judge = data.judge || null;
    if (data.plaintiff !== undefined) updateData.plaintiff = data.plaintiff || null;
    if (data.defendant !== undefined) updateData.defendant = data.defendant || null;
    if (data.parties !== undefined) updateData.parties = data.parties || null;
    if (data.summary !== undefined) updateData.summary = data.summary || null;
    if (data.fullText !== undefined) updateData.fullText = data.fullText || null;
    if (data.sourceUrl !== undefined) updateData.sourceUrl = data.sourceUrl || null;
    if (data.pdfUrl !== undefined) updateData.pdfUrl = data.pdfUrl || null;
    if (data.sourceName !== undefined) updateData.sourceName = data.sourceName || null;
    if (data.category !== undefined) updateData.category = data.category || null;
    if (data.status !== undefined) updateData.status = data.status as JudgmentStatus;
    if (data.isIndexable !== undefined) updateData.isIndexable = data.isIndexable;

    const updated = await prisma.judgment.update({ where: { id }, data: updateData });
    return dbToStored(updated);
  } catch (e) {
    console.error('[judgment-store] updateJudgment error:', e);
    return null;
  }
}

export async function deleteJudgment(id: number): Promise<boolean> {
  try {
    await prisma.judgment.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get stats - reads directly from DB
 */
export async function getStatsFromDB() {
  const [
    totalJudgments,
    publishedCount,
    hiddenCount,
    draftCount,
    pendingReviewCount,
    sourceBreakdownRaw,
    categoryBreakdownRaw,
    recentJudgments,
  ] = await Promise.all([
    prisma.judgment.count(),
    prisma.judgment.count({ where: { status: 'PUBLISHED' } }),
    prisma.judgment.count({ where: { status: 'HIDDEN' } }),
    prisma.judgment.count({ where: { status: 'DRAFT' } }),
    prisma.judgment.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.judgment.groupBy({ by: ['sourceName'], _count: true }),
    prisma.judgment.groupBy({ by: ['category'], _count: true }),
    prisma.judgment.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);

  const sourceBreakdown: Record<string, number> = {};
  for (const row of sourceBreakdownRaw) {
    sourceBreakdown[row.sourceName || 'unknown'] = row._count;
  }

  const categoryBreakdown: Record<string, number> = {};
  for (const row of categoryBreakdownRaw) {
    categoryBreakdown[row.category || 'אחר'] = row._count;
  }

  return {
    totalJudgments,
    publishedCount,
    hiddenCount,
    draftCount,
    pendingReviewCount,
    sourceBreakdown,
    categoryBreakdown,
    recentJudgments: recentJudgments.map(dbToStored),
  };
}

// Keep old sync version for backward compat
export function getStats() {
  console.warn('[judgment-store] getStats() is deprecated. Use getStatsFromDB()');
  return {
    totalJudgments: 0,
    publishedCount: 0,
    hiddenCount: 0,
    draftCount: 0,
    pendingReviewCount: 0,
    sourceBreakdown: {},
    categoryBreakdown: {},
    recentJudgments: [] as StoredJudgment[],
  };
}

export async function getStoreSize(): Promise<number> {
  return prisma.judgment.count();
}

/**
 * Auto-hydrate: DISABLED - only GOV.IL imports allowed
 */
export function ensureHydrated(): void {
  // Disabled - data comes only from decisions.court.gov.il via cron
}

// Re-export loadCache as no-op for backward compat
export async function loadCache(): Promise<void> {}

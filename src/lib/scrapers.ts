/**
 * Scrapers - only GOV.IL (decisions.court.gov.il)
 * All other sources have been removed.
 */

import { createSlug, type StoredJudgment } from './judgment-store';

type JudgmentInput = Omit<StoredJudgment, 'id' | 'createdAt' | 'updatedAt' | 'isIndexable'> & {
  _govFileId?: string;
  _govFolderDate?: string;
  _pdfPageCount?: number;
  _firstPageText?: string;
};

// ============================================================
// Helper: detect category from procedure type / court / text
// ============================================================
export function detectCategory(procedureType: string, courtName: string, summary: string): string {
  const text = `${procedureType} ${courtName} ${summary}`.toLowerCase();

  if (text.includes('פלילי') || text.includes('תפ') || text.includes('עפ') || text.includes('פלי')) return 'פלילי';
  if (text.includes('משפחה') || text.includes('גירושין') || text.includes('מזונות') || text.includes('משמורת')) return 'משפחה';
  if (text.includes('עבודה') || text.includes('עב') || text.includes('דמ')) return 'עבודה';
  if (text.includes('מנהלי') || text.includes('עתירה') || text.includes('בג"ץ') || text.includes('עת"מ')) return 'מנהלי';
  if (text.includes('נזיקין') || text.includes('תאונ') || text.includes('פיצוי') || text.includes('נזק')) return 'נזיקין';
  if (text.includes('חוזה') || text.includes('חוזי') || text.includes('הסכם')) return 'חוזים';
  if (text.includes('מקרקעין') || text.includes('דירה') || text.includes('נדל"ן') || text.includes('שכירות')) return 'מקרקעין';
  if (text.includes('ביטוח')) return 'ביטוח';
  if (text.includes('מיסים') || text.includes('מס') || text.includes('מע"מ')) return 'מיסים';
  if (text.includes('חדלות פירעון') || text.includes('פירוק') || text.includes('פשיטת רגל')) return 'חדלות פירעון';
  if (text.includes('רבני') || text.includes('בית דין רבני')) return 'בית דין רבני';
  if (text.includes('אזרחי') || text.includes('תא') || text.includes('ע"א')) return 'אזרחי';

  return 'אזרחי';
}

export { createSlug };

// ============================================================
// Run all scrapers - ONLY decisions.court.gov.il
// ============================================================
export interface ScrapeResult {
  source: string;
  sourceName: string;
  items: JudgmentInput[];
  errors: string[];
  duration: number;
}

export async function runAllScrapers(): Promise<ScrapeResult[]> {
  const { scrapeGovDecisions } = await import('./scraper-gov-decisions');
  const { prisma } = await import('./db');

  const start = Date.now();

  try {
    // Get existing GOV file IDs to avoid re-processing
    const existing = await prisma.judgment.findMany({
      where: { govFileId: { not: null } },
      select: { govFileId: true },
    });
    const existingIds = new Set(existing.map(j => j.govFileId).filter(Boolean) as string[]);

    // Get confidential case numbers from monitor logs (not_found = court ordered but not yet in DB)
    // These must NEVER be imported
    const confidentialLogs = await prisma.importLog.findMany({
      where: { source: 'confidential-monitor' },
      select: { sourceName: true },
    });
    const confidentialCaseNumbers = new Set(confidentialLogs.map(l => l.sourceName).filter(Boolean));

    // Also get HIDDEN cases from DB (already imported but then hidden by court order)
    const hiddenCases = await prisma.judgment.findMany({
      where: { status: 'HIDDEN' },
      select: { caseNumber: true },
    });
    hiddenCases.forEach(j => confidentialCaseNumbers.add(j.caseNumber));

    const { items: govItems, errors } = await scrapeGovDecisions(existingIds, confidentialCaseNumbers);

    // A judgment is only worth publishing once it has real party names.
    // Some PDFs extract with garbled/reversed text (Hebrew bidi issue in the
    // parser) and plaintiff/defendant end up empty - those must stay
    // unpublished (PENDING_REVIEW) until AI enrichment fills them in, since
    // the whole point of the site is being found by name.
    const hasRealName = (name: string) => !!name && name.trim().length > 0 && name.trim() !== 'לא ידוע';

    // Map GOV items to the standard format
    const items: JudgmentInput[] = govItems.map(item => ({
      title: item.title,
      slug: item.slug,
      caseNumber: item.caseNumber,
      courtName: item.courtName,
      procedureType: item.procedureType,
      judgmentDate: item.judgmentDate,
      judge: item.judge,
      plaintiff: item.plaintiff,
      defendant: item.defendant,
      parties: item.parties,
      summary: item.summary,
      fullText: item.fullText,
      sourceUrl: item.sourceUrl,
      pdfUrl: item.pdfUrl,
      sourceName: item.sourceName,
      category: item.category,
      status: (hasRealName(item.plaintiff) || hasRealName(item.defendant)) ? 'PUBLISHED' : 'PENDING_REVIEW',
      _govFileId: item.govFileId,
      _govFolderDate: item.govFolderDate,
      _pdfPageCount: item.pdfPageCount,
      _firstPageText: item.firstPageText,
    }));

    return [{
      source: 'decisions.court.gov.il',
      sourceName: 'פסקי דין - הרשות השופטת',
      items,
      errors,
      duration: Date.now() - start,
    }];
  } catch (e) {
    return [{
      source: 'decisions.court.gov.il',
      sourceName: 'פסקי דין - הרשות השופטת',
      items: [],
      errors: [String(e)],
      duration: Date.now() - start,
    }];
  }
}

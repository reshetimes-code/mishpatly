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

    const { items: govItems, errors } = await scrapeGovDecisions(existingIds);

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
      status: 'PUBLISHED',
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

/**
 * Daily import system - fetches judgments from multiple public sources
 * Runs daily at 08:00 AM via cron
 * Saves all import logs to PostgreSQL for persistence
 */

import { runAllScrapers } from './scrapers';
import { addJudgments } from './judgment-store';
import { prisma } from './db';
import { generateComprehensiveAnalysis, mergeComprehensiveAnalysis } from './gemini';

export interface ImportRecord {
  id: string;
  source: string;
  sourceName: string;
  importDate: string;
  importTime: string;
  count: number;
  status: 'success' | 'failed' | 'partial';
  newItems: number;
  updatedItems: number;
  errors: string[];
  duration: number;
  items: ImportedItem[];
}

export interface ImportedItem {
  caseNumber: string;
  defendant: string;
  plaintiff: string;
  court: string;
  date: string;
  subject: string;
  decision: string;
  source: string;
  category: string;
}

/**
 * Get import history from database
 */
export async function getImportHistory(): Promise<ImportRecord[]> {
  try {
    const logs = await prisma.importLog.findMany({
      orderBy: { importDate: 'desc' },
      take: 100,
    });

    return logs.map(log => ({
      id: `import-${log.id}`,
      source: log.source,
      sourceName: log.sourceName,
      importDate: log.importDate.toLocaleDateString('he-IL'),
      importTime: log.importDate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      count: log.totalCount,
      status: log.status as 'success' | 'failed' | 'partial',
      newItems: log.newCount,
      updatedItems: log.updatedCount,
      errors: log.errors ? JSON.parse(log.errors) : [],
      duration: 0,
      items: [],
    }));
  } catch (e) {
    console.error('[daily-import] Failed to get import history from DB:', e);
    return [];
  }
}

/**
 * Get last import date from database
 */
export async function getLastImportDate(): Promise<string | null> {
  try {
    const last = await prisma.importLog.findFirst({
      orderBy: { importDate: 'desc' },
    });
    return last ? last.importDate.toLocaleDateString('he-IL') : null;
  } catch {
    return null;
  }
}

/**
 * Run daily import - scrapes all sources and saves to DB
 */
export async function runDailyImport(): Promise<ImportRecord> {
  const now = new Date();
  const dateStr = now.toLocaleDateString('he-IL');
  const timeStr = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

  // Run all scrapers
  const scrapeResults = await runAllScrapers();

  // Main combined record
  const mainRecord: ImportRecord = {
    id: `import-${Date.now()}`,
    source: 'all-sources',
    sourceName: 'כל המקורות',
    importDate: dateStr,
    importTime: timeStr,
    count: 0,
    status: 'success',
    newItems: 0,
    updatedItems: 0,
    errors: [],
    duration: 0,
    items: [],
  };

  // Process each source result and save to DB
  for (const result of scrapeResults) {
    const { added, updated } = await addJudgments(result.items);

    // Save import log to database
    try {
      await prisma.importLog.create({
        data: {
          source: result.source,
          sourceName: result.sourceName,
          importDate: now,
          totalCount: result.items.length,
          newCount: added,
          updatedCount: updated,
          status: result.errors.length > 0 ? (result.items.length > 0 ? 'partial' : 'failed') : 'success',
          errors: result.errors.length > 0 ? JSON.stringify(result.errors) : null,
        },
      });
    } catch (e) {
      console.error(`[daily-import] Failed to save import log for ${result.source}:`, e);
    }

    mainRecord.count += result.items.length;
    mainRecord.newItems += added;
    mainRecord.updatedItems += updated;
    mainRecord.errors.push(...result.errors);
    mainRecord.duration = Math.max(mainRecord.duration, result.duration);

    // Collect sample items
    for (const item of result.items.slice(0, 3)) {
      mainRecord.items.push({
        caseNumber: item.caseNumber,
        defendant: item.defendant,
        plaintiff: item.plaintiff,
        court: item.courtName,
        date: item.judgmentDate,
        subject: item.summary?.slice(0, 100) || '',
        decision: '',
        source: item.sourceName,
        category: item.category,
      });
    }
  }

  // Set main record status
  mainRecord.status = mainRecord.errors.length > 0
    ? (mainRecord.count > 0 ? 'partial' : 'failed')
    : 'success';

  // AI comprehensive scan: enrich newly imported judgments with full analysis
  try {
    const needsScan = await prisma.judgment.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        aiEnrichedAt: null,
      },
      take: 30,
    });

    let aiUpdated = 0;
    for (const j of needsScan) {
      try {
        const analysis = await generateComprehensiveAnalysis(
          j.fullText || '',
          {
            caseNumber: j.caseNumber,
            courtName: j.courtName,
            judge: j.judge || undefined,
            plaintiff: j.plaintiff || undefined,
            defendant: j.defendant || undefined,
            summary: j.summary || undefined,
            procedureType: j.procedureType || undefined,
            category: j.category || undefined,
            title: j.title,
          }
        );
        if (!analysis) continue;

        const updates = mergeComprehensiveAnalysis(
          {
            judge: j.judge || '', plaintiff: j.plaintiff || '', defendant: j.defendant || '',
            procedureType: j.procedureType || '', category: j.category || '',
            summary: j.summary || '', courtName: j.courtName || '',
            aiAnalysis: j.aiAnalysis || '', keyFindings: j.keyFindings || '',
            partiesArgs: j.partiesArgs || '', courtReasoning: j.courtReasoning || '',
            verdict: j.verdict || '', decisionType: j.decisionType || '',
          },
          analysis,
        );

        if (Object.keys(updates).length > 0) {
          await prisma.judgment.update({ where: { id: j.id }, data: updates });
          aiUpdated++;
        }
        await new Promise((r) => setTimeout(r, 500));
      } catch { /* continue on error */ }
    }
    if (aiUpdated > 0) {
      console.log(`[daily-import] AI enriched ${aiUpdated} judgments with comprehensive analysis`);
    }
  } catch (e) {
    console.error('[daily-import] AI scan error:', e);
  }

  // Save main combined log to DB
  try {
    await prisma.importLog.create({
      data: {
        source: 'all-sources',
        sourceName: 'כל המקורות',
        importDate: now,
        totalCount: mainRecord.count,
        newCount: mainRecord.newItems,
        updatedCount: mainRecord.updatedItems,
        status: mainRecord.status,
        errors: mainRecord.errors.length > 0 ? JSON.stringify(mainRecord.errors) : null,
      },
    });
  } catch (e) {
    console.error('[daily-import] Failed to save main import log:', e);
  }

  return mainRecord;
}

export function getAllImportedItems(): ImportedItem[] {
  return [];
}

/**
 * Get source summary from database
 */
export async function getSourceSummary(): Promise<{ source: string; sourceName: string; lastCount: number; lastDate: string; status: string }[]> {
  try {
    const sources = ['decisions.court.gov.il'];
    const sourceNames: Record<string, string> = {
      'decisions.court.gov.il': 'פסקי דין - הרשות השופטת',
    };

    const results = [];
    for (const source of sources) {
      const last = await prisma.importLog.findFirst({
        where: { source },
        orderBy: { importDate: 'desc' },
      });

      results.push({
        source,
        sourceName: sourceNames[source] || source,
        lastCount: last?.totalCount || 0,
        lastDate: last ? `${last.importDate.toLocaleDateString('he-IL')} ${last.importDate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}` : 'לא יובא',
        status: last?.status || 'pending',
      });
    }

    return results;
  } catch (e) {
    console.error('[daily-import] Failed to get source summary:', e);
    return [];
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { runDailyImport } from '@/lib/daily-import';
import { runFullSeoProcess } from '@/lib/seo-engine';
import { prisma } from '@/lib/db';

// Called by Google Cloud Scheduler every day at 08:00 AM
// Or by the internal self-scheduler
const CRON_SECRET = process.env.CRON_SECRET || 'mishpatli-cron-secret-2026';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const urlSecret = new URL(request.url).searchParams.get('secret');

  if (authHeader !== `Bearer ${CRON_SECRET}` && urlSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Step 1: Import judgments from all sources
    const importResult = await runDailyImport();

    // Step 2: Run SEO
    const seoResult = await runFullSeoProcess();

    // Step 3: Get total count from DB for email
    const totalInDB = await prisma.judgment.count();

    // Step 4: Send detailed daily report email
    let emailSent = false;
    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString('he-IL');
      const reportLink = 'https://mishpatly.co.il/api/seo?view=report';

      // Build detailed source breakdown
      const sourceLines: string[] = [];
      // Get per-source stats from the last import logs
      const recentLogs = await prisma.importLog.findMany({
        where: {
          importDate: { gte: new Date(now.getTime() - 2 * 60 * 60 * 1000) }, // last 2 hours
          source: { not: 'all-sources' },
        },
        orderBy: { importDate: 'desc' },
      });

      for (const log of recentLogs) {
        const statusIcon = log.status === 'success' ? 'V' : log.status === 'partial' ? '!' : 'X';
        sourceLines.push(`${statusIcon} ${log.sourceName}: ${log.totalCount} נסרקו, ${log.newCount} חדשים, ${log.updatedCount} עודכנו`);
      }

      const emailBody = [
        `=== דוח ייבוא יומי - משפטלי ===`,
        `תאריך: ${dateStr}`,
        ``,
        `--- סיכום כללי ---`,
        `סה"כ פסקי דין במאגר: ${totalInDB}`,
        `נסרקו היום: ${importResult.count}`,
        `חדשים: ${importResult.newItems}`,
        `עודכנו: ${importResult.updatedItems}`,
        `שגיאות: ${importResult.errors.length}`,
        ``,
        `--- פירוט לפי מקור ---`,
        ...sourceLines,
        ``,
        `--- SEO ---`,
        `URLs נשלחו לאינדוקס: ${seoResult.indexing.newlySubmitted}`,
        `שמות מאונדקסים: ${seoResult.personNames}`,
        `Google Ping: ${seoResult.indexing.pingResults.google ? 'הצלחה' : 'נכשל'}`,
        `Bing Ping: ${seoResult.indexing.pingResults.bing ? 'הצלחה' : 'נכשל'}`,
        ``,
        totalInDB >= 10000
          ? `*** הגענו ל-${totalInDB} פסקי דין! אולי כדאי להוסיף מקום בשרת ***`
          : `יעד: ${totalInDB}/10,000 פסקי דין (${Math.round(totalInDB / 100)}%)`,
        ``,
        `דוח מלא: ${reportLink}`,
      ].join('\n');

      const subject = totalInDB >= 10000
        ? `הגענו ל-${totalInDB} פסקי דין! - משפטלי - ${dateStr}`
        : `דוח ייבוא יומי - משפטלי - ${dateStr} - ${importResult.newItems} חדשים (סה"כ ${totalInDB})`;

      // Send to both emails in parallel
      const emailPromises = ['info@reshetimes.co.il', 'reshetimes@gmail.com'].map(email =>
        fetch(`https://formsubmit.co/ajax/${email}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: subject,
            message: emailBody,
            _template: 'box',
            _captcha: 'false',
          }),
          signal: AbortSignal.timeout(10000),
        }).catch(() => null)
      );

      const results = await Promise.all(emailPromises);
      emailSent = results.some(r => r?.ok);
    } catch { /* email is best-effort */ }

    return NextResponse.json({
      message: `Daily process completed`,
      timestamp: new Date().toISOString(),
      totalInDB,
      import: {
        count: importResult.count,
        newItems: importResult.newItems,
        updatedItems: importResult.updatedItems,
        status: importResult.status,
        errors: importResult.errors.length,
      },
      seo: {
        urlsSubmitted: seoResult.indexing.newlySubmitted,
        personNames: seoResult.personNames,
        pingGoogle: seoResult.indexing.pingResults.google,
        pingBing: seoResult.indexing.pingResults.bing,
      },
      emailSent,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Process failed', details: String(error) },
      { status: 500 }
    );
  }
}

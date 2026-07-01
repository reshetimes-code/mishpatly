import { NextRequest, NextResponse } from 'next/server';
import { runDailyImport } from '@/lib/daily-import';
import { runFullSeoProcess } from '@/lib/seo-engine';
import { prisma } from '@/lib/db';
import nodemailer from 'nodemailer';

// Called by Google Cloud Scheduler every day at 08:00 AM
// Or by the internal self-scheduler
const CRON_SECRET = process.env.CRON_SECRET || 'mishpatli-cron-secret-2026';

const REPORT_RECIPIENTS = ['reshetimes@gmail.com', 'haimeld@gmail.com', 'orenshp77@gmail.com'];

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER || 'reshetimes@gmail.com',
      pass: process.env.SMTP_PASS || '',
    },
  });
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const urlSecret = new URL(request.url).searchParams.get('secret');

  if (authHeader !== `Bearer ${CRON_SECRET}` && urlSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Step 0a: Clean up junk/promotional entries that are not real judgments
    try {
      const junkSlugs = [
        'psakdin-רוצים-לדעת-איך-צפוי-התיק-להיגמר-בבית-משפט-פשוט-תשאלו',
        'psakdin-חיפוש-עורך-דין-לפי-עיר',
        'psakdin-עורכי-דין-לפי-תחום',
        'psakdin-הלפי-x2013-בוט-משפטי-חכם-שלומד-מפסקי-דין',
      ];
      const junkDeleted = await prisma.judgment.deleteMany({
        where: {
          OR: [
            { slug: { in: junkSlugs } },
            { caseNumber: { startsWith: 'PD-' } },
            { title: { contains: 'רוצים לדעת איך צפוי התיק' } },
            { title: { contains: 'חיפוש עורך דין לפי עיר' } },
            { title: { contains: 'עורכי דין לפי תחום' } },
          ],
        },
      });
      if (junkDeleted.count > 0) {
        console.log(`[cron] Cleaned up ${junkDeleted.count} junk entries`);
      }
    } catch (e) {
      console.error('[cron] Junk cleanup failed:', e);
    }

    // Step 0b: Check for court confidentiality orders (BEFORE importing new data)
    let confidentialResult = { processed: 0, unpublished: 0 };
    try {
      const { checkConfidentialCases } = await import('@/lib/confidential-monitor');
      confidentialResult = await checkConfidentialCases();
      if (confidentialResult.unpublished > 0) {
        console.log(`[cron] Confidential monitor: ${confidentialResult.unpublished} cases removed`);
      }
    } catch (e) {
      console.error('[cron] Confidential monitor failed:', e);
    }

    // Step 1: Import judgments from all sources
    const importResult = await runDailyImport();

    // Step 2: Run SEO
    const seoResult = await runFullSeoProcess();

    // Step 3: Get total count from DB for email
    const totalInDB = await prisma.judgment.count();

    // Step 4: Send detailed daily report email (only once per day)
    let emailSent = false;
    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString('he-IL');

      // DB-level guard: check if email already sent today
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      const existingEmailLog = await prisma.importLog.findFirst({
        where: {
          source: 'daily-email',
          importDate: { gte: todayStart },
        },
      });
      if (existingEmailLog) {
        console.log('[cron] Email already sent today, skipping');
        return NextResponse.json({
          message: `Daily process completed (email already sent)`,
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
            personPagesSubmitted: seoResult.personPagesSubmitted,
            pingGoogle: seoResult.indexing.pingResults.google,
            pingBing: seoResult.indexing.pingResults.bing,
          },
          emailSent: false,
          emailSkipped: true,
        });
      }

      // Mark email as sent BEFORE actually sending (to prevent race conditions)
      await prisma.importLog.create({
        data: {
          source: 'daily-email',
          sourceName: 'דוח יומי - מייל',
          importDate: now,
          totalCount: totalInDB,
          newCount: importResult.newItems,
          updatedCount: importResult.updatedItems,
          status: 'pending',
        },
      });
      const reportLink = 'https://mishpatly.co.il/admin/dashboard';

      // Build detailed source breakdown
      const sourceLines: string[] = [];
      // Get only the latest log per source (not duplicates from multiple runs)
      const allRecentLogs = await prisma.importLog.findMany({
        where: {
          importDate: { gte: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
          source: { notIn: ['all-sources', 'daily-email'] },
        },
        orderBy: { importDate: 'desc' },
      });
      // Keep only the most recent entry per source
      const seenSources = new Set<string>();
      const recentLogs = allRecentLogs.filter(log => {
        if (seenSources.has(log.source)) return false;
        seenSources.add(log.source);
        return true;
      });

      for (const log of recentLogs) {
        const statusIcon = log.status === 'success' ? '\u2705' : log.status === 'partial' ? '\u26A0\uFE0F' : '\u274C';
        sourceLines.push(`${statusIcon} ${log.sourceName}: ${log.totalCount} נסרקו, ${log.newCount} חדשים, ${log.updatedCount} עודכנו`);
      }

      const subject = totalInDB >= 10000
        ? `\u{1F389} הגענו ל-${totalInDB} פסקי דין! - משפטלי - ${dateStr}`
        : `\u{1F4CA} דוח ייבוא יומי - משפטלי - ${dateStr} - ${importResult.newItems} חדשים (סה"כ ${totalInDB})`;

      const progressPercent = Math.round(totalInDB / 100);
      const progressBar = '\u2588'.repeat(Math.min(Math.round(progressPercent / 5), 20)) + '\u2591'.repeat(Math.max(20 - Math.round(progressPercent / 5), 0));

      const htmlBody = `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a365d, #2c5282); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">\u2696\uFE0F משפטלי - דוח ייבוא יומי</h1>
            <p style="margin: 5px 0 0; opacity: 0.9;">${dateStr}</p>
          </div>

          <div style="background: #f7fafc; padding: 20px; border: 1px solid #e2e8f0;">
            <h2 style="color: #2d3748; margin-top: 0;">\u{1F4CA} סיכום כללי</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>סה"כ פסקי דין במאגר</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 20px; font-weight: bold; color: #2c5282;">${totalInDB}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">נסרקו היום</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${importResult.count}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">חדשים</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; color: #38a169; font-weight: bold;">${importResult.newItems}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">עודכנו</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${importResult.updatedItems}</td></tr>
              <tr><td style="padding: 8px;">שגיאות</td><td style="padding: 8px; color: ${importResult.errors.length > 0 ? '#e53e3e' : '#38a169'};">${importResult.errors.length}</td></tr>
            </table>
          </div>

          <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
            <h2 style="color: #2d3748; margin-top: 0;">\u{1F4E1} פירוט לפי מקור</h2>
            ${sourceLines.map(line => `<p style="margin: 5px 0; padding: 8px; background: #f7fafc; border-radius: 5px;">${line}</p>`).join('')}
          </div>

          <div style="background: #f7fafc; padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
            <h2 style="color: #2d3748; margin-top: 0;">\u{1F50D} SEO</h2>
            <p>URLs נשלחו לאינדוקס: <strong>${seoResult.indexing.newlySubmitted}</strong></p>
            <p>שמות מאונדקסים: <strong>${seoResult.personNames}</strong></p>
            <p>דפי שמות נשלחו לאינדוקס: <strong>${seoResult.personPagesSubmitted}</strong></p>
            <p>Google Ping: ${seoResult.indexing.pingResults.google ? '\u2705 הצלחה' : '\u274C נכשל'}</p>
            <p>Bing Ping: ${seoResult.indexing.pingResults.bing ? '\u2705 הצלחה' : '\u274C נכשל'}</p>
          </div>

          <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2d3748; margin-top: 0;">\u{1F3AF} התקדמות</h2>
            <p style="font-family: monospace; font-size: 16px;">${progressBar} ${progressPercent}%</p>
            <p>${totalInDB >= 10000
              ? `<strong style="color: #38a169;">\u{1F389} הגענו ל-${totalInDB} פסקי דין!</strong>`
              : `יעד: ${totalInDB} / 10,000 פסקי דין`}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0;">
            <p style="text-align: center;"><a href="${reportLink}" style="color: #2c5282;">צפייה בדוח המלא</a></p>
          </div>
        </div>
      `;

      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"משפטלי" <${process.env.SMTP_USER || 'reshetimes@gmail.com'}>`,
        to: REPORT_RECIPIENTS.join(', '),
        subject,
        html: htmlBody,
      });
      emailSent = true;

      // Update the email log status to success
      await prisma.importLog.updateMany({
        where: {
          source: 'daily-email',
          importDate: { gte: todayStart },
        },
        data: { status: 'success' },
      });
    } catch (e) {
      console.error('[cron] Email failed:', e);
      // Update the email log status to failed so it can retry
      const todayStartFallback = new Date();
      todayStartFallback.setHours(0, 0, 0, 0);
      await prisma.importLog.deleteMany({
        where: {
          source: 'daily-email',
          importDate: { gte: todayStartFallback },
        },
      }).catch(() => {});
    }

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
        personPagesSubmitted: seoResult.personPagesSubmitted,
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

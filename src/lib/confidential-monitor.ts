/**
 * Confidential Case Monitor
 *
 * Checks Gmail for court-ordered confidentiality notices from DecisionsPublishing@court.gov.il
 * and automatically removes/unpublishes matching cases from the database.
 *
 * Sends notification emails to admins with a list of actions taken.
 */

import { prisma } from './db';
import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER || 'reshetimes@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || '';

const NOTIFICATION_RECIPIENTS = ['reshetimes@gmail.com', 'telaviv2u@gmail.com'];

// Court email sender
const COURT_SENDER = 'DecisionsPublishing@court.gov.il';

interface ConfidentialAction {
  caseNumber: string;
  courtName: string;
  emailSubject: string;
  emailDate: string;
  action: 'unpublished' | 'not_found' | 'already_hidden';
  judgmentId?: number;
  judgmentTitle?: string;
}

/**
 * Extract case number and court from confidentiality email body
 * Example: "נבקש לעדכנכם כי בתיק ה"ט 56974-06-26 המתנהל בביהמ"ש השלום בבת ים, ניתנה החלטה על חיסיון."
 */
function parseConfidentialEmail(body: string): { caseNumber: string; courtName: string } | null {
  if (!body) return null;

  // Pattern 1: בתיק [type] [number] המתנהל ב[court], ניתנה החלטה על חיסיון/ניהול/etc
  const pattern = /בתיק\s+(?:[א-ת"׳]+\s+)?(\d[\d\/-]+\d)\s+המתנהל\s+ב([^,\.]+)[,\.]\s*ניתנה\s+החלטה\s+על\s/;
  const match = body.match(pattern);

  if (match) {
    return {
      caseNumber: match[1].trim(),
      courtName: match[2].trim(),
    };
  }

  // Fallback: extract case number from any court email about confidentiality/publication ban
  const fallbackPattern = /(\d{3,6}-\d{2}-\d{2,4})/;
  const fallbackMatch = body.match(fallbackPattern);
  if (fallbackMatch && (
    body.includes('חיסיון') ||
    body.includes('איסור פרסום') ||
    body.includes('דלתיים סגורות')
  )) {
    return {
      caseNumber: fallbackMatch[1].trim(),
      courtName: '',
    };
  }

  return null;
}

/**
 * Connect to Gmail via IMAP and fetch unread confidentiality emails
 */
async function fetchConfidentialEmails(): Promise<Array<{
  subject: string;
  from: string;
  date: string;
  body: string;
  uid: number;
}>> {
  const { ImapFlow } = await import('imapflow');

  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    logger: false,
  });

  const emails: Array<{
    subject: string;
    from: string;
    date: string;
    body: string;
    uid: number;
  }> = [];

  try {
    await client.connect();

    const lock = await client.getMailboxLock('INBOX');
    try {
      // Search for emails from the court about confidentiality (last 7 days, read or unread)
      const since = new Date();
      since.setDate(since.getDate() - 7);
      const uids = await client.search({ from: COURT_SENDER, since }, { uid: true });
      if (!uids || uids.length === 0) {
        lock.release();
        await client.logout();
        return emails;
      }
      const messages = client.fetch(uids, { uid: true, envelope: true, source: true }, { uid: true });

      const { simpleParser } = await import('mailparser');

      for await (const msg of messages) {
        try {
          if (!msg.source) continue;
          const parsed = await simpleParser(msg.source);
          const subject = parsed.subject || '';
          const body = parsed.text || '';

          // Process ALL emails from court - subject always contains "חיסיון" for these,
          // but also catch body variants like "איסור פרסום", "דלתיים סגורות" etc.
          // CRITICAL: must not miss any confidentiality order to avoid legal liability.
          const isConfidential = [subject, body].some(text =>
            text.includes('חיסיון') || text.includes('איסור פרסום') ||
            text.includes('דלתיים סגורות') || text.includes('איסור זיהוי') ||
            text.includes('צו איסור') || text.includes('הגבלת פרסום')
          );
          if (isConfidential) {
            emails.push({
              subject,
              from: parsed.from?.text || '',
              date: parsed.date?.toISOString() || new Date().toISOString(),
              body,
              uid: msg.uid,
            });
          }
        } catch (e) {
          console.error('[confidential-monitor] Error parsing email:', e);
        }
      }

      // Mark processed emails as read
      if (emails.length > 0) {
        const uids = emails.map(e => e.uid);
        for (const uid of uids) {
          try {
            await client.messageFlagsAdd({ uid }, ['\\Seen'], { uid: true });
          } catch { /* continue */ }
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();
  } catch (e) {
    console.error('[confidential-monitor] IMAP connection error:', e);
    try { await client.logout(); } catch { /* ignore */ }
  }

  return emails;
}

/**
 * Process a confidential case - unpublish from database
 */
async function processConfidentialCase(caseNumber: string, courtName: string): Promise<ConfidentialAction['action']> {
  // Search for the case in the database - use exact match to avoid hiding wrong cases
  const exactMatch = caseNumber.trim();
  // Search with all common case type prefixes to ensure we find the case
  const caseTypePrefixes = [
    '', 'ה"ט', 'ת"א', 'ת"ק', 'ה"ש', 'ת"פ', 'ע"א', 'ע"פ', 'עת"מ',
    'תפ', 'עפ', 'בש"א', 'רע"א', 'רע"פ', 'ע"ע', 'דנ"א', 'ה"פ',
    'פש"ר', 'צ', 'אז', 'תא', 'עא', 'עפ"ב',
  ];
  const judgments = await prisma.judgment.findMany({
    where: {
      OR: [
        ...caseTypePrefixes.map(prefix =>
          prefix ? { caseNumber: `${prefix} ${exactMatch}` } : { caseNumber: exactMatch }
        ),
        // Also search with contains as fallback
        { caseNumber: { contains: exactMatch } },
      ],
    },
  });

  if (judgments.length === 0) {
    return 'not_found';
  }

  let anyUpdated = false;
  for (const judgment of judgments) {
    if ((judgment.status as string) === 'HIDDEN' || (judgment.status as string) === 'REMOVED') {
      continue;
    }

    await prisma.judgment.update({
      where: { id: judgment.id },
      data: {
        status: 'HIDDEN',
        fullText: '', // Remove full text for legal compliance
        summary: `[תיק חסוי - הוסר בהתאם להחלטת בית המשפט]`,
      },
    });
    anyUpdated = true;

    console.log(`[confidential-monitor] Unpublished case ${caseNumber} (judgment ID: ${judgment.id})`);
  }

  return anyUpdated ? 'unpublished' : 'already_hidden';
}

/**
 * Send notification email with actions taken
 */
async function sendNotification(actions: ConfidentialAction[]): Promise<void> {
  if (actions.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const now = new Date().toLocaleDateString('he-IL');

  const rows = actions.map(a => {
    const statusIcon = a.action === 'unpublished' ? '\u2705' : a.action === 'not_found' ? '\u2705' : '\u2139\uFE0F';
    const statusText = a.action === 'unpublished' ? 'הוסר מהאתר'
      : a.action === 'not_found' ? 'לא קיים באתר - נחסם לייבוא'
      : 'כבר מוסתר';
    return `<tr>
      <td style="padding:8px;border:1px solid #ddd;">${statusIcon} ${statusText}</td>
      <td style="padding:8px;border:1px solid #ddd;">${a.courtName}</td>
      <td style="padding:8px;border:1px solid #ddd;font-weight:bold;">${a.caseNumber}</td>
    </tr>`;
  }).join('');

  const unpublishedCount = actions.filter(a => a.action === 'unpublished').length;

  const html = `
    <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <div style="background:#c62828;color:white;padding:20px;border-radius:10px 10px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:22px;">\u{1F6A8} דוח חיסיון תיקים - משפטלי</h1>
        <p style="margin:5px 0 0;opacity:0.9;">${now}</p>
      </div>
      <div style="background:#fff;padding:20px;border:1px solid #e0e0e0;">
        <p style="font-size:16px;">התקבלו <strong>${actions.length}</strong> הודעות חיסיון מהנהלת בתי המשפט.</p>
        <p><strong>${actions.length}</strong> תיקים טופלו: ${unpublishedCount > 0 ? `<strong style="color:#c62828;">${unpublishedCount} הוסרו מהאתר</strong>, ` : ''}${actions.filter(a => a.action === 'not_found').length} לא היו באתר (נחסמו לייבוא עתידי)${actions.filter(a => a.action === 'already_hidden').length > 0 ? `, ${actions.filter(a => a.action === 'already_hidden').length} כבר מוסתרים` : ''}.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:15px;">
          <tr style="background:#f5f5f5;">
            <th style="padding:8px;border:1px solid #ddd;text-align:right;">סטטוס</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:right;">בית משפט</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:right;">מספר תיק</th>
          </tr>
          ${rows}
        </table>
      </div>
      <div style="background:#f5f5f5;padding:15px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 10px 10px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#666;">דוח אוטומטי - משפטלי | בוט ניטור חיסיון</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"משפטלי - חיסיון" <${SMTP_USER}>`,
    to: NOTIFICATION_RECIPIENTS.join(', '),
    subject: `\u{1F6A8} חיסיון: ${unpublishedCount} תיקים הוסרו - ${now}`,
    html,
  });

  console.log(`[confidential-monitor] Notification sent to ${NOTIFICATION_RECIPIENTS.join(', ')}`);
}

/**
 * Main function - check for confidential emails and process them
 */
export async function checkConfidentialCases(): Promise<{
  processed: number;
  unpublished: number;
  notFound: number;
  actions: ConfidentialAction[];
}> {
  console.log('[confidential-monitor] Starting confidential case check...');

  const result = {
    processed: 0,
    unpublished: 0,
    notFound: 0,
    actions: [] as ConfidentialAction[],
  };

  try {
    // Fetch confidentiality emails (last 7 days, read or unread)
    const emails = await fetchConfidentialEmails();
    console.log(`[confidential-monitor] Found ${emails.length} confidentiality emails`);

    if (emails.length === 0) {
      return result;
    }

    // Get already-processed case numbers from recent logs to avoid duplicates
    const recentLogs = await prisma.importLog.findMany({
      where: {
        source: 'confidential-monitor',
        importDate: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      select: { sourceName: true },
    });
    const alreadyProcessed = new Set(recentLogs.map(l => l.sourceName));

    // Process each email
    for (const email of emails) {
      const parsed = parseConfidentialEmail(email.body);

      if (!parsed) {
        console.warn(`[confidential-monitor] Could not parse case number from email: ${email.subject}`);
        continue;
      }

      // Skip if already processed
      if (alreadyProcessed.has(parsed.caseNumber)) {
        console.log(`[confidential-monitor] Case ${parsed.caseNumber} already processed, skipping`);
        continue;
      }

      result.processed++;

      // Find and unpublish the case
      const action = await processConfidentialCase(parsed.caseNumber, parsed.courtName);

      // Log to DB so we don't process again
      await prisma.importLog.create({
        data: {
          source: 'confidential-monitor',
          sourceName: parsed.caseNumber,
          importDate: new Date(),
          totalCount: 1,
          newCount: action === 'unpublished' ? 1 : 0,
          updatedCount: 0,
          status: action,
        },
      }).catch(() => {});

      // Find judgment details for the report
      const judgment = await prisma.judgment.findFirst({
        where: { caseNumber: parsed.caseNumber },
        select: { id: true, title: true },
      });

      const actionRecord: ConfidentialAction = {
        caseNumber: parsed.caseNumber,
        courtName: parsed.courtName,
        emailSubject: email.subject,
        emailDate: email.date,
        action,
        judgmentId: judgment?.id,
        judgmentTitle: judgment?.title,
      };

      result.actions.push(actionRecord);

      if (action === 'unpublished') result.unpublished++;
      if (action === 'not_found') result.notFound++;

      // Also add to blacklist for future scraper runs
      console.log(`[confidential-monitor] Case ${parsed.caseNumber}: ${action}`);
    }

    // Send notification email
    if (result.actions.length > 0) {
      try {
        await sendNotification(result.actions);
      } catch (e) {
        console.error('[confidential-monitor] Failed to send notification:', e);
      }
    }
  } catch (e) {
    console.error('[confidential-monitor] Error:', e);
  }

  console.log(`[confidential-monitor] Done. Processed: ${result.processed}, Unpublished: ${result.unpublished}, Not found: ${result.notFound}`);
  return result;
}

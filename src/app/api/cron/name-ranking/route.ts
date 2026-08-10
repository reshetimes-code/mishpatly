import { NextRequest, NextResponse } from 'next/server';
import { runNameRankingCheck } from '@/lib/name-ranking-monitor';
import nodemailer from 'nodemailer';

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

/**
 * Name Ranking cron — checks a small daily batch of plaintiff/defendant
 * names for their current #1-Google-result status, and auto-boosts
 * indexing for any name we don't already own the top spot for.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const urlSecret = new URL(request.url).searchParams.get('secret');

  if (authHeader !== `Bearer ${CRON_SECRET}` && urlSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await runNameRankingCheck();
    const first = results.filter(r => r.isFirst);
    const boosted = results.filter(r => r.boosted);

    if (results.length > 0) {
      try {
        const dateStr = new Date().toLocaleDateString('he-IL');
        const rows = results.map(r => `
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 8px;">${r.name}</td>
            <td style="padding: 8px; text-align: center; font-weight: bold; color: ${r.isFirst ? '#38a169' : '#e53e3e'};">${r.position ?? 'לא נמצא'}</td>
            <td style="padding: 8px; text-align: center;">${r.isFirst ? '&#x2705; ראשונים' : r.boosted ? '&#x1F680; חוזק' : '-'}</td>
          </tr>
        `).join('');

        const htmlBody = `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a365d, #2c5282); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 22px;">&#x1F464; ניטור דירוג לפי שם - משפט לי</h1>
              <p style="margin: 5px 0 0; opacity: 0.9;">${dateStr}</p>
            </div>
            <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px;">
              <p>נבדקו <strong>${results.length}</strong> שמות | <strong style="color:#38a169;">${first.length}</strong> אנחנו ראשונים | <strong style="color:#3182ce;">${boosted.length}</strong> חוזקו לאינדוקס</p>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead><tr style="background: #edf2f7;">
                  <th style="padding: 8px; text-align: right;">שם</th>
                  <th style="padding: 8px; text-align: center;">מיקום בגוגל</th>
                  <th style="padding: 8px; text-align: center;">סטטוס</th>
                </tr></thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          </div>
        `;

        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"משפט לי - ניטור שמות" <${process.env.SMTP_USER || 'reshetimes@gmail.com'}>`,
          to: REPORT_RECIPIENTS.join(', '),
          subject: `&#x1F464; ניטור דירוג לפי שם: ${first.length}/${results.length} ראשונים - ${dateStr}`,
          html: htmlBody,
        });
      } catch (e) {
        console.error('[name-ranking] Email failed:', e);
      }
    }

    return NextResponse.json({
      message: `Name ranking: ${results.length} checked, ${first.length} we're #1, ${boosted.length} boosted`,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Name ranking check failed', details: String(error) },
      { status: 500 }
    );
  }
}

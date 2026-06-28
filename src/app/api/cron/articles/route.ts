import { NextRequest, NextResponse } from 'next/server';
import { generateDailyArticle } from '@/lib/article-generator';
import { submitUrlsViaIndexNow, submitUrlsToGoogle } from '@/lib/seo-engine';
import nodemailer from 'nodemailer';

const CRON_SECRET = process.env.CRON_SECRET || 'mishpatli-cron-secret-2026';
const SITE_URL = 'https://mishpatly.co.il';
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
 * Daily article generation endpoint
 * Called by Cloud Scheduler every day at 10:00 AM
 * Generates 1 AI article and submits it for indexing + sends email
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const urlSecret = new URL(request.url).searchParams.get('secret');

  if (authHeader !== `Bearer ${CRON_SECRET}` && urlSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await generateDailyArticle();

    // Submit new article URL for immediate indexing
    if (result.success && result.slug) {
      const articleUrl = `${SITE_URL}/articles/${encodeURIComponent(result.slug)}`;
      await Promise.all([
        submitUrlsToGoogle([articleUrl]),
        submitUrlsViaIndexNow([articleUrl]),
      ]);
    }

    // Send email notification
    let emailSent = false;
    if (result.success && result.title) {
      try {
        const dateStr = new Date().toLocaleDateString('he-IL');
        const articleUrl = `${SITE_URL}/articles/${result.slug}`;

        const htmlBody = `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a365d, #2c5282); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 22px;">&#x1F4DD; מאמר חדש פורסם - משפטלי</h1>
              <p style="margin: 5px 0 0; opacity: 0.9;">${dateStr}</p>
            </div>
            <div style="background: #f7fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px;">
              <h2 style="color: #2d3748; margin-top: 0;">&#x2705; מאמר חדש עלה לאתר</h2>
              <div style="padding: 15px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h3 style="margin: 0 0 10px; color: #1a365d;">${result.title}</h3>
                <a href="${articleUrl}" style="color: #2c5282; text-decoration: underline;">קרא את המאמר</a>
              </div>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;">
              <p style="text-align: center;"><a href="${SITE_URL}/articles" style="color: #2c5282;">צפייה בכל המאמרים</a></p>
            </div>
          </div>
        `;

        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"משפטלי" <${process.env.SMTP_USER || 'reshetimes@gmail.com'}>`,
          to: REPORT_RECIPIENTS.join(', '),
          subject: `📝 מאמר חדש: ${result.title} - משפטלי`,
          html: htmlBody,
        });
        emailSent = true;
      } catch (e) {
        console.error('[ArticleCron] Email failed:', e);
      }
    }

    return NextResponse.json({
      message: result.success ? 'Article generated and published' : 'Article generation failed',
      timestamp: new Date().toISOString(),
      ...result,
      emailSent,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Article generation failed', details: String(error) },
      { status: 500 }
    );
  }
}

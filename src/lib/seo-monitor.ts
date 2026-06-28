/**
 * SEO Monitor — Checks Google rankings for target keywords
 * and sends email alerts when rankings change.
 */

import nodemailer from 'nodemailer';
import { prisma } from './db';

const SITE_URL = 'https://mishpatly.co.il';
const SITE_DOMAIN = 'mishpatly.co.il';
const REPORT_RECIPIENTS = ['reshetimes@gmail.com', 'haimeld@gmail.com', 'orenshp77@gmail.com'];

// Keywords to monitor
const MONITORED_KEYWORDS = [
  'משפטלי',
  'משפט לי',
  'הסרת אזכורים משפטיים',
  'מחיקת פסק דין מגוגל',
  'הסרת שם מפסק דין',
  'פסקי דין',
  'מאגר פסקי דין',
  'חיפוש פסקי דין',
  'פסקי דין לפי שם',
  'דיני עבודה',
  'דיני משפחה',
  'תאונות דרכים',
  'בדיקת רקע משפטי',
  'מאגר פסקי דין חינם',
  'הסרת פסק דין',
  'עורכי דין',
];

interface KeywordRanking {
  keyword: string;
  position: number | null; // null = not found in top 100
  url: string | null;
  previousPosition: number | null;
  change: 'new' | 'up' | 'down' | 'same' | 'lost';
}

/**
 * Check Google ranking for a keyword using Custom Search API
 * Falls back to a simple scrape check if API not available
 */
async function checkGoogleRanking(keyword: string): Promise<{ position: number | null; url: string | null }> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_CX;

  if (apiKey && cx) {
    // Use Google Custom Search API
    try {
      for (let start = 1; start <= 91; start += 10) {
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(keyword)}&start=${start}&num=10&gl=il&hl=he`;
        const res = await fetch(searchUrl, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) break;
        const data = await res.json();
        const items = data.items || [];
        for (let i = 0; i < items.length; i++) {
          const link = items[i].link || '';
          if (link.includes(SITE_DOMAIN)) {
            return { position: start + i, url: link };
          }
        }
      }
    } catch { /* API error, skip */ }
  }

  // Fallback: simple site: search to check if indexed
  try {
    const siteSearchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=site:${SITE_DOMAIN}+${encodeURIComponent(keyword)}&num=1&gl=il&hl=he`;
    const res = await fetch(siteSearchUrl, { signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const data = await res.json();
      if (data.searchInformation?.totalResults && parseInt(data.searchInformation.totalResults) > 0) {
        return { position: null, url: data.items?.[0]?.link || null }; // found but unknown position
      }
    }
  } catch { /* skip */ }

  return { position: null, url: null };
}

/**
 * Run full SEO monitoring check and return rankings
 */
export async function runSeoMonitor(): Promise<KeywordRanking[]> {
  const rankings: KeywordRanking[] = [];

  // Load previous rankings from DB (stored in ImportLog as JSON)
  let previousRankings: Record<string, number | null> = {};
  try {
    const lastLog = await prisma.importLog.findFirst({
      where: { source: 'seo-monitor' },
      orderBy: { importDate: 'desc' },
    });
    if (lastLog?.errors) {
      previousRankings = JSON.parse(lastLog.errors);
    }
  } catch { /* no previous data */ }

  for (const keyword of MONITORED_KEYWORDS) {
    const { position, url } = await checkGoogleRanking(keyword);
    const prev = previousRankings[keyword] ?? null;

    let change: KeywordRanking['change'] = 'same';
    if (prev === null && position !== null) change = 'new';
    else if (prev !== null && position === null) change = 'lost';
    else if (prev !== null && position !== null && position < prev) change = 'up';
    else if (prev !== null && position !== null && position > prev) change = 'down';

    rankings.push({ keyword, position, url, previousPosition: prev, change });

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  // Save current rankings to DB
  const currentRankings: Record<string, number | null> = {};
  for (const r of rankings) {
    currentRankings[r.keyword] = r.position;
  }

  try {
    await prisma.importLog.create({
      data: {
        source: 'seo-monitor',
        sourceName: 'ניטור SEO',
        importDate: new Date(),
        totalCount: rankings.length,
        newCount: rankings.filter(r => r.change === 'new').length,
        updatedCount: rankings.filter(r => r.change === 'up').length,
        status: 'success',
        errors: JSON.stringify(currentRankings),
      },
    });
  } catch { /* DB error */ }

  return rankings;
}

/**
 * Send SEO ranking report email
 */
export async function sendSeoReport(rankings: KeywordRanking[]): Promise<boolean> {
  const changes = rankings.filter(r => r.change !== 'same');
  const ranked = rankings.filter(r => r.position !== null);
  const notRanked = rankings.filter(r => r.position === null);

  const dateStr = new Date().toLocaleDateString('he-IL');

  const changeIcon = (c: KeywordRanking['change']) => {
    switch (c) {
      case 'new': return '&#x1F389;'; // party
      case 'up': return '&#x2B06;&#xFE0F;'; // up arrow
      case 'down': return '&#x2B07;&#xFE0F;'; // down arrow
      case 'lost': return '&#x274C;'; // X
      default: return '&#x2796;'; // dash
    }
  };

  const changeText = (r: KeywordRanking) => {
    switch (r.change) {
      case 'new': return `חדש! מיקום ${r.position}`;
      case 'up': return `עלה מ-${r.previousPosition} ל-${r.position}`;
      case 'down': return `ירד מ-${r.previousPosition} ל-${r.position}`;
      case 'lost': return `נעלם (היה במיקום ${r.previousPosition})`;
      default: return `מיקום ${r.position || 'לא מדורג'}`;
    }
  };

  const htmlBody = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1a365d, #2c5282); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">&#x1F4CA; דוח ניטור SEO - משפט לי</h1>
        <p style="margin: 5px 0 0; opacity: 0.9;">${dateStr}</p>
      </div>

      ${changes.length > 0 ? `
      <div style="background: #f0fff4; padding: 15px 20px; border: 1px solid #c6f6d5;">
        <h2 style="color: #276749; margin: 0 0 10px; font-size: 16px;">&#x1F514; שינויים שזוהו</h2>
        ${changes.map(r => `
          <div style="padding: 8px; margin: 4px 0; background: white; border-radius: 6px; border: 1px solid #e2e8f0;">
            <strong>${r.keyword}</strong>: ${changeIcon(r.change)} ${changeText(r)}
          </div>
        `).join('')}
      </div>
      ` : `
      <div style="background: #f7fafc; padding: 15px 20px; border: 1px solid #e2e8f0;">
        <p style="color: #718096; margin: 0;">אין שינויים חדשים מהבדיקה האחרונה</p>
      </div>
      `}

      <div style="background: white; padding: 20px; border: 1px solid #e2e8f0;">
        <h2 style="color: #2d3748; margin: 0 0 10px; font-size: 16px;">&#x2705; מילות מפתח מדורגות (${ranked.length}/${rankings.length})</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead><tr style="background: #edf2f7;">
            <th style="padding: 8px; text-align: right;">מילת מפתח</th>
            <th style="padding: 8px; text-align: center;">מיקום</th>
            <th style="padding: 8px; text-align: center;">שינוי</th>
          </tr></thead>
          <tbody>
          ${ranked.map(r => `
            <tr style="border-bottom: 1px solid #edf2f7;">
              <td style="padding: 8px;">${r.keyword}</td>
              <td style="padding: 8px; text-align: center; font-weight: bold; color: ${(r.position || 100) <= 10 ? '#38a169' : (r.position || 100) <= 30 ? '#d69e2e' : '#e53e3e'};">${r.position}</td>
              <td style="padding: 8px; text-align: center;">${changeIcon(r.change)}</td>
            </tr>
          `).join('')}
          </tbody>
        </table>
      </div>

      ${notRanked.length > 0 ? `
      <div style="background: #fff5f5; padding: 15px 20px; border: 1px solid #fed7d7; border-top: none;">
        <h2 style="color: #9b2c2c; margin: 0 0 10px; font-size: 16px;">&#x1F534; עדיין לא מדורגים (${notRanked.length})</h2>
        <p style="font-size: 13px; color: #718096;">${notRanked.map(r => r.keyword).join(' | ')}</p>
      </div>
      ` : ''}

      <div style="background: #f7fafc; padding: 15px 20px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px; text-align: center;">
        <p style="font-size: 12px; color: #a0aec0; margin: 0;">דוח אוטומטי מ-<a href="${SITE_URL}" style="color: #2c5282;">משפט לי</a> | ניטור ${rankings.length} מילות מפתח</p>
      </div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'reshetimes@gmail.com',
        pass: process.env.SMTP_PASS || '',
      },
    });

    const subject = changes.length > 0
      ? `&#x1F514; ${changes.length} שינויי דירוג בגוגל - משפט לי - ${dateStr}`
      : `&#x1F4CA; דוח SEO יומי - ${ranked.length}/${rankings.length} מדורגים - ${dateStr}`;

    await transporter.sendMail({
      from: `"משפט לי - ניטור SEO" <${process.env.SMTP_USER || 'reshetimes@gmail.com'}>`,
      to: REPORT_RECIPIENTS.join(', '),
      subject,
      html: htmlBody,
    });

    return true;
  } catch (e) {
    console.error('[SEO Monitor] Email failed:', e);
    return false;
  }
}

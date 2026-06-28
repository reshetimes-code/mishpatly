import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import nodemailer from 'nodemailer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mishpatly.co.il';

async function sendDownloadEmail(email: string, judgment: { id: number; title: string; caseNumber: string }, downloadUrl: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'reshetimes@gmail.com',
        pass: process.env.SMTP_PASS || '',
      },
    });

    await transporter.sendMail({
      from: `"משפטלי" <${process.env.SMTP_USER || 'reshetimes@gmail.com'}>`,
      to: email,
      subject: `קישור הורדה - פסק דין ${judgment.caseNumber} | משפטלי`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0B3C5D, #1a5276); color: white; padding: 25px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2 style="margin: 0 0 5px 0; font-size: 20px;">משפטלי - מאגר פסקי דין</h2>
            <p style="margin: 0; font-size: 14px; opacity: 0.85;">הרכישה בוצעה בהצלחה</p>
          </div>
          <div style="background: #f7fafc; padding: 25px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px;">
            <p style="font-size: 15px; color: #333; margin-bottom: 15px;">שלום,</p>
            <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
              הרכישה שלך עבור פסק הדין הבא בוצעה בהצלחה:
            </p>
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; font-weight: bold; color: #0B3C5D;">${judgment.title}</p>
              <p style="margin: 0; font-size: 13px; color: #888;">מס׳ תיק: ${judgment.caseNumber}</p>
            </div>
            <a href="${SITE_URL}${downloadUrl}"
               style="display: block; text-align: center; background: linear-gradient(135deg, #C9A84C, #D4B85E); color: #072a42; font-weight: bold; padding: 14px; border-radius: 8px; text-decoration: none; font-size: 15px;">
              הורדת המסמך המלא (PDF)
            </a>
            <p style="font-size: 12px; color: #999; margin-top: 15px; text-align: center;">
              קישור זה תקף ללא הגבלת זמן
            </p>
          </div>
          <p style="font-size: 11px; color: #bbb; text-align: center; margin-top: 15px;">
            משפטלי - מאגר פסקי דין מקיף | mishpatly.co.il
          </p>
        </div>
      `,
    });
    console.log(`[purchases] Download email sent to ${email}`);
  } catch (err) {
    console.error('[purchases] Failed to send email:', err);
  }
}

/**
 * Purchase API - create a purchase for a judgment
 * POST: { judgmentId, email }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { judgmentId, email } = body;

    if (!judgmentId || !email) {
      return NextResponse.json(
        { error: 'נדרש מזהה פסק דין וכתובת אימייל' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'כתובת אימייל לא תקינה' },
        { status: 400 }
      );
    }

    // Check judgment exists
    const judgment = await prisma.judgment.findUnique({
      where: { id: Number(judgmentId) },
    });

    if (!judgment) {
      return NextResponse.json(
        { error: 'פסק הדין לא נמצא' },
        { status: 404 }
      );
    }

    const downloadUrl = `/api/judgments/${judgmentId}/download?email=${encodeURIComponent(email)}`;

    // Check if already purchased
    const existing = await prisma.purchase.findFirst({
      where: {
        judgmentId: Number(judgmentId),
        email,
        status: 'completed',
      },
    });

    if (existing) {
      // Re-send email for existing purchase
      await sendDownloadEmail(email, judgment, downloadUrl);
      return NextResponse.json({
        success: true,
        message: 'כבר רכשת מסמך זה - קישור הורדה נשלח שוב למייל',
        purchaseId: existing.id,
        downloadUrl,
      });
    }

    // Create mock purchase (status: completed immediately for testing)
    const purchase = await prisma.purchase.create({
      data: {
        judgmentId: Number(judgmentId),
        email,
        amount: 89,
        status: 'completed',
      },
    });

    // Send download email
    await sendDownloadEmail(email, judgment, downloadUrl);

    return NextResponse.json({
      success: true,
      message: 'הרכישה בוצעה בהצלחה - קישור הורדה נשלח למייל',
      purchaseId: purchase.id,
      downloadUrl,
    });
  } catch (error) {
    console.error('[purchases] Error:', error);
    return NextResponse.json(
      { error: 'שגיאה בביצוע הרכישה' },
      { status: 500 }
    );
  }
}

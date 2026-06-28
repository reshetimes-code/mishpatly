import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * Legal help lead form - sends email notification to admin
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, email, topic } = body;

    if (!fullName || !phone) {
      return NextResponse.json({ error: 'נדרש שם מלא וטלפון' }, { status: 400 });
    }

    // Send lead notification email
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
        to: 'reshetimes@gmail.com, orenshp77@gmail.com',
        subject: `ליד חדש - בקשת ליווי משפטי | ${fullName}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0B3C5D, #1a5276); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
              <h2 style="margin: 0;">בקשת ליווי משפטי חדשה</h2>
            </div>
            <div style="background: #f7fafc; padding: 25px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 100px;">שם מלא</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">טלפון</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="tel:${phone}" style="color: #0B3C5D;">${phone}</a></td>
                </tr>
                ${email ? `<tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">אימייל</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #0B3C5D;">${email}</a></td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 10px; font-weight: bold;">נושא הפנייה</td>
                  <td style="padding: 10px;">${topic || 'לא צוין'}</td>
                </tr>
              </table>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
              <p style="text-align: center; color: #666; font-size: 12px;">
                ליד מאתר משפטלי | ${new Date().toLocaleString('he-IL')}
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('[legal-help] Email failed:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'הפנייה נשלחה בהצלחה! עורך דין מומחה בתחום ייצור איתכם קשר תוך 24 שעות.',
    });
  } catch (error) {
    console.error('[legal-help] Error:', error);
    return NextResponse.json({ error: 'שגיאה בשליחת הפנייה' }, { status: 500 });
  }
}

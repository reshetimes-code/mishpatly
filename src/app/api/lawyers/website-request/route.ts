import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, email, details } = body;

    if (!fullName || !phone || !details) {
      return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'reshetimes@gmail.com',
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"משפטלי - בקשה לבניית אתר" <${process.env.SMTP_USER || 'reshetimes@gmail.com'}>`,
      to: 'reshetimes@gmail.com',
      subject: `בקשה לבניית אתר מ${fullName}`,
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#0B3C5D;color:white;padding:20px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="margin:0;font-size:22px">בקשה חדשה לבניית אתר</h1>
            <p style="margin:5px 0 0;color:#C9A84C;font-size:14px">מפורטל עורכי הדין - משפטלי</p>
          </div>
          <div style="background:white;border:1px solid #e5e7eb;padding:24px;border-radius:0 0 12px 12px">
            <table style="width:100%;border-collapse:collapse;font-size:15px">
              <tr>
                <td style="padding:8px 0;color:#666;width:120px">שם מלא:</td>
                <td style="padding:8px 0;font-weight:bold">${fullName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#666">טלפון:</td>
                <td style="padding:8px 0;font-weight:bold"><a href="tel:${phone}" style="color:#0B3C5D">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#666">אימייל:</td>
                <td style="padding:8px 0"><a href="mailto:${email}" style="color:#0B3C5D">${email}</a></td>
              </tr>
            </table>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
            <h3 style="color:#0B3C5D;margin:0 0 8px">פרטים על האתר המבוקש:</h3>
            <p style="background:#f9fafb;padding:16px;border-radius:8px;line-height:1.6;white-space:pre-line">${details}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Website request email error:', e);
    return NextResponse.json({ error: 'שגיאה בשליחת הבקשה' }, { status: 500 });
  }
}

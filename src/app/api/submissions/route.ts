import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import nodemailer from 'nodemailer';

/**
 * Public API for user judgment submissions
 * POST: Submit a judgment PDF for admin review
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const caseNumber = formData.get('caseNumber') as string || '';
    const courtName = formData.get('courtName') as string || '';
    const description = formData.get('description') as string || '';
    const file = formData.get('file') as File;
    const agreedTerms = formData.get('agreedTerms') === 'true';

    // Validation
    if (!email || !file) {
      return NextResponse.json(
        { error: 'נדרש אימייל וקובץ PDF' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'כתובת אימייל לא תקינה' },
        { status: 400 }
      );
    }

    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'ניתן להעלות קבצי PDF בלבד' },
        { status: 400 }
      );
    }

    if (!agreedTerms) {
      return NextResponse.json(
        { error: 'יש לאשר את התנאים' },
        { status: 400 }
      );
    }

    // Max file size: 20MB
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'גודל הקובץ מקסימלי 20MB' },
        { status: 400 }
      );
    }

    // Read file data
    const arrayBuffer = await file.arrayBuffer();
    const fileData = Buffer.from(arrayBuffer);

    // Save submission
    const submission = await prisma.userSubmission.create({
      data: {
        email,
        caseNumber: caseNumber || null,
        courtName: courtName || null,
        description: description || null,
        fileName: file.name,
        fileData,
        fileSize: file.size,
        agreedTerms,
        status: 'pending',
      },
    });

    // Send notification email to admin
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
        subject: `פסק דין חדש מלקוח - ממתין לאישור | ${caseNumber || submission.id}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <div style="background: #0B3C5D; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
              <h2 style="margin: 0;">פסק דין חדש מלקוח</h2>
            </div>
            <div style="background: #f7fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
              <p><strong>אימייל:</strong> ${email}</p>
              ${caseNumber ? `<p><strong>מספר תיק:</strong> ${caseNumber}</p>` : ''}
              ${courtName ? `<p><strong>בית משפט:</strong> ${courtName}</p>` : ''}
              ${description ? `<p><strong>תיאור:</strong> ${description}</p>` : ''}
              <p><strong>קובץ:</strong> ${file.name} (${(file.size / 1024).toFixed(0)} KB)</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;">
              <p style="text-align: center;">
                <a href="https://mishpatly.co.il/admin/dashboard" style="background: #C9A84C; color: #072a42; padding: 10px 25px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  כניסה לאישור
                </a>
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('[submissions] Email notification failed:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'המסמך נשלח בהצלחה ויועבר לבדיקת המערכת. תקבלו עדכון במייל.',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('[submissions] Error:', error);
    return NextResponse.json(
      { error: 'שגיאה בשליחת המסמך' },
      { status: 500 }
    );
  }
}

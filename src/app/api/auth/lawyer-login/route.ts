import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateLawyerToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'נא למלא אימייל וסיסמה' }, { status: 400 });
    }

    const lawyer = await prisma.lawyer.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (!lawyer || !lawyer.passwordHash) {
      return NextResponse.json({ error: 'אימייל או סיסמה שגויים' }, { status: 401 });
    }

    const valid = await verifyPassword(password, lawyer.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'אימייל או סיסמה שגויים' }, { status: 401 });
    }

    const token = generateLawyerToken(lawyer.id);

    return NextResponse.json({
      success: true,
      token,
      lawyer: {
        id: lawyer.id,
        slug: lawyer.slug,
        fullName: lawyer.fullName,
        email: lawyer.email,
        isActive: lawyer.isActive,
        isVerified: lawyer.isVerified,
      },
    });
  } catch {
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 });
  }
}

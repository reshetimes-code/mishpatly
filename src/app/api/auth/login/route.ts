import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { getAdminPassword } from '@/app/api/admin/change-password/route';

const ADMIN_USER = {
  id: 1,
  name: 'מנהל מערכת',
  email: 'admin@mishpatly.co.il',
  role: 'ADMIN' as const,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'אימייל וסיסמה נדרשים' }, { status: 400 });
    }

    const isAdminEmail = email === ADMIN_USER.email || email === 'admin@mishpatli.co.il' || email === 'admin';
    if (isAdminEmail && password === getAdminPassword()) {
      const token = generateToken(ADMIN_USER.id, ADMIN_USER.role);
      return NextResponse.json({ token, user: ADMIN_USER });
    }

    return NextResponse.json({ error: 'אימייל או סיסמה שגויים' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'שגיאה בעיבוד הבקשה' }, { status: 400 });
  }
}

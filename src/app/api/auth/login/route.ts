import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

const DEV_ADMIN = {
  email: 'admin@mishpatli.co.il',
  password: 'admin123',
  user: {
    id: 1,
    name: 'מנהל מערכת',
    email: 'admin@mishpatli.co.il',
    role: 'ADMIN' as const,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'אימייל וסיסמה נדרשים' }, { status: 400 });
    }

    // Dev admin login (replace with DB auth in production)
    if (email === DEV_ADMIN.email && password === DEV_ADMIN.password) {
      const token = generateToken(DEV_ADMIN.user.id, DEV_ADMIN.user.role);
      return NextResponse.json({ token, user: DEV_ADMIN.user });
    }

    return NextResponse.json({ error: 'אימייל או סיסמה שגויים' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'שגיאה בעיבוד הבקשה' }, { status: 400 });
  }
}

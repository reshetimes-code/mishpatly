import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateToken } from '@/lib/auth';

// In-memory admin password (replace with DB in production)
const globalStore = globalThis as unknown as { __adminPassword?: string };
if (!globalStore.__adminPassword) {
  globalStore.__adminPassword = 'admin123';
}

export function getAdminPassword(): string {
  return globalStore.__adminPassword || 'admin123';
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  const user = verifyToken(authHeader.substring(7));
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'כל השדות נדרשים' }, { status: 400 });
    }

    if (currentPassword !== globalStore.__adminPassword) {
      return NextResponse.json({ error: 'הסיסמה הנוכחית שגויה' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'הסיסמה חייבת להכיל לפחות 6 תווים' }, { status: 400 });
    }

    globalStore.__adminPassword = newPassword;

    const token = generateToken(user.userId, user.role);

    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json({ error: 'שגיאה בעיבוד הבקשה' }, { status: 400 });
  }
}

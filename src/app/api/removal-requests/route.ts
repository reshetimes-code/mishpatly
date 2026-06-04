import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const user = verifyToken(authHeader.substring(7));
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

export async function GET(request: NextRequest) {
  const user = authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  return NextResponse.json({
    requests: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, reason, documentUrl } = body;

    if (!fullName?.trim()) {
      return NextResponse.json({ error: 'שם מלא הוא שדה חובה' }, { status: 400 });
    }
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'כתובת אימייל אינה תקינה' }, { status: 400 });
    }
    if (!reason?.trim()) {
      return NextResponse.json({ error: 'סיבת הבקשה היא שדה חובה' }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: 'בקשת ההסרה נשלחה בהצלחה. נחזור אליך בהקדם.',
        id: Date.now(),
        data: { fullName, email, phone, reason, documentUrl, status: 'NEW' },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'שגיאה בעיבוד הבקשה' }, { status: 400 });
  }
}

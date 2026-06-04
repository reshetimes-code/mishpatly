import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const user = verifyToken(authHeader.substring(7));
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }
  const { id } = await params;
  return NextResponse.json({ id, status: 'NEW', message: 'Mock data - connect DB for real data' });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const { status } = body;
    const validStatuses = ['IN_PROGRESS', 'APPROVED', 'REJECTED'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: `סטטוס לא תקין. ערכים אפשריים: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    return NextResponse.json({
      message: status === 'APPROVED' ? 'הבקשה אושרה ופסק הדין הוסתר' : 'הסטטוס עודכן בהצלחה',
      request: { id: parseInt(id), status, updatedAt: new Date().toISOString() },
    });
  } catch {
    return NextResponse.json({ error: 'שגיאה בעדכון הבקשה' }, { status: 500 });
  }
}

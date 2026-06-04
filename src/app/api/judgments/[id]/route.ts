import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getJudgmentByIdFromDB, getJudgmentBySlugFromDB, updateJudgment, deleteJudgment } from '@/lib/judgment-store';

function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return verifyToken(authHeader.substring(7));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id);
  const judgment = !isNaN(numId)
    ? await getJudgmentByIdFromDB(numId)
    : await getJudgmentBySlugFromDB(id);

  if (!judgment) {
    return NextResponse.json({ error: 'פסק דין לא נמצא' }, { status: 404 });
  }

  if (judgment.status !== 'PUBLISHED') {
    const user = authenticateRequest(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'פסק דין לא נמצא' }, { status: 404 });
    }
  }

  return NextResponse.json(judgment);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = authenticateRequest(request);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await updateJudgment(parseInt(id), body);
    if (!updated) {
      return NextResponse.json({ error: 'פסק דין לא נמצא' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'שגיאה בעדכון' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = authenticateRequest(request);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await updateJudgment(parseInt(id), body);
    if (!updated) {
      return NextResponse.json({ error: 'פסק דין לא נמצא' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'שגיאה בעדכון' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = authenticateRequest(request);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  const { id } = await params;
  const success = await deleteJudgment(parseInt(id));
  if (!success) {
    return NextResponse.json({ error: 'פסק דין לא נמצא' }, { status: 404 });
  }
  return NextResponse.json({ message: 'פסק הדין נמחק בהצלחה', id: parseInt(id) });
}

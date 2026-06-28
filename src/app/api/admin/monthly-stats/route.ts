import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

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

  try {
    // Get daily counts for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const results = await prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT DATE(created_at) as day, COUNT(*) as count
      FROM judgments
      WHERE created_at >= ${thirtyDaysAgo}
      GROUP BY DATE(created_at)
      ORDER BY day DESC
    `;

    const months: { month: string; count: number }[] = results.map((r) => ({
      month: new Date(r.day).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }),
      count: Number(r.count),
    }));

    // Also get total for the last 30 days
    const totalLast30 = months.reduce((sum, m) => sum + m.count, 0);

    return NextResponse.json({
      months: months.reverse(),
      totalLast30Days: totalLast30,
    });
  } catch (error) {
    console.error('[monthly-stats] Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

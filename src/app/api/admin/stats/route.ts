import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getStatsFromDB } from '@/lib/judgment-store';
import { getLastImportDate, getSourceSummary } from '@/lib/daily-import';

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

  const stats = await getStatsFromDB();
  const lastImportDate = await getLastImportDate();
  const sources = await getSourceSummary();

  return NextResponse.json({
    totalJudgments: stats.totalJudgments,
    publishedCount: stats.publishedCount,
    hiddenCount: stats.hiddenCount,
    draftCount: stats.draftCount,
    pendingReviewCount: stats.pendingReviewCount,
    pendingRemovalRequests: 0,
    sourceBreakdown: stats.sourceBreakdown,
    categoryBreakdown: stats.categoryBreakdown,
    lastImportDate,
    sources,
    recentJudgments: stats.recentJudgments.slice(0, 5).map(j => ({
      id: j.id,
      title: j.title,
      caseNumber: j.caseNumber,
      courtName: j.courtName,
      status: j.status,
      sourceName: j.sourceName,
      category: j.category,
      createdAt: j.createdAt,
    })),
  });
}

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
    const [
      totalJudgments,
      withFullText,
      aiEnriched,
      withJudge,
      withPlaintiff,
      withDefendant,
      withSummary,
      withCategory,
      withKeyFindings,
      withCourtReasoning,
      withVerdict,
      recentlyEnriched,
    ] = await Promise.all([
      prisma.judgment.count(),
      prisma.judgment.count({ where: { fullText: { not: null } } }),
      prisma.judgment.count({ where: { aiEnrichedAt: { not: null } } }),
      prisma.judgment.count({ where: { judge: { not: null }, NOT: { judge: '' } } }),
      prisma.judgment.count({ where: { plaintiff: { not: null }, NOT: { plaintiff: '' } } }),
      prisma.judgment.count({ where: { defendant: { not: null }, NOT: { defendant: '' } } }),
      prisma.judgment.count({ where: { summary: { not: null }, NOT: { summary: '' } } }),
      prisma.judgment.count({ where: { category: { not: null }, NOT: { category: '' } } }),
      prisma.judgment.count({ where: { keyFindings: { not: null }, NOT: { keyFindings: '' } } }),
      prisma.judgment.count({ where: { courtReasoning: { not: null }, NOT: { courtReasoning: '' } } }),
      prisma.judgment.count({ where: { verdict: { not: null }, NOT: { verdict: '' } } }),
      prisma.judgment.findMany({
        where: { aiEnrichedAt: { not: null } },
        orderBy: { aiEnrichedAt: 'desc' },
        take: 30,
        select: {
          id: true,
          title: true,
          caseNumber: true,
          courtName: true,
          judge: true,
          plaintiff: true,
          defendant: true,
          category: true,
          summary: true,
          keyFindings: true,
          courtReasoning: true,
          verdict: true,
          decisionType: true,
          aiEnrichedAt: true,
          slug: true,
        },
      }),
    ]);

    // Count judgments missing key fields (candidates for AI scan)
    const missingMetadata = await prisma.judgment.count({
      where: {
        fullText: { not: null },
        OR: [
          { judge: null }, { judge: '' },
          { plaintiff: null }, { plaintiff: '' },
          { defendant: null }, { defendant: '' },
        ],
      },
    });

    const notEnriched = await prisma.judgment.count({
      where: { aiEnrichedAt: null },
    });

    return NextResponse.json({
      overview: {
        totalJudgments,
        withFullText,
        aiEnriched,
        notEnriched,
        missingMetadata,
      },
      fields: {
        judge: withJudge,
        plaintiff: withPlaintiff,
        defendant: withDefendant,
        summary: withSummary,
        category: withCategory,
        keyFindings: withKeyFindings,
        courtReasoning: withCourtReasoning,
        verdict: withVerdict,
      },
      recentlyEnriched,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

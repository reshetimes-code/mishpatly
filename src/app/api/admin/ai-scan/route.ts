import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { analyzeJudgment, mergeAnalysis } from '@/lib/gemini';

function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const user = verifyToken(authHeader.substring(7));
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

// POST /api/admin/ai-scan - scan judgments with Gemini AI
// Body: { limit?: number, onlyMissing?: boolean }
export async function POST(request: NextRequest) {
  const user = authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const limit = Math.min(body.limit || 20, 50); // max 50 at a time
    const onlyMissing = body.onlyMissing !== false; // default true

    // Find judgments that need scanning
    const where = onlyMissing
      ? {
          fullText: { not: null },
          OR: [
            { judge: null },
            { judge: '' },
            { plaintiff: null },
            { plaintiff: '' },
            { defendant: null },
            { defendant: '' },
          ],
        }
      : { fullText: { not: null } };

    const judgments = await prisma.judgment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    let scanned = 0;
    let updated = 0;
    let failed = 0;
    const results: { id: number; caseNumber: string; status: string; updates?: Record<string, string> }[] = [];

    for (const j of judgments) {
      if (!j.fullText) continue;

      try {
        const analysis = await analyzeJudgment(j.fullText, {
          caseNumber: j.caseNumber,
          courtName: j.courtName,
          judge: j.judge || undefined,
          plaintiff: j.plaintiff || undefined,
          defendant: j.defendant || undefined,
          summary: j.summary || undefined,
        });

        scanned++;

        if (!analysis) {
          results.push({ id: j.id, caseNumber: j.caseNumber, status: 'no_result' });
          failed++;
          continue;
        }

        const updates = mergeAnalysis(
          {
            judge: j.judge || '',
            plaintiff: j.plaintiff || '',
            defendant: j.defendant || '',
            procedureType: j.procedureType || '',
            category: j.category || '',
            summary: j.summary || '',
            courtName: j.courtName || '',
          },
          analysis
        );

        if (Object.keys(updates).length > 0) {
          // Build Prisma-compatible update data
          const prismaUpdates: Record<string, string | null> = {};
          for (const [key, value] of Object.entries(updates)) {
            // Map field names to Prisma column names
            if (key === 'courtName') prismaUpdates.courtName = value;
            else if (key === 'procedureType') prismaUpdates.procedureType = value;
            else prismaUpdates[key] = value;
          }

          await prisma.judgment.update({
            where: { id: j.id },
            data: prismaUpdates,
          });
          updated++;
          results.push({ id: j.id, caseNumber: j.caseNumber, status: 'updated', updates });
        } else {
          results.push({ id: j.id, caseNumber: j.caseNumber, status: 'no_changes' });
        }

        // Small delay between API calls to avoid rate limiting
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        failed++;
        results.push({ id: j.id, caseNumber: j.caseNumber, status: 'error' });
      }
    }

    return NextResponse.json({
      success: true,
      total: judgments.length,
      scanned,
      updated,
      failed,
      results,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

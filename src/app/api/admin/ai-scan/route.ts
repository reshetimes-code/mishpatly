import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { analyzeJudgment, mergeAnalysis, generateComprehensiveAnalysis, mergeComprehensiveAnalysis } from '@/lib/gemini';

function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const user = verifyToken(authHeader.substring(7));
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

// POST /api/admin/ai-scan - scan judgments with Gemini AI
// Body: { limit?: number, onlyMissing?: boolean, comprehensive?: boolean }
export async function POST(request: NextRequest) {
  const user = authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const limit = Math.min(body.limit || 20, 50);
    const onlyMissing = body.onlyMissing !== false;
    const comprehensive = body.comprehensive === true;

    // Find judgments that need scanning
    const where = comprehensive
      ? {
          // For comprehensive: scan judgments not yet AI-enriched
          aiEnrichedAt: null,
        }
      : onlyMissing
        ? {
            fullText: { not: null },
            OR: [
              { judge: null }, { judge: '' },
              { plaintiff: null }, { plaintiff: '' },
              { defendant: null }, { defendant: '' },
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
    const results: { id: number; caseNumber: string; status: string; updates?: Record<string, unknown>; error?: string }[] = [];

    for (const j of judgments) {
      try {
        if (comprehensive) {
          // Comprehensive analysis - generates full rich content
          const analysis = await generateComprehensiveAnalysis(
            j.fullText || '',
            {
              caseNumber: j.caseNumber,
              courtName: j.courtName,
              judge: j.judge || undefined,
              plaintiff: j.plaintiff || undefined,
              defendant: j.defendant || undefined,
              summary: j.summary || undefined,
              procedureType: j.procedureType || undefined,
              category: j.category || undefined,
              title: j.title,
            }
          );

          scanned++;

          if (!analysis) {
            results.push({ id: j.id, caseNumber: j.caseNumber, status: 'no_result' });
            failed++;
            continue;
          }

          const updates = mergeComprehensiveAnalysis(
            {
              judge: j.judge || '',
              plaintiff: j.plaintiff || '',
              defendant: j.defendant || '',
              procedureType: j.procedureType || '',
              category: j.category || '',
              summary: j.summary || '',
              courtName: j.courtName || '',
              aiAnalysis: j.aiAnalysis || '',
              keyFindings: j.keyFindings || '',
              partiesArgs: j.partiesArgs || '',
              courtReasoning: j.courtReasoning || '',
              verdict: j.verdict || '',
              decisionType: j.decisionType || '',
            },
            analysis
          );

          if (Object.keys(updates).length > 0) {
            await prisma.judgment.update({
              where: { id: j.id },
              data: updates,
            });
            updated++;
            results.push({ id: j.id, caseNumber: j.caseNumber, status: 'enriched', updates });
          } else {
            results.push({ id: j.id, caseNumber: j.caseNumber, status: 'no_changes' });
          }
        } else {
          // Basic metadata extraction (original behavior)
          if (!j.fullText) continue;

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
            await prisma.judgment.update({
              where: { id: j.id },
              data: updates,
            });
            updated++;
            results.push({ id: j.id, caseNumber: j.caseNumber, status: 'updated', updates });
          } else {
            results.push({ id: j.id, caseNumber: j.caseNumber, status: 'no_changes' });
          }
        }

        // Delay between API calls to avoid rate limiting
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        failed++;
        results.push({ id: j.id, caseNumber: j.caseNumber, status: 'error', error: String(err).slice(0, 200) });
      }
    }

    return NextResponse.json({
      success: true,
      mode: comprehensive ? 'comprehensive' : 'basic',
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

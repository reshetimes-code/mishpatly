import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { fetchAllJudgments, NormalizedJudgment } from '@/lib/import-gov';

// In-memory store for imported judgments (replace with DB in production)
let importedJudgments: NormalizedJudgment[] = [];

function authenticateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const user = verifyToken(authHeader.substring(7));
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

export async function POST(request: NextRequest) {
  const user = authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  try {
    const judgments = await fetchAllJudgments();
    importedJudgments = judgments;

    return NextResponse.json({
      message: `יובאו ${judgments.length} פסקי דין מ-data.gov.il בהצלחה`,
      count: judgments.length,
      sample: judgments.slice(0, 3),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'שגיאה בייבוא נתונים מ-data.gov.il', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const user = authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
  }

  return NextResponse.json({
    count: importedJudgments.length,
    judgments: importedJudgments,
  });
}

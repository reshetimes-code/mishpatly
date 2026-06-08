import { NextRequest, NextResponse } from 'next/server';
import { addReview, getReviewsByLawyerId, getLawyerById } from '@/lib/lawyer-store';

// GET /api/lawyers/[id]/reviews
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lawyerId = parseInt(id, 10);
  const lawyer = await getLawyerById(lawyerId);
  if (!lawyer) {
    return NextResponse.json({ error: 'עורך הדין לא נמצא' }, { status: 404 });
  }

  const reviews = await getReviewsByLawyerId(lawyerId);
  return NextResponse.json({ reviews, total: reviews.length });
}

// POST /api/lawyers/[id]/reviews - add review with AI filtering
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lawyerId = parseInt(id, 10);

  try {
    const body = await request.json();

    if (!body.reviewerName || !body.text || !body.rating) {
      return NextResponse.json({ error: 'יש למלא שם, דירוג וטקסט' }, { status: 400 });
    }

    const result = await addReview({
      lawyerId,
      reviewerName: body.reviewerName,
      rating: parseInt(body.rating, 10),
      text: body.text,
    });

    return NextResponse.json({
      success: true,
      approved: result.approved,
      reason: result.reason,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}

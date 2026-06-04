import { NextRequest, NextResponse } from 'next/server';

const RESOURCE_ID = '6a469006-3844-476f-84e8-960a8fd9df22';
const API_BASE = 'https://data.gov.il/api/3/action/datastore_search';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const params = new URLSearchParams({
      resource_id: RESOURCE_ID,
      limit: String(limit),
      offset: String(offset),
    });

    if (q) {
      params.set('q', q);
    }

    const res = await fetch(`${API_BASE}?${params}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json({ error: 'שגיאה בשליפת נתונים' }, { status: 500 });
    }

    const records = data.result.records.map((r: Record<string, string>) => ({
      id: r._id,
      defendant: r['משיבים'] || r['משיבים 2'] || '',
      plaintiff: r['עותרים'] || '',
      caseNumber: r['מספר הליך'] || '',
      court: r['מחוז'] || '',
      judgmentDate: r['תאריך פסק הדין'] || '',
      subject: r['נושא העתירה'] || '',
      decision: r['החלטה'] || '',
      details: r['פירוט ההחלטה'] || '',
      legalProvisions: r['סעיפי חוק רלוונטיים'] || '',
    }));

    return NextResponse.json({
      results: records,
      total: data.result.total,
      query: q,
    });
  } catch {
    return NextResponse.json({ error: 'שגיאה בחיבור ל-data.gov.il' }, { status: 500 });
  }
}

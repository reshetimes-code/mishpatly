import { NextRequest, NextResponse } from 'next/server';
import { searchJudgmentsFromDB } from '@/lib/judgment-store';

function highlightMatch(text: string, query: string): string {
  if (!query || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const court = searchParams.get('court') || '';
  const year = searchParams.get('year') || '';
  const procedureType = searchParams.get('procedureType') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

  const result = await searchJudgmentsFromDB({
    query: q,
    court,
    year,
    procedureType,
    status: 'PUBLISHED',
    page,
    limit,
  });

  const results = result.judgments.map((j) => ({
    ...j,
    titleHighlighted: q ? highlightMatch(j.title, q) : j.title,
    summaryHighlighted: q ? highlightMatch(j.summary || '', q) : j.summary,
  }));

  return NextResponse.json({
    results,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    query: q,
  });
}

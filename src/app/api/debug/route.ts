import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { addJudgment, createSlug, getStoreSize } from '@/lib/judgment-store';

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    DB_HOST: process.env.DB_HOST || 'NOT SET',
    DB_PASSWORD: process.env.DB_PASSWORD ? 'SET (len=' + process.env.DB_PASSWORD.length + ')' : 'NOT SET',
  };

  // Test direct DB query
  try {
    const dbCount = await prisma.judgment.count();
    results.dbCount = dbCount;
    results.dbStatus = 'connected';
  } catch (e) {
    results.dbStatus = 'error';
    results.dbError = String(e).slice(0, 300);
  }

  // Test insert
  try {
    const testResult = await addJudgment({
      title: 'test-debug',
      slug: createSlug('test-debug-' + Date.now()),
      caseNumber: 'DEBUG-' + Date.now(),
      courtName: 'test',
      procedureType: 'test',
      judgmentDate: '2026-01-01',
      judge: '',
      plaintiff: '',
      defendant: '',
      parties: '',
      summary: 'test',
      fullText: '',
      sourceUrl: '',
      pdfUrl: '',
      sourceName: 'debug',
      category: 'test',
      status: 'DRAFT',
    });
    results.insertTest = 'OK - id: ' + testResult.id;

    const dbCount2 = await prisma.judgment.count();
    results.dbCountAfterInsert = dbCount2;

    await prisma.judgment.deleteMany({ where: { sourceName: 'debug' } });
    results.cleanup = 'done';
  } catch (e) {
    results.insertError = String(e).slice(0, 500);
  }

  // Test store size
  try {
    results.storeSize = await getStoreSize();
  } catch (e) {
    results.storeSizeError = String(e).slice(0, 300);
  }

  return NextResponse.json(results);
}

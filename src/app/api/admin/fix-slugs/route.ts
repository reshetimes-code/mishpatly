import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSlug } from '@/lib/judgment-store';

export async function POST() {
  try {
    const all = await prisma.judgment.findMany({
      select: { id: true, slug: true, caseNumber: true, defendant: true, sourceName: true },
    });

    let updated = 0;
    const errors: string[] = [];

    for (const j of all) {
      const prefix = j.sourceName?.includes('נבו') ? 'nevo' :
                     j.sourceName?.includes('data.gov') ? 'gov' :
                     j.sourceName?.includes('court') || j.sourceName?.includes('הרשות') ? 'court' :
                     j.sourceName?.includes('רבני') ? 'rabbinic' :
                     j.sourceName?.includes('PsakDin') ? 'psakdin' :
                     j.sourceName?.includes('Takdin') ? 'takdin' :
                     j.sourceName?.includes('Din') ? 'din' :
                     j.sourceName?.includes('תולעת') ? 'tolaat' : 'case';

      const newSlug = createSlug(`${prefix}-${j.caseNumber}${j.defendant ? '-' + j.defendant : ''}`);

      if (newSlug === j.slug) continue;

      let finalSlug = newSlug;
      let counter = 1;
      while (true) {
        const existing = await prisma.judgment.findFirst({
          where: { slug: finalSlug, id: { not: j.id } },
        });
        if (!existing) break;
        finalSlug = `${newSlug}-${counter++}`;
      }

      try {
        await prisma.judgment.update({
          where: { id: j.id },
          data: { slug: finalSlug },
        });
        updated++;
      } catch (e) {
        errors.push(`ID ${j.id}: ${String(e).slice(0, 100)}`);
      }
    }

    return NextResponse.json({
      message: `עודכנו ${updated} slugs מתוך ${all.length}`,
      updated,
      total: all.length,
      errors: errors.slice(0, 10),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

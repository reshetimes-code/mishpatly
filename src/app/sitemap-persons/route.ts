import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://mishpatly.co.il';
const PAGE_SIZE = 49000;

/**
 * Sitemap for all person/judge pages — split by ?page=0,1,2,...
 * /sitemap-persons       → page 0 (first 49K)
 * /sitemap-persons?page=1 → page 1 (next 49K)
 */
export async function GET(request: NextRequest) {
  const page = parseInt(new URL(request.url).searchParams.get('page') || '0', 10);
  const skip = page * PAGE_SIZE;

  try {
    // Collect distinct person names: judges + plaintiffs + defendants
    const [judges, plaintiffs, defendants] = await Promise.all([
      prisma.judgment.findMany({
        where: { status: 'PUBLISHED', judge: { not: null } },
        select: { judge: true },
        distinct: ['judge'],
      }),
      prisma.judgment.findMany({
        where: { status: 'PUBLISHED', plaintiff: { not: null } },
        select: { plaintiff: true },
        distinct: ['plaintiff'],
      }),
      prisma.judgment.findMany({
        where: { status: 'PUBLISHED', defendant: { not: null } },
        select: { defendant: true },
        distinct: ['defendant'],
      }),
    ]);

    const nameSet = new Set<string>();
    for (const j of judges) {
      if (j.judge && j.judge.length > 1 && j.judge !== 'לא ידוע') nameSet.add(j.judge.trim());
    }
    for (const p of plaintiffs) {
      if (p.plaintiff && p.plaintiff.length > 1 && p.plaintiff !== 'לא ידוע') nameSet.add(p.plaintiff.trim());
    }
    for (const d of defendants) {
      if (d.defendant && d.defendant.length > 1 && d.defendant !== 'לא ידוע') nameSet.add(d.defendant.trim());
    }

    const allNames = Array.from(nameSet);
    const pageNames = allNames.slice(skip, skip + PAGE_SIZE);

    const urls = pageNames.map(name => `  <url>
    <loc>${BASE_URL}/person/${encodeURIComponent(name)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { 'Content-Type': 'application/xml' } }
    );
  }
}

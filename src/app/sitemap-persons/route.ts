import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://mishpatly.co.il';

/**
 * Sitemap for all person pages (judges, plaintiffs, defendants).
 * Served at /sitemap-persons (XML format)
 */
export async function GET() {
  try {
    // Get latest judgment date per person name for lastmod
    const [judges, plaintiffs, defendants] = await Promise.all([
      prisma.judgment.findMany({
        where: { status: 'PUBLISHED', judge: { not: null } },
        select: { judge: true, updatedAt: true },
        distinct: ['judge'],
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.judgment.findMany({
        where: { status: 'PUBLISHED', plaintiff: { not: null } },
        select: { plaintiff: true, updatedAt: true },
        distinct: ['plaintiff'],
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.judgment.findMany({
        where: { status: 'PUBLISHED', defendant: { not: null } },
        select: { defendant: true, updatedAt: true },
        distinct: ['defendant'],
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    const nameMap = new Map<string, Date>();
    for (const j of judges) {
      if (j.judge && j.judge.length > 1 && j.judge !== 'לא ידוע') {
        const name = j.judge.trim();
        const existing = nameMap.get(name);
        if (!existing || j.updatedAt > existing) nameMap.set(name, j.updatedAt);
      }
    }
    for (const p of plaintiffs) {
      if (p.plaintiff && p.plaintiff.length > 1 && p.plaintiff !== 'לא ידוע') {
        const name = p.plaintiff.trim();
        const existing = nameMap.get(name);
        if (!existing || p.updatedAt > existing) nameMap.set(name, p.updatedAt);
      }
    }
    for (const d of defendants) {
      if (d.defendant && d.defendant.length > 1 && d.defendant !== 'לא ידוע') {
        const name = d.defendant.trim();
        const existing = nameMap.get(name);
        if (!existing || d.updatedAt > existing) nameMap.set(name, d.updatedAt);
      }
    }

    const entries = Array.from(nameMap.entries()).slice(0, 49000);

    const urls = entries.map(([name, lastmod]) => `  <url>
    <loc>${BASE_URL}/person/${encodeURIComponent(name)}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { 'Content-Type': 'application/xml' } }
    );
  }
}

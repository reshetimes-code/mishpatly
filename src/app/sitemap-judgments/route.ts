import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://mishpatly.co.il';

/**
 * Second sitemap for judgments beyond the first 49,000
 * Served at /sitemap-judgments (XML format)
 */
export async function GET() {
  try {
    const judgments = await prisma.judgment.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { id: 'asc' },
      skip: 49000,
      take: 49000,
    });

    if (judgments.length === 0) {
      // No overflow, return empty sitemap
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
      return new NextResponse(xml, {
        headers: { 'Content-Type': 'application/xml' },
      });
    }

    const urls = judgments.map(j => `  <url>
    <loc>${BASE_URL}/judgment/${encodeURIComponent(j.slug)}</loc>
    <lastmod>${new Date(j.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
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

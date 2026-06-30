import type { MetadataRoute } from 'next';
import { keywordPages } from '@/app/seo-keywords';
import { seoTopics } from '@/lib/seo-topics';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://mishpatly.co.il';

// Static article slugs
const staticArticleSlugs = [
  'zchuyot-hanesham-bahalikh-pelili',
  'hok-haganat-hapratiyut',
  'halikhei-gerushin-beyisrael',
  'zchuyot-ovdim-befiturin',
  'hozim-miskhariyim-tipim',
  'tviot-nezikin-matai-veekh',
  'teunot-drakhim-zchuyot-nifgaim',
  'hatrada-minit-baavoda',
  'dinei-skhirut-dirot',
  'yerusha-vetzavaot-madrich',
  'tviot-ktanot-eikh-lehagish',
  'zchuyot-hayavim-hotza-lapoel',
  'mishmeret-yeladim-sugim-vekriteryonim',
  'avirot-tnua-knasot-nekudot',
  'rkhishat-dira-hebetim-mishpatiyim',
  'dinei-internet-vesayber',
  'bituah-leumi-zchuyot-gimlaot',
  'hadlut-peiraon-pshitat-regel',
  'zchuyot-dayarim-muganim',
  'heskem-mamon-madrich',
];

/**
 * Main sitemap — static pages, keywords, articles, lawyers, judges, and ALL judgments.
 * Judgments are fetched with only slug+date (lightweight query).
 * Google can handle sitemaps up to 50MB / 50,000 URLs.
 * If we exceed 50K, we'll split into sitemap index.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/lawyers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/removal-request`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/accessibility`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Topic hub pages
  const topicPages: MetadataRoute.Sitemap = seoTopics.map((topic) => ({
    url: `${BASE_URL}/topic/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // SEO keyword landing pages
  const keywordLandingPages: MetadataRoute.Sitemap = keywordPages.map((page) => ({
    url: `${BASE_URL}/search/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Static article pages
  const articlePages: MetadataRoute.Sitemap = staticArticleSlugs.map((slug) => ({
    url: `${BASE_URL}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Dynamic article pages from DB
  let dbArticlePages: MetadataRoute.Sitemap = [];
  try {
    const dbArticles = await prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    dbArticlePages = dbArticles
      .filter(a => !staticArticleSlugs.includes(a.slug))
      .map((a) => ({
        url: `${BASE_URL}/articles/${encodeURIComponent(a.slug)}`,
        lastModified: new Date(a.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      }));
  } catch { /* DB unavailable */ }

  // Lawyer profile pages
  let lawyerPages: MetadataRoute.Sitemap = [];
  try {
    const lawyers = await prisma.lawyer.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    lawyerPages = lawyers.map((l) => ({
      url: `${BASE_URL}/lawyers/${encodeURIComponent(l.slug)}`,
      lastModified: new Date(l.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }));
  } catch { /* DB unavailable */ }

  // Person pages — judges, plaintiffs, defendants → /person/ pages
  let personPages: MetadataRoute.Sitemap = [];
  try {
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

    personPages = Array.from(nameSet).slice(0, 40000).map((name) => ({
      url: `${BASE_URL}/person/${encodeURIComponent(name)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } catch { /* DB unavailable */ }

  // ALL judgment pages — lightweight query (only slug + date)
  // Person pages are in /sitemap-persons — keeping this under 50K
  let judgmentPages: MetadataRoute.Sitemap = [];
  try {
    const judgments = await prisma.judgment.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { id: 'asc' },
      take: 45000, // Leave room for static/lawyer/judge/article pages
    });
    judgmentPages = judgments.map((j) => ({
      url: `${BASE_URL}/judgment/${encodeURIComponent(j.slug)}`,
      lastModified: new Date(j.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch { /* DB unavailable */ }

  return [
    ...staticPages,
    ...topicPages,
    ...keywordLandingPages,
    ...articlePages,
    ...dbArticlePages,
    ...lawyerPages,
    ...personPages,
    ...judgmentPages,
  ];
}

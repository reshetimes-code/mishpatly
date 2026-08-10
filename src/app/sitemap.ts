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
 * Main sitemap — static pages, keywords, articles, lawyers only.
 * Judgments and persons have their own sitemaps via generateSitemaps
 * in /judgment/sitemap.ts and /person/sitemap.ts.
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

  return [
    ...staticPages,
    ...topicPages,
    ...keywordLandingPages,
    ...articlePages,
    ...dbArticlePages,
    ...lawyerPages,
  ];
}

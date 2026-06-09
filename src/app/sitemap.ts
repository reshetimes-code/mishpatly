import type { MetadataRoute } from 'next';
import { keywordPages } from '@/app/seo-keywords';
import { getAllJudgmentsFromDB } from '@/lib/judgment-store';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://mishpatly.co.il';

// Article slugs — keep in sync with /articles page
const articleSlugs = [
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/lawyers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/removal-request`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/accessibility`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // SEO keyword landing pages
  const keywordLandingPages: MetadataRoute.Sitemap = keywordPages.map((page) => ({
    url: `${BASE_URL}/search/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Article pages
  const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${BASE_URL}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Judgment pages from DB
  let allJudgments: Awaited<ReturnType<typeof getAllJudgmentsFromDB>> = [];
  try {
    allJudgments = await getAllJudgmentsFromDB();
  } catch {
    // DB unavailable during build - will be populated at runtime
  }
  const judgmentPages: MetadataRoute.Sitemap = allJudgments
    .filter(j => j.status === 'PUBLISHED')
    .map((j) => ({
      url: `${BASE_URL}/judgment/${encodeURIComponent(j.slug)}`,
      lastModified: new Date(j.updatedAt || j.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  // Lawyer profile pages from DB
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
  } catch {
    // DB unavailable during build
  }

  // Judge landing pages — extract unique judges from judgments
  const judgeNames = new Set<string>();
  for (const j of allJudgments) {
    if (j.judge && j.status === 'PUBLISHED') judgeNames.add(j.judge);
  }
  const judgePages: MetadataRoute.Sitemap = Array.from(judgeNames).map((name) => ({
    url: `${BASE_URL}/search?judge=${encodeURIComponent(name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...keywordLandingPages,
    ...articlePages,
    ...judgmentPages,
    ...lawyerPages,
    ...judgePages,
  ];
}

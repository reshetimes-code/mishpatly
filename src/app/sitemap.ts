import type { MetadataRoute } from 'next';
import { keywordPages } from '@/app/seo-keywords';
import { getAllJudgmentsFromDB } from '@/lib/judgment-store';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://mishpatly.co.il';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/removal-request`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/accessibility`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const keywordLandingPages: MetadataRoute.Sitemap = keywordPages.map((page) => ({
    url: `${BASE_URL}/search/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

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

  return [...staticPages, ...keywordLandingPages, ...judgmentPages];
}

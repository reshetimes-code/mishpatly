import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { seoTopics, getTopicBySlug } from '@/lib/seo-topics';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://mishpatly.co.il';

export function generateStaticParams() {
  return seoTopics.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return { title: 'נושא לא נמצא | משפטלי' };

  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    alternates: { canonical: `${SITE_URL}/topic/${slug}` },
    openGraph: {
      title: topic.metaTitle,
      description: topic.metaDescription,
      url: `${SITE_URL}/topic/${slug}`,
      type: 'website',
      locale: 'he_IL',
      siteName: 'משפטלי',
    },
    robots: { index: true, follow: true },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  // Fetch related judgments
  let judgments: { slug: string; title: string; courtName: string; judgmentDate: Date; judge: string | null }[] = [];
  try {
    judgments = await prisma.judgment.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { category: { contains: topic.searchQuery, mode: 'insensitive' } },
          { title: { contains: topic.searchQuery, mode: 'insensitive' } },
          { legalTopics: { has: topic.searchQuery } },
        ],
      },
      select: { slug: true, title: true, courtName: true, judgmentDate: true, judge: true },
      orderBy: { judgmentDate: 'desc' },
      take: 12,
    });
  } catch { /* DB unavailable */ }

  // Fetch related articles
  let articles: { slug: string; title: string; author: string; category: string }[] = [];
  try {
    const dbArticles = await prisma.article.findMany({
      where: {
        isPublished: true,
        OR: [
          { category: { contains: topic.searchQuery, mode: 'insensitive' } },
          { title: { contains: topic.searchQuery, mode: 'insensitive' } },
        ],
      },
      select: { slug: true, title: true, author: true, category: true },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    });
    articles = dbArticles;
  } catch { /* DB unavailable */ }

  // Related topics
  const relatedTopics = topic.relatedTopics
    .map(s => seoTopics.find(t => t.slug === s))
    .filter(Boolean);

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": topic.h1,
        "description": topic.metaDescription,
        "url": `${SITE_URL}/topic/${slug}`,
        "inLanguage": "he",
        "isPartOf": { "@type": "WebSite", "name": "משפטלי", "url": SITE_URL },
      },
      {
        "@type": "FAQPage",
        "mainEntity": topic.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "דף הבית", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": topic.title, "item": `${SITE_URL}/topic/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div dir="rtl" className="min-h-screen bg-legal-bg">
        {/* Breadcrumbs */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">דף הבית</Link>
            <span>/</span>
            <span className="text-primary font-medium">{topic.title}</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="bg-gradient-to-bl from-[#0B3C5D] via-[#072a42] to-[#0B3C5D] text-white py-12">
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{topic.h1}</h1>
            <p className="text-lg text-white/80 max-w-3xl">{topic.heroText}</p>
            <div className="mt-6">
              <Link
                href={`/search?q=${encodeURIComponent(topic.searchQuery)}`}
                className="inline-flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded-lg font-bold hover:bg-accent/90 transition"
              >
                חיפוש פסקי דין ב{topic.title}
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Article Content */}
              <article className="bg-white rounded-xl shadow-sm p-8">
                <div className="prose-legal space-y-5">
                  {topic.content.map((p, i) => (
                    <p key={i} className="text-legal-text leading-relaxed text-base">{p}</p>
                  ))}
                </div>
              </article>

              {/* Related Judgments */}
              {judgments.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">פסקי דין אחרונים ב{topic.title}</h2>
                  <div className="space-y-3">
                    {judgments.map(j => (
                      <Link
                        key={j.slug}
                        href={`/judgment/${j.slug}`}
                        className="block p-4 rounded-lg border border-gray-100 hover:border-accent/30 hover:bg-accent/5 transition"
                      >
                        <h3 className="text-sm font-bold text-primary mb-1 line-clamp-1">{j.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{j.courtName}</span>
                          <span>{new Date(j.judgmentDate).toLocaleDateString('he-IL')}</span>
                          {j.judge && <span>שופט: {j.judge}</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/search?q=${encodeURIComponent(topic.searchQuery)}`}
                    className="block text-center mt-4 text-accent font-medium text-sm hover:underline"
                  >
                    צפייה בכל פסקי הדין &larr;
                  </Link>
                </div>
              )}

              {/* Related Articles */}
              {articles.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-primary mb-4">מאמרים ב{topic.title}</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {articles.map(a => (
                      <Link
                        key={a.slug}
                        href={`/articles/${a.slug}`}
                        className="block p-4 rounded-lg border border-gray-100 hover:border-accent/30 hover:bg-accent/5 transition"
                      >
                        <span className="text-xs text-accent font-medium">{a.category}</span>
                        <h3 className="text-sm font-bold text-primary mt-1">{a.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{a.author}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-primary mb-4">שאלות נפוצות</h2>
                <div className="space-y-4">
                  {topic.faqs.map((faq, i) => (
                    <details key={i} className="group border border-gray-100 rounded-lg">
                      <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-primary text-sm hover:bg-gray-50 rounded-lg">
                        {faq.question}
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">&#9660;</span>
                      </summary>
                      <div className="px-4 pb-4 text-sm text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Search */}
              <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
                <h3 className="text-sm font-bold text-primary mb-3">חיפוש מהיר</h3>
                <form action="/search" method="GET">
                  <input type="hidden" name="category" value={topic.searchQuery} />
                  <input
                    type="text"
                    name="q"
                    placeholder={`חיפוש ב${topic.title}...`}
                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 mb-3"
                  />
                  <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                    חפש
                  </button>
                </form>
              </div>

              {/* Related Topics */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-sm font-bold text-primary mb-3">נושאים קשורים</h3>
                <div className="space-y-2">
                  {relatedTopics.map(t => t && (
                    <Link
                      key={t.slug}
                      href={`/topic/${t.slug}`}
                      className="block p-3 rounded-lg border border-gray-100 hover:border-accent/30 hover:bg-accent/5 transition text-sm font-medium text-primary"
                    >
                      {t.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA: Find a Lawyer */}
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-5 border border-accent/20">
                <h3 className="text-sm font-bold text-primary mb-2">צריכים עורך דין?</h3>
                <p className="text-xs text-gray-600 mb-3">מצאו עורך דין מתמחה ב{topic.title}</p>
                <Link
                  href="/lawyers"
                  className="block text-center bg-accent text-primary py-2.5 rounded-lg text-sm font-bold hover:bg-accent/90 transition"
                >
                  לפורטל עורכי הדין
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

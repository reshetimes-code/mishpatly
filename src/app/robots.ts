import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: [
      'https://mishpatly.co.il/sitemap.xml',
      'https://mishpatly.co.il/sitemap-persons',
      'https://mishpatly.co.il/sitemap-persons?page=1',
      'https://mishpatly.co.il/sitemap-persons?page=2',
    ],
    host: 'https://mishpatly.co.il',
  };
}

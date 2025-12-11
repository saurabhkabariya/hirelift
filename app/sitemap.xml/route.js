import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = 'https://www.hirelift.tech';
  const currentDate = new Date().toISOString();

  const urls = [
    // Core pages - Highest priority for global SEO
    {
      loc: baseUrl,
      lastmod: currentDate,
      changefreq: "daily",
      priority: 1.0,
    },
    {
      loc: `${baseUrl}/audit`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/pricing`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/jobs`,
      lastmod: currentDate,
      changefreq: "daily",
      priority: 0.9,
    },
    
    // Authentication and user areas
    {
      loc: `${baseUrl}/auth`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/dashboard`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.6,
    },
    
    // Templates and tools
    {
      loc: `${baseUrl}/playground`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    
    // Company and job posting
    {
      loc: `${baseUrl}/post-job`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.6,
    },
    {
      loc: `${baseUrl}/company-search`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.6,
    },
    
    // Information and legal pages

    {
      loc: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.6,
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: "yearly",
      priority: 0.4,
    },
    {
      loc: `${baseUrl}/terms`,
      lastmod: currentDate,
      changefreq: "yearly",
      priority: 0.4,
    },
    {
      loc: `${baseUrl}/refund`,
      lastmod: currentDate,
      changefreq: "yearly",
      priority: 0.4,
    },

  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

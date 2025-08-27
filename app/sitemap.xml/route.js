import { NextResponse } from "next/server";
import { getAllBlogPosts } from '../../data/blogPosts';

export async function GET() {
  const baseUrl = 'https://hirelift.vercel.app';
  const currentDate = new Date().toISOString();
  const blogPosts = getAllBlogPosts();

  const urls = [
    // Core pages - High priority
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
      loc: `${baseUrl}/playground`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/company-search`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/pricing`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: "daily",
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/auth`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.6,
    },
    {
      loc: `${baseUrl}/dashboard`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.7,
    },

    // Blog main page
    {
      loc: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: "daily",
      priority: 0.8,
    },

    // Dynamic blog posts
    ...blogPosts.map(post => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: new Date(post.publishDate).toISOString(),
      changefreq: "monthly",
      priority: post.featured ? 0.8 : 0.7,
    })),

    // Location-based pages for Indian cities
    {
      loc: `${baseUrl}/jobs/mumbai`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.6,
    },
    {
      loc: `${baseUrl}/jobs/delhi`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.6,
    },
    {
      loc: `${baseUrl}/jobs/bangalore`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.6,
    },
    {
      loc: `${baseUrl}/jobs/chennai`,
      lastmod: currentDate,
      changefreq: "weekly",
      priority: 0.6,
    },

    // Tool-specific landing pages
    {
      loc: `${baseUrl}/tools/ats-resume-checker`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/tools/resume-optimizer`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/tools/cold-email-generator`,
      lastmod: currentDate,
      changefreq: "monthly",
      priority: 0.7,
    }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url>
  <loc>${u.loc}</loc>
  <lastmod>${u.lastmod || currentDate}</lastmod>
  <changefreq>${u.changefreq}</changefreq>
  <priority>${u.priority}</priority>
</url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

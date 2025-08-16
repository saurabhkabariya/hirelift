import { NextResponse } from "next/server";

export async function GET() {
  const urls = [
    {
      loc: "https://hirelift.vercel.app",
      changefreq: "weekly",
      priority: 1.0,
    },
    {
      loc: "https://hirelift.vercel.app/audit",
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      loc: "https://hirelift.vercel.app/pricing",
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      loc: "https://hirelift.vercel.app/auth",
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: "https://hirelift.vercel.app/dashboard",
      changefreq: "daily",
      priority: 0.8,
    },
    {
      loc: "https://hirelift.vercel.app/company-search",
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: "https://hirelift.vercel.app/contact",
      changefreq: "monthly",
      priority: 0.6,
    },
    {
      loc: "https://hirelift.vercel.app/privacy",
      changefreq: "yearly",
      priority: 0.3,
    },
    {
      loc: "https://hirelift.vercel.app/terms",
      changefreq: "yearly",
      priority: 0.3,
    },
    {
      loc: "https://hirelift.vercel.app/refund",
      changefreq: "yearly",
      priority: 0.3,
    },
  ];

  const lastmod = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url>
  <loc>${u.loc}</loc>
  <lastmod>${lastmod}</lastmod>
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

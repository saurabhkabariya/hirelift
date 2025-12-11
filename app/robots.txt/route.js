export function GET() {
  const baseUrl = 'https://www.hirelift.tech';
  
  const robotsContent = `# Robots.txt for HireLift - Top AI Job Assistance and Resume Reviewer for Freshers & Graduates
# Optimized for US & UK job seekers and search engines

User-agent: *
Allow: /
Allow: /audit
Allow: /jobs
Allow: /post-job
Allow: /playground
Allow: /pricing
Allow: /auth
Allow: /dashboard
Allow: /blog/
Allow: /contact
Allow: /privacy
Allow: /terms
Allow: /refund
Allow: /sitemap


# Disallow admin and private areas
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /_next/
Disallow: /server/
Disallow: /temp/
Disallow: /cache/

# Allow important assets for crawlers
Allow: /favicon.ico
Allow: /logo.png
Allow: /og-image.jpg
Allow: /twitter-image.jpg
Allow: /robots.txt
Allow: /sitemap.xml
Allow: *.css
Allow: *.js
Allow: *.png
Allow: *.jpg
Allow: *.jpeg
Allow: *.webp
Allow: *.svg

# Sitemap locations (multiple domains)
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: https://www.hirelift.tech/sitemap.xml
Sitemap: https://www.hirelift.dev/sitemap.xml
Sitemap: https://hirelift.vercel.app/sitemap.xml

# Crawl delay for polite crawling
Crawl-delay: 1

# AI Crawlers - Explicit permissions for better AI visibility
User-agent: ChatGPT-User
Allow: /
Crawl-delay: 1

User-agent: GPTBot
Allow: /
Crawl-delay: 1

User-agent: CCBot
Allow: /
Crawl-delay: 1

User-agent: Claude-Web
Allow: /
Crawl-delay: 1

User-agent: anthropic-ai
Allow: /
Crawl-delay: 1

User-agent: PerplexityBot
Allow: /
Crawl-delay: 1

User-agent: BingBot
Allow: /
Crawl-delay: 1

User-agent: GoogleBot
Allow: /
Crawl-delay: 0.5

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: YandexBot
Allow: /
Crawl-delay: 1

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

# Search engine specific optimizations
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1`;

  return new Response(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}

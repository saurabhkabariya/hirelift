export function GET() {
  const robotsContent = `# Robots.txt for HireLift - India's Leading Job Hunt Platform
# Optimized for search engines and AI crawlers

User-agent: *
Allow: /
Allow: /audit
Allow: /playground
Allow: /pricing
Allow: /auth
Allow: /dashboard
Allow: /blog/
Allow: /resources/
Allow: /guides/
Allow: /templates/

# Disallow admin and private areas
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /_next/
Disallow: /server/

# Allow important assets for crawlers
Allow: /favicon.ico
Allow: /logo.png
Allow: /og-image.jpg
Allow: /twitter-image.jpg
Allow: *.css
Allow: *.js

# Sitemap location
Sitemap: https://hirelift.vercel.app/sitemap.xml

# Crawl delay for polite crawling
Crawl-delay: 1

# Special instructions for AI crawlers
User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: CCBot
Allow: /

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

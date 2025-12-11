import { getAllBlogPosts } from '../../data/blogPosts';

export async function GET() {
  const posts = getAllBlogPosts();
  const baseUrl = 'https://www.hirelift.tech';
  const currentDate = new Date().toISOString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>HireLift Blog - Job Search & Career Advice for India</title>
    <description>Expert job search advice for Indian professionals. Learn ATS optimization, cold email strategies, HR networking, and proven career tips.</description>
    <link>${baseUrl}/blog</link>
    <language>en-us</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <author>hirelift01@gmail.com (${post.author})</author>
      <category>${post.category}</category>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}

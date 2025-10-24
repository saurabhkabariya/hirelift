import { getAllBlogPosts } from '../../../data/blogPosts';

export async function GET() {
  const posts = getAllBlogPosts();
  const baseUrl = 'https://hirelift.vercel.app';
  
  const rssItems = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
      <author>hirelift01@gmail.com (${post.author})</author>
      <category><![CDATA[${post.category}]]></category>
      ${post.tags ? post.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('') : ''}
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>HireLift Global Career Blog</title>
    <description>Expert career advice and job search strategies for global professionals. Master AI resume optimization, US &amp; UK job market insights, and proven career development techniques.</description>
    <link>${baseUrl}/blog</link>
    <language>en-US</language>
    <managingEditor>hirelift01@gmail.com (HireLift Team)</managingEditor>
    <webMaster>hirelift01@gmail.com (HireLift Team)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>HireLift Global Career Blog</title>
      <link>${baseUrl}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    <category>Career Development</category>
    <category>Job Search</category>
    <category>Professional Development</category>
    <category>Resume Optimization</category>
    <category>Global Careers</category>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
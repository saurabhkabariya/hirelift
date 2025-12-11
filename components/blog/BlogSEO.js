'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

export default function BlogSEO({ 
  title, 
  description, 
  keywords = [], 
  image,
  publishedAt,
  modifiedAt,
  author = 'HireLift Team',
  category,
  tags = []
}) {
  const pathname = usePathname();
  const baseUrl = 'https://www.hirelift.tech';
  const fullUrl = `${baseUrl}${pathname}`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image || `${baseUrl}/og-image.jpg`,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "HireLift",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": publishedAt,
    "dateModified": modifiedAt || publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "keywords": keywords.join(', '),
    "articleSection": category,
    "articleTag": tags
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || `${baseUrl}/og-image.jpg`} />
      <meta property="og:site_name" content="HireLift" />
      <meta property="article:published_time" content={publishedAt} />
      <meta property="article:modified_time" content={modifiedAt || publishedAt} />
      <meta property="article:author" content={author} />
      <meta property="article:section" content={category} />
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image || `${baseUrl}/og-image.jpg`} />
      <meta property="twitter:creator" content="@HireLift" />
      <meta property="twitter:site" content="@HireLift" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* RSS Feed */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title="HireLift Blog RSS Feed"
        href={`${baseUrl}/feed.xml`}
      />
      
      {/* Preload important resources */}
      <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="" />
      
      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
    </Head>
  );
}

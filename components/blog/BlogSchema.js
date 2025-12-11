'use client';

export default function BlogSchema({ post }) {
  const baseUrl = 'https://www.hirelift.tech';
  
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${baseUrl}/blog/${post.slug}#article`,
        "isPartOf": {
          "@id": `${baseUrl}/blog/${post.slug}#webpage`
        },
        "author": {
          "@type": "Organization",
          "name": "HireLift Team",
          "@id": `${baseUrl}#organization`
        },
        "headline": post.title,
        "datePublished": post.publishedAt,
        "dateModified": post.publishedAt,
        "mainEntityOfPage": {
          "@id": `${baseUrl}/blog/${post.slug}#webpage`
        },
        "wordCount": post.content ? post.content.split(' ').length : 1000,
        "commentCount": 0,
        "publisher": {
          "@id": `${baseUrl}#organization`
        },
        "image": {
          "@type": "ImageObject",
          "@id": `${baseUrl}/blog/${post.slug}#primaryimage`,
          "inLanguage": "en-IN",
          "url": `${baseUrl}/blog/${post.slug}/opengraph-image`,
          "contentUrl": `${baseUrl}/blog/${post.slug}/opengraph-image`,
          "width": 1200,
          "height": 630
        },
        "thumbnailUrl": `${baseUrl}/blog/${post.slug}/opengraph-image`,
        "keywords": post.keywords.join(', '),
        "articleSection": [post.category],
        "inLanguage": "en-IN",
        "potentialAction": [
          {
            "@type": "CommentAction",
            "name": "Comment",
            "target": [`${baseUrl}/blog/${post.slug}#respond`]
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/blog/${post.slug}#webpage`,
        "url": `${baseUrl}/blog/${post.slug}`,
        "name": post.title,
        "isPartOf": {
          "@id": `${baseUrl}#website`
        },
        "primaryImageOfPage": {
          "@id": `${baseUrl}/blog/${post.slug}#primaryimage`
        },
        "image": {
          "@id": `${baseUrl}/blog/${post.slug}#primaryimage`
        },
        "thumbnailUrl": `${baseUrl}/blog/${post.slug}/opengraph-image`,
        "datePublished": post.publishedAt,
        "dateModified": post.publishedAt,
        "description": post.excerpt,
        "breadcrumb": {
          "@id": `${baseUrl}/blog/${post.slug}#breadcrumb`
        },
        "inLanguage": "en-IN",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [`${baseUrl}/blog/${post.slug}`]
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/blog/${post.slug}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${baseUrl}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        "name": "HireLift",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en-IN",
          "@id": `${baseUrl}#/schema/logo/image/`,
          "url": `${baseUrl}/logo.png`,
          "contentUrl": `${baseUrl}/logo.png`,
          "width": 512,
          "height": 512,
          "caption": "HireLift"
        },
        "image": {
          "@id": `${baseUrl}#/schema/logo/image/`
        },
        "sameAs": [
          "https://twitter.com/hirelift",
          "https://linkedin.com/company/hirelift"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
        "url": baseUrl,
        "name": "HireLift",
        "description": "AI-powered resume optimization and job search platform for Indian professionals",
        "publisher": {
          "@id": `${baseUrl}#organization`
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/blog?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-IN"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

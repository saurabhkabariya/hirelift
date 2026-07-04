'use client';

export default function EnhancedBlogSchema({ post, faqs = [], howToSteps = [] }) {
  const baseUrl = 'https://www.hirelift.tech';

  // Comprehensive schema markup for SGE optimization
  const schemas = [
    // Main Article Schema
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${baseUrl}/blog/${post.slug}#article`,
      "headline": post.title,
      "alternativeHeadline": post.excerpt,
      "description": post.metaDescription || post.excerpt,
      "image": {
        "@type": "ImageObject",
        "url": `${baseUrl}/og-image.png`,
        "width": 1200,
        "height": 630
      },
      "datePublished": post.publishedAt,
      "dateModified": post.publishedAt,
      "author": {
        "@type": "Organization",
        "name": post.author || "HireLift Team",
        "url": baseUrl
      },
      "publisher": {
        "@type": "Organization",
        "name": "HireLift",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
          "width": 200,
          "height": 60
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${baseUrl}/blog/${post.slug}`
      },
      "articleBody": post.content,
      "wordCount": post.content?.split(' ').length || 1000,
      "keywords": post.keywords?.join(', '),
      "articleSection": post.category,
      "inLanguage": "en",
      "isPartOf": {
        "@id": `${baseUrl}#website`
      }
    }
  ];

  // FAQ Schema - Extremely valuable for SGE
  if (faqs && faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
  }

  // HowTo Schema - Perfect for step-by-step content AI parsing
  if (howToSteps && howToSteps.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": post.title,
      "description": post.excerpt,
      "step": howToSteps.map((step, idx) => ({
        "@type": "HowToStep",
        "position": idx + 1,
        "name": step.title,
        "text": step.description,
        "image": step.image || `${baseUrl}/step-${idx + 1}.png`
      }))
    });
  }

  // Breadcrumb Schema
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        "name": post.category,
        "item": `${baseUrl}/blog?category=${post.category}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": `${baseUrl}/blog/${post.slug}`
      }
    ]
  });

  // Organization Schema - For better brand recognition
  schemas.push({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}#organization`,
    "name": "HireLift",
    "url": baseUrl,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-XXX-XXX-XXXX",
      "contactType": "Customer service"
    },
    "sameAs": [
      "https://www.linkedin.com/company/hirelift",
      "https://twitter.com/hirelift",
      "https://www.instagram.com/hirelift"
    ]
  });

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

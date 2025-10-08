import Head from 'next/head';

/**
 * SEO Component for HireLift - Global Job Search Platform
 * Provides consistent SEO optimization across all pages
 */

export function SEOHead({ 
  title, 
  description, 
  keywords = [], 
  ogImage, 
  url, 
  type = "website",
  noIndex = false,
  canonicalUrl,
  structuredData = null 
}) {
  const defaultKeywords = [
    "resume optimizer", "ATS checker", "job search", "career coaching", "interview preparation",
    "AI resume builder", "professional resume", "global job market", "remote jobs", "career development"
  ];

  const allKeywords = [...defaultKeywords, ...keywords].join(", ");
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="author" content="HireLift Team" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="Global" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="HireLift" />
      <meta property="og:locale" content="en_US" />
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={title} />
        </>
      )}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content="@hirelift" />
      <meta name="twitter:site" content="@hirelift" />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}

/**
 * Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(faqs) {
  return {
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
  };
}

/**
 * Generate Software Application Schema
 */
export function generateSoftwareSchema(appData) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": appData.name,
    "description": appData.description,
    "url": appData.url,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": appData.price || "0",
      "priceCurrency": appData.currency || "USD"
    },
    "aggregateRating": appData.rating && {
      "@type": "AggregateRating",
      "ratingValue": appData.rating.value,
      "ratingCount": appData.rating.count
    }
  };
}

/**
 * Generate How-To Schema
 */
export function generateHowToSchema(howTo) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howTo.name,
    "description": howTo.description,
    "totalTime": howTo.totalTime,
    "step": howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      "name": step.name,
      "text": step.text,
      "position": index + 1
    }))
  };
}

/**
 * Global SEO Keywords for Job Search Domain
 */
export const GLOBAL_SEO_KEYWORDS = {
  primary: [
    "resume optimizer", "ATS checker", "job search platform", "career coaching", 
    "AI resume builder", "professional resume", "interview preparation"
  ],
  secondary: [
    "global job search", "remote jobs", "career development", "job application tracker",
    "resume templates", "LinkedIn optimization", "salary negotiation", "career change"
  ],
  longTail: [
    "how to optimize resume for ATS", "best resume format for job search",
    "AI powered career coaching", "remote job search strategies", 
    "professional resume writing service", "interview preparation tips"
  ],
  industry: [
    "tech jobs", "software engineer resume", "data analyst resume", 
    "marketing manager resume", "project manager resume", "sales resume"
  ],
  location: [
    "USA jobs", "Canada jobs", "UK jobs", "Australia jobs", "remote worldwide jobs",
    "international job search", "global career opportunities"
  ]
};

export default SEOHead;
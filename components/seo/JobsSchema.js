export default function JobsSchema() {
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Jobs all around World | HireLift",
    "description": "Browse thousands of free job opportunities across World. Find your dream job in IT, Marketing, Sales, Finance and more.",
    "url": `${'https://www.hirelift.tech'}/jobs`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "Job Listings",
      "description": "Latest job openings around world",
      "numberOfItems": "1000+"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.hirelift.tech"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Jobs",
          "item": `${'https://www.hirelift.tech'}/jobs`
        }
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "HireLift",
      "url": "https://www.hirelift.tech",
      "logo": {
        "@type": "ImageObject",
        "url": `${'https://www.hirelift.tech'}/logo.png`
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jobPostingSchema)
      }}
    />
  );
}
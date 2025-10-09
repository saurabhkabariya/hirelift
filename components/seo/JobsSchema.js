export default function JobsSchema() {
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Jobs in India | HireLift",
    "description": "Browse thousands of free job opportunities across India. Find your dream job in IT, Marketing, Sales, Finance and more.",
    "url": "https://hirelift.vercel.app/jobs",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Job Listings",
      "description": "Latest job openings in India",
      "numberOfItems": "1000+"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://hirelift.vercel.app"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Jobs",
          "item": "https://hirelift.vercel.app/jobs"
        }
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "HireLift",
      "url": "https://hirelift.vercel.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hirelift.vercel.app/logo.png"
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
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
      "numberOfItems": "1000+",
      "itemListElement": [
        {
          "@type": "JobPosting",
          "@id": "https://hirelift.vercel.app/jobs/sample-job-1",
          "title": "Software Developer Jobs in India",
          "description": "Find software developer positions across major Indian cities",
          "hiringOrganization": {
            "@type": "Organization",
            "name": "Various Companies",
            "url": "https://hirelift.vercel.app"
          },
          "jobLocation": {
            "@type": "Place",
            "addressCountry": "IN",
            "addressLocality": "India"
          },
          "employmentType": ["FULL_TIME", "PART_TIME", "CONTRACT"],
          "industry": "Technology",
          "occupationalCategory": "Software Development"
        }
      ]
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
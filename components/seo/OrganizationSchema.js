export default function OrganizationSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HireLift",
    "alternateName": "HireLift India",
    "url": "https://www.hirelift.tech",
    "logo": {
      "@type": "ImageObject",
      "url": `${'https://www.hirelift.tech'}/logo.png`,
      "width": 200,
      "height": 200
    },
    "description": "India's leading job hunt platform with free ATS resume checker, cold email templates, and HR directory. Get hired 3x faster with 85% ATS pass rate.",
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "HireLift Team"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "India"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hirelift01@gmail.com",
      "url": `${'https://www.hirelift.tech'}/contact`
    },
    "sameAs": [
      "https://twitter.com/hirelift",
      "https://linkedin.com/company/hirelift",
      "https://facebook.com/hirelift"
    ],
    "knowsAbout": [
      "Job Search",
      "Resume Optimization",
      "ATS Resume Checker", 
      "Cold Email Templates",
      "HR Directory",
      "Career Development",
      "Job Hunt Assistance",
      "Employment in India"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "serviceType": "Job Search Platform",
    "audience": {
      "@type": "Audience",
      "audienceType": "Job Seekers in India"
    },
    "offers": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Free ATS Resume Checker",
        "description": "Free resume analysis and optimization tool"
      },
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema)
      }}
    />
  );
}
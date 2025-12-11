'use client';

import { useEffect } from 'react';

export default function StructuredData() {
  useEffect(() => {
    // FAQ Structured Data
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is an ATS score and why is it important?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An ATS (Applicant Tracking System) score measures how well your resume is optimized for automated screening systems. Over 98% of Fortune 500 companies use ATS to filter resumes before human review. A high ATS score (above 80%) significantly increases your chances of getting past the initial screening and reaching hiring managers."
          }
        },
        {
          "@type": "Question",
          "name": "How does HireLift improve my ATS score?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HireLift uses AI to analyze your resume against job descriptions, identifying missing keywords, formatting issues, and optimization opportunities. Our tool provides specific recommendations to improve keyword density, file format compatibility, and content structure to achieve an 85% or higher ATS pass rate."
          }
        },
        {
          "@type": "Question",
          "name": "Can I access HR contacts directly through HireLift?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, HireLift provides access to a curated database of HR contacts and hiring managers from top companies. This allows you to bypass traditional application processes and connect directly with decision-makers, increasing your response rate by up to 300%."
          }
        },
        {
          "@type": "Question",
          "name": "Is HireLift suitable for all career levels?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely! HireLift works for entry-level professionals, experienced candidates, and career changers. Our AI adapts recommendations based on your experience level and target role, ensuring relevant optimization strategies for everyone from fresh graduates to senior executives."
          }
        }
      ]
    };

    // Service Structured Data
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Resume ATS Optimization Service",
      "description": "AI-powered resume optimization service that improves ATS scores and provides direct HR contacts for faster job search success",
      "provider": {
        "@type": "Organization",
        "name": "HireLift"
      },
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "HireLift Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Free Resume ATS Analysis",
              "description": "Comprehensive analysis of your resume's ATS compatibility with actionable recommendations"
            },
            "price": "0",
            "priceCurrency": "INR"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "HireLift Proe",
              "description": "Unlimited resume optimization, HR contacts access, and interview templates"
            },
            "price": "99",
            "priceCurrency": "INR"
          }
        ]
      }
    };

    // Product Structured Data
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "HireLift Job Search Platform",
      "image": `${'https://www.hirelift.tech'}/logo.png`,
      "description": "AI-powered job search platform with resume optimization, ATS score analysis, and HR contacts database",
      "brand": {
        "@type": "Brand",
        "name": "HireLift"
      },
      "offers": {
        "@type": "Offer",
        "url": `${'https://www.hirelift.tech'}/pricing`,
        "priceCurrency": "USD",
        "price": "0",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150",
        "bestRating": "5"
      }
    };

    // Add schemas to head
    const addSchema = (schema, id) => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
      
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    };

    addSchema(faqSchema, 'faq-schema');
    addSchema(serviceSchema, 'service-schema');
    addSchema(productSchema, 'product-schema');

    return () => {
      // Cleanup on unmount
      ['faq-schema', 'service-schema', 'product-schema'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.remove();
      });
    };
  }, []);

  return null; // This component doesn't render anything visible
}

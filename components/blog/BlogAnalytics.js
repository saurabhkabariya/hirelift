'use client';

import { useEffect } from 'react';

export default function BlogAnalytics({ slug, title, category }) {
  useEffect(() => {
    // Track blog post views
    const trackView = () => {
      // Send analytics event (replace with your analytics service)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: title,
          page_location: window.location.href,
          content_group1: category,
          custom_parameter_1: slug
        });
      }
      
      // You can also send to other analytics services here
      console.log('Blog post viewed:', { slug, title, category });
    };

    // Track view after component mounts
    trackView();

    // Track time spent on page
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 10) { // Only track if user spent more than 10 seconds
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'scroll', {
            event_category: 'Blog Engagement',
            event_label: slug,
            value: timeSpent
          });
        }
        console.log('Time spent on blog post:', timeSpent, 'seconds');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [slug, title, category]);

  return null; // This component doesn't render anything
}

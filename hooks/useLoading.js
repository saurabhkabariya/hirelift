'use client';
import { useState, useCallback } from 'react';

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleRedirect = useCallback((url, delay = 1800) => {
    startLoading();
    
    setTimeout(() => {
      if (url.startsWith('#')) {
        // Handle smooth scroll for internal links
        const element = document.querySelector(url);
        if (element) {
          const headerHeight = 70;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
        // Stop loading after scroll animation completes
        setTimeout(() => {
          stopLoading();
        }, 800);
      } else {
        // Handle external redirects - loading will stop when page changes
        window.location.href = url;
      }
    }, delay);
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    startLoading,
    stopLoading,
    handleRedirect
  };
};

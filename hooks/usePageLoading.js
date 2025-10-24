'use client';

import { useLoading } from '@/contexts/LoadingContext';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

export const usePageLoading = () => {
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const navigatingRef = useRef(false);

  // Stop loading when pathname changes (route change complete)
  useEffect(() => {
    if (navigatingRef.current) {
      const timer = setTimeout(() => {
        stopLoading();
        navigatingRef.current = false;
      }, 300); // Small delay to ensure smooth transition

      return () => clearTimeout(timer);
    }
  }, [pathname, stopLoading]);

  const navigateWithLoading = useCallback((path, message = 'Loading...') => {
    // Don't start loading if we're already on the target path
    if (pathname === path) {
      return;
    }
    
    navigatingRef.current = true;
    startLoading(message);
    router.push(path);
  }, [startLoading, router, pathname]);

  const executeWithLoading = useCallback(async (asyncFunction, message = 'Processing...') => {
    try {
      startLoading(message);
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    startLoading,
    stopLoading,
    navigateWithLoading,
    executeWithLoading
  };
};
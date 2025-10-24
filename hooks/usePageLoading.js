'use client';

import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const usePageLoading = () => {
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();

  const navigateWithLoading = useCallback((path, message = 'Loading...') => {
    startLoading(message);
    router.push(path);
    // Loading will stop automatically when route changes
  }, [startLoading, router]);

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
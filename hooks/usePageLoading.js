'use client';

import { useLoading } from '@/contexts/LoadingContext';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

export const usePageLoading = () => {
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const navigatingRef = useRef(false);
  const loadingTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Track component mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clean up any pending timers on unmount
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    };
  }, []);

  // Stop loading when pathname changes (route change complete)
  useEffect(() => {
    // Clear any existing timer
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }

    if (navigatingRef.current) {
      // Small delay to ensure smooth transition
      loadingTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          stopLoading();
          navigatingRef.current = false;
        }
      }, 300);
    }

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    };
  }, [pathname, stopLoading]);

  const navigateWithLoading = useCallback((path, message = 'Loading...') => {
    // Don't start loading if we're already on the target path
    if (pathname === path) {
      return;
    }

    // Don't navigate if component is unmounted
    if (!isMountedRef.current) {
      return;
    }
    
    navigatingRef.current = true;
    startLoading(message);
    
    // Use try-catch to handle navigation errors
    try {
      router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
      if (isMountedRef.current) {
        stopLoading();
        navigatingRef.current = false;
      }
    }
  }, [startLoading, stopLoading, router, pathname]);

  const executeWithLoading = useCallback(async (asyncFunction, message = 'Processing...') => {
    if (!isMountedRef.current) {
      return;
    }

    try {
      startLoading(message);
      const result = await asyncFunction();
      return result;
    } catch (error) {
      console.error('Execute with loading error:', error);
      throw error;
    } finally {
      if (isMountedRef.current) {
        stopLoading();
      }
    }
  }, [startLoading, stopLoading]);

  return {
    startLoading,
    stopLoading,
    navigateWithLoading,
    executeWithLoading
  };
};
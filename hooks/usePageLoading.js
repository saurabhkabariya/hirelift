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
  const lastPathnameRef = useRef(pathname);

  // Track component mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clean up any pending timers on unmount and stop loading
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
      // Always stop loading on unmount to prevent stuck state
      if (navigatingRef.current) {
        stopLoading();
        navigatingRef.current = false;
      }
    };
  }, [stopLoading]);

  // Stop loading when pathname changes (route change complete)
  useEffect(() => {
    // Only process if pathname actually changed
    if (pathname !== lastPathnameRef.current) {
      lastPathnameRef.current = pathname;
      
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
        }, 200);
      }
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

    // If already navigating, stop previous loading first
    if (navigatingRef.current) {
      stopLoading();
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    }
    
    navigatingRef.current = true;
    startLoading(message);
    
    // Set a safety timeout in case navigation fails silently
    const safetyTimeout = setTimeout(() => {
      if (isMountedRef.current && navigatingRef.current) {
        console.warn('Navigation safety timeout triggered');
        stopLoading();
        navigatingRef.current = false;
      }
    }, 3000);
    
    // Use try-catch to handle navigation errors
    try {
      router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
      clearTimeout(safetyTimeout);
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

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 30000); // 30 second timeout

    try {
      startLoading(message);
      const result = await asyncFunction(abortController.signal);
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.warn('Execute with loading aborted');
      } else {
        console.error('Execute with loading error:', error);
      }
      throw error;
    } finally {
      if (isMountedRef.current) {
        stopLoading();
      } else {
        // Ensure loading stops even if unmounted
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
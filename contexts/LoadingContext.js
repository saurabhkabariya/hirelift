'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const loadingCountRef = useRef(0);
  const forceStopTimeoutRef = useRef(null);

  // Safety mechanism: force stop loading after 10 seconds
  useEffect(() => {
    if (isLoading && !forceStopTimeoutRef.current) {
      forceStopTimeoutRef.current = setTimeout(() => {
        console.warn('Loading forcefully stopped after 10 seconds');
        loadingCountRef.current = 0;
        setIsLoading(false);
        setLoadingMessage('');
        forceStopTimeoutRef.current = null;
      }, 10000);
    } else if (!isLoading && forceStopTimeoutRef.current) {
      clearTimeout(forceStopTimeoutRef.current);
      forceStopTimeoutRef.current = null;
    }

    return () => {
      if (forceStopTimeoutRef.current) {
        clearTimeout(forceStopTimeoutRef.current);
        forceStopTimeoutRef.current = null;
      }
    };
  }, [isLoading]);

  // Reset loading state when page becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isLoading) {
        // Check if loading has been stuck for more than 3 seconds
        const checkStuckTimeout = setTimeout(() => {
          if (loadingCountRef.current > 0) {
            console.warn('Loading was stuck, resetting...');
            loadingCountRef.current = 0;
            setIsLoading(false);
            setLoadingMessage('');
          }
        }, 3000);

        return () => clearTimeout(checkStuckTimeout);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isLoading]);

  const startLoading = useCallback((message = '') => {
    loadingCountRef.current += 1;
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
    
    if (loadingCountRef.current === 0) {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const forceStopLoading = useCallback(() => {
    loadingCountRef.current = 0;
    setIsLoading(false);
    setLoadingMessage('');
    if (forceStopTimeoutRef.current) {
      clearTimeout(forceStopTimeoutRef.current);
      forceStopTimeoutRef.current = null;
    }
  }, []);

  const value = {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    forceStopLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};
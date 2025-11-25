'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Global cache for trial status to avoid multiple API calls across components
let trialStatusCache = null;
let lastCacheTime = 0;
const CACHE_DURATION = 30000; // 30 seconds cache
let pendingRequest = null; // Prevent multiple simultaneous requests

export const useTrialStatus = () => {
  const { user, token, validateAndRefreshUser } = useAuth();
  const [trialStatus, setTrialStatus] = useState({
    hasClaimedTrial: false,
    isTrialActive: false,
    canClaimTrial: false,
    trialStartDate: null,
    trialEndDate: null,
    daysRemaining: 0,
    isExpired: false,
    loading: true,
    error: null
  });
  const [claimingTrial, setClaimingTrial] = useState(false);
  const retryTimeoutRef = useRef(null);

  // Check if cache is valid
  const isCacheValid = () => {
    return trialStatusCache && (Date.now() - lastCacheTime) < CACHE_DURATION;
  };

  // Clear any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, []);

  // Fetch trial status with caching and request deduplication
  const fetchTrialStatus = useCallback(async () => {
    if (!token || !user) {
      setTrialStatus(prev => ({ 
        ...prev, 
        loading: false,
        canClaimTrial: !!user && !user.hasClaimedTrial
      }));
      return;
    }

    // Return cached data if valid
    if (isCacheValid()) {
      console.log('🎯 Using cached trial status data');
      setTrialStatus({
        ...trialStatusCache,
        loading: false,
        error: null
      });
      return;
    }

    // If there's already a pending request, wait for it
    if (pendingRequest) {
      console.log('⏳ Waiting for pending trial status request');
      try {
        const cachedResult = await pendingRequest;
        setTrialStatus({
          ...cachedResult,
          loading: false,
          error: null
        });
        return;
      } catch (error) {
        // Continue with new request if pending one failed
      }
    }

    try {
      // Create a new request promise
      pendingRequest = fetch('/api/trial/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          // Cache the successful response
          trialStatusCache = data.trialStatus;
          lastCacheTime = Date.now();
          return data.trialStatus;
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      });

      const result = await pendingRequest;
      setTrialStatus({
        ...result,
        loading: false,
        error: null
      });

    } catch (error) {
      // Handle authentication errors with controlled retry
      if (error.message.includes('401') && !retryTimeoutRef.current) {
        try {
          const refreshSuccess = await validateAndRefreshUser();
          if (refreshSuccess) {
            // Retry once after token refresh with debounce
            retryTimeoutRef.current = setTimeout(() => {
              retryTimeoutRef.current = null;
              fetchTrialStatus();
            }, 1000);
            return;
          }
        } catch (refreshError) {
          // Silent handling of refresh errors
        }
      }

      // Set fallback state with user data (no error shown to user)
      setTrialStatus({
        hasClaimedTrial: user?.hasClaimedTrial || false,
        isTrialActive: user?.isTrialActive || false,
        canClaimTrial: !user?.hasClaimedTrial && !user?.isPremium,
        trialStartDate: user?.trialStartDate || null,
        trialEndDate: user?.trialEndDate || null,
        daysRemaining: user?.trialEndDate ? 
          Math.max(0, Math.ceil((new Date(user.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24))) : 0,
        isExpired: user?.trialEndDate ? new Date() >= new Date(user.trialEndDate) : false,
        loading: false,
        error: null // Don't show error to user, use fallback data
      });
    } finally {
      pendingRequest = null; // Clear pending request
    }
  }, [token, user, validateAndRefreshUser]);

  // Claim trial
  const claimTrial = useCallback(async () => {
    if (!token || claimingTrial) {
      return { success: false, error: 'Not authenticated or already claiming' };
    }
    
    setClaimingTrial(true);
    
    try {
      const response = await fetch('/api/trial/claim', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Clear cache to force fresh data
        trialStatusCache = null;
        lastCacheTime = 0;
        
        await fetchTrialStatus(); // Fetch updated status
        
        return {
          success: true,
          message: data.message || 'Trial activated successfully!',
          trialInfo: data.trialInfo
        };
      } else {
        setTrialStatus(prev => ({
          ...prev,
          error: data.error || 'Failed to claim trial'
        }));
        
        return {
          success: false,
          error: data.error || 'Failed to claim trial'
        };
      }
    } catch (error) {
      const errorMessage = 'Network error - please try again';
      setTrialStatus(prev => ({
        ...prev,
        error: errorMessage
      }));
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setClaimingTrial(false);
    }
  }, [token, claimingTrial, fetchTrialStatus]);

  // Initial fetch with debounced approach
  useEffect(() => {
    if (!user) return;
    
    // Debounce the initial fetch to prevent rapid calls
    const timeoutId = setTimeout(() => {
      fetchTrialStatus();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [user, token]); // Remove fetchTrialStatus from deps to prevent loops

  // Clear cache when user changes (logout/login)
  useEffect(() => {
    if (!user) {
      trialStatusCache = null;
      lastCacheTime = 0;
    }
  }, [user?.id]);

  return {
    hasClaimedTrial: trialStatus.hasClaimedTrial || false,
    isTrialActive: trialStatus.isTrialActive || false,
    canClaimTrial: trialStatus.canClaimTrial || false,
    trialStartDate: trialStatus.trialStartDate || null,
    trialEndDate: trialStatus.trialEndDate || null,
    daysRemaining: trialStatus.daysRemaining || 0,
    isExpired: trialStatus.isExpired || false,
    loading: trialStatus.loading !== undefined ? trialStatus.loading : true,
    error: trialStatus.error || null,
    claimTrial,
    claimingTrial,
    refetch: fetchTrialStatus
  };
};

// Helper function to clear cache manually if needed
export const clearTrialStatusCache = () => {
  trialStatusCache = null;
  lastCacheTime = 0;
  pendingRequest = null;
};
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

  // Fetch trial status
  const fetchTrialStatus = useCallback(async () => {
    if (!token || !user) {
      setTrialStatus(prev => ({ 
        ...prev, 
        loading: false,
        canClaimTrial: !!user && !user.hasClaimedTrial // Set basic state when no token
      }));
      return;
    }

    try {
      const response = await fetch('/api/trial/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTrialStatus({
          ...data.trialStatus,
          loading: false,
          error: null
        });
      } else {
        // Handle different error status codes
        let errorMessage = 'Failed to fetch trial status';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If we can't parse error response, use generic message
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        // Set fallback state for non-auth errors
        if (response.status === 401) {
          // Token expired or invalid - try to validate and refresh
          try {
            const refreshSuccess = await validateAndRefreshUser();
            if (refreshSuccess) {
              // Retry the request with refreshed token after a short delay
              setTimeout(() => fetchTrialStatus(), 500);
              return;
            } else {
              // Refresh failed - set fallback state with user data
              setTrialStatus({
                hasClaimedTrial: user?.hasClaimedTrial || false,
                isTrialActive: user?.isTrialActive || false,
                canClaimTrial: !user?.hasClaimedTrial && !user?.isPremium,
                trialStartDate: user?.trialStartDate || null,
                trialEndDate: user?.trialEndDate || null,
                daysRemaining: 0,
                isExpired: user?.trialEndDate ? new Date() >= new Date(user.trialEndDate) : false,
                loading: false,
                error: 'Session expired - please refresh the page'
              });
            }
          } catch (refreshError) {
            // Fallback to user data from context
            setTrialStatus({
              hasClaimedTrial: user?.hasClaimedTrial || false,
              isTrialActive: user?.isTrialActive || false,
              canClaimTrial: !user?.hasClaimedTrial && !user?.isPremium,
              trialStartDate: user?.trialStartDate || null,
              trialEndDate: user?.trialEndDate || null,
              daysRemaining: 0,
              isExpired: user?.trialEndDate ? new Date() >= new Date(user.trialEndDate) : false,
              loading: false,
              error: 'Authentication error - please refresh the page'
            });
          }
        } else {
          // Other errors - set safe defaults
          setTrialStatus(prev => ({
            hasClaimedTrial: user?.hasClaimedTrial || false,
            isTrialActive: false,
            canClaimTrial: !user?.hasClaimedTrial && !user?.isPremium,
            trialStartDate: null,
            trialEndDate: null,
            daysRemaining: 0,
            isExpired: false,
            loading: false,
            error: errorMessage
          }));
        }
      }
    } catch (error) {
      setTrialStatus(prev => ({
        hasClaimedTrial: user?.hasClaimedTrial || false,
        isTrialActive: false,
        canClaimTrial: !user?.hasClaimedTrial && !user?.isPremium,
        trialStartDate: null,
        trialEndDate: null,
        daysRemaining: 0,
        isExpired: false,
        loading: false,
        error: error.message || 'Network error'
      }));
    }
  }, [token, user, validateAndRefreshUser]);

  // Claim trial
  const claimTrial = useCallback(async () => {
    if (!token || claimingTrial) return { success: false, error: 'Invalid state' };

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
        // Refresh trial status
        await fetchTrialStatus();
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Failed to claim trial' };
      }
    } catch (error) {
      console.error('Error claiming trial:', error);
      return { success: false, error: error.message };
    } finally {
      setClaimingTrial(false);
    }
  }, [token, claimingTrial, fetchTrialStatus]);

  // Check if trial is about to expire (2 days or less)
  const isTrialNearExpiry = trialStatus.isTrialActive && trialStatus.daysRemaining <= 2 && trialStatus.daysRemaining > 0;

  // Check if trial just expired
  const isTrialJustExpired = trialStatus.isTrialActive && trialStatus.daysRemaining <= 0;

  // Refresh trial status periodically
  useEffect(() => {
    fetchTrialStatus();
    
    // Set up periodic refresh (every 5 minutes)
    const interval = setInterval(fetchTrialStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchTrialStatus]);

  return {
    trialStatus,
    claimTrial,
    claimingTrial,
    refetchTrialStatus: fetchTrialStatus,
    isTrialNearExpiry,
    isTrialJustExpired,
    // Helper computed values
    canShowClaimButton: trialStatus.canClaimTrial && !trialStatus.loading,
    shouldShowExpiryWarning: isTrialNearExpiry || isTrialJustExpired,
    trialDaysLeft: Math.max(0, trialStatus.daysRemaining)
  };
};
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

/**
 * AdUnit Component - Display Google AdSense ads
 * Only shows ads for non-premium users
 * 
 * @param {string} adSlot - AdSense ad slot ID
 * @param {string} adFormat - Ad format (auto, rectangle, horizontal, vertical)
 * @param {boolean} fullWidthResponsive - Whether ad should be full width responsive
 * @param {string} style - Additional inline styles
 */
export default function AdUnit({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  style = {}
}) {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Push ad after component mounts (only for non-premium users)
    if (!loading && (!user || !user.isPremium)) {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [loading, user]);

  // Don't show ads if user is premium or still loading
  if (loading || (user && user.isPremium)) {
    return null;
  }

  return (
    <div style={{ margin: '20px 0', textAlign: 'center', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7941545613699675"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}

// Predefined ad components for common placements

export function BannerAd({ adSlot = '1234567890' }) {
  return (
    <AdUnit
      adSlot={adSlot}
      adFormat="horizontal"
      fullWidthResponsive={true}
    />
  );
}

export function SidebarAd({ adSlot = '0987654321' }) {
  return (
    <AdUnit
      adSlot={adSlot}
      adFormat="vertical"
      fullWidthResponsive={false}
      style={{ maxWidth: '300px', margin: '20px auto' }}
    />
  );
}

export function InFeedAd({ adSlot = '1122334455' }) {
  return (
    <AdUnit
      adSlot={adSlot}
      adFormat="fluid"
      fullWidthResponsive={true}
    />
  );
}

export function InArticleAd({ adSlot = '5544332211' }) {
  return (
    <AdUnit
      adSlot={adSlot}
      adFormat="fluid"
      fullWidthResponsive={true}
      style={{ margin: '30px 0' }}
    />
  );
}

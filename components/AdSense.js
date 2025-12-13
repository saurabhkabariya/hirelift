'use client';

import { useAuth } from '@/contexts/AuthContext';
import Script from 'next/script';

export default function AdSense() {
  const { user, loading } = useAuth();

  // Don't show ads if:
  // 1. Still loading user data
  // 2. User is premium
  if (loading || (user && user.isPremium)) {
    return null;
  }

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7941545613699675"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
}

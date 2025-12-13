'use client';

import Script from 'next/script';

/**
 * AdSense Script Component
 * This script MUST be present on all pages for Google AdSense verification
 * Ad units themselves will check for premium status before displaying
 */
export default function AdSense() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7941545613699675"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

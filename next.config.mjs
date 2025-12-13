/** @type {import('next').NextConfig} */
const nextConfig = {
  // External packages configuration for Turbopack
  serverExternalPackages: ['pdf-parse', 'canvas'],
  
  // Turbopack configuration
  turbopack: {},

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['react-icons', 'framer-motion'],
  },
  
  // Optimize for SEO and performance
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=3600',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/resume-checker',
        destination: '/audit',
        permanent: true,
      },
      {
        source: '/ats-checker',
        destination: '/audit',
        permanent: true,
      },
    ];
  },

  // Generate static paths for better SEO
  trailingSlash: false,
};

export default nextConfig;

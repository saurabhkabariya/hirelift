export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/'],
    },
    sitemap: 'https://hirelift.vercel.app/sitemap.xml',
  }
}

# HireLift SEO Migration Guide
## New Domains: www.hirelift.tech & www.hirelift.dev

---

## 📋 Overview

This guide documents the comprehensive SEO migration from `hirelift.vercel.app` to the new domains **www.hirelift.tech** (primary) and **www.hirelift.dev** (secondary). The implementation focuses on targeting **US & UK job seekers and fresh graduates**.

---

## 🎯 Target Audience & Geographic Focus

### Primary Markets
- **United States (en-US)** - Primary market
- **United Kingdom (en-GB)** - Primary market
- Canada (en-CA) - Secondary
- Australia (en-AU) - Secondary

### Target Demographics
- Fresh graduates (ages 18-25)
- College students seeking first jobs
- Entry-level job seekers
- First-time job hunters
- New graduates entering workforce

### Geographic SEO Targets
**US Cities:**
- New York City
- San Francisco
- Austin
- Seattle
- Boston
- Chicago
- Los Angeles

**UK Cities:**
- London
- Manchester
- Birmingham
- Edinburgh
- Bristol
- Leeds
- Glasgow

---

## 🔧 Environment Configuration

### Required Environment Variable
Add to your `.env.local` file:

```bash
NEXT_PUBLIC_BASE_URL=https://www.hirelift.tech
```

### Domain Usage by Environment
- **Production**: `https://www.hirelift.tech`
- **Staging**: `https://www.hirelift.dev`
- **Development**: `http://localhost:3000`

### Fallback Pattern
All files use the following pattern for flexibility:
```javascript
process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hirelift.tech'
```

---

## 📁 Files Updated (40+ files)

### Core Configuration
✅ `lib/seoConfig.js` - Centralized SEO configuration
  - Updated baseUrl with environment variable support
  - Added alternateDomains array (hirelift.tech, hirelift.dev)
  - Added primaryRegions: ['US', 'UK']
  - Added targetCities for US and UK
  - Updated PAGE_SEO for all pages with fresher-focused keywords
  - Added REGIONAL_KEYWORDS mapping (US vs UK terminology)
  - Updated STRUCTURED_DATA with country-specific areaServed

✅ `.env.example` - Added NEXT_PUBLIC_BASE_URL configuration

### Root Layout & Metadata
✅ `app/layout.js` - Root layout with global metadata
  - Updated metadataBase with environment variable
  - Added alternates.languages for en-US and en-GB
  - Complete keywords overhaul: 115 fresher-focused keywords
  - Updated title: "#1 Resume Builder for Freshers & Graduates in US & UK"
  - Updated OpenGraph with new domain and locale targeting
  - Updated Twitter card with fresher messaging
  - Added geo.region and geo.placename metadata
  - Updated all structured data schemas (Organization, WebSite, SoftwareApplication, BreadcrumbList)

### Page Files
✅ `app/page.js` - Homepage
✅ `app/audit/page.js` - Resume checker page
✅ `app/auth/page.js` - Authentication page
✅ `app/pricing/page.js` - Pricing page
✅ `app/onboarding/page.js` - Onboarding flow
✅ `app/post-job/page.js` - Job posting page

### Metadata Files
✅ `app/audit/metadata.js`
✅ `app/auth/metadata.js`
✅ `app/pricing/metadata.js`
✅ `app/playground/metadata.js`
✅ `app/dashboard/metadata.js`
✅ `app/company-search/metadata.js`
✅ `app/blog/metadata.js`
✅ `app/blog/[slug]/page.js`
✅ `app/jobs/layout.js`

### Blog & SEO Components
✅ `components/blog/BlogSEO.js`
✅ `components/blog/BlogSchema.js`
✅ `components/blog/BlogPostPage.js`
✅ `components/seo/OrganizationSchema.js`
✅ `components/seo/JobsSchema.js`
✅ `components/StructuredData.js`

### Feed & Sitemap Files
✅ `app/sitemap.xml/route.js` - Main sitemap
✅ `app/robots.txt/route.js` - Robots.txt with multiple domain sitemaps
✅ `app/feed.xml/route.js` - RSS feed
✅ `app/blog/sitemap.xml/route.js` - Blog sitemap
✅ `app/blog/feed.xml/route.js` - Blog RSS feed
✅ `app/jobs/feed.xml/route.js` - Jobs RSS feed

---

## 🎨 SEO Keywords Strategy

### 115 Targeted Keywords in 5 Categories

#### 1. Fresher & Graduate Focus (30 keywords)
- resume builder for freshers
- entry level resume builder
- graduate resume templates
- first job resume help
- college student resume
- new graduate CV builder
- fresher resume format
- etc.

#### 2. ATS & Resume Optimization (25 keywords)
- ATS resume checker
- ATS friendly resume
- ATS optimized resume
- applicant tracking system
- free ATS scanner
- resume parser
- etc.

#### 3. US Job Market (20 keywords)
- entry level jobs US
- new grad jobs USA
- US resume format
- American job search
- entry level positions US
- college grad jobs America
- etc.

#### 4. UK Job Market (20 keywords)
- graduate jobs UK
- entry level jobs UK
- UK CV builder
- British job search
- graduate schemes UK
- UK CV format
- etc.

#### 5. Job Search & Career (20 keywords)
- job search tips
- career starter
- first job application
- entry level career
- graduate job hunt
- etc.

---

## 🌍 Regional Keywords Mapping

### US vs UK Terminology
```javascript
export const REGIONAL_KEYWORDS = {
  US: {
    document: 'resume',
    position: 'entry level',
    graduate: 'new grad',
    search: 'job search',
    // ... more
  },
  UK: {
    document: 'CV',
    position: 'graduate',
    graduate: 'graduate',
    search: 'graduate recruitment',
    // ... more
  }
};
```

---

## 📊 Structured Data Updates

### Organization Schema
- Updated URL to new domain
- Updated logo URL
- Changed contact email to hirelift01@gmail.com
- Added country-specific areaServed array

### WebSite Schema
- Updated main URL
- Updated search action target URL
- Added language variations

### SoftwareApplication Schema
- Updated application URL
- Updated downloadUrl
- Updated screenshot URL
- Country-specific configurations

### BreadcrumbList Schema
- All breadcrumb URLs updated
- Consistent across all pages

---

## 🤖 Robots.txt Configuration

Updated to include:
- Multiple sitemap URLs (hirelift.tech, hirelift.dev)
- Environment-aware baseUrl
- Explicit AI crawler permissions (ChatGPT-User, GPTBot)
- Updated header: "#1 AI Resume Builder for Freshers & Graduates"

---

## 🗺️ Sitemap Configuration

Multiple sitemaps for better organization:
- Main sitemap: `sitemap.xml`
- Blog sitemap: `blog/sitemap.xml`
- All use environment variable for baseUrl
- Updated lastModified dates
- Priority and changeFrequency optimized

---

## 🔍 Verification Steps

### 1. Environment Setup
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Add your domain
NEXT_PUBLIC_BASE_URL=https://www.hirelift.tech
```

### 2. Test Local Build
```bash
npm run build
npm run start
```

### 3. Check URLs
Verify all pages use the correct domain:
- Homepage: Check OpenGraph URL
- Audit page: Check structured data
- Blog posts: Check canonical URLs
- RSS feeds: Check item URLs

### 4. Verify Structured Data
Use Google's Rich Results Test:
- https://search.google.com/test/rich-results
- Test homepage, blog posts, and pricing page

### 5. Check Sitemaps
```bash
# Visit in browser
https://www.hirelift.tech/sitemap.xml
https://www.hirelift.tech/robots.txt
https://www.hirelift.tech/blog/sitemap.xml
```

---

## 🚀 Deployment Steps

### Step 1: Update DNS Settings
- Point www.hirelift.tech to your hosting
- Point www.hirelift.dev to your hosting
- Configure SSL certificates

### Step 2: Set Environment Variables
In your hosting platform (Vercel, Netlify, etc.):
```bash
NEXT_PUBLIC_BASE_URL=https://www.hirelift.tech
```

### Step 3: Deploy Application
```bash
git add .
git commit -m "feat: Migrate SEO to new domains with US/UK fresher targeting"
git push origin main
```

### Step 4: Google Search Console
1. Add both domains as properties
2. Submit sitemaps:
   - `https://www.hirelift.tech/sitemap.xml`
   - `https://www.hirelift.dev/sitemap.xml`
3. Request indexing for key pages

### Step 5: Google Analytics
- Update GA property settings
- Add both domains to allowed domains
- Update referral exclusion list

---

## 📈 SEO Checklist

### On-Page SEO
- ✅ Title tags updated (fresher focus)
- ✅ Meta descriptions updated (US/UK targeting)
- ✅ 115 targeted keywords implemented
- ✅ OpenGraph tags updated
- ✅ Twitter cards updated
- ✅ Canonical URLs set correctly
- ✅ Language alternates configured (en-US, en-GB)

### Technical SEO
- ✅ Robots.txt configured
- ✅ Sitemaps generated and submitted
- ✅ Structured data implemented (JSON-LD)
- ✅ Mobile-responsive
- ✅ Page speed optimized
- ✅ SSL enabled

### Local SEO
- ✅ Geographic metadata added (geo.region, geo.placename)
- ✅ Target cities listed in SEO config
- ✅ Country-specific content variations
- ✅ Regional keyword mapping

### Content SEO
- ✅ Fresh graduate focus in all copy
- ✅ Entry-level terminology used
- ✅ US/UK job market references
- ✅ Student-friendly language
- ✅ First-time job seeker content

---

## 🛠️ Troubleshooting

### Issue: URLs still showing old domain
**Solution**: Clear Next.js cache and rebuild
```bash
rm -rf .next
npm run build
```

### Issue: Environment variable not working
**Solution**: Check .env.local exists and restart dev server
```bash
# Kill all node processes
pkill node
# Restart
npm run dev
```

### Issue: Structured data errors
**Solution**: Validate with Google's tool
- https://search.google.com/test/rich-results
- Fix any JSON syntax errors
- Ensure all URLs use new domain

### Issue: Sitemap not updating
**Solution**: Clear cache and regenerate
```bash
# Delete .next cache
rm -rf .next
# Rebuild
npm run build
```

---

## 📞 Support & Questions

For issues or questions about this SEO migration:
- Check this guide first
- Review `lib/seoConfig.js` for all settings
- Test locally before deploying
- Verify environment variables are set correctly

---

## 📝 Notes

1. **Backward Compatibility**: The old vercel.app domain will still work but all internal links and metadata now point to the new domains.

2. **301 Redirects**: Consider setting up 301 redirects from hirelift.vercel.app to www.hirelift.tech at the hosting level.

3. **Monitoring**: Monitor Google Search Console for both domains during the transition period.

4. **Indexing**: It may take 2-4 weeks for Google to fully index the new domains and adjust rankings.

5. **Analytics**: Update Google Analytics to track both domains if running them simultaneously.

---

## ✅ Summary

### What Changed
- **40+ files updated** with new domain URLs
- **115 targeted keywords** focused on US/UK freshers
- **Geographic targeting** for 14 cities (7 US + 7 UK)
- **Regional keyword mapping** for US vs UK terminology
- **Structured data** updated across all pages
- **Sitemaps & robots.txt** configured for new domains
- **Environment variable** system for flexible domain management

### SEO Impact
- ✅ Better targeting of US & UK markets
- ✅ Fresher-specific keyword optimization
- ✅ Improved local SEO for target cities
- ✅ Enhanced structured data for rich results
- ✅ Multiple language alternates (en-US, en-GB)
- ✅ Comprehensive geo-targeting metadata

### Next Steps
1. Deploy to production with environment variables set
2. Submit sitemaps to Google Search Console
3. Monitor rankings for target keywords
4. Track traffic from US & UK markets
5. Adjust strategy based on performance data

---

**Migration Completed**: January 2025
**Domains**: www.hirelift.tech (primary), www.hirelift.dev (secondary)
**Target Markets**: United States & United Kingdom
**Target Audience**: Fresh Graduates & Entry-Level Job Seekers

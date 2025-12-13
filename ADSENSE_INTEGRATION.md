# Google AdSense Integration

Google AdSense has been integrated across the HireLift platform with premium user detection.

## Features
- ✅ Automatically hides ads for premium users (`user.isPremium === true`)
- ✅ Shows ads only to free users
- ✅ Script loads after page interaction for better performance
- ✅ Multiple ad formats available

## Components

### 1. AdSense (Core Script Loader)
Location: `components/AdSense.js`

Loads the AdSense script only for non-premium users.
Already integrated in `app/layout.js`.

### 2. AdUnit (Reusable Ad Component)
Location: `components/AdUnit.js`

**Basic Usage:**
```jsx
import AdUnit from '@/components/AdUnit';

<AdUnit 
  adSlot="YOUR_AD_SLOT_ID"
  adFormat="auto"
  fullWidthResponsive={true}
/>
```

**Predefined Components:**

```jsx
import { BannerAd, SidebarAd, InFeedAd, InArticleAd } from '@/components/AdUnit';

// Banner ad (horizontal, full width)
<BannerAd adSlot="1234567890" />

// Sidebar ad (vertical, 300px max width)
<SidebarAd adSlot="0987654321" />

// In-feed ad (fluid, responsive)
<InFeedAd adSlot="1122334455" />

// In-article ad (fluid, 30px margin)
<InArticleAd adSlot="5544332211" />
```

## Ad Placement Examples

### Homepage
```jsx
// app/page.js
import { BannerAd, InFeedAd } from '@/components/AdUnit';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BannerAd adSlot="YOUR_SLOT_ID" />
      
      <ToolkitSection />
      <InFeedAd adSlot="YOUR_SLOT_ID" />
      
      <FeaturesSection />
    </>
  );
}
```

### Blog Post
```jsx
// app/blog/[slug]/page.js
import { InArticleAd, SidebarAd } from '@/components/AdUnit';

export default function BlogPost() {
  return (
    <div className="flex">
      <article>
        <h1>Blog Title</h1>
        <InArticleAd adSlot="YOUR_SLOT_ID" />
        <p>Content...</p>
      </article>
      
      <aside>
        <SidebarAd adSlot="YOUR_SLOT_ID" />
      </aside>
    </div>
  );
}
```

### Audit/Pricing Pages
```jsx
// app/audit/page.js
import { BannerAd } from '@/components/AdUnit';

export default function AuditPage() {
  return (
    <>
      <BannerAd adSlot="YOUR_SLOT_ID" />
      <AuditForm />
    </>
  );
}
```

## Getting Ad Slot IDs

1. Go to [Google AdSense](https://adsense.google.com/)
2. Navigate to **Ads** → **By ad unit**
3. Create new ad units for different placements
4. Copy the `data-ad-slot` ID for each unit
5. Replace placeholder IDs in the code

## Ad Formats

- `auto` - Responsive, adapts to available space
- `horizontal` - Banner-style ads
- `vertical` - Sidebar/tower ads
- `fluid` - In-feed and in-article ads
- `rectangle` - Fixed rectangular ads

## Premium User Logic

Ads are hidden when:
- `user.isPremium === true`
- User data is still loading

Ads are shown when:
- User is not logged in
- User is logged in but not premium

## Environment Variables

No additional environment variables needed. The AdSense client ID is hardcoded:
```
ca-pub-7941545613699675
```

## Testing

**Test as Free User:**
1. Sign out or use incognito mode
2. Navigate to any page
3. Ads should be visible

**Test as Premium User:**
1. Log in with premium account
2. Navigate to any page
3. Ads should NOT be visible

## Performance

- Script loads with `strategy="afterInteractive"` (after page is interactive)
- No impact on initial page load
- Lazy loading for better performance

## Compliance

- crossOrigin="anonymous" for CORS compliance
- Responsive ads for mobile optimization
- Non-intrusive placement

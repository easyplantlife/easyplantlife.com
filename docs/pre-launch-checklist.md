# Pre-Launch Checklist

This document outlines all requirements that must be verified before launching Easy Plant Life.

## Automated Verification

The following items are automatically tested in `src/__tests__/app/pre-launch-checklist.test.ts`:

### Critical Files
- [x] 404 Not Found page (`/app/not-found.tsx`)
- [x] Sitemap (`/app/sitemap.ts`)
- [x] Robots.txt (`/app/robots.ts`)

### Social Preview
- [x] Open Graph image generator (`/app/opengraph-image.tsx`)
- [x] Apple touch icon (`/app/apple-icon.tsx`)
- [x] Favicon (`/app/favicon.ico`)

### Metadata Configuration
- [x] Default title and description
- [x] metadataBase for absolute URLs
- [x] Open Graph configuration
- [x] Twitter card configuration

### Core Functionality
- [x] Google Analytics component
- [x] Newsletter API route and page
- [x] Contact form API route and page
- [x] All public pages exist (Home, About, Books, Blog, Newsletter, Contact)

### Environment Variables
- [x] `.env.example` documents all required variables

## Manual Verification Required

The following items require manual verification in the production environment:

### Infrastructure
- [ ] Domain configured - `easyplantlife.com` DNS points to hosting provider
- [ ] SSL certificate active - HTTPS works without browser warnings
- [ ] CDN configured for optimal performance (if applicable)

### Production Environment Variables

Set these in your production environment (Vercel, Netlify, etc.):

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID (G-XXXXXXXXXX) | Yes |
| `RESEND_API_KEY` | Resend API key for sending emails | Yes |
| `RESEND_AUDIENCE_ID` | Resend audience ID for newsletter subscribers | Yes |
| `MEDIUM_PUBLICATION_URL` | Medium publication URL for blog posts | Yes |

### Functional Tests (Production)
- [ ] Newsletter signup works - submit a real email and verify it appears in Resend audience
- [ ] Contact form works - submit form and verify email is received
- [ ] Google Analytics tracks - check GA4 real-time view for page loads
- [ ] Blog posts load - verify Medium RSS feed is fetched correctly

### Social Sharing Verification

Test social preview with these tools:
- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) - shows correct OG image and description
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator) - shows correct card preview
- [ ] [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) - shows correct preview

### SEO Verification
- [ ] Google Search Console connected and site verified
- [ ] Sitemap submitted to Google Search Console (`https://easyplantlife.com/sitemap.xml`)
- [ ] No crawl errors after initial indexing

### Browser Compatibility
- [ ] Works in Chrome (latest)
- [ ] Works in Firefox (latest)
- [ ] Works in Safari (latest)
- [ ] Works in Edge (latest)
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome

### Accessibility
- [ ] Keyboard navigation works on all pages
- [ ] Screen reader tested (VoiceOver/NVDA)
- [ ] Sufficient color contrast verified

### Legal (If Required)
- [ ] Privacy Policy page (if collecting personal data beyond what's necessary)
- [ ] Terms of Service page (if needed)

Note: For a simple brand/content site with standard newsletter signup and contact form,
minimal legal pages may be needed. Consult with legal counsel if unsure.

## Post-Launch Checklist

After launching, verify these items:

- [ ] All pages load without errors in production
- [ ] Monitor error tracking for first 24-48 hours
- [ ] Verify first newsletter signups are working
- [ ] Check Google Analytics for traffic data
- [ ] Monitor performance metrics (Core Web Vitals)

## Running Automated Tests

```bash
# Run pre-launch checklist tests
npm test -- src/__tests__/app/pre-launch-checklist.test.ts

# Run all tests
npm test
```

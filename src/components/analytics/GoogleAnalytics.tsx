/**
 * Google Analytics 4 Integration Component
 *
 * Loads GA4 tracking scripts for production environments only.
 * Respects user privacy by not collecting personally identifiable information.
 *
 * Usage: Add to root layout to track page views across all pages.
 */

import Script from "next/script";

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const isProduction = process.env.NODE_ENV === "production";

  // Only load analytics in production with a valid measurement ID
  if (!isProduction || !measurementId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics gtag.js */}
      <Script
        id="ga-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      {/* GA4 Configuration */}
      <Script
        id="ga-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `,
        }}
      />
    </>
  );
}

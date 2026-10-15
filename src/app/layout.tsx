import type { Metadata, Viewport } from "next";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider, ThemeScript } from "@/components/theme";
import { siteConfig } from "@/content/site";
import { DEFAULT_SOCIAL_IMAGE, FEED_ALTERNATES } from "@/lib/seo";
import { bodyFont, headingFont } from "./fonts";
import "./globals.css";

/**
 * Site-wide default metadata configuration
 *
 * These defaults apply to all pages unless overridden:
 * - Title template: "Page Title | Easy Plant Life"
 * - Default description for brand messaging
 * - Open Graph defaults for social sharing
 * - Twitter card configuration
 * - RSS feed discovery and large image previews for search
 * - Favicon and Apple touch icon
 */
const defaultTitle = siteConfig.name;
const defaultDescription =
  "A calm approach to plant-based living. Simple, sustainable guidance without complexity or perfection.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: defaultDescription,
  applicationName: siteConfig.name,
  keywords: [
    "plant-based",
    "vegan",
    "simple living",
    "sustainable",
    "lifestyle",
    "Easy Plant Life",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "food",
  alternates: { types: FEED_ALTERNATES },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    title: defaultTitle,
    description: defaultDescription,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [DEFAULT_SOCIAL_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon.svg", type: "image/svg+xml" },
      { url: "/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
  manifest: "/favicons/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the theme init script sets data-theme on
    // <html> before hydration, which React would otherwise flag as a mismatch.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${headingFont.variable} ${bodyFont.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeScript />
        <GoogleAnalytics />
        <ThemeProvider>
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

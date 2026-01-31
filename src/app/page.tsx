import type { Metadata } from "next";
import { Hero, NewsletterCTA, SecondaryCTAs } from "@/components/home";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

/**
 * Home Page SEO Metadata
 *
 * Configures title, description, Open Graph, and Twitter card metadata
 * for optimal search engine and social media presentation.
 */
export const metadata: Metadata = {
  title: "Easy Plant Life — A Calm Approach to Plant-Based Living",
  description:
    "Easy Plant Life is about living vegan without turning it into a project. Simple, sustainable, calm guidance for a plant-based lifestyle.",
  keywords: [
    "plant-based",
    "vegan",
    "simple living",
    "sustainable",
    "lifestyle",
  ],
  openGraph: {
    title: "Easy Plant Life — A Calm Approach to Plant-Based Living",
    description:
      "Simple, sustainable, calm guidance for a plant-based lifestyle. No complexity, no perfection—just easy living.",
    type: "website",
    siteName: "Easy Plant Life",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Easy Plant Life — A Calm Approach to Plant-Based Living",
    description:
      "Simple, sustainable, calm guidance for a plant-based lifestyle.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Home Page
 *
 * The main landing page for Easy Plant Life. Designed to communicate
 * the brand in under 30 seconds with a calm, intentional design.
 *
 * Structure:
 * 1. Hero Section - Brand name, tagline, brief explanation
 * 2. Newsletter CTA - Primary conversion goal
 * 3. Secondary CTAs - Links to Blog and Books
 *
 * Design principles:
 * - Single scroll or near single-scroll on desktop
 * - Generous white space
 * - No unnecessary sections
 * - Responsive on all devices
 */
export default function Home() {
  return (
    <main className="bg-background">
      {/* JSON-LD Structured Data for SEO */}
      <OrganizationJsonLd />
      <WebSiteJsonLd />

      {/* Hero Section - First impression and brand message */}
      <Hero />

      {/* Newsletter CTA - Primary conversion goal */}
      <NewsletterCTA />

      {/* Secondary CTAs - Additional navigation to content */}
      <SecondaryCTAs />
    </main>
  );
}

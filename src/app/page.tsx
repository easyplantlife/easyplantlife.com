import { Hero, NewsletterCTA, SecondaryCTAs } from "@/components/home";

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
      {/* Hero Section - First impression and brand message */}
      <Hero />

      {/* Newsletter CTA - Primary conversion goal */}
      <NewsletterCTA />

      {/* Secondary CTAs - Additional navigation to content */}
      <SecondaryCTAs />
    </main>
  );
}

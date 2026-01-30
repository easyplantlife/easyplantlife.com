import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { AboutContent } from "@/components/about";

export const metadata: Metadata = {
  title: "About | Easy Plant Life",
  description:
    "Learn about Easy Plant Life and our calm approach to living with plants.",
  openGraph: {
    title: "About | Easy Plant Life",
    description:
      "Discover the philosophy behind Easy Plant Life—a calm, honest approach to plant-based living without the pressure or perfection.",
    type: "website",
    siteName: "Easy Plant Life",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Easy Plant Life",
    description:
      "Discover the philosophy behind Easy Plant Life—a calm approach to plant-based living.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * About Page
 *
 * Explains the Easy Plant Life brand philosophy through three sections:
 * 1. Why Easy Plant Life exists
 * 2. What we believe
 * 3. What we're not
 *
 * Design principles:
 * - Calm, honest, non-authoritative tone
 * - Simple single-column layout for readability
 * - Generous white space between sections
 * - No complex grid layouts or cards
 */
export default function AboutPage() {
  return (
    <PageLayout title="About">
      <AboutContent />
    </PageLayout>
  );
}

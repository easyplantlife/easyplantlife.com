import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { NewsletterContent } from "@/components/newsletter";

export const metadata: Metadata = {
  title: "Newsletter | Easy Plant Life",
  description:
    "Subscribe to thoughtful updates on calm, plant-based living. Simple ideas for bringing nature into your everyday life.",
  openGraph: {
    title: "Newsletter | Easy Plant Life",
    description:
      "Join our newsletter for thoughtful updates on calm, plant-based living. Simple ideas, no pressure—just easy ways to connect with nature.",
    type: "website",
    siteName: "Easy Plant Life",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Newsletter | Easy Plant Life",
    description:
      "Thoughtful updates on calm, plant-based living. Simple ideas for bringing nature into your everyday life.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Newsletter Page
 *
 * A dedicated newsletter signup page with a calm value proposition
 * and prominent signup form.
 *
 * Design principles:
 * - One-sentence value proposition (no hype)
 * - Prominent newsletter form
 * - No frequency pressure
 * - Calm, honest tone per brand guidelines
 */
export default function NewsletterPage() {
  return (
    <PageLayout title="Newsletter">
      <NewsletterContent />
    </PageLayout>
  );
}

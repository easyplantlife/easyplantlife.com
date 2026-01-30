import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { NewsletterContent } from "@/components/newsletter";

export const metadata: Metadata = {
  title: "Newsletter | Easy Plant Life",
  description: "Subscribe to our newsletter for plant tips and updates.",
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

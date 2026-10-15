import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { NewsletterContent } from "@/components/newsletter";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Newsletter",
  description:
    "An occasional email on calm, plant-based living. New posts and the odd idea, only when there is something worth sending. No schedule.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <PageLayout
      variant="narrow"
      eyebrow="Newsletter"
      title="Occasional notes on easy plant-based living."
      lead="One email when there is something worth sharing. No schedule, no series, no sales funnel."
    >
      <NewsletterContent />
    </PageLayout>
  );
}

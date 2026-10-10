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

export default function AboutPage() {
  return (
    <PageLayout
      eyebrow="About"
      title="Living vegan does not need to feel like a project."
      lead="Somewhere along the way, a simple choice turned into something complicated. Rules to follow, recipes to perfect, pressure to optimize. This site is the quieter alternative."
    >
      <AboutContent />
    </PageLayout>
  );
}

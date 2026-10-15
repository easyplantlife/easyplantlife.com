import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { AboutContent } from "@/components/about";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "The philosophy behind Easy Plant Life: a calm, honest approach to plant-based living, without pressure, rules or perfection.",
  path: "/about",
});

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

import type { Metadata } from "next";
import {
  BooksPreview,
  Hero,
  IdeaSection,
  RecentWriting,
  RECENT_WRITING_LIMIT,
} from "@/components/home";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { getAllPosts } from "@/lib/blog/posts";

/**
 * Home Page SEO Metadata
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
 * 1. Hero - headline, promise and the newsletter form
 * 2. The idea - the brand values as one statement
 * 3. Recent writing - the three newest posts
 * 4. Books - both books, cover first
 */
export default function Home() {
  const posts = getAllPosts().slice(0, RECENT_WRITING_LIMIT);

  return (
    <main className="min-h-full bg-ground">
      <OrganizationJsonLd />
      <WebSiteJsonLd />

      <Hero />
      <IdeaSection />
      <RecentWriting posts={posts} />
      <BooksPreview />
    </main>
  );
}

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
import { pageMetadata } from "@/lib/seo";

/**
 * Home Page SEO Metadata
 */
export const metadata: Metadata = pageMetadata({
  title: "Easy Plant Life — A Calm Approach to Plant-Based Living",
  absoluteTitle: true,
  description:
    "Easy Plant Life is about living vegan without turning it into a project. Simple, calm writing and books on plant-based eating that fits ordinary days.",
  path: "/",
  keywords: [
    "plant-based living",
    "easy vegan",
    "vegan for beginners",
    "simple vegan meals",
    "vegan habits",
    "Easy Plant Life",
  ],
});

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

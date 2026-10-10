import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import { PreferEmail } from "@/components/blog/PreferEmail";
import { getAllPosts } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Blog | Easy Plant Life",
  description:
    "Short pieces on plant-based living that fits real life: habits, food, and the quiet parts nobody talks about.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <PageLayout
      eyebrow="Blog"
      title="Short pieces on easy plant-based living."
      lead="Published here, when there is something worth saying. No schedule."
    >
      <p data-testid="blog-intro" className="mb-2 font-sans text-sm text-faint">
        Newest first
      </p>

      <BlogPostsList
        posts={posts}
        headingLevel={2}
        showThumbnails
        data-testid="blog-posts-list"
      />

      <PreferEmail />
    </PageLayout>
  );
}

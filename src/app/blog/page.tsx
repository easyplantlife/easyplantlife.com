import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import { PreferEmail } from "@/components/blog/PreferEmail";
import { BlogJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getAllPosts } from "@/lib/blog/posts";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description:
    "Short pieces on easy plant-based living that fits real life: simple vegan meals, habits, groceries, and the quiet parts nobody talks about.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <PageLayout
      eyebrow="Blog"
      title="Short pieces on easy plant-based living."
      lead="Published here, when there is something worth saying. No schedule."
    >
      <BlogJsonLd posts={posts} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />

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

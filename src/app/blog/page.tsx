import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import { fetchMediumPosts } from "@/lib/api/medium";
import type { BlogPost } from "@/lib/types/blog";

export const metadata: Metadata = {
  title: "Blog | Easy Plant Life",
  description:
    "Read our latest articles about plant care and living with plants.",
};

/**
 * Converts Medium posts to the BlogPost format used by components.
 */
function convertToBlogPost(mediumPost: {
  title: string;
  excerpt: string;
  url: string;
  publishedDate: Date;
  thumbnail?: string;
}): BlogPost {
  return {
    title: mediumPost.title,
    excerpt: mediumPost.excerpt,
    url: mediumPost.url,
    publishedDate: mediumPost.publishedDate,
    thumbnail: mediumPost.thumbnail,
  };
}

/**
 * Blog Page
 *
 * Displays blog posts fetched from Medium via RSS feed.
 * Posts are displayed as preview cards that link to the full
 * articles on Medium.
 *
 * Design principles:
 * - Calm, honest presentation of content
 * - Clear indication that posts link to Medium
 * - Responsive layout for all devices
 * - Graceful error handling for failed fetches
 */
export default async function BlogPage() {
  let posts: BlogPost[] = [];
  let error: string | undefined;

  try {
    const mediumPosts = await fetchMediumPosts({
      username: process.env.MEDIUM_USERNAME || "easyplantlife",
      maxPosts: 10,
    });
    posts = mediumPosts.map(convertToBlogPost);
  } catch {
    error = "Unable to load blog posts. Please try again later.";
  }

  return (
    <PageLayout title="Blog">
      <p
        data-testid="blog-intro"
        className="mb-12 text-lg text-text-secondary"
      >
        Our latest thoughts on plant care and living with nature. These articles
        are published on Medium—click any post to read the full article there.
      </p>
      <BlogPostsList
        posts={posts}
        error={error}
        data-testid="blog-posts-list"
      />
    </PageLayout>
  );
}

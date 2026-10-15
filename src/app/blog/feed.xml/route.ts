import { buildRssFeed } from "@/lib/blog/feed";
import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";
import type { BlogPostContent } from "@/lib/types/blog";

/** Rendered once at build time, like the posts themselves. */
export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts()
    .map((post) => getPostBySlug(post.slug))
    .filter((post): post is BlogPostContent => post !== null);

  return new Response(buildRssFeed(posts), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

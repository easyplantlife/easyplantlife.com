import type { HTMLAttributes } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { BlogPost } from "@/lib/types/blog";
import { cn } from "@/lib/utils";
import { BlogPostsList } from "./BlogPostsList";

export interface RelatedPostsProps extends HTMLAttributes<HTMLElement> {
  posts: BlogPost[];
}

/**
 * RelatedPosts
 *
 * A short hairline list under a post: a few more pieces on the same
 * subjects, so a reader who got to the end has somewhere calm to go next.
 * Renders nothing when there is nothing else to read.
 */
export function RelatedPosts({
  posts,
  className = "",
  ...props
}: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="related-posts-title"
      data-testid="related-posts"
      className={cn("mt-20", className)}
      {...props}
    >
      <SectionHeader
        eyebrow="Keep reading"
        title="More on the same idea"
        titleId="related-posts-title"
      />
      <BlogPostsList posts={posts} headingLevel={3} />
    </section>
  );
}

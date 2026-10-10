import type { HTMLAttributes } from "react";
import { Text } from "@/components/ui/Text";
import type { BlogPost } from "@/lib/types/blog";
import { cn } from "@/lib/utils";
import { BlogPostRow } from "./BlogPostRow";

export interface BlogPostsListProps extends HTMLAttributes<HTMLElement> {
  posts: BlogPost[];
  isLoading?: boolean;
  /** Message shown instead of the list when the feed failed to load. */
  error?: string;
  /** Show at most this many posts. */
  limit?: number;
  headingLevel?: 2 | 3;
}

/**
 * BlogPostsList
 *
 * Hairline list of posts with calm loading, error and empty states.
 */
export function BlogPostsList({
  posts,
  isLoading = false,
  error,
  limit,
  headingLevel = 2,
  className = "",
  ...props
}: BlogPostsListProps) {
  if (isLoading) {
    return (
      <div role="status" aria-live="polite" className={className} {...props}>
        <Text color="secondary">Loading posts…</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className={className} {...props}>
        <Text color="secondary">{error}</Text>
      </div>
    );
  }

  const visible = typeof limit === "number" ? posts.slice(0, limit) : posts;

  if (visible.length === 0) {
    return (
      <div className={className} {...props}>
        <Text color="secondary">
          Nothing published yet. New writing appears here as it is written.
        </Text>
      </div>
    );
  }

  return (
    <ul
      aria-label="Blog posts"
      className={cn("flex flex-col border-b border-line", className)}
      {...props}
    >
      {visible.map((post) => (
        <li key={post.url}>
          <BlogPostRow post={post} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}

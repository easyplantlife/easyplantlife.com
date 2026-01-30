import type { HTMLAttributes } from "react";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Text } from "@/components/ui/Text";
import type { BlogPost } from "@/lib/types/blog";

export interface BlogPostsListProps extends HTMLAttributes<HTMLElement> {
  /** Array of blog posts to display */
  posts: BlogPost[];
  /** Whether posts are currently loading */
  isLoading?: boolean;
  /** Error message to display */
  error?: string;
}

/**
 * BlogPostsList Component
 *
 * Displays a list of blog posts with support for loading, empty, and error states.
 * Uses semantic list markup and BlogPostCard components for each post.
 *
 * @example
 * ```tsx
 * <BlogPostsList posts={posts} />
 * <BlogPostsList posts={[]} isLoading />
 * <BlogPostsList posts={[]} error="Failed to load posts" />
 * ```
 */
export function BlogPostsList({
  posts,
  isLoading = false,
  error,
  className = "",
  ...props
}: BlogPostsListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div role="status" aria-live="polite" className={className} {...props}>
        <Text color="secondary">Loading posts...</Text>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div role="alert" className={className} {...props}>
        <Text color="secondary">{error}</Text>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className={className} {...props}>
        <Text color="secondary">No posts available yet. Check back soon!</Text>
      </div>
    );
  }

  // Posts list
  return (
    <ul
      aria-label="Blog posts"
      className={`space-y-8 ${className}`.trim()}
      {...props}
    >
      {posts.map((post) => (
        <li key={post.url}>
          <BlogPostCard post={post} />
        </li>
      ))}
    </ul>
  );
}

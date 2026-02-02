import Image from "next/image";
import type { HTMLAttributes } from "react";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { BlogPost } from "@/lib/types/blog";

export interface BlogPostCardProps extends HTMLAttributes<HTMLElement> {
  /** The blog post data to display */
  post: BlogPost;
}

/**
 * Formats a date for display
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a date for the datetime attribute (YYYY-MM-DD)
 */
function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * BlogPostCard Component
 *
 * Displays a blog post preview card with title, excerpt, publication date,
 * and link to the full article on Medium. Links open in a new tab with
 * proper accessibility indicators.
 *
 * @example
 * ```tsx
 * <BlogPostCard post={post} />
 * ```
 */
export function BlogPostCard({
  post,
  className = "",
  ...props
}: BlogPostCardProps) {
  const { title, excerpt, url, publishedDate, thumbnail, readTime } = post;

  return (
    <Card
      as="article"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group ${className}`.trim()}
      {...props}
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <div className="min-w-0 flex-1 space-y-3">
          <Heading
            level={3}
            className="group-hover:text-primary transition-colors"
          >
            {title}
          </Heading>

          <Text color="secondary" className="line-clamp-3">
            {excerpt}
          </Text>

          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <time dateTime={formatDateISO(publishedDate)}>
              {formatDate(publishedDate)}
            </time>
            {readTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{readTime} min read</span>
              </>
            )}
          </div>
        </div>

        {thumbnail && (
          <div className="shrink-0 overflow-hidden rounded">
            <Image
              src={thumbnail}
              alt=""
              width={224}
              height={168}
              className="h-32 w-44 object-cover sm:h-40 sm:w-64"
            />
          </div>
        )}
      </div>
      <span className="sr-only">(opens in new tab)</span>
    </Card>
  );
}

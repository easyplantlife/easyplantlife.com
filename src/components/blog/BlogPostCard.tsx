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
      className={className}
      image={
        thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            width={400}
            height={225}
            className="h-auto w-full object-cover"
          />
        ) : undefined
      }
      {...props}
    >
      <div className="space-y-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
        >
          <Heading level={3} className="group-hover:text-primary transition-colors">
            {title}
          </Heading>
          <span className="sr-only">(opens in new tab)</span>
          <svg
            aria-hidden="true"
            className="ml-1 inline-block h-4 w-4 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>

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
    </Card>
  );
}

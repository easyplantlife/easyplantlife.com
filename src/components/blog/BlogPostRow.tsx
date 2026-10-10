import type { HTMLAttributes } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Heading, type HeadingLevel } from "@/components/ui/Heading";
import { Link } from "@/components/ui/Link";
import { Text } from "@/components/ui/Text";
import type { BlogPost } from "@/lib/types/blog";
import { cn } from "@/lib/utils";

export interface BlogPostRowProps extends HTMLAttributes<HTMLElement> {
  post: BlogPost;
  /** Heading level for the post title; 2 on the blog page, 3 on the home page. */
  headingLevel?: Extract<HeadingLevel, 2 | 3>;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * BlogPostRow
 *
 * One post in a hairline list: date and read time on the left, title,
 * excerpt and a "Read the post" link on the right. The row wraps to a
 * single column when it gets narrow.
 */
export function BlogPostRow({
  post,
  headingLevel = 3,
  className = "",
  ...props
}: BlogPostRowProps) {
  const { title, excerpt, url, publishedDate, readTime } = post;

  return (
    <article
      className={cn(
        "flex flex-wrap gap-x-8 gap-y-3 border-t border-line py-7",
        className
      )}
      {...props}
    >
      <p className="w-44 shrink-0 pt-1 font-sans text-[15px] text-faint">
        <time dateTime={formatDateISO(publishedDate)}>
          {formatDate(publishedDate)}
        </time>
        {readTime && (
          <>
            <span aria-hidden="true"> · </span>
            <span>{readTime} min read</span>
          </>
        )}
      </p>

      <div className="flex min-w-0 flex-1 basis-[22rem] flex-col gap-2">
        <Heading level={headingLevel} className="text-2xl">
          <Link
            href={url}
            variant="plain"
            className="text-ink transition-colors hover:text-accent"
          >
            {title}
          </Link>
        </Heading>
        <Text size="lg" color="secondary" className="max-w-[64ch]">
          {excerpt}
        </Text>
        <ArrowLink
          href={url}
          className="text-[15px]"
          aria-label={`Read "${title}"`}
        >
          Read the post
        </ArrowLink>
      </div>
    </article>
  );
}

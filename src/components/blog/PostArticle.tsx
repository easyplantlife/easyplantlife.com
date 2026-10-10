import type { HTMLAttributes } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Link } from "@/components/ui/Link";
import { Text } from "@/components/ui/Text";
import type { BlogPostContent } from "@/lib/types/blog";
import { cn } from "@/lib/utils";

export interface PostArticleProps extends HTMLAttributes<HTMLElement> {
  post: BlogPostContent;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * PostArticle
 *
 * One full post: eyebrow, title, optional lead and a date line, then the
 * body rendered from Markdown, then a hairline footer with the way back to
 * the list and, when the piece was first published elsewhere, a quiet
 * pointer to the original.
 */
export function PostArticle({
  post,
  className = "",
  ...props
}: PostArticleProps) {
  const { title, lead, html, publishedDate, readTime, originalUrl } = post;

  return (
    <article
      data-testid="post-article"
      className={cn("flex flex-col gap-10", className)}
      {...props}
    >
      <header className="flex flex-col gap-5">
        <Eyebrow>Blog</Eyebrow>
        <Heading level={1}>{title}</Heading>
        {lead && (
          <Text size="xl" color="secondary" className="max-w-[54ch]">
            {lead}
          </Text>
        )}
        <p className="font-sans text-[15px] text-faint">
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
      </header>

      <div
        data-testid="post-body"
        className="post-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <ArrowLink href="/blog">All posts</ArrowLink>
        {originalUrl && (
          <Link
            href={originalUrl}
            variant="plain"
            className="font-sans text-sm text-faint transition-colors hover:text-ink"
          >
            First published on Medium <span aria-hidden="true">↗</span>
          </Link>
        )}
      </footer>
    </article>
  );
}

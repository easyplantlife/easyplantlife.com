import Image from "next/image";
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
 * One full post. The header (eyebrow, title, optional lead) and the cover
 * run the full content width. Below them a meta rail (date, read time)
 * sits beside the prose column on wide screens and above it on narrow
 * ones. A hairline footer holds the way back to the list and, when the
 * piece was first published elsewhere, a quiet pointer to the original.
 */
export function PostArticle({
  post,
  className = "",
  ...props
}: PostArticleProps) {
  const { title, lead, html, cover, publishedDate, readTime, originalUrl } =
    post;

  return (
    <article
      data-testid="post-article"
      className={cn("flex flex-col gap-12", className)}
      {...props}
    >
      <header className="flex flex-col gap-5">
        <Eyebrow>Blog</Eyebrow>
        <Heading level={1} className="max-w-[18ch]">
          {title}
        </Heading>
        {lead && (
          <Text size="xl" color="secondary" className="max-w-[54ch]">
            {lead}
          </Text>
        )}
      </header>

      {cover && (
        <figure data-testid="post-cover" className="flex flex-col gap-3">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-surface">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              priority
              sizes="(max-width: 70rem) 100vw, 1120px"
              className="object-cover"
            />
          </div>
          {cover.caption && (
            <figcaption className="text-center font-sans text-sm text-faint">
              {cover.caption}
            </figcaption>
          )}
        </figure>
      )}

      <div className="flex flex-wrap gap-x-20 gap-y-6">
        <p
          data-testid="post-meta"
          className="flex w-44 shrink-0 flex-col gap-1 pt-1 font-sans text-[15px] text-faint"
        >
          <time dateTime={formatDateISO(publishedDate)}>
            {formatDate(publishedDate)}
          </time>
          {readTime && <span>{readTime} min read</span>}
        </p>

        <div
          data-testid="post-body"
          className="post-body min-w-0 max-w-prose flex-1 basis-[30rem]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

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

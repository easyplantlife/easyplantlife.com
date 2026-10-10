import { type HTMLAttributes } from "react";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { BlogPost } from "@/lib/types/blog";
import { cn } from "@/lib/utils";

export interface RecentWritingProps extends HTMLAttributes<HTMLElement> {
  posts: BlogPost[];
  error?: string;
  /** How many posts to show; the rest live on the blog page. */
  limit?: number;
}

export const RECENT_WRITING_LIMIT = 3;

/**
 * RecentWriting
 *
 * The newest posts as a short hairline list with a link to all of them.
 */
export function RecentWriting({
  posts,
  error,
  limit = RECENT_WRITING_LIMIT,
  className = "",
  ...props
}: RecentWritingProps) {
  return (
    <section
      aria-labelledby="recent-writing-title"
      data-testid="recent-writing"
      className={cn("pb-8 pt-24", className)}
      {...props}
    >
      <Container>
        <SectionHeader
          eyebrow="From the blog"
          title="Recent writing"
          titleId="recent-writing-title"
          action={<ArrowLink href="/blog">All posts</ArrowLink>}
        />
        <BlogPostsList
          posts={posts}
          error={error}
          limit={limit}
          headingLevel={3}
        />
      </Container>
    </section>
  );
}

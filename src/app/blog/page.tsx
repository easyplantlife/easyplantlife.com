import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Panel } from "@/components/ui/Panel";
import { Text } from "@/components/ui/Text";
import { siteConfig } from "@/content/site";
import { getBlogPosts } from "@/lib/api/blog";

export const metadata: Metadata = {
  title: "Blog | Easy Plant Life",
  description:
    "Read our latest articles about plant care and living with plants.",
};

/** Re-fetch the Medium feed at most once an hour. */
export const revalidate = 3600;

export default async function BlogPage() {
  const { posts, error } = await getBlogPosts({ maxPosts: 10 });

  return (
    <PageLayout
      eyebrow="Blog"
      title="Short pieces on easy plant-based living."
      lead="The writing is published on Medium. The newest pieces are listed here; each one opens there in a new tab."
      action={
        <ButtonLink href={siteConfig.mediumUrl} variant="secondary">
          Follow on Medium <span aria-hidden="true">↗</span>
        </ButtonLink>
      }
    >
      <p data-testid="blog-intro" className="mb-2 font-sans text-sm text-faint">
        Newest first
      </p>

      <BlogPostsList
        posts={posts}
        error={error}
        headingLevel={2}
        data-testid="blog-posts-list"
      />

      <div className="pt-7">
        <ArrowLink href={siteConfig.mediumUrl}>Older posts on Medium</ArrowLink>
      </div>

      <Panel
        as="aside"
        columns
        aria-labelledby="prefer-email"
        className="mt-16"
      >
        <div className="flex flex-col gap-2">
          <p
            id="prefer-email"
            className="font-serif text-[22px] font-medium leading-snug text-ink"
          >
            Prefer email?
          </p>
          <Text color="secondary">
            One short note when there is something worth sharing. No schedule.
          </Text>
        </div>
        <div>
          <ButtonLink href="/newsletter">Get the notes</ButtonLink>
        </div>
      </Panel>
    </PageLayout>
  );
}

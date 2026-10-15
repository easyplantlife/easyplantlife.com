import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/blog/PostArticle";
import { PreferEmail } from "@/components/blog/PreferEmail";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { BlogPostingJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/content/site";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/blog/posts";
import { DEFAULT_SOCIAL_IMAGE, FEED_ALTERNATES } from "@/lib/seo";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/** How many related posts to show under a post. */
const RELATED_POSTS_LIMIT = 3;

/** Every post is rendered at build time; unknown slugs are a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Post not found" };
  }

  const image = post.thumbnail
    ? { url: post.thumbnail, alt: post.cover?.alt || post.title }
    : DEFAULT_SOCIAL_IMAGE;
  const socialTitle = `${post.title} | ${siteConfig.name}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    alternates: { canonical: post.url, types: FEED_ALTERNATES },
    openGraph: {
      type: "article",
      title: socialTitle,
      description: post.excerpt,
      url: post.url,
      siteName: siteConfig.name,
      locale: "en_US",
      publishedTime: post.publishedDate.toISOString(),
      modifiedTime: (post.updatedDate ?? post.publishedDate).toISOString(),
      authors: [siteConfig.url],
      section: "Blog",
      tags: post.tags,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: post.excerpt,
      images: [image.url],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="flex-1 pb-24 pt-20">
      <Container>
        <BlogPostingJsonLd post={post} />
        <BreadcrumbJsonLd
          items={[
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: post.url },
          ]}
        />
        <PostArticle post={post} />
        <RelatedPosts posts={getRelatedPosts(slug, RELATED_POSTS_LIMIT)} />
        <PreferEmail />
      </Container>
    </main>
  );
}

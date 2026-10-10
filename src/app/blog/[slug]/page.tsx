import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/blog/PostArticle";
import { PreferEmail } from "@/components/blog/PreferEmail";
import { BlogPostingJsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { getPostBySlug, getPostSlugs } from "@/lib/blog/posts";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

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

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: post.url,
      siteName: "Easy Plant Life",
      locale: "en_US",
      publishedTime: post.publishedDate.toISOString(),
      images: post.thumbnail ? [{ url: post.thumbnail }] : undefined,
    },
    twitter: {
      card: post.thumbnail ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images: post.thumbnail ? [post.thumbnail] : undefined,
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
      <Container variant="prose">
        <BlogPostingJsonLd post={post} />
        <PostArticle post={post} />
        <PreferEmail />
      </Container>
    </main>
  );
}

/**
 * Blog feed
 *
 * Thin layer over the Medium RSS service that pages and sections share.
 * It resolves which Medium account to read, maps feed items to the site's
 * BlogPost shape and turns a failed fetch into a calm message instead of a
 * crash, so a Medium outage never takes the site down.
 */

import { siteConfig } from "@/content/site";
import type { BlogPost } from "@/lib/types/blog";
import { fetchMediumPosts, type MediumPost } from "./medium";

export interface BlogFeedResult {
  posts: BlogPost[];
  /** Present when the feed could not be loaded. */
  error?: string;
}

export const BLOG_FEED_ERROR =
  "The latest posts could not be loaded right now. Everything is still on Medium.";

export const DEFAULT_BLOG_POST_LIMIT = 10;

/**
 * Pulls a Medium username out of a profile or publication URL.
 * Supports https://medium.com/@name and https://name.medium.com.
 * Anything else is returned unchanged for fetchMediumPosts to handle.
 */
export function extractMediumUsername(url: string): string {
  const atMatch = url.match(/medium\.com\/@([^/]+)/);
  if (atMatch) return atMatch[1];

  const subdomainMatch = url.match(/^https?:\/\/([^.]+)\.medium\.com/);
  if (subdomainMatch) return subdomainMatch[1];

  return url;
}

/** The Medium account to read: MEDIUM_PUBLICATION_URL, else the site default. */
export function getMediumUsername(): string {
  const publicationUrl = process.env.MEDIUM_PUBLICATION_URL;
  return publicationUrl
    ? extractMediumUsername(publicationUrl)
    : siteConfig.mediumUsername;
}

export function toBlogPost(post: MediumPost): BlogPost {
  return {
    title: post.title,
    excerpt: post.excerpt,
    url: post.url,
    publishedDate: post.publishedDate,
    thumbnail: post.thumbnail,
  };
}

export async function getBlogPosts({
  maxPosts = DEFAULT_BLOG_POST_LIMIT,
}: { maxPosts?: number } = {}): Promise<BlogFeedResult> {
  try {
    const mediumPosts = await fetchMediumPosts({
      username: getMediumUsername(),
      maxPosts,
    });
    return { posts: mediumPosts.map(toBlogPost) };
  } catch {
    return { posts: [], error: BLOG_FEED_ERROR };
  }
}

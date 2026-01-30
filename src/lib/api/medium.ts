/**
 * Medium Data Fetching Service
 *
 * Fetches and parses blog posts from Medium's RSS feed.
 * Uses server-side fetching to avoid CORS issues.
 *
 * @see docs/medium-integration.md for technical specification
 */

import { parseStringPromise } from "xml2js";

/**
 * Represents a blog post from Medium.
 */
export interface MediumPost {
  /** Unique identifier extracted from guid */
  id: string;
  /** Post title */
  title: string;
  /** Post excerpt/summary (HTML stripped) */
  excerpt: string;
  /** Full URL to the Medium post */
  url: string;
  /** Publication date */
  publishedDate: Date;
  /** Optional thumbnail image URL */
  thumbnail?: string;
  /** Optional post categories/tags */
  categories?: string[];
}

/**
 * Configuration for the Medium service.
 */
export interface MediumServiceConfig {
  /** Medium username (with or without @ prefix) */
  username: string;
  /** Maximum number of posts to return (default: 10) */
  maxPosts?: number;
}

/**
 * RSS feed item structure from xml2js parsing.
 */
interface RssItem {
  title?: string[];
  link?: string[];
  guid?: string[];
  pubDate?: string[];
  description?: string[];
  category?: string[];
  "media:thumbnail"?: Array<{ $?: { url?: string } }>;
}

/**
 * RSS feed structure from xml2js parsing.
 */
interface RssFeed {
  rss?: {
    channel?: Array<{
      item?: RssItem[];
    }>;
  };
}

/**
 * Strips HTML tags from a string.
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Decodes common HTML entities.
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&mdash;": "—",
    "&ndash;": "–",
    "&hellip;": "…",
  };

  return text.replace(
    /&[a-zA-Z0-9#]+;/g,
    (match) => entities[match] || match
  );
}

/**
 * Extracts the post ID from a Medium guid URL.
 * Example: "https://medium.com/p/abc123" -> "abc123"
 */
function extractIdFromGuid(guid: string): string {
  const match = guid.match(/\/p\/([a-zA-Z0-9]+)$/);
  return match ? match[1] : guid;
}

/**
 * Validates and creates a MediumPost from an RSS item.
 * Returns null if the item is missing required fields.
 */
function parseRssItem(item: RssItem): MediumPost | null {
  const title = item.title?.[0];
  const link = item.link?.[0];
  const guid = item.guid?.[0];
  const pubDate = item.pubDate?.[0];
  const description = item.description?.[0];

  // All required fields must be present
  if (!title || !link || !guid || !pubDate || !description) {
    return null;
  }

  // Parse and validate date
  const publishedDate = new Date(pubDate);
  if (isNaN(publishedDate.getTime())) {
    return null;
  }

  // Sanitize excerpt
  const excerpt = decodeHtmlEntities(stripHtml(description)).trim();
  if (!excerpt) {
    return null;
  }

  const post: MediumPost = {
    id: extractIdFromGuid(guid),
    title: title.trim(),
    excerpt,
    url: link.trim(),
    publishedDate,
  };

  // Add optional categories
  if (item.category && item.category.length > 0) {
    post.categories = item.category;
  }

  // Add optional thumbnail
  const thumbnailUrl = item["media:thumbnail"]?.[0]?.$?.url;
  if (thumbnailUrl) {
    post.thumbnail = thumbnailUrl;
  }

  return post;
}

/**
 * Fetches blog posts from a Medium user's RSS feed.
 *
 * @param config - Service configuration
 * @returns Array of MediumPost objects
 * @throws Error if fetching or parsing fails
 *
 * @example
 * ```ts
 * const posts = await fetchMediumPosts({ username: "easyplantlife" });
 * // Returns array of up to 10 posts
 * ```
 */
export async function fetchMediumPosts(
  config: MediumServiceConfig
): Promise<MediumPost[]> {
  const { username, maxPosts = 10 } = config;

  // Normalize username (ensure @ prefix for URL)
  const normalizedUsername = username.startsWith("@")
    ? username
    : `@${username}`;

  const feedUrl = `https://medium.com/feed/${normalizedUsername}`;

  let response: Response;
  try {
    response = await fetch(feedUrl, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch Medium posts: ${message}`);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Medium RSS feed: ${response.status} ${response.statusText}`
    );
  }

  const xml = await response.text();

  let parsed: RssFeed;
  try {
    parsed = await parseStringPromise(xml, {
      explicitArray: true,
      trim: true,
    });
  } catch {
    throw new Error("Failed to parse Medium RSS feed: Invalid XML");
  }

  const items = parsed?.rss?.channel?.[0]?.item || [];

  const posts: MediumPost[] = [];
  for (const item of items) {
    if (posts.length >= maxPosts) {
      break;
    }

    const post = parseRssItem(item);
    if (post) {
      posts.push(post);
    }
  }

  return posts;
}

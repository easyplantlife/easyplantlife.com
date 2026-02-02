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
  guid?: Array<string | { _?: string; $?: Record<string, unknown> }>;
  pubDate?: string[];
  description?: string[];
  "content:encoded"?: string[];
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

  return text.replace(/&[a-zA-Z0-9#]+;/g, (match) => entities[match] || match);
}

/**
 * Extracts the guid string from RSS item (handles both string and object formats).
 */
function getGuidString(
  guid: string | { _?: string; $?: Record<string, unknown> } | undefined
): string | null {
  if (!guid) return null;
  if (typeof guid === "string") return guid;
  return guid._ ?? null;
}

/**
 * Extracts the post ID from a Medium guid URL.
 * Example: "https://medium.com/p/abc123" -> "abc123"
 */
function extractIdFromGuid(guid: string): string {
  const match = guid.match(/\/p\/([a-zA-Z0-9]+)$/);
  return match ? match[1] : guid;
}

/** URLs to exclude from image extraction (tracking pixels, etc.). */
const EXCLUDED_IMAGE_PATTERNS = [/medium\.com\/_\//, /^data:/];

/**
 * Extracts the first image URL from HTML content.
 * Skips tracking pixels and data URLs.
 */
function extractFirstImageFromHtml(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!match) return null;
  const url = match[1];
  if (EXCLUDED_IMAGE_PATTERNS.some((p) => p.test(url))) return null;
  return url;
}

/** Max excerpt length when derived from full content. */
const MAX_EXCERPT_LENGTH = 300;

/**
 * Validates and creates a MediumPost from an RSS item.
 * Returns null if the item is missing required fields.
 */
function parseRssItem(item: RssItem): MediumPost | null {
  const title = item.title?.[0];
  const link = item.link?.[0];
  const guidRaw = item.guid?.[0];
  const guid = getGuidString(guidRaw);
  const pubDate = item.pubDate?.[0];
  // Medium often omits description; use content:encoded as fallback
  const description = item.description?.[0] ?? item["content:encoded"]?.[0];

  // All required fields must be present
  if (!title || !link || !guid || !pubDate || !description) {
    return null;
  }

  // Parse and validate date
  const publishedDate = new Date(pubDate);
  if (isNaN(publishedDate.getTime())) {
    return null;
  }

  // Sanitize excerpt (truncate when from full content)
  let excerpt = decodeHtmlEntities(stripHtml(description)).trim();
  if (excerpt.length > MAX_EXCERPT_LENGTH) {
    excerpt = excerpt.slice(0, MAX_EXCERPT_LENGTH).replace(/\s+\S*$/, "") + "…";
  }
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

  // Add optional thumbnail: prefer media:thumbnail, fallback to first image in content
  const contentEncoded = item["content:encoded"]?.[0];
  const thumbnailUrl =
    item["media:thumbnail"]?.[0]?.$?.url ??
    (contentEncoded ? extractFirstImageFromHtml(contentEncoded) : null);
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

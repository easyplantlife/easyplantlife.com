/**
 * SEO helpers
 *
 * One place to build page metadata so every page gets the same essentials:
 * a canonical URL, Open Graph and Twitter cards that agree with the title
 * and description, and absolute URLs for structured data and feeds.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

/** Shown in social previews when a page has no image of its own. */
export const DEFAULT_SOCIAL_IMAGE = {
  url: "/images/banner.png",
  width: 1200,
  height: 630,
  alt: "Easy Plant Life — Living Vegan Made Simple. A calm approach to plant-based living.",
} as const;

/** Where the blog RSS feed is served. */
export const BLOG_FEED_PATH = "/blog/feed.xml";

/**
 * The feed link every page advertises. Next replaces `alternates` per page
 * rather than merging it, so pages that set a canonical repeat this.
 */
export const FEED_ALTERNATES = {
  "application/rss+xml": [
    { url: BLOG_FEED_PATH, title: `${siteConfig.name} — Blog` },
  ],
};

/** The square brand mark, used as the publisher logo in structured data. */
export const LOGO_PATH = "/images/mark-logo.png";

/**
 * Turns a site path (or an already absolute URL) into an absolute URL on
 * the canonical host.
 */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  if (path === "/" || path === "") return siteConfig.url;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface PageMetadataInput {
  /** Page title without the brand suffix; the layout template adds it. */
  title: string;
  description: string;
  /** Site path of the page, used for the canonical URL. */
  path: string;
  /** Use the title as is, without the layout template. */
  absoluteTitle?: boolean;
  /** Social preview image; falls back to the brand banner. */
  image?: { url: string; alt: string; width?: number; height?: number };
  keywords?: string[];
}

/**
 * Metadata for a regular page. The title goes through the layout template
 * ("%s | Easy Plant Life") unless `absoluteTitle` is set; social cards get
 * the full title since they are read outside the site.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  image,
  keywords,
}: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  const socialImage = image ?? DEFAULT_SOCIAL_IMAGE;

  const metadata: Metadata = {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path, types: FEED_ALTERNATES },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_US",
      url: path,
      title: fullTitle,
      description,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [socialImage.url],
    },
  };
  if (keywords) metadata.keywords = keywords;
  return metadata;
}

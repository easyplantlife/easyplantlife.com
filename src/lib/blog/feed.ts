/**
 * Blog RSS feed
 *
 * Builds an RSS 2.0 document from the posts, with the full body of each
 * post so feed readers can show it without a click. Site-relative links
 * and images are made absolute, since a feed is read away from the site.
 */

import { siteConfig } from "@/content/site";
import type { BlogPostContent } from "@/lib/types/blog";
import { absoluteUrl, BLOG_FEED_PATH } from "@/lib/seo";

export { BLOG_FEED_PATH };

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Wraps HTML in CDATA, splitting any "]]>" that would close it early. */
function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

/** Makes src="/..." and href="/..." absolute. */
function absolutizeHtml(html: string): string {
  return html.replace(
    /\b(src|href)="(\/[^"]*)"/g,
    (_, attribute: string, path: string) =>
      `${attribute}="${absoluteUrl(path)}"`
  );
}

function renderItem(post: BlogPostContent): string {
  const url = absoluteUrl(post.url);
  const cover = post.cover
    ? `<figure><img src="${absoluteUrl(post.cover.src)}" alt="${escapeXml(post.cover.alt)}"></figure>`
    : "";
  const categories = (post.tags ?? [])
    .map((tag) => `      <category>${escapeXml(tag)}</category>`)
    .join("\n");

  return [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${url}</link>`,
    `      <guid isPermaLink="true">${url}</guid>`,
    `      <pubDate>${post.publishedDate.toUTCString()}</pubDate>`,
    `      <dc:creator>${escapeXml(siteConfig.name)}</dc:creator>`,
    `      <description>${escapeXml(post.excerpt)}</description>`,
    `      <content:encoded>${cdata(cover + absolutizeHtml(post.html))}</content:encoded>`,
    categories,
    "    </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * The feed document for the given posts, expected newest first.
 */
export function buildRssFeed(posts: BlogPostContent[]): string {
  const lastBuild = posts[0]?.updatedDate ?? posts[0]?.publishedDate;
  const blogUrl = absoluteUrl("/blog");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${escapeXml(siteConfig.name)} — Blog</title>`,
    `    <link>${blogUrl}</link>`,
    `    <description>${escapeXml("Short pieces on easy plant-based living that fits real life.")}</description>`,
    "    <language>en-us</language>",
    `    <atom:link href="${absoluteUrl(BLOG_FEED_PATH)}" rel="self" type="application/rss+xml"/>`,
    lastBuild
      ? `    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>`
      : "",
    ...posts.map(renderItem),
    "  </channel>",
    "</rss>",
  ]
    .filter(Boolean)
    .join("\n")
    .concat("\n");
}

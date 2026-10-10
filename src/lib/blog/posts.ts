/**
 * Blog posts
 *
 * Reads the Markdown files in src/content/posts at build time. Each file is
 * one post; its name is the slug and its front matter holds the metadata:
 *
 *   ---
 *   title: "Default meals"
 *   date: "2026-03-01T12:00:00.000Z"
 *   excerpt: "Why a boring default is the whole trick."   (optional)
 *   lead: "A one-line subtitle."                          (optional)
 *   image: "/images/blog/default-meals/01.jpeg"           (optional)
 *   tags: ["food", "habits"]                              (optional)
 *   medium: "https://easyplantlife.medium.com/..."        (optional)
 *   ---
 *
 * See docs/blog.md for the authoring guide.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPostContent, BlogPostEntry } from "@/lib/types/blog";
import { renderMarkdown } from "./markdown";

/** Where the post files live. */
export const POSTS_DIRECTORY = path.join(
  process.cwd(),
  "src",
  "content",
  "posts"
);

const WORDS_PER_MINUTE = 200;

/** Max excerpt length when derived from the body. */
const MAX_EXCERPT_LENGTH = 200;

/** Only lower-case letters, digits and hyphens make a valid slug. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface PostFrontMatter {
  title?: unknown;
  date?: unknown;
  excerpt?: unknown;
  lead?: unknown;
  image?: unknown;
  tags?: unknown;
  medium?: unknown;
}

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

/** Strips Markdown syntax well enough to count words or quote a line. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#\\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Estimated reading time in minutes, never less than one.
 */
export function estimateReadTime(markdown: string): number {
  const words = toPlainText(markdown).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * The first real paragraph of the body, trimmed to a sentence boundary
 * when it runs long. Headings, images and lists are skipped.
 */
export function excerptFromBody(markdown: string): string {
  const paragraphs = markdown.split(/\n\s*\n/);
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("!") ||
      trimmed.startsWith("-") ||
      trimmed.startsWith(">")
    ) {
      continue;
    }
    const text = toPlainText(trimmed);
    if (text.length <= MAX_EXCERPT_LENGTH) return text;
    return text.slice(0, MAX_EXCERPT_LENGTH).replace(/\s+\S*$/, "") + "…";
  }
  return "";
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readDate(value: unknown): Date | undefined {
  if (value instanceof Date) return isNaN(value.getTime()) ? undefined : value;
  if (typeof value !== "string") return undefined;
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
}

function readTags(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const tags = value.filter((tag): tag is string => typeof tag === "string");
  return tags.length > 0 ? tags : undefined;
}

interface ParsedPost {
  entry: BlogPostEntry;
  body: string;
}

/**
 * Parses one post file. Throws when the front matter is missing a title or
 * a valid date, so a broken post fails the build instead of disappearing.
 */
export function parsePost(slug: string, source: string): ParsedPost {
  const { data, content } = matter(source);
  const frontMatter = data as PostFrontMatter;

  const title = readString(frontMatter.title);
  if (!title) {
    throw new Error(`Post "${slug}" needs a title in its front matter.`);
  }

  const publishedDate = readDate(frontMatter.date);
  if (!publishedDate) {
    throw new Error(`Post "${slug}" needs a valid date in its front matter.`);
  }

  const body = content.trim();
  const entry: BlogPostEntry = {
    slug,
    title,
    excerpt: readString(frontMatter.excerpt) ?? excerptFromBody(body),
    url: `/blog/${slug}`,
    publishedDate,
    readTime: estimateReadTime(body),
  };

  const lead = readString(frontMatter.lead);
  if (lead) entry.lead = lead;

  const image = readString(frontMatter.image);
  if (image) entry.thumbnail = image;

  const tags = readTags(frontMatter.tags);
  if (tags) entry.tags = tags;

  const originalUrl = readString(frontMatter.medium);
  if (originalUrl) entry.originalUrl = originalUrl;

  return { entry, body };
}

/**
 * Reads one post file. The directory is a constant so the build can trace
 * the post files as static assets of the pages that read them.
 */
function readPostFile(slug: string): ParsedPost | null {
  if (!isValidSlug(slug)) return null;
  const filePath = path.join(POSTS_DIRECTORY, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parsePost(slug, fs.readFileSync(filePath, "utf8"));
}

/**
 * Slugs of every post file, sorted by name.
 */
export function getPostSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIRECTORY)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""))
    .filter(isValidSlug)
    .sort();
}

/**
 * Every post, newest first, without the rendered body.
 */
export function getAllPosts(): BlogPostEntry[] {
  return getPostSlugs()
    .map((slug) => readPostFile(slug))
    .filter((post): post is ParsedPost => post !== null)
    .map((post) => post.entry)
    .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
}

/**
 * One post with its body rendered to HTML, or null when there is no such
 * post. Slugs that could escape the posts directory are treated as missing.
 */
export function getPostBySlug(slug: string): BlogPostContent | null {
  const post = readPostFile(slug);
  if (!post) return null;
  return { ...post.entry, html: renderMarkdown(post.body) };
}

/**
 * Markdown rendering for blog posts
 *
 * A small wrapper around marked with one house rule: an image that stands
 * alone in a paragraph becomes a <figure>, and its title, written as
 * ![alt](src "caption"), becomes the <figcaption>. Everything else is
 * CommonMark as marked renders it.
 *
 * Post bodies are trusted (they live in this repository), so the output is
 * not sanitized.
 */

import { Marked, type Tokens } from "marked";
import type { PostImage } from "@/lib/types/blog";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderFigure({ href, title, text }: Tokens.Image): string {
  const img = `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}" loading="lazy" decoding="async">`;
  const caption = title ? `<figcaption>${escapeHtml(title)}</figcaption>` : "";
  return `<figure>${img}${caption}</figure>\n`;
}

/** True when a paragraph holds nothing but a single image. */
function isLoneImage(tokens: Tokens.Generic[]): tokens is [Tokens.Image] {
  const meaningful = tokens.filter(
    (token) => !(token.type === "text" && token.raw.trim() === "")
  );
  return meaningful.length === 1 && meaningful[0].type === "image";
}

const marked = new Marked({
  gfm: true,
  renderer: {
    image(token) {
      return renderFigure(token);
    },
    paragraph({ tokens }) {
      // A figure is block content; keep it out of the <p>.
      if (isLoneImage(tokens)) {
        return renderFigure(tokens[0]);
      }
      return false;
    },
  },
});

export interface SplitLeadImage {
  /** The image that opened the body, when there was one. */
  cover?: PostImage;
  /** The body without that image. */
  body: string;
}

/**
 * Lifts an image that opens the body out as the cover. Only a lone image in
 * the very first paragraph counts; everything else stays in the body.
 */
export function splitLeadImage(markdown: string): SplitLeadImage {
  const [first] = marked.lexer(markdown);
  if (
    first?.type !== "paragraph" ||
    !first.tokens ||
    !isLoneImage(first.tokens)
  ) {
    return { body: markdown };
  }
  const [image] = first.tokens;
  const cover: PostImage = { src: image.href, alt: image.text };
  if (image.title) cover.caption = image.title;
  return { cover, body: markdown.slice(first.raw.length).trim() };
}

/**
 * Renders a Markdown string to HTML.
 */
export function renderMarkdown(markdown: string): string {
  // No async extensions are registered, so parse returns a string.
  return marked.parse(markdown) as string;
}

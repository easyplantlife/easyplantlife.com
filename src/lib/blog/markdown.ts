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

/**
 * Renders a Markdown string to HTML.
 */
export function renderMarkdown(markdown: string): string {
  // No async extensions are registered, so parse returns a string.
  return marked.parse(markdown) as string;
}

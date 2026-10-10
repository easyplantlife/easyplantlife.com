/**
 * Blog Post Types
 *
 * TypeScript interfaces for blog posts displayed on the site. Posts are
 * Markdown files in src/content/posts, read by src/lib/blog/posts.ts.
 */

/**
 * A post as it appears in a list: on the blog page and the home page.
 *
 * @property title - Post title
 * @property excerpt - Brief summary or preview of the post content
 * @property url - Site path of the full post, e.g. /blog/default-meals
 * @property publishedDate - When the post was published
 * @property thumbnail - Optional cover image path, used for social previews
 * @property readTime - Optional estimated reading time in minutes
 */
export interface BlogPost {
  /** Post title */
  title: string;
  /** Brief summary or preview of the post content */
  excerpt: string;
  /** Site path of the full post */
  url: string;
  /** When the post was published */
  publishedDate: Date;
  /** Optional cover image path */
  thumbnail?: string;
  /** Optional estimated reading time in minutes */
  readTime?: number;
}

/**
 * A post read from its Markdown file, without the rendered body.
 */
export interface BlogPostEntry extends BlogPost {
  /** File name without extension; also the last segment of the URL */
  slug: string;
  /** Optional one-line subtitle shown under the title */
  lead?: string;
  /** Optional topic tags from the front matter */
  tags?: string[];
  /** Where the piece was first published, when that was not this site */
  originalUrl?: string;
}

/**
 * An image that stands on its own, with the alt text and optional caption
 * the author wrote in Markdown.
 */
export interface PostImage {
  /** Image path under public/ */
  src: string;
  /** Alt text; empty when the image is decorative */
  alt: string;
  /** Optional caption shown under the image */
  caption?: string;
}

/**
 * A post with its body rendered to HTML, for the post page.
 */
export interface BlogPostContent extends BlogPostEntry {
  /** The image that opened the body, shown full width above the text */
  cover?: PostImage;
  /** Body rendered from Markdown */
  html: string;
}

/**
 * Blog Post Types
 *
 * TypeScript interfaces for blog posts displayed on the site.
 * These types represent how blog content is presented to users,
 * regardless of the underlying data source (Medium, etc.).
 */

/**
 * Represents a blog post as displayed on the site.
 *
 * @property title - Post title
 * @property excerpt - Brief summary or preview of the post content
 * @property url - Full URL to read the complete post
 * @property publishedDate - When the post was published
 * @property thumbnail - Optional preview image URL
 * @property readTime - Optional estimated reading time in minutes
 */
export interface BlogPost {
  /** Post title */
  title: string;
  /** Brief summary or preview of the post content */
  excerpt: string;
  /** Full URL to read the complete post */
  url: string;
  /** When the post was published */
  publishedDate: Date;
  /** Optional preview image URL */
  thumbnail?: string;
  /** Optional estimated reading time in minutes */
  readTime?: number;
}

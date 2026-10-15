/**
 * JSON-LD Structured Data Components
 *
 * Provides schema.org structured data for improved SEO.
 * These components render JSON-LD scripts that help search engines
 * understand the content and structure of the site.
 *
 * The Organization and WebSite nodes carry stable @ids so posts, books and
 * pages can point at them instead of repeating them.
 */

import type { Book } from "@/content/books";
import { siteConfig } from "@/content/site";
import type { BlogPostContent, BlogPostEntry } from "@/lib/types/blog";
import { absoluteUrl, LOGO_PATH } from "@/lib/seo";

const BASE_URL = siteConfig.url;
const SITE_NAME = siteConfig.name;
const SITE_DESCRIPTION =
  "A calm approach to plant-based living. Simple, sustainable guidance without complexity or perfection.";

const ORGANIZATION_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;
const BLOG_ID = `${BASE_URL}/blog#blog`;

/** A reference to the organization node, for author and publisher fields. */
const organizationRef = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: BASE_URL,
};

/**
 * Renders one JSON-LD script. "<" is escaped so text in the data can never
 * close the script element early.
 */
function JsonLdScript({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * Organization JSON-LD Component
 *
 * Renders schema.org Organization structured data for the home page.
 * Helps search engines identify the website as belonging to an organization.
 */
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
    email: siteConfig.contactEmail,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(LOGO_PATH),
    },
    sameAs: [siteConfig.mediumUrl],
  };

  return <JsonLdScript schema={schema} />;
}

/**
 * WebSite JSON-LD Component
 *
 * Renders schema.org WebSite structured data.
 * Note: Does not include SearchAction as the site does not have search functionality.
 */
export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    publisher: { "@id": ORGANIZATION_ID },
  };

  return <JsonLdScript schema={schema} />;
}

interface BookJsonLdProps {
  book: Book;
}

/**
 * Book JSON-LD Component
 *
 * Renders schema.org Book structured data for a single book.
 * Include offers only for available books with purchase links.
 *
 * @param book - The book data to render as structured data
 */
export function BookJsonLd({ book }: BookJsonLdProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${BASE_URL}/books#${book.id}`,
    name: book.title,
    description: book.description,
    image: absoluteUrl(book.coverImage),
    url: absoluteUrl("/books"),
    inLanguage: "en",
    author: organizationRef,
    publisher: organizationRef,
  };

  if (book.pages) {
    schema.numberOfPages = book.pages;
  }

  // Only include offers for available books with purchase links
  if (book.status === "available" && book.purchaseLinks.length > 0) {
    schema.offers = book.purchaseLinks.map((link) => ({
      "@type": "Offer",
      url: link.url,
      availability: "https://schema.org/InStock",
    }));
  }

  return <JsonLdScript schema={schema} />;
}

interface BlogPostingJsonLdProps {
  post: BlogPostEntry | BlogPostContent;
}

/**
 * BlogPosting JSON-LD Component
 *
 * Renders schema.org BlogPosting structured data for one self-hosted post.
 *
 * @param post - The post to describe
 */
export function BlogPostingJsonLd({ post }: BlogPostingJsonLdProps) {
  const url = absoluteUrl(post.url);
  const published = post.publishedDate.toISOString();
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: published,
    dateModified: post.updatedDate?.toISOString() ?? published,
    inLanguage: "en-US",
    author: organizationRef,
    publisher: {
      ...organizationRef,
      logo: { "@type": "ImageObject", url: absoluteUrl(LOGO_PATH) },
    },
    isPartOf: { "@type": "Blog", "@id": BLOG_ID },
  };

  const cover = "cover" in post ? post.cover : undefined;
  const image = post.thumbnail ?? cover?.src;
  if (image) {
    schema.image = {
      "@type": "ImageObject",
      url: absoluteUrl(image),
      ...(cover?.alt ? { caption: cover.alt } : {}),
    };
    schema.thumbnailUrl = absoluteUrl(image);
  }

  if (post.tags) {
    schema.keywords = post.tags.join(", ");
  }

  if (post.wordCount) {
    schema.wordCount = post.wordCount;
  }

  if (post.readTime) {
    schema.timeRequired = `PT${post.readTime}M`;
  }

  if (post.originalUrl) {
    schema.sameAs = post.originalUrl;
  }

  return <JsonLdScript schema={schema} />;
}

interface BlogJsonLdProps {
  posts: BlogPostEntry[];
}

/**
 * Blog JSON-LD Component
 *
 * Renders schema.org Blog structured data for the blog index, listing every
 * post so crawlers can see the whole archive from one page.
 */
export function BlogJsonLd({ posts }: BlogJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": BLOG_ID,
    name: `${SITE_NAME} — Blog`,
    description: "Short pieces on easy plant-based living that fits real life.",
    url: absoluteUrl("/blog"),
    inLanguage: "en-US",
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${absoluteUrl(post.url)}#article`,
      headline: post.title,
      url: absoluteUrl(post.url),
      datePublished: post.publishedDate.toISOString(),
      ...(post.thumbnail ? { image: absoluteUrl(post.thumbnail) } : {}),
    })),
  };

  return <JsonLdScript schema={schema} />;
}

export interface BreadcrumbItem {
  name: string;
  /** Site path of the crumb */
  path: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

/**
 * BreadcrumbList JSON-LD Component
 *
 * Tells search engines where a page sits in the site, which they can show
 * in place of the bare URL in results.
 */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };

  return <JsonLdScript schema={schema} />;
}

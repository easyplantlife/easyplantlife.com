/**
 * JSON-LD Structured Data Components
 *
 * Provides schema.org structured data for improved SEO.
 * These components render JSON-LD scripts that help search engines
 * understand the content and structure of the site.
 */

import type { Book } from "@/content/books";

const BASE_URL = "https://easyplantlife.com";
const SITE_NAME = "Easy Plant Life";
const SITE_DESCRIPTION =
  "A calm approach to plant-based living. Simple, sustainable guidance without complexity or perfection.";

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
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
    logo: `${BASE_URL}/opengraph-image`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
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
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
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
    name: book.title,
    description: book.description,
    image: `${BASE_URL}${book.coverImage}`,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  // Only include offers for available books with purchase links
  if (book.status === "available" && book.purchaseLinks.length > 0) {
    schema.offers = book.purchaseLinks.map((link) => ({
      "@type": "Offer",
      url: link.url,
      availability: "https://schema.org/InStock",
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

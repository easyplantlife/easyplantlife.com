/**
 * JSON-LD Structured Data Components Tests
 *
 * Tests for JSON-LD structured data components following TDD approach.
 * Verifies proper schema.org structured data output for SEO.
 *
 * Acceptance Criteria from issue #66:
 * - [ ] Organization schema on home page
 * - [ ] WebSite schema with search action (if applicable)
 * - [ ] Book schema on books page (for each book)
 * - [ ] Article schema for blog posts (if rendered on-site)
 *
 * Note: Blog posts are rendered on Medium, not on-site, so Article schema is not needed.
 * Note: Site does not have search functionality, so WebSite schema omits search action.
 */

import { render } from "@testing-library/react";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
  BookJsonLd,
} from "@/components/seo/JsonLd";
import type { Book } from "@/content/books";

/**
 * Helper function to extract JSON-LD data from rendered component
 */
function getJsonLdData(container: HTMLElement): unknown {
  const script = container.querySelector('script[type="application/ld+json"]');
  if (!script || !script.textContent) {
    return null;
  }
  return JSON.parse(script.textContent);
}

describe("JSON-LD Structured Data Components", () => {
  describe("OrganizationJsonLd", () => {
    it("renders a script tag with type application/ld+json", () => {
      const { container } = render(<OrganizationJsonLd />);
      const script = container.querySelector(
        'script[type="application/ld+json"]'
      );
      expect(script).toBeInTheDocument();
    });

    it("includes @context schema.org", () => {
      const { container } = render(<OrganizationJsonLd />);
      const data = getJsonLdData(container) as { "@context"?: string };
      expect(data?.["@context"]).toBe("https://schema.org");
    });

    it("includes @type Organization", () => {
      const { container } = render(<OrganizationJsonLd />);
      const data = getJsonLdData(container) as { "@type"?: string };
      expect(data?.["@type"]).toBe("Organization");
    });

    it("includes organization name", () => {
      const { container } = render(<OrganizationJsonLd />);
      const data = getJsonLdData(container) as { name?: string };
      expect(data?.name).toBe("Easy Plant Life");
    });

    it("includes organization URL", () => {
      const { container } = render(<OrganizationJsonLd />);
      const data = getJsonLdData(container) as { url?: string };
      expect(data?.url).toBe("https://easyplantlife.com");
    });

    it("includes organization description", () => {
      const { container } = render(<OrganizationJsonLd />);
      const data = getJsonLdData(container) as { description?: string };
      expect(data?.description).toBeTruthy();
      expect(typeof data?.description).toBe("string");
    });

    it("includes logo", () => {
      const { container } = render(<OrganizationJsonLd />);
      const data = getJsonLdData(container) as { logo?: string };
      expect(data?.logo).toBeTruthy();
    });
  });

  describe("WebSiteJsonLd", () => {
    it("renders a script tag with type application/ld+json", () => {
      const { container } = render(<WebSiteJsonLd />);
      const script = container.querySelector(
        'script[type="application/ld+json"]'
      );
      expect(script).toBeInTheDocument();
    });

    it("includes @context schema.org", () => {
      const { container } = render(<WebSiteJsonLd />);
      const data = getJsonLdData(container) as { "@context"?: string };
      expect(data?.["@context"]).toBe("https://schema.org");
    });

    it("includes @type WebSite", () => {
      const { container } = render(<WebSiteJsonLd />);
      const data = getJsonLdData(container) as { "@type"?: string };
      expect(data?.["@type"]).toBe("WebSite");
    });

    it("includes website name", () => {
      const { container } = render(<WebSiteJsonLd />);
      const data = getJsonLdData(container) as { name?: string };
      expect(data?.name).toBe("Easy Plant Life");
    });

    it("includes website URL", () => {
      const { container } = render(<WebSiteJsonLd />);
      const data = getJsonLdData(container) as { url?: string };
      expect(data?.url).toBe("https://easyplantlife.com");
    });

    it("includes website description", () => {
      const { container } = render(<WebSiteJsonLd />);
      const data = getJsonLdData(container) as { description?: string };
      expect(data?.description).toBeTruthy();
      expect(typeof data?.description).toBe("string");
    });

    it("does not include potentialAction (no search functionality)", () => {
      const { container } = render(<WebSiteJsonLd />);
      const data = getJsonLdData(container) as { potentialAction?: unknown };
      expect(data?.potentialAction).toBeUndefined();
    });
  });

  describe("BookJsonLd", () => {
    const mockBook: Book = {
      id: "test-book",
      title: "Test Book Title",
      description: "A test book description for testing purposes.",
      coverImage: "/images/books/test-book.jpg",
      status: "available",
      purchaseLinks: [
        { label: "Amazon", url: "https://amazon.com/test-book" },
      ],
    };

    const mockComingSoonBook: Book = {
      id: "coming-soon-book",
      title: "Coming Soon Book",
      description: "A book that is coming soon.",
      coverImage: "/images/books/coming-soon.jpg",
      status: "coming-soon",
      purchaseLinks: [],
    };

    it("renders a script tag with type application/ld+json", () => {
      const { container } = render(<BookJsonLd book={mockBook} />);
      const script = container.querySelector(
        'script[type="application/ld+json"]'
      );
      expect(script).toBeInTheDocument();
    });

    it("includes @context schema.org", () => {
      const { container } = render(<BookJsonLd book={mockBook} />);
      const data = getJsonLdData(container) as { "@context"?: string };
      expect(data?.["@context"]).toBe("https://schema.org");
    });

    it("includes @type Book", () => {
      const { container } = render(<BookJsonLd book={mockBook} />);
      const data = getJsonLdData(container) as { "@type"?: string };
      expect(data?.["@type"]).toBe("Book");
    });

    it("includes book name from title", () => {
      const { container } = render(<BookJsonLd book={mockBook} />);
      const data = getJsonLdData(container) as { name?: string };
      expect(data?.name).toBe("Test Book Title");
    });

    it("includes book description", () => {
      const { container } = render(<BookJsonLd book={mockBook} />);
      const data = getJsonLdData(container) as { description?: string };
      expect(data?.description).toBe(
        "A test book description for testing purposes."
      );
    });

    it("includes book image URL", () => {
      const { container } = render(<BookJsonLd book={mockBook} />);
      const data = getJsonLdData(container) as { image?: string };
      expect(data?.image).toContain("/images/books/test-book.jpg");
    });

    it("includes author as Organization", () => {
      const { container } = render(<BookJsonLd book={mockBook} />);
      const data = getJsonLdData(container) as {
        author?: { "@type"?: string; name?: string };
      };
      expect(data?.author?.["@type"]).toBe("Organization");
      expect(data?.author?.name).toBe("Easy Plant Life");
    });

    it("includes publisher as Organization", () => {
      const { container } = render(<BookJsonLd book={mockBook} />);
      const data = getJsonLdData(container) as {
        publisher?: { "@type"?: string; name?: string };
      };
      expect(data?.publisher?.["@type"]).toBe("Organization");
      expect(data?.publisher?.name).toBe("Easy Plant Life");
    });

    it("includes offers for available books with purchase links", () => {
      const { container } = render(<BookJsonLd book={mockBook} />);
      const data = getJsonLdData(container) as {
        offers?: Array<{ "@type"?: string; url?: string }>;
      };
      expect(data?.offers).toBeDefined();
      expect(Array.isArray(data?.offers)).toBe(true);
      expect(data?.offers?.length).toBeGreaterThan(0);
      expect(data?.offers?.[0]?.["@type"]).toBe("Offer");
      expect(data?.offers?.[0]?.url).toBe("https://amazon.com/test-book");
    });

    it("does not include offers for coming-soon books", () => {
      const { container } = render(<BookJsonLd book={mockComingSoonBook} />);
      const data = getJsonLdData(container) as { offers?: unknown };
      expect(data?.offers).toBeUndefined();
    });

    it("does not include offers for books without purchase links", () => {
      const bookWithoutLinks: Book = {
        ...mockBook,
        purchaseLinks: [],
      };
      const { container } = render(<BookJsonLd book={bookWithoutLinks} />);
      const data = getJsonLdData(container) as { offers?: unknown };
      expect(data?.offers).toBeUndefined();
    });
  });

  describe("Multiple BookJsonLd", () => {
    const books: Book[] = [
      {
        id: "book-1",
        title: "First Book",
        description: "First book description.",
        coverImage: "/images/books/first.jpg",
        status: "available",
        purchaseLinks: [{ label: "Buy", url: "https://example.com/buy1" }],
      },
      {
        id: "book-2",
        title: "Second Book",
        description: "Second book description.",
        coverImage: "/images/books/second.jpg",
        status: "coming-soon",
        purchaseLinks: [],
      },
    ];

    it("renders separate JSON-LD scripts for each book", () => {
      const { container } = render(
        <>
          {books.map((book) => (
            <BookJsonLd key={book.id} book={book} />
          ))}
        </>
      );
      const scripts = container.querySelectorAll(
        'script[type="application/ld+json"]'
      );
      expect(scripts.length).toBe(2);
    });

    it("each book has correct data", () => {
      const { container } = render(
        <>
          {books.map((book) => (
            <BookJsonLd key={book.id} book={book} />
          ))}
        </>
      );
      const scripts = container.querySelectorAll(
        'script[type="application/ld+json"]'
      );

      const firstBookData = JSON.parse(scripts[0].textContent || "{}") as {
        name?: string;
      };
      const secondBookData = JSON.parse(scripts[1].textContent || "{}") as {
        name?: string;
      };

      expect(firstBookData.name).toBe("First Book");
      expect(secondBookData.name).toBe("Second Book");
    });
  });
});

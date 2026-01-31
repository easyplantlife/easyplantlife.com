/**
 * Books Page JSON-LD Integration Tests
 *
 * Tests that the books page includes proper JSON-LD structured data
 * for each book using the Book schema.
 */

import { render } from "@testing-library/react";
import BooksPage from "@/app/books/page";
import { books } from "@/content/books";

/**
 * Helper function to extract all JSON-LD data from rendered component
 */
function getAllJsonLdData(container: HTMLElement): unknown[] {
  const scripts = container.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  return Array.from(scripts).map((script) =>
    JSON.parse(script.textContent || "{}")
  );
}

describe("Books Page JSON-LD", () => {
  it("includes Book JSON-LD for each book", () => {
    const { container } = render(<BooksPage />);
    const jsonLdData = getAllJsonLdData(container);
    const bookSchemas = jsonLdData.filter(
      (data) => (data as { "@type"?: string })?.["@type"] === "Book"
    );
    expect(bookSchemas.length).toBe(books.length);
  });

  it("each Book schema has correct @context", () => {
    const { container } = render(<BooksPage />);
    const jsonLdData = getAllJsonLdData(container);
    const bookSchemas = jsonLdData.filter(
      (data) => (data as { "@type"?: string })?.["@type"] === "Book"
    );

    bookSchemas.forEach((schema) => {
      expect((schema as { "@context"?: string })?.["@context"]).toBe(
        "https://schema.org"
      );
    });
  });

  it("each Book schema includes book name", () => {
    const { container } = render(<BooksPage />);
    const jsonLdData = getAllJsonLdData(container);
    const bookSchemas = jsonLdData.filter(
      (data) => (data as { "@type"?: string })?.["@type"] === "Book"
    );

    books.forEach((book, index) => {
      const schema = bookSchemas[index] as { name?: string };
      expect(schema?.name).toBe(book.title);
    });
  });

  it("each Book schema includes description", () => {
    const { container } = render(<BooksPage />);
    const jsonLdData = getAllJsonLdData(container);
    const bookSchemas = jsonLdData.filter(
      (data) => (data as { "@type"?: string })?.["@type"] === "Book"
    );

    books.forEach((book, index) => {
      const schema = bookSchemas[index] as { description?: string };
      expect(schema?.description).toBe(book.description);
    });
  });

  it("each Book schema includes image URL", () => {
    const { container } = render(<BooksPage />);
    const jsonLdData = getAllJsonLdData(container);
    const bookSchemas = jsonLdData.filter(
      (data) => (data as { "@type"?: string })?.["@type"] === "Book"
    );

    books.forEach((book, index) => {
      const schema = bookSchemas[index] as { image?: string };
      expect(schema?.image).toContain(book.coverImage);
    });
  });

  it("each Book schema includes author as Organization", () => {
    const { container } = render(<BooksPage />);
    const jsonLdData = getAllJsonLdData(container);
    const bookSchemas = jsonLdData.filter(
      (data) => (data as { "@type"?: string })?.["@type"] === "Book"
    );

    bookSchemas.forEach((schema) => {
      const author = (schema as { author?: { "@type"?: string; name?: string } })
        ?.author;
      expect(author?.["@type"]).toBe("Organization");
      expect(author?.name).toBe("Easy Plant Life");
    });
  });

  it("each Book schema includes publisher as Organization", () => {
    const { container } = render(<BooksPage />);
    const jsonLdData = getAllJsonLdData(container);
    const bookSchemas = jsonLdData.filter(
      (data) => (data as { "@type"?: string })?.["@type"] === "Book"
    );

    bookSchemas.forEach((schema) => {
      const publisher = (
        schema as { publisher?: { "@type"?: string; name?: string } }
      )?.publisher;
      expect(publisher?.["@type"]).toBe("Organization");
      expect(publisher?.name).toBe("Easy Plant Life");
    });
  });
});

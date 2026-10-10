import { render, screen, within } from "@testing-library/react";
import BooksPage from "@/app/books/page";
import { books } from "@/content/books";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

function getJsonLd(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll('script[type="application/ld+json"]')
  ).map((s) => JSON.parse(s.textContent || "{}"));
}

/**
 * Books Page
 *
 * Intro, one full BookItem row per book, structured data per book and a
 * short "where to start" aside.
 */
describe("Books Page", () => {
  describe("Intro", () => {
    it("renders the eyebrow, h1 and lead", () => {
      render(<BooksPage />);
      expect(screen.getByText("Books")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Two short books about the same idea."
      );
      expect(screen.getByText(/both are on amazon/i)).toBeInTheDocument();
    });

    it("renders exactly one h1 inside a single main", () => {
      render(<BooksPage />);
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(screen.getAllByRole("main")).toHaveLength(1);
    });
  });

  describe("Books list", () => {
    it("renders every book from the content as a row", () => {
      render(<BooksPage />);
      const list = screen.getByTestId("books-list");
      expect(within(list).getAllByRole("article")).toHaveLength(books.length);
      for (const book of books) {
        expect(
          within(list).getByRole("heading", { level: 2, name: book.title })
        ).toBeInTheDocument();
        expect(
          within(list).getByRole("img", { name: `Cover of ${book.title}` })
        ).toBeInTheDocument();
      }
    });

    it("renders purchase links that open in a new tab safely", () => {
      render(<BooksPage />);
      const list = screen.getByTestId("books-list");
      const links = within(list).getAllByRole("link", {
        name: /buy on amazon/i,
      });
      expect(links).toHaveLength(
        books.filter((b) => b.status === "available").length
      );
      for (const link of links) {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(link.getAttribute("href")).toMatch(
          /^https:\/\/www\.amazon\.com/
        );
      }
    });

    it("shows the page count for each book", () => {
      render(<BooksPage />);
      for (const book of books) {
        if (book.pages) {
          expect(screen.getByText(`${book.pages} pages`)).toBeInTheDocument();
        }
      }
    });

    it("includes Book JSON-LD for each book", () => {
      const { container } = render(<BooksPage />);
      const data = getJsonLd(container).filter((d) => d["@type"] === "Book");
      expect(data).toHaveLength(books.length);
      expect(data.map((d) => d.name)).toEqual(books.map((b) => b.title));
    });
  });

  describe("Where to start", () => {
    it("renders the aside after the list with a link to the blog", () => {
      render(<BooksPage />);
      const aside = screen.getByTestId("books-intro");
      expect(aside.tagName).toBe("ASIDE");
      expect(aside).toHaveTextContent(/not sure where to start/i);
      expect(
        within(aside).getByRole("link", { name: "Read the blog" })
      ).toHaveAttribute("href", "/blog");

      const list = screen.getByTestId("books-list");
      expect(
        list.compareDocumentPosition(aside) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });
  });

  describe("Content", () => {
    it("has no placeholder or hype language", () => {
      render(<BooksPage />);
      const text = document.body.textContent?.toLowerCase() ?? "";
      for (const word of ["lorem", "[n pages]", "amazing", "life-changing"]) {
        expect(text).not.toContain(word);
      }
    });
  });
});

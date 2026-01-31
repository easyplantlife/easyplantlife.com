import { render, screen } from "@testing-library/react";
import BooksPage from "@/app/books/page";
import { books } from "@/content/books";

/**
 * Books Page Tests
 *
 * Tests for the complete Books page assembly following TDD approach.
 * Based on acceptance criteria from Issue #39 (M6-04):
 *
 * - [ ] Page uses PageLayout
 * - [ ] Page title/intro explaining the books section
 * - [ ] Books list renders
 * - [ ] Responsive on all devices
 *
 * Additional acceptance criteria from Issue #40 (M6-05):
 *
 * - [ ] All books from data source are displayed
 * - [ ] External links have target="_blank" and rel="noopener noreferrer"
 */

describe("Books Page", () => {
  /**
   * Acceptance Criteria Tests (Issue #40 - M6-05)
   *
   * GIVEN the books page
   * WHEN it loads
   * THEN all books from data source are displayed
   *
   * GIVEN a book card with external links
   * WHEN I inspect the links
   * THEN they have target="_blank" and rel="noopener noreferrer"
   */
  describe("Acceptance Criteria (M6-05)", () => {
    it("displays all books from the data source when the page loads", () => {
      render(<BooksPage />);

      // Verify each book from the data source is displayed
      books.forEach((book) => {
        expect(screen.getByText(book.title)).toBeInTheDocument();
      });
    });

    it("renders the same number of book cards as books in the data source", () => {
      render(<BooksPage />);

      // BookCard renders as article elements
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(books.length);
    });

    it("external purchase links have target='_blank' attribute", () => {
      render(<BooksPage />);

      // Find all external links (purchase links)
      const allLinks = screen.queryAllByRole("link");
      const externalLinks = allLinks.filter((link) =>
        link.getAttribute("href")?.startsWith("http")
      );

      // Each external link should open in a new tab
      externalLinks.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
      });
    });

    it("external purchase links have rel='noopener noreferrer' for security", () => {
      render(<BooksPage />);

      // Find all external links (purchase links)
      const allLinks = screen.queryAllByRole("link");
      const externalLinks = allLinks.filter((link) =>
        link.getAttribute("href")?.startsWith("http")
      );

      // Each external link should have proper security attributes
      externalLinks.forEach((link) => {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  /**
   * Acceptance Criteria Tests (Issue #39 - M6-04)
   */
  describe("Acceptance Criteria (M6-04)", () => {
    it("displays the page title 'Books' when the page loads", () => {
      render(<BooksPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/books/i);
    });

    it("displays an intro explaining the books section", () => {
      render(<BooksPage />);
      const intro = screen.getByTestId("books-intro");
      expect(intro).toBeInTheDocument();
    });

    it("renders the books list", () => {
      render(<BooksPage />);
      const booksList = screen.getByTestId("books-list");
      expect(booksList).toBeInTheDocument();
    });
  });

  describe("Page Structure", () => {
    it("renders a main element as the page container (via PageLayout)", () => {
      render(<BooksPage />);
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("has proper page structure for accessibility", () => {
      render(<BooksPage />);
      // Should have exactly one main element
      expect(screen.getAllByRole("main")).toHaveLength(1);
    });

    it("renders the page title as h1 heading", () => {
      render(<BooksPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/books/i);
    });
  });

  describe("PageLayout Integration", () => {
    it("uses PageLayout component with title prop", () => {
      render(<BooksPage />);
      // PageLayout renders a main element with Container
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();

      // Title is rendered as h1 with font-heading class
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("font-heading");
    });

    it("has consistent vertical padding from PageLayout", () => {
      render(<BooksPage />);
      const main = screen.getByRole("main");
      // PageLayout default variant adds py-12 md:py-16
      expect(main).toHaveClass("py-12");
      expect(main).toHaveClass("md:py-16");
    });

    it("content is wrapped in Container for max-width constraint", () => {
      render(<BooksPage />);
      const booksList = screen.getByTestId("books-list");
      // Container has mx-auto and max-w-6xl
      const container = booksList.parentElement;
      expect(container).toHaveClass("mx-auto");
      expect(container).toHaveClass("max-w-6xl");
    });
  });

  describe("Intro Section", () => {
    it("renders intro text explaining the books section", () => {
      render(<BooksPage />);
      const intro = screen.getByTestId("books-intro");
      expect(intro).toBeInTheDocument();
      // Intro should contain meaningful text about books
      expect(intro.textContent?.length).toBeGreaterThan(20);
    });

    it("intro appears before the books list", () => {
      render(<BooksPage />);
      const intro = screen.getByTestId("books-intro");
      const booksList = screen.getByTestId("books-list");

      expect(
        intro.compareDocumentPosition(booksList) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it("intro uses appropriate typography styles", () => {
      render(<BooksPage />);
      const intro = screen.getByTestId("books-intro");
      // Intro contains a paragraph with text styling
      const paragraph = intro.querySelector("p");
      expect(paragraph).toHaveClass("text-lg");
    });
  });

  describe("BooksList Integration", () => {
    it("renders the BooksList component", () => {
      render(<BooksPage />);
      expect(screen.getByTestId("books-list")).toBeInTheDocument();
    });

    it("renders book cards within the list", () => {
      render(<BooksPage />);
      // BookCard renders as article elements
      const articles = screen.getAllByRole("article");
      expect(articles.length).toBeGreaterThan(0);
    });
  });

  describe("Content Flow", () => {
    it("title appears before intro", () => {
      render(<BooksPage />);
      const title = screen.getByRole("heading", { level: 1 });
      const intro = screen.getByTestId("books-intro");

      expect(
        title.compareDocumentPosition(intro) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it("intro appears before books list", () => {
      render(<BooksPage />);
      const intro = screen.getByTestId("books-intro");
      const booksList = screen.getByTestId("books-list");

      expect(
        intro.compareDocumentPosition(booksList) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });

  describe("Responsive Design", () => {
    it("uses responsive vertical padding", () => {
      render(<BooksPage />);
      const main = screen.getByRole("main");
      // PageLayout default variant: py-12 md:py-16
      expect(main).toHaveClass("py-12");
      expect(main).toHaveClass("md:py-16");
    });

    it("uses responsive horizontal padding via Container", () => {
      render(<BooksPage />);
      const booksList = screen.getByTestId("books-list");
      const container = booksList.parentElement;
      // Container has responsive horizontal padding
      expect(container).toHaveClass("px-4");
      expect(container).toHaveClass("md:px-6");
      expect(container).toHaveClass("lg:px-8");
    });
  });

  describe("Accessibility", () => {
    it("has proper landmark with main element", () => {
      render(<BooksPage />);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("book cards are marked as articles for semantics", () => {
      render(<BooksPage />);
      const articles = screen.getAllByRole("article");
      expect(articles.length).toBeGreaterThan(0);
    });
  });

  describe("Visual Design - Brand Compliance", () => {
    it("page title uses brand heading font", () => {
      render(<BooksPage />);
      const title = screen.getByRole("heading", { level: 1 });
      expect(title).toHaveClass("font-heading");
    });

    it("intro text uses appropriate styling", () => {
      render(<BooksPage />);
      const intro = screen.getByTestId("books-intro");
      expect(intro).toBeInTheDocument();
    });

    it("has generous spacing between intro and books list", () => {
      render(<BooksPage />);
      const intro = screen.getByTestId("books-intro");
      // Should have margin-bottom for spacing
      expect(intro).toHaveClass("mb-12");
    });
  });
});

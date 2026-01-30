/**
 * BooksList Component Tests
 *
 * Tests for the BooksList component following TDD approach.
 * Verifies rendering of book collection with responsive layout.
 *
 * Acceptance Criteria from issue #38:
 * - [ ] BooksList component created
 * - [ ] Renders all books from data source
 * - [ ] Responsive layout (single column mobile, may expand desktop)
 * - [ ] Appropriate spacing between books
 */

import { render, screen } from "@testing-library/react";
import { BooksList } from "@/components/books/BooksList";
import type { Book } from "@/content/books";

const mockBooks: Book[] = [
  {
    id: "book-1",
    title: "First Book",
    description: "Description for the first book.",
    coverImage: "/images/books/book-1.jpg",
    status: "available",
    purchaseLinks: [{ label: "Amazon", url: "https://amazon.com/book-1" }],
  },
  {
    id: "book-2",
    title: "Second Book",
    description: "Description for the second book.",
    coverImage: "/images/books/book-2.jpg",
    status: "coming-soon",
    purchaseLinks: [],
  },
  {
    id: "book-3",
    title: "Third Book",
    description: "Description for the third book.",
    coverImage: "/images/books/book-3.jpg",
    status: "available",
    purchaseLinks: [{ label: "Amazon", url: "https://amazon.com/book-3" }],
  },
];

describe("BooksList Component", () => {
  describe("Rendering", () => {
    it("renders all books from the provided array", () => {
      render(<BooksList books={mockBooks} />);

      expect(screen.getByText("First Book")).toBeInTheDocument();
      expect(screen.getByText("Second Book")).toBeInTheDocument();
      expect(screen.getByText("Third Book")).toBeInTheDocument();
    });

    it("renders correct number of book articles", () => {
      render(<BooksList books={mockBooks} />);

      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(3);
    });

    it("renders empty state when no books provided", () => {
      render(<BooksList books={[]} />);

      // Should not crash and should have no articles
      expect(screen.queryAllByRole("article")).toHaveLength(0);
    });

    it("renders a single book correctly", () => {
      render(<BooksList books={[mockBooks[0]]} />);

      expect(screen.getByText("First Book")).toBeInTheDocument();
      expect(screen.getAllByRole("article")).toHaveLength(1);
    });
  });

  describe("Layout and Styling", () => {
    it("wraps books in a container element", () => {
      const { container } = render(<BooksList books={mockBooks} />);

      // Should have a containing div or section
      const wrapper = container.firstChild;
      expect(wrapper).toBeInstanceOf(HTMLElement);
    });

    it("applies spacing classes for book separation", () => {
      const { container } = render(<BooksList books={mockBooks} />);

      const wrapper = container.firstChild as HTMLElement;
      // Should have gap or space-y class for spacing
      expect(
        wrapper.className.includes("gap") || wrapper.className.includes("space")
      ).toBe(true);
    });

    it("applies grid or flex layout classes", () => {
      const { container } = render(<BooksList books={mockBooks} />);

      const wrapper = container.firstChild as HTMLElement;
      // Should use grid or flex for layout
      expect(
        wrapper.className.includes("grid") || wrapper.className.includes("flex")
      ).toBe(true);
    });
  });

  describe("Props and Customization", () => {
    it("accepts and applies custom className", () => {
      const { container } = render(
        <BooksList books={mockBooks} className="custom-list-class" />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("custom-list-class");
    });

    it("passes through HTML attributes", () => {
      render(<BooksList books={mockBooks} data-testid="books-list" />);

      expect(screen.getByTestId("books-list")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("book cards are distinct and navigable", () => {
      render(<BooksList books={mockBooks} />);

      const articles = screen.getAllByRole("article");
      expect(articles.length).toBeGreaterThan(0);

      // Each article should contain its book's heading
      articles.forEach((article) => {
        const heading = article.querySelector('[role="heading"], h1, h2, h3');
        expect(heading).toBeInTheDocument();
      });
    });
  });
});

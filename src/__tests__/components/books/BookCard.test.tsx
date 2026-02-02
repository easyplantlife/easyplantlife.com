/**
 * BookCard Component Tests
 *
 * Tests for the BookCard component following TDD approach.
 * Verifies rendering of book information, status badges, and purchase links.
 *
 * Acceptance Criteria from issue #37:
 * - [ ] BookCard component at `/components/books/BookCard.tsx`
 * - [ ] Displays cover image
 * - [ ] Displays title and short description
 * - [ ] Shows status badge (available/coming soon)
 * - [ ] Lists purchase links (external)
 * - [ ] External links have proper attributes
 *
 * Test Cases:
 * - GIVEN a book with status "available"
 *   WHEN the card renders
 *   THEN purchase links are displayed
 *
 * - GIVEN a book with status "coming-soon"
 *   WHEN the card renders
 *   THEN "Coming Soon" badge is shown
 *   AND no purchase links are displayed
 */

import { render, screen } from "@testing-library/react";
import { BookCard } from "@/components/books/BookCard";
import type { Book } from "@/content/books";

const mockAvailableBook: Book = {
  id: "test-book-1",
  title: "Test Book Title",
  description: "A test book description for testing purposes.",
  coverImage: "/images/books/test-book.jpg",
  status: "available",
  purchaseLinks: [
    { label: "Amazon", url: "https://amazon.com/test-book" },
    { label: "Barnes & Noble", url: "https://bn.com/test-book" },
  ],
};

const mockComingSoonBook: Book = {
  id: "test-book-2",
  title: "Upcoming Book Title",
  description: "An upcoming book about plant care.",
  coverImage: "/images/books/upcoming-book.jpg",
  status: "coming-soon",
  purchaseLinks: [],
};

describe("BookCard Component", () => {
  describe("Rendering", () => {
    it("renders as an article element for coming-soon books", () => {
      render(<BookCard book={mockComingSoonBook} />);
      const card = screen.getByRole("article");
      expect(card).toBeInTheDocument();
    });

    it("renders as a clickable card link for available books", () => {
      render(<BookCard book={mockAvailableBook} />);
      // The card itself is a link to the first purchase URL
      const cardLink = screen.getAllByRole("link")[0];
      expect(cardLink).toHaveAttribute("href", "https://amazon.com/test-book");
    });

    it("renders the book title", () => {
      render(<BookCard book={mockAvailableBook} />);
      expect(screen.getByText("Test Book Title")).toBeInTheDocument();
    });

    it("renders the book description", () => {
      render(<BookCard book={mockAvailableBook} />);
      expect(
        screen.getByText("A test book description for testing purposes.")
      ).toBeInTheDocument();
    });
  });

  describe("Cover Image", () => {
    it("displays the cover image", () => {
      render(<BookCard book={mockAvailableBook} />);
      const image = screen.getByRole("img", { name: /test book title/i });
      expect(image).toBeInTheDocument();
    });

    it("cover image has correct src attribute", () => {
      render(<BookCard book={mockAvailableBook} />);
      const image = screen.getByRole("img", { name: /test book title/i });
      expect(image).toHaveAttribute("src");
      // Next.js Image component transforms src, so we check it contains the path
      expect(image.getAttribute("src")).toContain("test-book.jpg");
    });

    it("cover image has proper alt text using book title", () => {
      render(<BookCard book={mockAvailableBook} />);
      const image = screen.getByRole("img", { name: /test book title/i });
      expect(image).toHaveAttribute("alt", "Test Book Title cover");
    });
  });

  describe("Status Badge - Available", () => {
    it("does not show Coming Soon badge for available books", () => {
      render(<BookCard book={mockAvailableBook} />);
      expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
    });
  });

  describe("Status Badge - Coming Soon", () => {
    it("shows Coming Soon badge for coming-soon status", () => {
      render(<BookCard book={mockComingSoonBook} />);
      expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    });

    it("Coming Soon badge is visually distinct", () => {
      render(<BookCard book={mockComingSoonBook} />);
      const badge = screen.getByText(/coming soon/i);
      // Badge should have rounded styling
      expect(badge.className).toMatch(/rounded/);
    });
  });

  describe("Purchase Links - Available Book", () => {
    it("displays retailer labels for available books", () => {
      render(<BookCard book={mockAvailableBook} />);
      // Retailer names are shown as visual labels
      expect(screen.getByText("Amazon")).toBeInTheDocument();
      expect(screen.getByText("Barnes & Noble")).toBeInTheDocument();
    });

    it("card links to first purchase URL", () => {
      render(<BookCard book={mockAvailableBook} />);
      // The card itself is the link to the first purchase URL
      const cardLink = screen.getByRole("link");
      expect(cardLink).toHaveAttribute("href", "https://amazon.com/test-book");
    });

    it("card link opens in new tab", () => {
      render(<BookCard book={mockAvailableBook} />);
      const cardLink = screen.getByRole("link");
      expect(cardLink).toHaveAttribute("target", "_blank");
    });

    it("card link has proper security attributes", () => {
      render(<BookCard book={mockAvailableBook} />);
      const cardLink = screen.getByRole("link");
      expect(cardLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Purchase Links - Coming Soon Book", () => {
    it("does not display purchase links section for coming-soon books", () => {
      render(<BookCard book={mockComingSoonBook} />);
      // Should not have any external links
      expect(
        screen.queryByRole("link", { name: /amazon/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("uses semantic heading for book title", () => {
      render(<BookCard book={mockAvailableBook} />);
      const heading = screen.getByRole("heading", { name: "Test Book Title" });
      expect(heading).toBeInTheDocument();
    });

    it("card link is keyboard accessible", () => {
      render(<BookCard book={mockAvailableBook} />);
      const link = screen.getByRole("link");
      // Links are focusable by default
      expect(link).not.toHaveAttribute("tabindex", "-1");
    });
  });

  describe("Props and Customization", () => {
    it("accepts and applies custom className", () => {
      render(<BookCard book={mockAvailableBook} className="custom-class" />);
      // For available books, the card renders as a link
      const card = screen.getByRole("link");
      expect(card).toHaveClass("custom-class");
    });

    it("accepts and applies custom className to article cards", () => {
      render(<BookCard book={mockComingSoonBook} className="custom-class" />);
      // For coming-soon books, the card renders as an article
      const card = screen.getByRole("article");
      expect(card).toHaveClass("custom-class");
    });

    it("passes through HTML attributes", () => {
      render(<BookCard book={mockAvailableBook} data-testid="book-card" />);
      expect(screen.getByTestId("book-card")).toBeInTheDocument();
    });
  });
});

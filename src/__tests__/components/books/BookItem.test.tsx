import { render, screen, within } from "@testing-library/react";
import { BookItem } from "@/components/books/BookItem";
import type { Book } from "@/content/books";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

const book: Book = {
  id: "playbook",
  title: "The Everyday Vegan Playbook",
  tagline: "The practical one",
  description: "A calm guide to default meals.",
  coverImage: "/images/books/playbook.png",
  status: "available",
  pages: 76,
  purchaseLinks: [
    { label: "Buy on Amazon", url: "https://www.amazon.com/dp/B0GL118S83" },
  ],
};

describe("BookItem", () => {
  describe("full variant", () => {
    it("renders the cover with a descriptive alt", () => {
      render(<BookItem book={book} />);
      expect(
        screen.getByRole("img", { name: `Cover of ${book.title}` })
      ).toHaveAttribute("src", expect.stringContaining("playbook.png"));
    });

    it("renders tagline and status as an eyebrow", () => {
      render(<BookItem book={book} />);
      expect(
        screen.getByText("The practical one · Available now")
      ).toBeInTheDocument();
    });

    it("renders the title as an h2 and the description", () => {
      render(<BookItem book={book} />);
      expect(
        screen.getByRole("heading", { level: 2, name: book.title })
      ).toBeInTheDocument();
      expect(screen.getByText(book.description)).toBeInTheDocument();
    });

    it("renders the page count when known", () => {
      render(<BookItem book={book} />);
      expect(screen.getByText("Length")).toBeInTheDocument();
      expect(screen.getByText("76 pages")).toBeInTheDocument();
    });

    it("omits the length when pages is unknown", () => {
      render(<BookItem book={{ ...book, pages: undefined }} />);
      expect(screen.queryByText("Length")).not.toBeInTheDocument();
    });

    it("renders an external buy button with an honest note", () => {
      render(<BookItem book={book} />);
      const link = screen.getByRole("link", { name: /buy on amazon/i });
      expect(link).toHaveAttribute("href", book.purchaseLinks[0].url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.className).toContain("rounded-pill");
      expect(screen.getByText("Opens in a new tab")).toBeInTheDocument();
    });

    it("hides purchase links for a coming-soon book", () => {
      render(<BookItem book={{ ...book, status: "coming-soon" }} />);
      expect(screen.getByText(/Coming soon/)).toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
      expect(screen.queryByText("Opens in a new tab")).not.toBeInTheDocument();
    });

    it("renders as an article separated by a hairline", () => {
      render(<BookItem book={book} />);
      const article = screen.getByRole("article");
      expect(article.className).toContain("border-t");
    });
  });

  describe("compact variant", () => {
    it("links the cover to the books page", () => {
      render(<BookItem book={book} variant="compact" />);
      const link = screen.getByRole("link", {
        name: `${book.title}, on the books page`,
      });
      expect(link).toHaveAttribute("href", "/books");
      expect(within(link).getByRole("presentation")).toHaveAttribute("alt", "");
    });

    it("uses an h3 by default", () => {
      render(<BookItem book={book} variant="compact" />);
      expect(
        screen.getByRole("heading", { level: 3, name: book.title })
      ).toBeInTheDocument();
    });

    it("shows status, description and an arrow link to Amazon", () => {
      render(<BookItem book={book} variant="compact" />);
      expect(screen.getByText("Available now")).toBeInTheDocument();
      expect(screen.getByText(book.description)).toBeInTheDocument();
      const link = screen.getByRole("link", { name: "Buy on Amazon" });
      expect(link).toHaveAttribute("href", book.purchaseLinks[0].url);
      expect(link.textContent).toContain("↗");
    });

    it("does not render the page count", () => {
      render(<BookItem book={book} variant="compact" />);
      expect(screen.queryByText("76 pages")).not.toBeInTheDocument();
    });
  });
});

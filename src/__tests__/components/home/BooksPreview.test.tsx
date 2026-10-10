import { render, screen, within } from "@testing-library/react";
import { BooksPreview } from "@/components/home/BooksPreview";
import { books, type Book } from "@/content/books";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

describe("BooksPreview", () => {
  it("renders a section labelled by its heading", () => {
    render(<BooksPreview />);
    const section = screen.getByTestId("books-preview");
    expect(section).toHaveAttribute("aria-labelledby", "books-preview-title");
    expect(
      screen.getByRole("region", { name: "Two books, one idea" })
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and h2", () => {
    render(<BooksPreview />);
    expect(screen.getByText("Books")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Two books, one idea" })
    ).toBeInTheDocument();
  });

  it("defaults to every book in the content", () => {
    render(<BooksPreview />);
    const section = screen.getByTestId("books-preview");
    expect(within(section).getAllByRole("article")).toHaveLength(books.length);
    for (const book of books) {
      expect(
        screen.getByRole("heading", { level: 3, name: book.title })
      ).toBeInTheDocument();
    }
  });

  it("renders compact items whose cover links to the books page", () => {
    render(<BooksPreview />);
    const coverLink = screen.getByRole("link", {
      name: `${books[0].title}, on the books page`,
    });
    expect(coverLink).toHaveAttribute("href", "/books");
  });

  it("links each available book to its store", () => {
    render(<BooksPreview />);
    const buyLinks = screen.getAllByRole("link", { name: /buy on amazon/i });
    expect(buyLinks).toHaveLength(books.length);
    for (const link of buyLinks) {
      expect(link).toHaveAttribute("target", "_blank");
    }
  });

  it("accepts a books prop", () => {
    const one: Book[] = [books[1]];
    render(<BooksPreview books={one} />);
    const section = screen.getByTestId("books-preview");
    expect(within(section).getAllByRole("article")).toHaveLength(1);
    expect(
      screen.getByRole("heading", { level: 3, name: books[1].title })
    ).toBeInTheDocument();
  });
});

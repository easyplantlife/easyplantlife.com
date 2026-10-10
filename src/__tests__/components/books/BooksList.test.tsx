import { render, screen, within } from "@testing-library/react";
import { BooksList } from "@/components/books/BooksList";
import type { Book } from "@/content/books";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

const books: Book[] = [
  {
    id: "one",
    title: "Book One",
    tagline: "The first",
    description: "First description",
    coverImage: "/images/books/one.png",
    status: "available",
    purchaseLinks: [{ label: "Buy on Amazon", url: "https://amazon.com/1" }],
  },
  {
    id: "two",
    title: "Book Two",
    tagline: "The second",
    description: "Second description",
    coverImage: "/images/books/two.png",
    status: "coming-soon",
    purchaseLinks: [],
  },
];

describe("BooksList", () => {
  it("renders one full row per book", () => {
    render(<BooksList books={books} />);
    const rows = screen.getAllByRole("article");
    expect(rows).toHaveLength(2);
    expect(
      within(rows[0]).getByRole("heading", { level: 2, name: "Book One" })
    ).toBeInTheDocument();
    expect(
      within(rows[1]).getByRole("heading", { level: 2, name: "Book Two" })
    ).toBeInTheDocument();
  });

  it("stacks rows in a column closed by a hairline", () => {
    render(<BooksList books={books} data-testid="books-list" />);
    const list = screen.getByTestId("books-list");
    expect(list.className).toContain("flex-col");
    expect(list.className).toContain("border-b");
  });

  it("renders the buy link only for available books", () => {
    render(<BooksList books={books} />);
    expect(
      screen.getAllByRole("link", { name: /buy on amazon/i })
    ).toHaveLength(1);
  });

  it("renders nothing for an empty list", () => {
    render(<BooksList books={[]} />);
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("merges a custom className", () => {
    render(<BooksList books={books} className="mt-4" data-testid="l" />);
    expect(screen.getByTestId("l").className).toContain("mt-4");
  });
});

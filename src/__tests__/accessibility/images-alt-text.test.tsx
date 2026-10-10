/**
 * Image Alt Text Tests
 *
 * Verifies that every image is either described (informative) or hidden
 * (decorative, inside an element that already carries the meaning).
 * Required for WCAG 2.1 compliance.
 */

import { render, screen, within } from "@testing-library/react";
import { Brand } from "@/components/Brand";
import { Hero } from "@/components/home/Hero";
import { AboutContent } from "@/components/about/AboutContent";
import { BookItem } from "@/components/books/BookItem";
import { BlogPostRow } from "@/components/blog/BlogPostRow";

// Mock next/link
jest.mock("next/link", () => {
  return function MockNextLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock next/image - filter out Next.js-specific props
jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage(props: {
    src: string;
    alt: string;
    priority?: boolean;
    fill?: boolean;
    [key: string]: unknown;
  }) {
    const { priority, fill, ...htmlProps } = props;
    void priority;
    void fill;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...htmlProps} />;
  },
}));

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
  trackFormView: jest.fn(),
  trackNewsletterSubmit: jest.fn(),
  trackContactSubmit: jest.fn(),
}));

const mockBook = {
  id: "test-book",
  title: "The Plant Care Guide",
  tagline: "The practical one",
  description: "A book about caring for plants",
  coverImage: "/images/books/plant-care-guide.jpg",
  status: "available" as const,
  purchaseLinks: [
    { label: "Buy on Amazon", url: "https://amazon.com/plant-care-guide" },
  ],
};

describe("Image Alt Text", () => {
  describe("Brand mark", () => {
    it("is decorative: the wordmark carries the name", () => {
      render(<Brand />);
      const img = document.querySelector("img");
      expect(img).toHaveAttribute("alt", "");
      expect(img).toHaveAttribute("aria-hidden", "true");
      expect(
        screen.getByRole("link", { name: /easy plant life, home/i })
      ).toBeInTheDocument();
    });
  });

  describe("Hero photo", () => {
    it("has descriptive alt text naming both books", () => {
      render(<Hero />);
      const photo = within(screen.getByTestId("hero-books")).getByRole("img");
      const alt = photo.getAttribute("alt") ?? "";
      expect(alt).not.toBe("");
      expect(alt).toContain("The Everyday Vegan Playbook");
      expect(alt).toContain("The Normal Vegan");
    });
  });

  describe("BookItem (full)", () => {
    it("has descriptive alt text for the cover", () => {
      render(<BookItem book={mockBook} />);
      const image = screen.getByRole("img");

      expect(image.getAttribute("alt")).toBe("Cover of The Plant Care Guide");
    });

    it("handles books with special characters in title", () => {
      render(
        <BookItem book={{ ...mockBook, title: "Plant's Life: A Journey" }} />
      );
      expect(screen.getByRole("img").getAttribute("alt")).toBe(
        "Cover of Plant's Life: A Journey"
      );
    });
  });

  describe("BookItem (compact)", () => {
    it("cover is decorative inside a link that names the book", () => {
      render(<BookItem book={mockBook} variant="compact" />);
      const link = screen.getByRole("link", {
        name: "The Plant Care Guide, on the books page",
      });
      const img = link.querySelector("img");
      expect(img).toHaveAttribute("alt", "");
      expect(link).toHaveAttribute("href", "/books");
    });
  });

  describe("AboutContent", () => {
    it("books photo is decorative inside a labelled link", () => {
      render(<AboutContent />);
      const link = screen.getByRole("link", {
        name: "The Easy Plant Life books",
      });
      expect(link.querySelector("img")).toHaveAttribute("alt", "");
    });

    it("author photo placeholder is labelled for assistive tech", () => {
      render(<AboutContent />);
      expect(
        screen.getByRole("img", { name: "Author photo placeholder" })
      ).toBeInTheDocument();
    });
  });

  describe("BlogPostRow", () => {
    it("renders no image: the title and excerpt are the content", () => {
      render(
        <BlogPostRow
          post={{
            title: "How to Keep It Simple",
            excerpt: "A short note",
            url: "https://medium.com/simple",
            publishedDate: new Date("2024-01-15"),
            thumbnail: "/images/blog/simple.jpg",
          }}
        />
      );
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(screen.getByText("How to Keep It Simple")).toBeInTheDocument();
    });
  });

  describe("SVG icons", () => {
    it("decorative arrows and icons are hidden from screen readers", () => {
      render(<Hero />);
      const arrows = screen.getAllByText("→");
      arrows.forEach((arrow) =>
        expect(arrow).toHaveAttribute("aria-hidden", "true")
      );
    });
  });
});

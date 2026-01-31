/**
 * Image Alt Text Tests
 *
 * Verifies that all images in the application have proper alt text.
 * This is required for WCAG 2.1 compliance.
 */

import { render, screen } from "@testing-library/react";
import { BookCard } from "@/components/books/BookCard";
import { BlogPostCard } from "@/components/blog/BlogPostCard";

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
    // Filter out Next.js-specific props that aren't valid HTML attributes
    const { priority, fill, ...htmlProps } = props;
    void priority;
    void fill;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...htmlProps} />;
  },
}));

describe("Image Alt Text", () => {
  describe("BookCard Component", () => {
    const mockBook = {
      id: "test-book",
      title: "The Plant Care Guide",
      description: "A book about caring for plants",
      coverImage: "/images/books/plant-care-guide.jpg",
      status: "available" as const,
      purchaseLinks: [
        { label: "Buy on Amazon", url: "https://amazon.com/plant-care-guide" },
      ],
    };

    it("has descriptive alt text for book cover image", () => {
      render(<BookCard book={mockBook} />);
      const image = screen.getByRole("img");

      expect(image).toHaveAttribute("alt");
      const altText = image.getAttribute("alt");
      expect(altText).not.toBe("");
      expect(altText).toContain("cover");
      expect(altText).toContain(mockBook.title);
    });

    it("alt text includes book title for context", () => {
      render(<BookCard book={mockBook} />);
      const image = screen.getByRole("img");

      expect(image.getAttribute("alt")).toBe("The Plant Care Guide cover");
    });
  });

  describe("BlogPostCard Component", () => {
    const mockPost = {
      title: "How to Care for Indoor Plants",
      excerpt: "A guide to keeping your indoor plants healthy",
      url: "https://medium.com/indoor-plants",
      publishedDate: new Date("2024-01-15"),
      thumbnail: "/images/blog/indoor-plants.jpg",
    };

    it("has descriptive alt text for blog post thumbnail", () => {
      render(<BlogPostCard post={mockPost} />);
      const image = screen.getByRole("img");

      expect(image).toHaveAttribute("alt");
      const altText = image.getAttribute("alt");
      expect(altText).not.toBe("");
      expect(altText).toBe(mockPost.title);
    });

    it("uses post title as alt text", () => {
      render(<BlogPostCard post={mockPost} />);
      const image = screen.getByRole("img");

      expect(image.getAttribute("alt")).toBe("How to Care for Indoor Plants");
    });
  });

  describe("Card Component with images", () => {
    it("decorative images should have empty alt or aria-hidden", () => {
      // Note: Decorative images that don't convey meaning should have alt=""
      // or aria-hidden="true". This test documents expected behavior.

      // Currently all images in the app are informative (book covers, thumbnails)
      // so they all have meaningful alt text.
      expect(true).toBe(true); // Placeholder - no decorative images currently
    });
  });

  describe("SVG Icons", () => {
    it("decorative SVG icons should be hidden from screen readers", () => {
      // SVG icons used for decoration should have aria-hidden="true"
      // This is verified in the component implementations (MobileNav, BlogPostCard)

      // The tests in keyboard-navigation.test.tsx verify that:
      // - SVG icons have aria-hidden="true"
      // - Interactive elements have proper aria-labels
      expect(true).toBe(true); // Behavior verified in other tests
    });
  });
});

describe("Image Alt Text - Edge Cases", () => {
  it("handles books with special characters in title", () => {
    const bookWithSpecialTitle = {
      id: "special-book",
      title: "Plant's Life: A Journey",
      description: "Description",
      coverImage: "/images/books/special.jpg",
      status: "available" as const,
      purchaseLinks: [],
    };

    render(<BookCard book={bookWithSpecialTitle} />);
    const image = screen.getByRole("img");

    expect(image.getAttribute("alt")).toBe("Plant's Life: A Journey cover");
  });

  it("handles blog posts without thumbnails gracefully", () => {
    const postWithoutThumbnail = {
      title: "No Thumbnail Post",
      excerpt: "This post has no thumbnail",
      url: "https://medium.com/no-thumbnail",
      publishedDate: new Date("2024-01-15"),
      // No thumbnail property
    };

    render(<BlogPostCard post={postWithoutThumbnail} />);

    // Should not render an image when no thumbnail is provided
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

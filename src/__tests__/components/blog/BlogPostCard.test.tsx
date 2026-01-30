/**
 * BlogPostCard Component Tests
 *
 * Tests for the BlogPostCard component following TDD approach.
 * Verifies rendering of blog post information and external links to Medium.
 *
 * Acceptance Criteria from issue #44:
 * - [ ] BlogPostCard component created
 * - [ ] Displays title prominently
 * - [ ] Shows excerpt (truncated if needed)
 * - [ ] Shows publication date
 * - [ ] Links to Medium article
 * - [ ] External link indicators present
 *
 * Test Cases:
 * - GIVEN a blog post card
 *   WHEN it renders
 *   THEN the title links to the Medium URL
 *   AND the link opens in a new tab
 */

import { render, screen } from "@testing-library/react";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import type { BlogPost } from "@/lib/types/blog";

const mockBlogPost: BlogPost = {
  title: "Finding Peace Through Plant Care",
  excerpt:
    "A short guide on how caring for plants can bring calm to your daily routine.",
  url: "https://medium.com/@easyplantlife/finding-peace-through-plant-care",
  publishedDate: new Date("2024-01-15"),
};

const mockBlogPostWithThumbnail: BlogPost = {
  title: "The Art of Slow Growth",
  excerpt:
    "Why patience is the most important skill in gardening and in life. Learn to embrace the slow progress.",
  url: "https://medium.com/@easyplantlife/the-art-of-slow-growth",
  publishedDate: new Date("2024-02-20"),
  thumbnail: "/images/blog/slow-growth.jpg",
  readTime: 5,
};

const mockBlogPostWithLongExcerpt: BlogPost = {
  title: "Understanding Your Plants",
  excerpt:
    "A comprehensive guide to understanding what your plants are telling you through their leaves, stems, and overall appearance. This detailed exploration covers common signs of plant health and distress that every plant parent should know about.",
  url: "https://medium.com/@easyplantlife/understanding-your-plants",
  publishedDate: new Date("2024-03-10"),
};

describe("BlogPostCard Component", () => {
  describe("Rendering", () => {
    it("renders as an article element", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      const card = screen.getByRole("article");
      expect(card).toBeInTheDocument();
    });

    it("renders the post title", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      expect(
        screen.getByText("Finding Peace Through Plant Care")
      ).toBeInTheDocument();
    });

    it("renders the post excerpt", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      expect(
        screen.getByText(
          "A short guide on how caring for plants can bring calm to your daily routine."
        )
      ).toBeInTheDocument();
    });
  });

  describe("Title", () => {
    it("uses semantic heading for post title", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      const heading = screen.getByRole("heading", {
        name: "Finding Peace Through Plant Care",
      });
      expect(heading).toBeInTheDocument();
    });

    it("title is displayed prominently", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      const heading = screen.getByRole("heading", {
        name: "Finding Peace Through Plant Care",
      });
      // Title should be within a link
      expect(heading.closest("a")).toBeInTheDocument();
    });
  });

  describe("Excerpt", () => {
    it("displays the excerpt text", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      expect(
        screen.getByText(/caring for plants can bring calm/)
      ).toBeInTheDocument();
    });

    it("truncates long excerpts", () => {
      render(<BlogPostCard post={mockBlogPostWithLongExcerpt} />);
      // Should have truncation styling
      const excerptElement = screen.getByText(/comprehensive guide/);
      expect(excerptElement).toHaveClass("line-clamp-3");
    });
  });

  describe("Publication Date", () => {
    it("displays the publication date", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      // Date should be formatted and displayed - check for time element
      const timeElement = screen.getByRole("time");
      expect(timeElement).toBeInTheDocument();
    });

    it("formats date in a readable format", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      // Should show month, day, and year format
      const timeElement = screen.getByRole("time");
      // Check that it contains a date-like format (e.g., "Jan 15, 2024")
      expect(timeElement.textContent).toMatch(/\w{3} \d{1,2}, \d{4}/);
    });

    it("uses time element with datetime attribute", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      const timeElement = screen.getByRole("time");
      expect(timeElement).toBeInTheDocument();
      // datetime attribute should be in ISO format
      expect(timeElement).toHaveAttribute("dateTime");
      expect(timeElement.getAttribute("dateTime")).toMatch(
        /^\d{4}-\d{2}-\d{2}$/
      );
    });
  });

  describe("Medium Link", () => {
    it("links to the Medium article", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      const link = screen.getByRole("link", {
        name: /finding peace through plant care/i,
      });
      expect(link).toHaveAttribute(
        "href",
        "https://medium.com/@easyplantlife/finding-peace-through-plant-care"
      );
    });

    it("opens link in new tab", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      const link = screen.getByRole("link", {
        name: /finding peace through plant care/i,
      });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("has proper security attributes", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      const link = screen.getByRole("link", {
        name: /finding peace through plant care/i,
      });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("External Link Indicator", () => {
    it("shows external link indicator", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      // Should have an external link icon or text indicator
      const link = screen.getByRole("link", {
        name: /finding peace through plant care/i,
      });
      // Check for screen reader text or icon
      expect(link.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });

    it("has screen reader accessible external link text", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      expect(screen.getByText(/opens in new tab/i)).toBeInTheDocument();
    });
  });

  describe("Optional Thumbnail", () => {
    it("displays thumbnail when provided", () => {
      render(<BlogPostCard post={mockBlogPostWithThumbnail} />);
      const image = screen.getByRole("img", {
        name: /the art of slow growth/i,
      });
      expect(image).toBeInTheDocument();
    });

    it("thumbnail has correct alt text", () => {
      render(<BlogPostCard post={mockBlogPostWithThumbnail} />);
      const image = screen.getByRole("img", {
        name: /the art of slow growth/i,
      });
      expect(image).toHaveAttribute("alt", "The Art of Slow Growth");
    });

    it("does not render image section when no thumbnail", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("Optional Read Time", () => {
    it("displays read time when provided", () => {
      render(<BlogPostCard post={mockBlogPostWithThumbnail} />);
      expect(screen.getByText(/5 min read/i)).toBeInTheDocument();
    });

    it("does not display read time when not provided", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      expect(screen.queryByText(/min read/i)).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("link is keyboard accessible", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      const link = screen.getByRole("link", {
        name: /finding peace through plant care/i,
      });
      expect(link).not.toHaveAttribute("tabindex", "-1");
    });

    it("has proper focus styles", () => {
      render(<BlogPostCard post={mockBlogPost} />);
      const link = screen.getByRole("link", {
        name: /finding peace through plant care/i,
      });
      // Should have focus-visible classes
      expect(link).toHaveClass("focus-visible:ring-2");
    });
  });

  describe("Props and Customization", () => {
    it("accepts and applies custom className", () => {
      render(<BlogPostCard post={mockBlogPost} className="custom-class" />);
      const card = screen.getByRole("article");
      expect(card).toHaveClass("custom-class");
    });

    it("passes through HTML attributes", () => {
      render(<BlogPostCard post={mockBlogPost} data-testid="blog-post-card" />);
      expect(screen.getByTestId("blog-post-card")).toBeInTheDocument();
    });
  });
});

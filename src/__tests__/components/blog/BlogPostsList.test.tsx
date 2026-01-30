/**
 * BlogPostsList Component Tests
 *
 * Tests for the BlogPostsList component following TDD approach.
 * Verifies rendering of blog post lists with loading, empty, and error states.
 *
 * Acceptance Criteria from issue #45:
 * - [ ] BlogPostsList component created
 * - [ ] Accepts posts array as prop
 * - [ ] Handles empty state gracefully
 * - [ ] Loading state handled
 * - [ ] Error state handled
 *
 * Test Cases:
 * - GIVEN an empty posts array
 *   WHEN the list renders
 *   THEN a "no posts" message displays
 *
 * - GIVEN posts are loading
 *   WHEN the list renders
 *   THEN a loading indicator displays
 */

import { render, screen } from "@testing-library/react";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import type { BlogPost } from "@/lib/types/blog";

const mockPosts: BlogPost[] = [
  {
    title: "Finding Peace Through Plant Care",
    excerpt:
      "A short guide on how caring for plants can bring calm to your daily routine.",
    url: "https://medium.com/@easyplantlife/finding-peace-through-plant-care",
    publishedDate: new Date("2024-01-15"),
  },
  {
    title: "The Art of Slow Growth",
    excerpt:
      "Why patience is the most important skill in gardening and in life.",
    url: "https://medium.com/@easyplantlife/the-art-of-slow-growth",
    publishedDate: new Date("2024-02-20"),
    thumbnail: "/images/blog/slow-growth.jpg",
    readTime: 5,
  },
  {
    title: "Understanding Your Plants",
    excerpt:
      "A comprehensive guide to understanding what your plants are telling you.",
    url: "https://medium.com/@easyplantlife/understanding-your-plants",
    publishedDate: new Date("2024-03-10"),
  },
];

describe("BlogPostsList Component", () => {
  describe("Rendering Posts", () => {
    it("renders a list of blog posts", () => {
      render(<BlogPostsList posts={mockPosts} />);
      expect(
        screen.getByText("Finding Peace Through Plant Care")
      ).toBeInTheDocument();
      expect(screen.getByText("The Art of Slow Growth")).toBeInTheDocument();
      expect(screen.getByText("Understanding Your Plants")).toBeInTheDocument();
    });

    it("renders each post as an article", () => {
      render(<BlogPostsList posts={mockPosts} />);
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(3);
    });

    it("uses semantic list markup", () => {
      render(<BlogPostsList posts={mockPosts} />);
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(3);
    });
  });

  describe("Empty State", () => {
    it("displays a no posts message when posts array is empty", () => {
      render(<BlogPostsList posts={[]} />);
      expect(
        screen.getByText(/no posts/i, { exact: false })
      ).toBeInTheDocument();
    });

    it("does not render list when empty", () => {
      render(<BlogPostsList posts={[]} />);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("displays a loading indicator when loading", () => {
      render(<BlogPostsList posts={[]} isLoading />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("does not render posts while loading", () => {
      render(<BlogPostsList posts={mockPosts} isLoading />);
      expect(
        screen.queryByText("Finding Peace Through Plant Care")
      ).not.toBeInTheDocument();
    });

    it("has accessible loading state", () => {
      render(<BlogPostsList posts={[]} isLoading />);
      // Check for aria-live or status role for screen reader announcement
      const loadingElement = screen.getByText(/loading/i);
      expect(
        loadingElement.closest('[aria-live]') ||
          loadingElement.closest('[role="status"]')
      ).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("displays error message when error is provided", () => {
      render(<BlogPostsList posts={[]} error="Failed to load posts" />);
      expect(screen.getByText(/failed to load posts/i)).toBeInTheDocument();
    });

    it("does not render posts when error occurs", () => {
      render(
        <BlogPostsList posts={mockPosts} error="Failed to load posts" />
      );
      expect(
        screen.queryByText("Finding Peace Through Plant Care")
      ).not.toBeInTheDocument();
    });

    it("has accessible error state", () => {
      render(<BlogPostsList posts={[]} error="Failed to load posts" />);
      // Check for alert role for screen reader announcement
      const errorElement = screen.getByText(/failed to load posts/i);
      expect(errorElement.closest('[role="alert"]')).toBeInTheDocument();
    });
  });

  describe("Props and Customization", () => {
    it("accepts and applies custom className", () => {
      render(<BlogPostsList posts={mockPosts} className="custom-class" />);
      const list = screen.getByRole("list");
      expect(list).toHaveClass("custom-class");
    });

    it("passes through HTML attributes", () => {
      render(
        <BlogPostsList posts={mockPosts} data-testid="blog-posts-list" />
      );
      expect(screen.getByTestId("blog-posts-list")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has accessible name for the list", () => {
      render(<BlogPostsList posts={mockPosts} />);
      // List should have an accessible name via aria-label or aria-labelledby
      const list = screen.getByRole("list");
      expect(
        list.hasAttribute("aria-label") || list.hasAttribute("aria-labelledby")
      ).toBe(true);
    });

    it("empty state message is accessible", () => {
      render(<BlogPostsList posts={[]} />);
      const message = screen.getByText(/no posts/i, { exact: false });
      // Should not be hidden from screen readers
      expect(message).not.toHaveAttribute("aria-hidden", "true");
    });
  });
});

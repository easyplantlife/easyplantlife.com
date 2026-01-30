/**
 * Blog Page Tests
 *
 * Tests for the complete Blog page assembly following TDD approach.
 * Based on acceptance criteria from Issue #46 (M7-06):
 *
 * - [ ] Page uses PageLayout
 * - [ ] Fetches posts on load (SSR or SSG)
 * - [ ] Displays posts list
 * - [ ] Clear indication posts link to Medium
 * - [ ] Error handling for failed fetches
 * - [ ] Responsive
 */

import { render, screen } from "@testing-library/react";
import BlogPage from "@/app/blog/page";
import * as mediumService from "@/lib/api/medium";
import type { MediumPost } from "@/lib/api/medium";

// Mock the Medium service
jest.mock("@/lib/api/medium", () => ({
  fetchMediumPosts: jest.fn(),
}));

const mockPosts: MediumPost[] = [
  {
    id: "abc123",
    title: "Finding Peace Through Plant Care",
    excerpt:
      "A short guide on how caring for plants can bring calm to your daily routine.",
    url: "https://medium.com/@easyplantlife/finding-peace-through-plant-care",
    publishedDate: new Date("2024-01-15"),
  },
  {
    id: "def456",
    title: "The Art of Slow Growth",
    excerpt:
      "Why patience is the most important skill in gardening and in life.",
    url: "https://medium.com/@easyplantlife/the-art-of-slow-growth",
    publishedDate: new Date("2024-02-20"),
    thumbnail: "https://example.com/slow-growth.jpg",
  },
];

describe("Blog Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mediumService.fetchMediumPosts as jest.Mock).mockResolvedValue(mockPosts);
  });

  /**
   * Acceptance Criteria Tests (Issue #46 - M7-06)
   */
  describe("Acceptance Criteria (M7-06)", () => {
    it("uses PageLayout component with title 'Blog'", async () => {
      const Page = await BlogPage();
      render(Page);

      // PageLayout renders a main element
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();

      // Title is rendered as h1
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent(/blog/i);
    });

    it("fetches posts on load and displays them", async () => {
      const Page = await BlogPage();
      render(Page);

      // Verify posts are displayed
      expect(
        screen.getByText("Finding Peace Through Plant Care")
      ).toBeInTheDocument();
      expect(screen.getByText("The Art of Slow Growth")).toBeInTheDocument();

      // Verify fetchMediumPosts was called
      expect(mediumService.fetchMediumPosts).toHaveBeenCalled();
    });

    it("displays posts in BlogPostsList component", async () => {
      const Page = await BlogPage();
      render(Page);

      // BlogPostsList uses ul with role="list" and aria-label
      const list = screen.getByRole("list", { name: /blog posts/i });
      expect(list).toBeInTheDocument();

      // Each post renders as an article
      const articles = screen.getAllByRole("article");
      expect(articles).toHaveLength(2);
    });

    it("clearly indicates posts link to Medium with external link icons", async () => {
      const Page = await BlogPage();
      render(Page);

      // All post links should open in new tab (external Medium links)
      const links = screen.getAllByRole("link");
      const externalLinks = links.filter((link) =>
        link.getAttribute("href")?.includes("medium.com")
      );

      externalLinks.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });

      // Should have accessible screen reader text for external links
      const srTexts = screen.getAllByText(/opens in new tab/i);
      expect(srTexts.length).toBeGreaterThan(0);
    });

    it("handles errors gracefully when fetch fails", async () => {
      (mediumService.fetchMediumPosts as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      const Page = await BlogPage();
      render(Page);

      // Should display error message
      expect(
        screen.getByText(/unable to load blog posts/i)
      ).toBeInTheDocument();
    });

    it("uses responsive layout styles", async () => {
      const Page = await BlogPage();
      render(Page);

      const main = screen.getByRole("main");
      // PageLayout default variant: py-12 md:py-16
      expect(main).toHaveClass("py-12");
      expect(main).toHaveClass("md:py-16");
    });
  });

  describe("Page Structure", () => {
    it("renders a main element as the page container (via PageLayout)", async () => {
      const Page = await BlogPage();
      render(Page);
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("has exactly one main element for accessibility", async () => {
      const Page = await BlogPage();
      render(Page);
      expect(screen.getAllByRole("main")).toHaveLength(1);
    });

    it("renders the page title as h1 heading", async () => {
      const Page = await BlogPage();
      render(Page);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/blog/i);
    });
  });

  describe("PageLayout Integration", () => {
    it("uses PageLayout component with title prop", async () => {
      const Page = await BlogPage();
      render(Page);

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();

      // Title is rendered as h1 with font-heading class
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("font-heading");
    });

    it("has consistent vertical padding from PageLayout", async () => {
      const Page = await BlogPage();
      render(Page);
      const main = screen.getByRole("main");
      expect(main).toHaveClass("py-12");
      expect(main).toHaveClass("md:py-16");
    });

    it("content is wrapped in Container for max-width constraint", async () => {
      const Page = await BlogPage();
      render(Page);
      const list = screen.getByRole("list", { name: /blog posts/i });
      // Container has mx-auto and max-w-6xl
      const container = list.closest("[class*='mx-auto'][class*='max-w-']");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Intro Section", () => {
    it("renders intro text explaining the blog section", async () => {
      const Page = await BlogPage();
      render(Page);
      const intro = screen.getByTestId("blog-intro");
      expect(intro).toBeInTheDocument();
      // Intro should contain meaningful text about blog/Medium
      expect(intro.textContent?.length).toBeGreaterThan(20);
    });

    it("intro appears before the posts list", async () => {
      const Page = await BlogPage();
      render(Page);
      const intro = screen.getByTestId("blog-intro");
      const postsList = screen.getByRole("list", { name: /blog posts/i });

      expect(
        intro.compareDocumentPosition(postsList) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it("intro uses appropriate typography styles", async () => {
      const Page = await BlogPage();
      render(Page);
      const intro = screen.getByTestId("blog-intro");
      expect(intro).toHaveClass("text-text-secondary");
    });

    it("intro mentions Medium to indicate external content", async () => {
      const Page = await BlogPage();
      render(Page);
      const intro = screen.getByTestId("blog-intro");
      expect(intro.textContent?.toLowerCase()).toMatch(/medium/i);
    });
  });

  describe("BlogPostsList Integration", () => {
    it("renders the BlogPostsList component", async () => {
      const Page = await BlogPage();
      render(Page);
      const list = screen.getByRole("list", { name: /blog posts/i });
      expect(list).toBeInTheDocument();
    });

    it("renders post cards within the list", async () => {
      const Page = await BlogPage();
      render(Page);
      const articles = screen.getAllByRole("article");
      expect(articles.length).toBeGreaterThan(0);
    });

    it("converts MediumPost to BlogPost format", async () => {
      const Page = await BlogPage();
      render(Page);

      // Verify post data is correctly transformed and displayed
      expect(
        screen.getByText("Finding Peace Through Plant Care")
      ).toBeInTheDocument();
      // Date displayed in localized format (may vary by timezone)
      expect(screen.getByText(/jan 1\d, 2024/i)).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("displays empty state when no posts are available", async () => {
      (mediumService.fetchMediumPosts as jest.Mock).mockResolvedValue([]);

      const Page = await BlogPage();
      render(Page);

      expect(screen.getByText(/no posts/i)).toBeInTheDocument();
    });
  });

  describe("Content Flow", () => {
    it("title appears before intro", async () => {
      const Page = await BlogPage();
      render(Page);
      const title = screen.getByRole("heading", { level: 1 });
      const intro = screen.getByTestId("blog-intro");

      expect(
        title.compareDocumentPosition(intro) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it("intro appears before posts list", async () => {
      const Page = await BlogPage();
      render(Page);
      const intro = screen.getByTestId("blog-intro");
      const postsList = screen.getByRole("list", { name: /blog posts/i });

      expect(
        intro.compareDocumentPosition(postsList) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });

  describe("Responsive Design", () => {
    it("uses responsive vertical padding", async () => {
      const Page = await BlogPage();
      render(Page);
      const main = screen.getByRole("main");
      expect(main).toHaveClass("py-12");
      expect(main).toHaveClass("md:py-16");
    });

    it("uses responsive horizontal padding via Container", async () => {
      const Page = await BlogPage();
      render(Page);
      const list = screen.getByRole("list", { name: /blog posts/i });
      const container = list.closest("[class*='px-4']");
      expect(container).toHaveClass("px-4");
      expect(container).toHaveClass("md:px-6");
      expect(container).toHaveClass("lg:px-8");
    });
  });

  describe("Accessibility", () => {
    it("has proper landmark with main element", async () => {
      const Page = await BlogPage();
      render(Page);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("post cards are marked as articles for semantics", async () => {
      const Page = await BlogPage();
      render(Page);
      const articles = screen.getAllByRole("article");
      expect(articles.length).toBeGreaterThan(0);
    });

    it("external links have accessible indication", async () => {
      const Page = await BlogPage();
      render(Page);

      // Screen reader text for external links
      const srTexts = screen.getAllByText(/opens in new tab/i);
      srTexts.forEach((text) => {
        expect(text).toHaveClass("sr-only");
      });
    });

    it("error state has alert role", async () => {
      (mediumService.fetchMediumPosts as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      const Page = await BlogPage();
      render(Page);

      const errorElement = screen.getByRole("alert");
      expect(errorElement).toBeInTheDocument();
    });
  });

  describe("Visual Design - Brand Compliance", () => {
    it("page title uses brand heading font", async () => {
      const Page = await BlogPage();
      render(Page);
      const title = screen.getByRole("heading", { level: 1 });
      expect(title).toHaveClass("font-heading");
    });

    it("intro text uses appropriate secondary color", async () => {
      const Page = await BlogPage();
      render(Page);
      const intro = screen.getByTestId("blog-intro");
      expect(intro).toHaveClass("text-text-secondary");
    });

    it("has generous spacing between intro and posts list", async () => {
      const Page = await BlogPage();
      render(Page);
      const intro = screen.getByTestId("blog-intro");
      // Should have margin-bottom for spacing
      expect(intro).toHaveClass("mb-12");
    });
  });
});

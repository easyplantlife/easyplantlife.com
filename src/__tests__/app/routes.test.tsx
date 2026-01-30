/**
 * Page Routes Tests
 *
 * Tests for M3-06: Create All Page Route Files
 *
 * Acceptance Criteria:
 * - /app/page.tsx - Home (already exists)
 * - /app/about/page.tsx - About
 * - /app/books/page.tsx - Books
 * - /app/blog/page.tsx - Blog
 * - /app/newsletter/page.tsx - Newsletter
 * - /app/contact/page.tsx - Contact
 * - Each page has basic metadata
 * - Each page renders without error
 *
 * Test Cases:
 * GIVEN I navigate to /about
 * WHEN the page loads
 * THEN I see the About page (placeholder content OK)
 *
 * GIVEN I navigate to /nonexistent
 * WHEN the page loads
 * THEN I see a 404 page
 */

import { render, screen } from "@testing-library/react";

// Mock next/font/google
jest.mock("next/font/google", () => ({
  Lora: () => ({ variable: "--font-heading", className: "mock-lora" }),
  Source_Sans_3: () => ({
    variable: "--font-body",
    className: "mock-source-sans",
  }),
}));

// Mock the Medium service for Blog page
jest.mock("@/lib/api/medium", () => ({
  fetchMediumPosts: jest.fn().mockResolvedValue([
    {
      id: "test123",
      title: "Test Blog Post",
      excerpt: "Test excerpt for blog post.",
      url: "https://medium.com/@test/test-post",
      publishedDate: new Date("2024-01-15"),
    },
  ]),
}));

describe("Page Routes (M3-06)", () => {
  describe("About Page (/about)", () => {
    it("renders without error", async () => {
      const AboutPage = (await import("@/app/about/page")).default;
      render(<AboutPage />);
      expect(
        screen.getByRole("heading", { name: /about/i, level: 1 })
      ).toBeInTheDocument();
    });

    it("exports metadata with title", async () => {
      const { metadata } = await import("@/app/about/page");
      expect(metadata).toBeDefined();
      expect(metadata.title).toBeDefined();
      expect(metadata.title).toMatch(/about/i);
    });

    it("has descriptive placeholder content", async () => {
      const AboutPage = (await import("@/app/about/page")).default;
      render(<AboutPage />);
      expect(document.body.textContent).toBeTruthy();
    });
  });

  describe("Books Page (/books)", () => {
    it("renders without error", async () => {
      const BooksPage = (await import("@/app/books/page")).default;
      render(<BooksPage />);
      expect(
        screen.getByRole("heading", { name: /books/i, level: 1 })
      ).toBeInTheDocument();
    });

    it("exports metadata with title", async () => {
      const { metadata } = await import("@/app/books/page");
      expect(metadata).toBeDefined();
      expect(metadata.title).toBeDefined();
      expect(metadata.title).toMatch(/books/i);
    });

    it("has descriptive placeholder content", async () => {
      const BooksPage = (await import("@/app/books/page")).default;
      render(<BooksPage />);
      expect(document.body.textContent).toBeTruthy();
    });
  });

  describe("Blog Page (/blog)", () => {
    it("renders without error", async () => {
      const BlogPage = (await import("@/app/blog/page")).default;
      const Page = await BlogPage();
      render(Page);
      expect(
        screen.getByRole("heading", { name: /blog/i, level: 1 })
      ).toBeInTheDocument();
    });

    it("exports metadata with title", async () => {
      const { metadata } = await import("@/app/blog/page");
      expect(metadata).toBeDefined();
      expect(metadata.title).toBeDefined();
      expect(metadata.title).toMatch(/blog/i);
    });

    it("has descriptive placeholder content", async () => {
      const BlogPage = (await import("@/app/blog/page")).default;
      const Page = await BlogPage();
      render(Page);
      expect(document.body.textContent).toBeTruthy();
    });
  });

  describe("Newsletter Page (/newsletter)", () => {
    it("renders without error", async () => {
      const NewsletterPage = (await import("@/app/newsletter/page")).default;
      render(<NewsletterPage />);
      expect(
        screen.getByRole("heading", { name: /newsletter/i, level: 1 })
      ).toBeInTheDocument();
    });

    it("exports metadata with title", async () => {
      const { metadata } = await import("@/app/newsletter/page");
      expect(metadata).toBeDefined();
      expect(metadata.title).toBeDefined();
      expect(metadata.title).toMatch(/newsletter/i);
    });

    it("has descriptive placeholder content", async () => {
      const NewsletterPage = (await import("@/app/newsletter/page")).default;
      render(<NewsletterPage />);
      expect(document.body.textContent).toBeTruthy();
    });
  });

  describe("Contact Page (/contact)", () => {
    it("renders without error", async () => {
      const ContactPage = (await import("@/app/contact/page")).default;
      render(<ContactPage />);
      expect(
        screen.getByRole("heading", { name: /contact/i, level: 1 })
      ).toBeInTheDocument();
    });

    it("exports metadata with title", async () => {
      const { metadata } = await import("@/app/contact/page");
      expect(metadata).toBeDefined();
      expect(metadata.title).toBeDefined();
      expect(metadata.title).toMatch(/contact/i);
    });

    it("has descriptive placeholder content", async () => {
      const ContactPage = (await import("@/app/contact/page")).default;
      render(<ContactPage />);
      expect(document.body.textContent).toBeTruthy();
    });
  });

  describe("Home Page (/)", () => {
    it("renders without error", async () => {
      const HomePage = (await import("@/app/page")).default;
      render(<HomePage />);
      expect(
        screen.getByRole("heading", { name: /easy plant life/i, level: 1 })
      ).toBeInTheDocument();
    });
  });
});

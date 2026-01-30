/**
 * 404 Not Found Page Tests
 *
 * Tests for M3-07: Create Custom 404 Not Found Page
 *
 * Acceptance Criteria:
 * - /app/not-found.tsx created
 * - Friendly message
 * - Link back to home
 * - Consistent with brand styling
 * - No technical jargon
 *
 * Test Cases:
 * GIVEN I navigate to a nonexistent page
 * WHEN the page loads
 * THEN I see a friendly 404 page with a link to return home
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

// Mock next/link to avoid useContext issues in test environment
jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("404 Not Found Page (M3-07)", () => {
  describe("Rendering", () => {
    it("renders without error", async () => {
      const NotFoundPage = (await import("@/app/not-found")).default;
      render(<NotFoundPage />);
      expect(document.body).toBeInTheDocument();
    });

    it("has a main element for semantic structure", async () => {
      const NotFoundPage = (await import("@/app/not-found")).default;
      render(<NotFoundPage />);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });

  describe("Friendly Message", () => {
    it("displays a heading that is friendly and non-technical", async () => {
      const NotFoundPage = (await import("@/app/not-found")).default;
      render(<NotFoundPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      // Should not contain technical jargon
      expect(heading.textContent?.toLowerCase()).not.toContain("error");
      expect(heading.textContent?.toLowerCase()).not.toContain("404");
    });

    it("displays a descriptive message that is calm and helpful", async () => {
      const NotFoundPage = (await import("@/app/not-found")).default;
      render(<NotFoundPage />);
      // Should have some helpful text beyond just the heading
      const textContent = document.body.textContent;
      expect(textContent?.length).toBeGreaterThan(0);
      // Should not contain technical jargon
      expect(textContent?.toLowerCase()).not.toContain("error 404");
      expect(textContent?.toLowerCase()).not.toContain("not found");
    });
  });

  describe("Link Back to Home", () => {
    it("has a link that navigates to home page", async () => {
      const NotFoundPage = (await import("@/app/not-found")).default;
      render(<NotFoundPage />);
      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });

  describe("Brand Styling", () => {
    it("uses consistent vertical padding", async () => {
      const NotFoundPage = (await import("@/app/not-found")).default;
      render(<NotFoundPage />);
      const main = screen.getByRole("main");
      expect(main).toHaveClass("py-12");
    });

    it("uses Container component for consistent max-width and padding", async () => {
      const NotFoundPage = (await import("@/app/not-found")).default;
      render(<NotFoundPage />);
      const main = screen.getByRole("main");
      const container = main.firstElementChild;
      expect(container).toHaveClass("mx-auto");
      expect(container).toHaveClass("max-w-6xl");
    });

    it("uses brand font for heading", async () => {
      const NotFoundPage = (await import("@/app/not-found")).default;
      render(<NotFoundPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("font-heading");
    });

    it("centers content for a calm, focused experience", async () => {
      const NotFoundPage = (await import("@/app/not-found")).default;
      render(<NotFoundPage />);
      const main = screen.getByRole("main");
      // Content should be centered
      expect(main).toHaveClass("text-center");
    });
  });

  describe("Accessibility", () => {
    it("has semantic main landmark", async () => {
      const NotFoundPage = (await import("@/app/not-found")).default;
      render(<NotFoundPage />);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("has proper heading hierarchy with h1", async () => {
      const NotFoundPage = (await import("@/app/not-found")).default;
      render(<NotFoundPage />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("home link is keyboard accessible", async () => {
      const NotFoundPage = (await import("@/app/not-found")).default;
      render(<NotFoundPage />);
      const homeLink = screen.getByRole("link", { name: /home/i });
      // Link should be focusable (not have tabindex -1)
      expect(homeLink).not.toHaveAttribute("tabindex", "-1");
    });
  });
});

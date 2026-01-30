import { render, screen } from "@testing-library/react";
import { PageLayout } from "@/components/PageLayout";

/**
 * PageLayout Component Tests
 *
 * Tests for the reusable PageLayout component following TDD approach.
 * Verifies consistent structure, spacing, title handling, and hero variant.
 *
 * Acceptance Criteria (Issue #23):
 * - PageLayout component created
 * - Accepts title prop for page heading
 * - Consistent vertical padding
 * - Uses Container component
 * - Optional hero variant for home page
 */

describe("PageLayout Component", () => {
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(<PageLayout>Test content</PageLayout>);
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("renders as main element for semantic structure", () => {
      render(<PageLayout data-testid="page-layout">Content</PageLayout>);
      const layout = screen.getByTestId("page-layout");
      expect(layout.tagName).toBe("MAIN");
    });

    it("renders without title when not provided", () => {
      render(<PageLayout>Content</PageLayout>);
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("Title Prop", () => {
    it("renders title as h1 heading when provided", () => {
      render(<PageLayout title="Page Title">Content</PageLayout>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Page Title");
    });

    it("title uses Heading component styling", () => {
      render(<PageLayout title="Page Title">Content</PageLayout>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("font-heading");
    });

    it("title has appropriate margin below for spacing", () => {
      render(<PageLayout title="Page Title">Content</PageLayout>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("mb-8");
    });
  });

  describe("Vertical Padding", () => {
    it("has consistent vertical padding", () => {
      render(<PageLayout data-testid="page-layout">Content</PageLayout>);
      const layout = screen.getByTestId("page-layout");
      expect(layout).toHaveClass("py-12");
    });

    it("has larger vertical padding on larger screens", () => {
      render(<PageLayout data-testid="page-layout">Content</PageLayout>);
      const layout = screen.getByTestId("page-layout");
      expect(layout).toHaveClass("md:py-16");
    });
  });

  describe("Container Integration", () => {
    it("wraps content in Container component", () => {
      render(
        <PageLayout data-testid="page-layout">
          <div data-testid="child">Content</div>
        </PageLayout>
      );
      const child = screen.getByTestId("child");
      // Container has mx-auto class for centering
      const container = child.parentElement;
      expect(container).toHaveClass("mx-auto");
    });

    it("Container has default variant for general pages", () => {
      render(
        <PageLayout data-testid="page-layout">
          <div data-testid="child">Content</div>
        </PageLayout>
      );
      const child = screen.getByTestId("child");
      const container = child.parentElement;
      expect(container).toHaveClass("max-w-6xl");
    });

    it("Container has responsive horizontal padding", () => {
      render(
        <PageLayout data-testid="page-layout">
          <div data-testid="child">Content</div>
        </PageLayout>
      );
      const child = screen.getByTestId("child");
      const container = child.parentElement;
      expect(container).toHaveClass("px-4");
      expect(container).toHaveClass("md:px-6");
      expect(container).toHaveClass("lg:px-8");
    });
  });

  describe("Hero Variant", () => {
    it("renders hero variant when variant is hero", () => {
      render(
        <PageLayout variant="hero" data-testid="page-layout">
          Content
        </PageLayout>
      );
      const layout = screen.getByTestId("page-layout");
      expect(layout).toBeInTheDocument();
    });

    it("hero variant has increased vertical padding", () => {
      render(
        <PageLayout variant="hero" data-testid="page-layout">
          Content
        </PageLayout>
      );
      const layout = screen.getByTestId("page-layout");
      expect(layout).toHaveClass("py-16");
      expect(layout).toHaveClass("md:py-24");
    });

    it("hero variant can still render title", () => {
      render(
        <PageLayout variant="hero" title="Welcome">
          Content
        </PageLayout>
      );
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Welcome");
    });

    it("hero variant uses larger title size", () => {
      render(
        <PageLayout variant="hero" title="Welcome">
          Content
        </PageLayout>
      );
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("text-5xl");
    });

    it("default variant uses standard title size", () => {
      render(<PageLayout title="Page Title">Content</PageLayout>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("text-4xl");
    });
  });

  describe("Custom Styling", () => {
    it("accepts and applies custom className to main element", () => {
      render(
        <PageLayout className="custom-class" data-testid="page-layout">
          Content
        </PageLayout>
      );
      const layout = screen.getByTestId("page-layout");
      expect(layout).toHaveClass("custom-class");
    });

    it("custom className does not override base vertical padding", () => {
      render(
        <PageLayout className="custom-class" data-testid="page-layout">
          Content
        </PageLayout>
      );
      const layout = screen.getByTestId("page-layout");
      expect(layout).toHaveClass("py-12");
    });
  });

  describe("Props Forwarding", () => {
    it("passes through HTML attributes to main element", () => {
      render(
        <PageLayout
          data-testid="page-layout"
          id="main-content"
          aria-label="Main content area"
        >
          Content
        </PageLayout>
      );
      const layout = screen.getByTestId("page-layout");
      expect(layout).toHaveAttribute("id", "main-content");
      expect(layout).toHaveAttribute("aria-label", "Main content area");
    });
  });

  describe("Accessibility", () => {
    it("uses semantic main element for landmark navigation", () => {
      render(<PageLayout>Content</PageLayout>);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("title heading provides document structure", () => {
      render(<PageLayout title="About Us">Content</PageLayout>);
      // H1 heading is present for screen reader navigation
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });
});

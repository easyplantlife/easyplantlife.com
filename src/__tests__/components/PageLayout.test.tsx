import { render, screen } from "@testing-library/react";
import { PageLayout } from "@/components/PageLayout";

/**
 * PageLayout Component Tests
 *
 * Verifies the main landmark, the shared intro block (eyebrow, title, lead,
 * action), the Container integration and the narrow variant.
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

    it("renders without an intro when no title, eyebrow or lead is given", () => {
      render(<PageLayout>Content</PageLayout>);
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    });
  });

  describe("Intro Block", () => {
    it("renders title as h1 heading when provided", () => {
      render(<PageLayout title="Page Title">Content</PageLayout>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Page Title");
    });

    it("title uses the serif Heading styling", () => {
      render(<PageLayout title="Page Title">Content</PageLayout>);
      expect(screen.getByRole("heading", { level: 1 })).toHaveClass(
        "font-serif"
      );
    });

    it("renders an eyebrow above the title", () => {
      render(
        <PageLayout eyebrow="Books" title="Two short books">
          Content
        </PageLayout>
      );
      const eyebrow = screen.getByText("Books");
      expect(eyebrow).toHaveClass("uppercase");
      expect(
        eyebrow.compareDocumentPosition(
          screen.getByRole("heading", { level: 1 })
        )
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it("renders a lead paragraph under the title", () => {
      render(
        <PageLayout title="Blog" lead="The writing lives on Medium.">
          Content
        </PageLayout>
      );
      expect(screen.getByText("The writing lives on Medium.")).toHaveClass(
        "text-muted"
      );
    });

    it("renders an optional action beside the intro", () => {
      render(
        <PageLayout
          title="Blog"
          action={<a href="https://medium.com">Follow</a>}
        >
          Content
        </PageLayout>
      );
      expect(screen.getByRole("link", { name: "Follow" })).toBeInTheDocument();
    });

    it("wraps the intro in a header with space below it", () => {
      render(<PageLayout title="Page Title">Content</PageLayout>);
      const header = screen
        .getByRole("heading", { level: 1 })
        .closest("header");
      expect(header).toHaveClass("mb-12");
    });
  });

  describe("Vertical Padding", () => {
    it("has consistent vertical padding", () => {
      render(<PageLayout data-testid="page-layout">Content</PageLayout>);
      const layout = screen.getByTestId("page-layout");
      expect(layout).toHaveClass("pt-20");
      expect(layout).toHaveClass("pb-24");
    });

    it("fills the remaining height so the footer stays at the bottom", () => {
      render(<PageLayout data-testid="page-layout">Content</PageLayout>);
      expect(screen.getByTestId("page-layout")).toHaveClass("flex-1");
    });
  });

  describe("Container Integration", () => {
    it("wraps content in Container component", () => {
      render(
        <PageLayout data-testid="page-layout">
          <div data-testid="child">Content</div>
        </PageLayout>
      );
      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("mx-auto");
    });

    it("Container has default variant for general pages", () => {
      render(
        <PageLayout data-testid="page-layout">
          <div data-testid="child">Content</div>
        </PageLayout>
      );
      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("max-w-content");
    });

    it("Container has responsive horizontal padding", () => {
      render(
        <PageLayout data-testid="page-layout">
          <div data-testid="child">Content</div>
        </PageLayout>
      );
      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("px-5");
      expect(container).toHaveClass("sm:px-8");
      expect(container).toHaveClass("lg:px-12");
    });
  });

  describe("Narrow Variant", () => {
    it("uses the narrow container", () => {
      render(
        <PageLayout variant="narrow">
          <div data-testid="child">Content</div>
        </PageLayout>
      );
      const container = screen.getByTestId("child").parentElement;
      expect(container).toHaveClass("max-w-narrow");
    });

    it("centers the intro text", () => {
      render(
        <PageLayout variant="narrow" title="Newsletter">
          Content
        </PageLayout>
      );
      const header = screen
        .getByRole("heading", { level: 1 })
        .closest("header");
      expect(header).toHaveClass("text-center");
    });

    it("can still render a title", () => {
      render(
        <PageLayout variant="narrow" title="Welcome">
          Content
        </PageLayout>
      );
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Welcome"
      );
    });
  });

  describe("Custom Styling", () => {
    it("accepts and applies custom className to main element", () => {
      render(
        <PageLayout className="custom-class" data-testid="page-layout">
          Content
        </PageLayout>
      );
      expect(screen.getByTestId("page-layout")).toHaveClass("custom-class");
    });

    it("custom className does not override base vertical padding", () => {
      render(
        <PageLayout className="custom-class" data-testid="page-layout">
          Content
        </PageLayout>
      );
      expect(screen.getByTestId("page-layout")).toHaveClass("pt-20");
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
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });
});

/**
 * Layout Correctness Tests
 *
 * Tests that verify layout structure is correct across all pages and components.
 * Ensures proper semantic HTML structure and layout consistency.
 *
 * Acceptance Criteria:
 * - Layout is correct on all (browsers/devices)
 */

import { render, screen } from "@testing-library/react";
import * as fs from "fs";
import * as path from "path";

// Layout Components
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageLayout } from "@/components/PageLayout";

// Page Content Components
import { Hero } from "@/components/home/Hero";
import { SecondaryCTAs } from "@/components/home/SecondaryCTAs";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { AboutContent } from "@/components/about/AboutContent";
import { NewsletterContent } from "@/components/newsletter/NewsletterContent";
import { ContactContent } from "@/components/contact/ContactContent";
import { BooksList } from "@/components/books/BooksList";
import { BlogPostsList } from "@/components/blog/BlogPostsList";

// UI Components
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

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
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...htmlProps} />;
  },
}));

// Mock analytics
jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
  trackFormView: jest.fn(),
  trackNewsletterSubmit: jest.fn(),
  trackContactSubmit: jest.fn(),
}));

describe("Layout Correctness - Semantic HTML Structure", () => {
  describe("Header Component", () => {
    it("uses header element (banner landmark)", () => {
      render(<Header />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("has navigation landmark", () => {
      render(<Header />);
      expect(
        screen.getByRole("navigation", { name: /main/i })
      ).toBeInTheDocument();
    });

    it("logo is a link with proper text", () => {
      render(<Header />);
      const logoLink = screen.getByRole("link", { name: /easy plant life/i });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute("href", "/");
    });
  });

  describe("Footer Component", () => {
    it("uses footer element (contentinfo landmark)", () => {
      render(<Footer />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("contains navigation or content", () => {
      render(<Footer />);
      // Should have some text content
      expect(screen.getByRole("contentinfo")).not.toBeEmptyDOMElement();
    });
  });

  describe("PageLayout Component", () => {
    it("uses main element for content area", () => {
      render(
        <PageLayout>
          <p>Content</p>
        </PageLayout>
      );
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("renders children inside main", () => {
      render(
        <PageLayout>
          <p data-testid="page-content">Content</p>
        </PageLayout>
      );
      const main = screen.getByRole("main");
      expect(main).toContainElement(screen.getByTestId("page-content"));
    });

    it("applies vertical padding classes", () => {
      render(
        <PageLayout>
          <p>Content</p>
        </PageLayout>
      );
      const main = screen.getByRole("main");
      expect(main).toHaveClass("py-12");
      expect(main).toHaveClass("md:py-16");
    });

    it("can render with optional title", () => {
      render(
        <PageLayout title="Test Page">
          <p>Content</p>
        </PageLayout>
      );
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Test Page"
      );
    });
  });

  describe("Full Page Structure (Header + Main + Footer)", () => {
    it("can render complete page layout with all landmarks", () => {
      render(
        <>
          <Header />
          <PageLayout>
            <p>Content</p>
          </PageLayout>
          <Footer />
        </>
      );

      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });
});

describe("Layout Correctness - Heading Hierarchy", () => {
  describe("Page Components have proper heading levels", () => {
    it("Hero uses h1 for main heading", () => {
      render(<Hero />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it("AboutContent renders content sections with headings", () => {
      render(<AboutContent />);
      const headings = screen.getAllByRole("heading", { level: 2 });
      expect(headings.length).toBeGreaterThan(0);
    });

    it("NewsletterContent renders form", () => {
      render(<NewsletterContent />);
      expect(screen.getByTestId("newsletter-content")).toBeInTheDocument();
    });

    it("ContactContent renders form", () => {
      render(<ContactContent />);
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    });
  });

  describe("Heading Component renders correct levels", () => {
    it("renders h1 when level=1", () => {
      render(<Heading level={1}>Heading 1</Heading>);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Heading 1"
      );
    });

    it("renders h2 when level=2", () => {
      render(<Heading level={2}>Heading 2</Heading>);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Heading 2"
      );
    });

    it("renders h3 when level=3", () => {
      render(<Heading level={3}>Heading 3</Heading>);
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "Heading 3"
      );
    });

    it("renders h4 when level=4", () => {
      render(<Heading level={4}>Heading 4</Heading>);
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
        "Heading 4"
      );
    });
  });
});

describe("Layout Correctness - Container Widths", () => {
  it("Container has max-width constraint", () => {
    const { container } = render(
      <Container>
        <p>Content</p>
      </Container>
    );
    const containerEl = container.firstChild;
    expect(containerEl).toHaveClass("max-w-6xl");
  });

  it("Container is horizontally centered", () => {
    const { container } = render(
      <Container>
        <p>Content</p>
      </Container>
    );
    const containerEl = container.firstChild;
    expect(containerEl).toHaveClass("mx-auto");
  });

  it("Header inner content has max-width", () => {
    const { container } = render(<Header />);
    const innerContainer = container.querySelector(".max-w-7xl");
    expect(innerContainer).toBeInTheDocument();
  });
});

describe("Layout Correctness - Flex Layout", () => {
  it("Header uses flexbox for horizontal alignment", () => {
    const { container } = render(<Header />);
    const flexRow = container.querySelector(".flex.items-center");
    expect(flexRow).toBeInTheDocument();
  });

  it("Header content is space-between aligned", () => {
    const { container } = render(<Header />);
    const spaceBetween = container.querySelector(".justify-between");
    expect(spaceBetween).toBeInTheDocument();
  });
});

describe("Layout Correctness - Card Component", () => {
  it("has consistent padding", () => {
    const { container } = render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(container.firstChild).toHaveClass("p-6");
  });

  it("has rounded corners", () => {
    const { container } = render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(container.firstChild).toHaveClass("rounded-lg");
  });

  it("has background color", () => {
    const { container } = render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toMatch(/bg-/);
  });
});

describe("Layout Correctness - Text Component", () => {
  it("renders as paragraph by default", () => {
    render(<Text>Body text</Text>);
    const text = screen.getByText("Body text");
    expect(text.tagName).toBe("P");
  });

  it("can render as different elements", () => {
    render(<Text as="span">Span text</Text>);
    const text = screen.getByText("Span text");
    expect(text.tagName).toBe("SPAN");
  });
});

describe("Layout Correctness - List Components", () => {
  const mockBook = {
    id: "book-1",
    title: "Test Book",
    description: "Description",
    coverImage: "/cover.jpg",
    status: "available" as const,
    purchaseLinks: [{ label: "Buy", url: "https://example.com" }],
  };

  const mockPost = {
    title: "Test Post",
    excerpt: "Excerpt",
    url: "https://medium.com/test",
    publishedDate: new Date("2024-01-01"),
    thumbnail: "/thumb.jpg",
  };

  it("BooksList renders items", () => {
    render(
      <BooksList
        books={[mockBook, { ...mockBook, id: "book-2", title: "Second Book" }]}
      />
    );
    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("Second Book")).toBeInTheDocument();
  });

  it("BlogPostsList renders items", () => {
    render(
      <BlogPostsList
        posts={[
          mockPost,
          {
            ...mockPost,
            url: "https://medium.com/second",
            title: "Second Post",
          },
        ]}
      />
    );
    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });

  it("Empty BlogPostsList shows message", () => {
    render(<BlogPostsList posts={[]} />);
    expect(screen.getByText(/no posts/i)).toBeInTheDocument();
  });
});

describe("Layout Correctness - Form Layouts", () => {
  it("NewsletterCTA form has proper structure", () => {
    render(<NewsletterCTA />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /subscribe/i })
    ).toBeInTheDocument();
  });

  it("ContactContent form has all fields", () => {
    render(<ContactContent />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });
});

describe("Layout Correctness - CSS Class Consistency", () => {
  const componentsDir = path.join(process.cwd(), "src", "components");

  function getComponentFiles(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...getComponentFiles(fullPath));
      } else if (item.endsWith(".tsx") && !item.endsWith(".test.tsx")) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const componentFiles = getComponentFiles(componentsDir);

  it("all components use Tailwind classes (minimal inline styles)", () => {
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, "utf-8");
      // Should not have inline style objects in JSX (style={{ ... }})
      const inlineStyleCount = (content.match(/style=\{\{/g) || []).length;
      // Allow very few inline styles (0-2 per file for edge cases)
      expect(inlineStyleCount).toBeLessThanOrEqual(2);
    }
  });

  it("components generally use className or Script components for styling", () => {
    let classNameCount = 0;
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, "utf-8");
      // Most components should use className, but some (like GoogleAnalytics) use Script
      if (content.includes("className") || content.includes("<Script")) {
        classNameCount++;
      }
    }
    // Most components should follow this pattern
    expect(classNameCount).toBeGreaterThan(componentFiles.length * 0.9);
  });
});

describe("Layout Correctness - Spacing Consistency", () => {
  it("Container applies consistent horizontal padding", () => {
    const { container } = render(
      <Container>
        <p>Content</p>
      </Container>
    );
    expect(container.firstChild).toHaveClass("px-4");
  });

  it("Card applies consistent padding", () => {
    const { container } = render(
      <Card>
        <p>Content</p>
      </Card>
    );
    expect(container.firstChild).toHaveClass("p-6");
  });
});

describe("Layout Correctness - Visual Hierarchy", () => {
  it("SecondaryCTAs renders navigation links", () => {
    render(<SecondaryCTAs />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });

  it("Hero has visual prominence with larger text", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    // H1 wraps the logo; logo image has responsive width for visual prominence
    expect(h1).toBeInTheDocument();
    const logo = screen.getByRole("img", { name: /easy plant life/i });
    expect(logo.className).toMatch(/w-64|md:w-80|lg:w-96/);
  });
});

describe("Layout Correctness - Full Page Rendering", () => {
  it("Home page components render without errors", () => {
    expect(() =>
      render(
        <main>
          <Hero />
          <SecondaryCTAs />
          <NewsletterCTA />
        </main>
      )
    ).not.toThrow();
  });

  it("About page content renders correctly", () => {
    expect(() =>
      render(
        <PageLayout>
          <AboutContent />
        </PageLayout>
      )
    ).not.toThrow();
  });

  it("Newsletter page content renders correctly", () => {
    expect(() =>
      render(
        <PageLayout>
          <NewsletterContent />
        </PageLayout>
      )
    ).not.toThrow();
  });

  it("Contact page content renders correctly", () => {
    expect(() =>
      render(
        <PageLayout>
          <ContactContent />
        </PageLayout>
      )
    ).not.toThrow();
  });
});

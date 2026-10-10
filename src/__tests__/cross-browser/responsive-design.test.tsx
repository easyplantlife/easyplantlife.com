/**
 * Responsive Design Tests
 *
 * The redesign is intrinsically responsive: rows wrap, grids use
 * auto-fit columns and the header navigation wraps beneath the brand
 * instead of collapsing into a hamburger. These tests assert that
 * shape through class checks and component rendering.
 *
 * Acceptance Criteria:
 * - Mobile Safari (iOS) tested
 * - Chrome Mobile (Android) tested
 * - Layout is correct on all viewports
 */

import { render, screen, within } from "@testing-library/react";

// Layout Components
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageLayout } from "@/components/PageLayout";

// UI Components
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";

// Page Components
import { Hero } from "@/components/home/Hero";
import { IdeaSection } from "@/components/home/IdeaSection";
import { BooksPreview } from "@/components/home/BooksPreview";
import { AboutContent } from "@/components/about/AboutContent";
import { BookItem } from "@/components/books/BookItem";
import { BooksList } from "@/components/books/BooksList";
import { BlogPostRow } from "@/components/blog/BlogPostRow";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { NewsletterContent } from "@/components/newsletter/NewsletterContent";
import { ContactContent } from "@/components/contact/ContactContent";

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

// Mock analytics
jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
  trackFormView: jest.fn(),
  trackNewsletterSubmit: jest.fn(),
  trackContactSubmit: jest.fn(),
}));

const AUTO_FIT_GRID = /grid-cols-\[repeat\(auto-fit,minmax\(min\(100%,/;

const mockBook = {
  id: "test-book",
  title: "Test Book",
  tagline: "The practical one",
  description: "Test description",
  coverImage: "/test-cover.jpg",
  status: "available" as const,
  purchaseLinks: [{ label: "Buy", url: "https://example.com" }],
};

const mockPost = {
  title: "Test Post",
  excerpt: "Test excerpt",
  url: "https://medium.com/test",
  publishedDate: new Date("2024-01-01"),
};

describe("Responsive Design - Header Navigation", () => {
  it("has no hamburger menu: every link is always rendered", () => {
    render(<Header />);
    expect(
      screen.queryByRole("button", { name: /menu/i })
    ).not.toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(within(nav).getAllByRole("link")).toHaveLength(4);
    expect(
      screen.getByRole("link", { name: "Newsletter" })
    ).toBeInTheDocument();
  });

  it("navigation is never hidden behind a breakpoint", () => {
    render(<Header />);
    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(nav.className).not.toMatch(/\bhidden\b/);
    expect(nav.className).not.toContain("md:flex");
  });

  it("header row and navigation list wrap when space runs out", () => {
    render(<Header />);
    const banner = screen.getByRole("banner");
    const row = banner.firstElementChild as HTMLElement;
    expect(row.className).toContain("flex-wrap");
    expect(row.className).toContain("items-center");
    expect(row.className).toContain("justify-between");

    const list = screen
      .getByRole("navigation", { name: /main navigation/i })
      .querySelector("ul");
    expect(list?.className).toContain("flex-wrap");
  });

  it("uses the shared Container width and gutters", () => {
    render(<Header />);
    const row = screen.getByRole("banner").firstElementChild as HTMLElement;
    expect(row.className).toContain("max-w-content");
    expect(row.className).toContain("px-5");
    expect(row.className).toContain("sm:px-8");
    expect(row.className).toContain("lg:px-12");
  });
});

describe("Responsive Design - Footer", () => {
  it("renders with the shared container", () => {
    render(<Footer />);
    const inner = screen.getByRole("contentinfo")
      .firstElementChild as HTMLElement;
    expect(inner.className).toContain("max-w-content");
    expect(inner.className).toContain("px-5");
  });

  it("brand row and link list wrap", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: /footer/i });
    expect(nav.querySelector("ul")?.className).toContain("flex-wrap");
    expect((nav.parentElement as HTMLElement).className).toContain("flex-wrap");
  });

  it("all footer links are accessible", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => expect(link).toHaveAttribute("href"));
  });
});

describe("Responsive Design - Container Component", () => {
  function renderContainer(props = {}) {
    const { container } = render(
      <Container {...props}>
        <p>Content</p>
      </Container>
    );
    return container.firstChild as HTMLElement;
  }

  it("applies a max-width rather than a fixed width", () => {
    const el = renderContainer();
    expect(el).toHaveClass("max-w-content");
    expect(el.className).not.toMatch(/\bw-\d+px/);
  });

  it("centers content with mx-auto", () => {
    expect(renderContainer()).toHaveClass("mx-auto");
  });

  it("gutters grow with the viewport (px-5 sm:px-8 lg:px-12)", () => {
    const el = renderContainer();
    expect(el).toHaveClass("px-5");
    expect(el).toHaveClass("sm:px-8");
    expect(el).toHaveClass("lg:px-12");
  });

  it("narrow and prose variants still have gutters", () => {
    expect(renderContainer({ variant: "narrow" })).toHaveClass("px-5");
    expect(renderContainer({ variant: "prose" })).toHaveClass("px-5");
  });
});

describe("Responsive Design - Home Page Components", () => {
  describe("Hero", () => {
    it("uses an auto-fit grid so the photo stacks under the copy on phones", () => {
      render(<Hero />);
      const grid = screen.getByTestId("hero-section")
        .firstElementChild as HTMLElement;
      expect(grid.className).toMatch(AUTO_FIT_GRID);
    });

    it("uses fluid heading sizing", () => {
      render(<Hero />);
      expect(screen.getByRole("heading", { level: 1 }).className).toContain(
        "clamp("
      );
    });

    it("inline newsletter row wraps", () => {
      render(<NewsletterForm layout="inline" />);
      const row = screen.getByRole("form").firstElementChild as HTMLElement;
      expect(row.className).toContain("flex-wrap");
    });
  });

  describe("IdeaSection", () => {
    it("uses an auto-fit grid for its two columns", () => {
      render(<IdeaSection />);
      const grid = screen.getByTestId("idea-section")
        .firstElementChild as HTMLElement;
      expect(grid.className).toMatch(AUTO_FIT_GRID);
    });
  });

  describe("BooksPreview", () => {
    it("lays the books out in an auto-fit grid", () => {
      render(<BooksPreview />);
      const section = screen.getByTestId("books-preview");
      const grid = section.querySelector(".grid") as HTMLElement;
      expect(grid.className).toMatch(AUTO_FIT_GRID);
    });
  });
});

describe("Responsive Design - Page Content Components", () => {
  describe("AboutContent", () => {
    it("index and chapters sit in an auto-fit grid", () => {
      render(<AboutContent />);
      expect(screen.getByTestId("about-content").className).toMatch(
        AUTO_FIT_GRID
      );
    });

    it("renders section headings", () => {
      render(<AboutContent />);
      expect(screen.getAllByRole("heading", { level: 2 }).length).toBe(4);
    });
  });

  describe("NewsletterContent", () => {
    it("renders the form and wraps the expectation lists", () => {
      render(<NewsletterContent />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      const lists = screen.getByTestId("newsletter-content")
        .lastElementChild as HTMLElement;
      expect(lists.className).toMatch(AUTO_FIT_GRID);
    });
  });

  describe("ContactContent", () => {
    it("two columns collapse via auto-fit grid", () => {
      render(<ContactContent />);
      expect(screen.getByTestId("contact-content").className).toMatch(
        AUTO_FIT_GRID
      );
    });

    it("renders contact form with all fields", () => {
      render(<ContactContent />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });
  });
});

describe("Responsive Design - Rows and Lists", () => {
  describe("BookItem", () => {
    it("full row uses an auto-fit grid", () => {
      const { container } = render(<BookItem book={mockBook} />);
      expect((container.firstChild as HTMLElement).className).toMatch(
        AUTO_FIT_GRID
      );
    });

    it("compact row wraps", () => {
      const { container } = render(
        <BookItem book={mockBook} variant="compact" />
      );
      expect((container.firstChild as HTMLElement).className).toContain(
        "flex-wrap"
      );
    });
  });

  describe("BooksList", () => {
    it("renders list of books", () => {
      render(<BooksList books={[mockBook]} />);
      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });

    it("renders an empty list gracefully when no books", () => {
      const { container } = render(<BooksList books={[]} />);
      expect(container.firstChild?.childNodes.length).toBe(0);
    });
  });

  describe("BlogPostRow", () => {
    it("meta column wraps under the body on narrow screens", () => {
      const { container } = render(<BlogPostRow post={mockPost} />);
      expect((container.firstChild as HTMLElement).className).toContain(
        "flex-wrap"
      );
    });
  });

  describe("BlogPostsList", () => {
    it("renders list of posts", () => {
      render(<BlogPostsList posts={[mockPost]} />);
      expect(screen.getByText("Test Post")).toBeInTheDocument();
    });

    it("handles empty list gracefully", () => {
      render(<BlogPostsList posts={[]} />);
      expect(screen.getByText(/nothing published yet/i)).toBeInTheDocument();
    });
  });

  describe("Panel", () => {
    it("columns collapse via auto-fit grid", () => {
      render(
        <Panel columns data-testid="panel">
          <p>a</p>
          <p>b</p>
        </Panel>
      );
      expect(screen.getByTestId("panel").className).toMatch(AUTO_FIT_GRID);
    });
  });
});

describe("Responsive Design - Button Component", () => {
  it("buttons meet the 44px touch target (48px tall)", () => {
    render(<Button size="md">Touch Target</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-12");
  });

  it("large buttons are taller still", () => {
    render(<Button size="lg">Large Button</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-14");
  });

  it("small buttons stay at 40px, used only beside other controls", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10");
  });
});

describe("Responsive Design - PageLayout", () => {
  it("renders with main content area", () => {
    render(
      <PageLayout>
        <p>Page content</p>
      </PageLayout>
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("applies vertical padding", () => {
    render(
      <PageLayout>
        <p>Page content</p>
      </PageLayout>
    );
    const main = screen.getByRole("main");
    expect(main).toHaveClass("pt-20");
    expect(main).toHaveClass("pb-24");
  });

  it("wraps content in Container with responsive gutters", () => {
    render(
      <PageLayout>
        <p>Page content</p>
      </PageLayout>
    );
    const inner = screen.getByRole("main").firstElementChild as HTMLElement;
    expect(inner).toHaveClass("mx-auto");
    expect(inner).toHaveClass("px-5");
  });

  it("intro header wraps title and action", () => {
    render(
      <PageLayout title="Blog" action={<a href="/x">Action</a>}>
        <p>Page content</p>
      </PageLayout>
    );
    const header = screen.getByRole("heading", { level: 1 }).closest("header");
    expect(header?.className).toContain("flex-wrap");
  });
});

describe("Viewport Meta and Zoom", () => {
  it("layout components do not set fixed widths that prevent responsive behavior", () => {
    const { container } = render(<Header />);
    expect(container.innerHTML).not.toMatch(/width:\s*\d+px/);
  });

  it("no component relies on breakpoint-hidden navigation", () => {
    const { container } = render(
      <>
        <Header />
        <Footer />
      </>
    );
    expect(container.innerHTML).not.toContain("md:hidden");
  });
});

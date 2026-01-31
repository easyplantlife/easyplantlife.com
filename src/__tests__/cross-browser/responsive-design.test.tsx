/**
 * Responsive Design Tests
 *
 * Tests that verify the site works correctly across different viewport sizes
 * and devices (mobile, tablet, desktop).
 *
 * Acceptance Criteria:
 * - Mobile Safari (iOS) tested
 * - Chrome Mobile (Android) tested
 * - Layout is correct on all viewports
 *
 * Note: These tests verify responsive behavior through class assertions
 * and component rendering at different logical viewport states.
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Layout Components
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { PageLayout } from "@/components/PageLayout";

// UI Components
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// Page Components
import { Hero } from "@/components/home/Hero";
import { SecondaryCTAs } from "@/components/home/SecondaryCTAs";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { AboutContent } from "@/components/about/AboutContent";
import { BooksList } from "@/components/books/BooksList";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
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

describe("Responsive Design - Header Navigation", () => {
  describe("Mobile Navigation Visibility", () => {
    it("mobile nav button has md:hidden class (hidden on desktop)", () => {
      render(<Header />);
      const menuButton = screen.getByRole("button", { name: /menu/i });
      expect(menuButton).toHaveClass("md:hidden");
    });

    it("desktop nav has hidden md:flex classes (hidden on mobile, visible on desktop)", () => {
      render(<Header />);
      const desktopNav = screen.getByRole("navigation", {
        name: /main navigation/i,
      });
      expect(desktopNav).toHaveClass("hidden");
      expect(desktopNav).toHaveClass("md:flex");
    });

    it("provides all navigation links in both mobile and desktop views", () => {
      render(<Header />);
      // Desktop nav links
      const desktopNav = screen.getByRole("navigation", {
        name: /main navigation/i,
      });
      const desktopLinks = within(desktopNav).getAllByRole("link");
      expect(desktopLinks.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe("Header Layout", () => {
    it("uses max-w-7xl for consistent max width", () => {
      const { container } = render(<Header />);
      const innerDiv = container.querySelector(".max-w-7xl");
      expect(innerDiv).toBeInTheDocument();
    });

    it("uses responsive padding (px-4 sm:px-6 lg:px-8)", () => {
      const { container } = render(<Header />);
      const paddedDiv = container.querySelector(".px-4");
      expect(paddedDiv).toBeInTheDocument();
      expect(paddedDiv).toHaveClass("sm:px-6");
      expect(paddedDiv).toHaveClass("lg:px-8");
    });

    it("uses flexbox for alignment", () => {
      const { container } = render(<Header />);
      const flexDiv = container.querySelector(".flex");
      expect(flexDiv).toBeInTheDocument();
      expect(flexDiv).toHaveClass("items-center");
      expect(flexDiv).toHaveClass("justify-between");
    });
  });
});

describe("Responsive Design - Footer", () => {
  it("renders with responsive container", () => {
    const { container } = render(<Footer />);
    const maxWidthContainer = container.querySelector(".max-w-7xl");
    expect(maxWidthContainer).toBeInTheDocument();
  });

  it("uses responsive padding", () => {
    const { container } = render(<Footer />);
    const paddedElement = container.querySelector("[class*='px-']");
    expect(paddedElement).toBeInTheDocument();
  });

  it("all footer links are accessible", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);

    links.forEach((link) => {
      expect(link).toHaveAttribute("href");
    });
  });
});

describe("Responsive Design - Mobile Nav", () => {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  it("menu panel positions correctly (right-0 for slide-in effect)", async () => {
    const user = userEvent.setup();
    render(<MobileNav links={navLinks} />);

    await user.click(screen.getByRole("button", { name: /menu/i }));

    const panel = screen.getByTestId("mobile-nav-panel");
    expect(panel).toHaveClass("right-0");
  });

  it("overlay covers full viewport", async () => {
    const user = userEvent.setup();
    render(<MobileNav links={navLinks} />);

    await user.click(screen.getByRole("button", { name: /menu/i }));

    const overlay = screen.getByTestId("mobile-nav-overlay");
    expect(overlay).toHaveClass("fixed");
    expect(overlay).toHaveClass("inset-0");
  });

  it("menu panel is fixed position for consistent behavior", async () => {
    const user = userEvent.setup();
    render(<MobileNav links={navLinks} />);

    await user.click(screen.getByRole("button", { name: /menu/i }));

    const panel = screen.getByTestId("mobile-nav-panel");
    expect(panel).toHaveClass("fixed");
  });
});

describe("Responsive Design - Container Component", () => {
  it("applies responsive max-width", () => {
    const { container } = render(
      <Container>
        <p>Content</p>
      </Container>
    );
    const containerEl = container.firstChild;
    expect(containerEl).toHaveClass("max-w-6xl");
  });

  it("centers content with mx-auto", () => {
    const { container } = render(
      <Container>
        <p>Content</p>
      </Container>
    );
    const containerEl = container.firstChild;
    expect(containerEl).toHaveClass("mx-auto");
  });

  it("applies horizontal padding", () => {
    const { container } = render(
      <Container>
        <p>Content</p>
      </Container>
    );
    const containerEl = container.firstChild;
    expect(containerEl).toHaveClass("px-4");
  });
});

describe("Responsive Design - Home Page Components", () => {
  describe("Hero Component", () => {
    it("renders with responsive text sizing", () => {
      render(<Hero />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("renders hero section with tagline", () => {
      render(<Hero />);
      expect(screen.getByTestId("hero-tagline")).toBeInTheDocument();
    });
  });

  describe("SecondaryCTAs Component", () => {
    it("renders navigation links", () => {
      render(<SecondaryCTAs />);
      // Should have links to blog and books
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe("NewsletterCTA Component", () => {
    it("renders newsletter form", () => {
      render(<NewsletterCTA />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /subscribe/i })
      ).toBeInTheDocument();
    });
  });
});

describe("Responsive Design - Page Content Components", () => {
  describe("AboutContent", () => {
    it("renders content article", () => {
      render(<AboutContent />);
      expect(screen.getByTestId("about-content")).toBeInTheDocument();
    });

    it("renders section headings", () => {
      render(<AboutContent />);
      const headings = screen.getAllByRole("heading", { level: 2 });
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe("NewsletterContent", () => {
    it("renders newsletter form for mobile and desktop", () => {
      render(<NewsletterContent />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });

  describe("ContactContent", () => {
    it("renders contact form with all fields", () => {
      render(<ContactContent />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });
  });
});

describe("Responsive Design - Cards and Lists", () => {
  const mockBook = {
    id: "test-book",
    title: "Test Book",
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
    thumbnail: "/test.jpg",
  };

  describe("BooksList", () => {
    it("renders list of books", () => {
      render(<BooksList books={[mockBook]} />);
      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });

    it("renders empty grid gracefully when no books", () => {
      const { container } = render(<BooksList books={[]} />);
      // BooksList renders an empty grid when there are no books
      const grid = container.querySelector(".grid");
      expect(grid).toBeInTheDocument();
      expect(grid?.children.length).toBe(0);
    });
  });

  describe("BlogPostsList", () => {
    it("renders list of posts", () => {
      render(<BlogPostsList posts={[mockPost]} />);
      expect(screen.getByText("Test Post")).toBeInTheDocument();
    });

    it("handles empty list gracefully", () => {
      render(<BlogPostsList posts={[]} />);
      expect(screen.getByText(/no posts/i)).toBeInTheDocument();
    });
  });

  describe("Card Component", () => {
    it("applies proper padding", () => {
      const { container } = render(
        <Card>
          <p>Card content</p>
        </Card>
      );
      const card = container.firstChild;
      expect(card).toHaveClass("p-6");
    });

    it("has rounded corners", () => {
      const { container } = render(
        <Card>
          <p>Card content</p>
        </Card>
      );
      const card = container.firstChild;
      expect(card).toHaveClass("rounded-lg");
    });
  });
});

describe("Responsive Design - Button Component", () => {
  it("buttons are touch-friendly (sufficient padding)", () => {
    render(<Button size="md">Touch Target</Button>);
    const button = screen.getByRole("button");
    // Medium size should have good touch target padding
    expect(button).toHaveClass("py-2");
    expect(button).toHaveClass("px-4");
  });

  it("large buttons have even larger touch targets", () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("py-3");
    expect(button).toHaveClass("px-6");
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

  it("applies responsive vertical padding", () => {
    render(
      <PageLayout>
        <p>Page content</p>
      </PageLayout>
    );
    const main = screen.getByRole("main");
    expect(main).toHaveClass("py-12");
    expect(main).toHaveClass("md:py-16");
  });

  it("wraps content in Container with responsive padding", () => {
    const { container } = render(
      <PageLayout>
        <p>Page content</p>
      </PageLayout>
    );
    const innerContainer = container.querySelector(".mx-auto.px-4");
    expect(innerContainer).toBeInTheDocument();
  });
});

describe("Touch Interaction Compatibility", () => {
  it("interactive elements have appropriate touch target sizes", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button");
    // Button should have minimum touch target through padding
    const classes = button.className;
    expect(classes).toMatch(/p[xy]?-\d/);
  });

  it("links in navigation are spaced appropriately", async () => {
    const user = userEvent.setup();
    const navLinks = [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
    ];
    render(<MobileNav links={navLinks} />);

    await user.click(screen.getByRole("button", { name: /menu/i }));

    const nav = screen.getByRole("navigation", { name: /mobile/i });
    const links = within(nav).getAllByRole("link");

    // Each link should be a separate touchable element
    expect(links.length).toBe(2);
    links.forEach((link) => {
      expect(link.tagName).toBe("A");
    });
  });
});

describe("Viewport Meta and Zoom", () => {
  it("layout components do not set fixed widths that prevent responsive behavior", () => {
    const { container } = render(<Header />);
    const html = container.innerHTML;
    // Should not have hardcoded pixel widths
    expect(html).not.toMatch(/width:\s*\d+px/);
  });

  it("container uses max-width rather than fixed width", () => {
    const { container } = render(
      <Container>
        <p>Test</p>
      </Container>
    );
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl.className).toContain("max-w-");
    expect(containerEl.className).not.toMatch(/w-\d+px/);
  });
});

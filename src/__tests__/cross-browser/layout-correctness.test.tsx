/**
 * Layout Correctness Tests
 *
 * Tests that verify layout structure is correct across all pages and components.
 * Ensures proper semantic HTML structure and layout consistency.
 *
 * Acceptance Criteria:
 * - Layout is correct on all (browsers/devices)
 */

import { render, screen, within } from "@testing-library/react";
import * as fs from "fs";
import * as path from "path";

// Layout Components
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageLayout } from "@/components/PageLayout";

// Page Content Components
import { Hero } from "@/components/home/Hero";
import { IdeaSection } from "@/components/home/IdeaSection";
import { RecentWriting } from "@/components/home/RecentWriting";
import { BooksPreview } from "@/components/home/BooksPreview";
import { AboutContent } from "@/components/about/AboutContent";
import { NewsletterContent } from "@/components/newsletter/NewsletterContent";
import { ContactContent } from "@/components/contact/ContactContent";
import { BooksList } from "@/components/books/BooksList";
import { BlogPostsList } from "@/components/blog/BlogPostsList";

// UI Components
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
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

const mockBook = {
  id: "book-1",
  title: "Test Book",
  tagline: "The practical one",
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
};

describe("Layout Correctness - Semantic HTML Structure", () => {
  describe("Header Component", () => {
    it("uses header element (banner landmark)", () => {
      render(<Header />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("has a navigation landmark named Main navigation", () => {
      render(<Header />);
      expect(
        screen.getByRole("navigation", { name: "Main navigation" })
      ).toBeInTheDocument();
    });

    it("navigation links live in a list", () => {
      render(<Header />);
      const nav = screen.getByRole("navigation", { name: "Main navigation" });
      expect(within(nav).getByRole("list")).toBeInTheDocument();
      expect(within(nav).getAllByRole("listitem")).toHaveLength(4);
    });

    it("brand is a link to home with an accessible name", () => {
      render(<Header />);
      expect(
        screen.getByRole("link", { name: /easy plant life, home/i })
      ).toHaveAttribute("href", "/");
    });
  });

  describe("Footer Component", () => {
    it("uses footer element (contentinfo landmark)", () => {
      render(<Footer />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("has a navigation landmark named Footer navigation", () => {
      render(<Footer />);
      expect(
        screen.getByRole("navigation", { name: "Footer navigation" })
      ).toBeInTheDocument();
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
      expect(screen.getByRole("main")).toContainElement(
        screen.getByTestId("page-content")
      );
    });

    it("applies vertical padding classes", () => {
      render(
        <PageLayout>
          <p>Content</p>
        </PageLayout>
      );
      const main = screen.getByRole("main");
      expect(main).toHaveClass("pt-20");
      expect(main).toHaveClass("pb-24");
    });

    it("renders no intro header without title, eyebrow or lead", () => {
      render(
        <PageLayout>
          <p>Content</p>
        </PageLayout>
      );
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
      expect(screen.getByRole("main").querySelector("header")).toBeNull();
    });

    it("renders title as the h1 with eyebrow and lead", () => {
      render(
        <PageLayout eyebrow="Blog" title="Test Page" lead="One sentence.">
          <p>Content</p>
        </PageLayout>
      );
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Test Page"
      );
      expect(screen.getByText("Blog")).toBeInTheDocument();
      expect(screen.getByText("One sentence.")).toBeInTheDocument();
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
  it("Hero uses h1 for the headline and labels its section with it", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/living vegan/i);
    expect(screen.getByRole("region", { name: h1.textContent! })).toBe(
      screen.getByTestId("hero-section")
    );
  });

  it("home sections after the hero use h2", () => {
    render(
      <>
        <IdeaSection />
        <RecentWriting posts={[mockPost]} />
        <BooksPreview />
      </>
    );
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s.map((h) => h.textContent)).toEqual([
      expect.stringContaining("Simplicity over optimization"),
      "Recent writing",
      "Two books, one idea",
    ]);
  });

  it("list items on the home page use h3", () => {
    render(
      <>
        <RecentWriting posts={[mockPost]} />
        <BooksPreview />
      </>
    );
    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s.length).toBeGreaterThanOrEqual(3);
  });

  it("AboutContent renders four h2 chapters and no h1", () => {
    render(<AboutContent />);
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(4);
  });

  it("NewsletterContent renders the form without its own heading", () => {
    render(<NewsletterContent />);
    expect(screen.getByTestId("newsletter-content")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("ContactContent renders the h1 and the form", () => {
    render(<ContactContent />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Say hello."
    );
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
  });

  it("BooksList uses h2 per book", () => {
    render(<BooksList books={[mockBook]} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Test Book"
    );
  });

  describe("Heading Component renders correct levels", () => {
    it.each([1, 2, 3, 4] as const)("renders h%i when level=%i", (level) => {
      render(<Heading level={level}>Heading {level}</Heading>);
      expect(screen.getByRole("heading", { level })).toHaveTextContent(
        `Heading ${level}`
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
    expect(container.firstChild).toHaveClass("max-w-content");
  });

  it("Container is horizontally centered", () => {
    const { container } = render(
      <Container>
        <p>Content</p>
      </Container>
    );
    expect(container.firstChild).toHaveClass("mx-auto");
  });

  it("Header and Footer inner content share the same max-width", () => {
    render(
      <>
        <Header />
        <Footer />
      </>
    );
    expect(
      (screen.getByRole("banner").firstElementChild as HTMLElement).className
    ).toContain("max-w-content");
    expect(
      (screen.getByRole("contentinfo").firstElementChild as HTMLElement)
        .className
    ).toContain("max-w-content");
  });
});

describe("Layout Correctness - Flex Layout", () => {
  it("Header uses flexbox for horizontal alignment", () => {
    render(<Header />);
    const row = screen.getByRole("banner").firstElementChild as HTMLElement;
    expect(row.className).toContain("flex");
    expect(row.className).toContain("items-center");
    expect(row.className).toContain("justify-between");
  });
});

describe("Layout Correctness - Panel and Text", () => {
  it("Panel has consistent padding, radius and surface", () => {
    const { container } = render(
      <Panel>
        <p>Panel content</p>
      </Panel>
    );
    expect(container.firstChild).toHaveClass("p-7");
    expect(container.firstChild).toHaveClass("rounded-2xl");
    expect(container.firstChild).toHaveClass("bg-surface");
  });

  it("Text renders as paragraph by default", () => {
    render(<Text>Body text</Text>);
    expect(screen.getByText("Body text").tagName).toBe("P");
  });

  it("Text can render as different elements", () => {
    render(<Text as="span">Span text</Text>);
    expect(screen.getByText("Span text").tagName).toBe("SPAN");
  });
});

describe("Layout Correctness - List Components", () => {
  it("BooksList renders items", () => {
    render(
      <BooksList
        books={[mockBook, { ...mockBook, id: "book-2", title: "Second Book" }]}
      />
    );
    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("Second Book")).toBeInTheDocument();
  });

  it("BlogPostsList renders items in a labelled list", () => {
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
    const list = screen.getByRole("list", { name: "Blog posts" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  });

  it("Empty BlogPostsList shows a calm message", () => {
    render(<BlogPostsList posts={[]} />);
    expect(screen.getByText(/nothing published yet/i)).toBeInTheDocument();
  });

  it("BlogPostsList honours a limit", () => {
    render(
      <BlogPostsList
        limit={1}
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
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});

describe("Layout Correctness - Form Layouts", () => {
  it("Hero newsletter form has field and button", () => {
    render(<Hero />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get the notes/i })
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
    for (const item of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
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
      const inlineStyleCount = (content.match(/style=\{\{/g) || []).length;
      expect(inlineStyleCount).toBeLessThanOrEqual(2);
    }
  });

  it("components never hard-code brand hex colors (tokens only)", () => {
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, "utf-8");
      expect(content).not.toMatch(/#[0-9a-f]{6}\b/i);
    }
  });

  it("every component that renders markup styles it with className", () => {
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, "utf-8");
      // Providers, inline scripts and raw SVG icons render no styleable
      // markup; comments are ignored.
      const code = content
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
      const rendersMarkup =
        /<(?!(?:script|svg|path|circle)\b)[a-z][\w-]*[\s>]/.test(code);
      if (rendersMarkup) {
        expect(
          content.includes("className") || content.includes("<Script")
        ).toBe(true);
      }
    }
  });
});

describe("Layout Correctness - Visual Hierarchy", () => {
  it("Hero has visual prominence with fluid serif headline", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.className).toContain("font-serif");
    expect(h1.className).toContain("clamp(");
  });

  it("IdeaSection links onward to the About page", () => {
    render(<IdeaSection />);
    expect(
      screen.getByRole("link", { name: /more about why this exists/i })
    ).toHaveAttribute("href", "/about");
  });
});

describe("Layout Correctness - Full Page Rendering", () => {
  it("Home page sections render without errors", () => {
    expect(() =>
      render(
        <main>
          <Hero />
          <IdeaSection />
          <RecentWriting posts={[mockPost]} />
          <BooksPreview />
        </main>
      )
    ).not.toThrow();
  });

  it.each([
    ["About", <AboutContent key="about" />],
    ["Newsletter", <NewsletterContent key="newsletter" />],
    ["Contact", <ContactContent key="contact" />],
  ])("%s page content renders correctly", (_name, content) => {
    expect(() => render(<PageLayout>{content}</PageLayout>)).not.toThrow();
  });
});

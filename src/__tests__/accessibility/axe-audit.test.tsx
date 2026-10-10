/**
 * Automated Accessibility Audit Tests
 *
 * Uses jest-axe to run automated accessibility audits on all components.
 * Tests for WCAG 2.1 AA compliance.
 */

import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

// UI primitives
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Link } from "@/components/ui/Link";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusNote } from "@/components/ui/StatusNote";
import { Text } from "@/components/ui/Text";
import { Textarea } from "@/components/ui/Textarea";

// Layout and theme
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider, ThemeToggle } from "@/components/theme";

// Forms and page sections
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ContactForm } from "@/components/forms/ContactForm";
import { Hero } from "@/components/home/Hero";
import { IdeaSection } from "@/components/home/IdeaSection";
import { RecentWriting } from "@/components/home/RecentWriting";
import { BooksPreview } from "@/components/home/BooksPreview";
import { AboutContent } from "@/components/about/AboutContent";
import { BookItem } from "@/components/books/BookItem";
import { BooksList } from "@/components/books/BooksList";
import { BlogPostRow } from "@/components/blog/BlogPostRow";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import { NewsletterContent } from "@/components/newsletter/NewsletterContent";
import { ContactContent } from "@/components/contact/ContactContent";

expect.extend(toHaveNoViolations);

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
  id: "test-book",
  title: "Test Book",
  tagline: "The practical one",
  description: "Test description",
  coverImage: "/test-cover.jpg",
  status: "available" as const,
  pages: 76,
  purchaseLinks: [{ label: "Buy on Amazon", url: "https://amazon.com/test" }],
};

const mockPost = {
  title: "Test Blog Post",
  excerpt: "This is a test excerpt",
  url: "https://medium.com/test-post",
  publishedDate: new Date("2024-01-01"),
  readTime: 4,
};

async function expectNoViolations(ui: React.ReactElement) {
  const { container } = render(ui);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

describe("Accessibility Audit - UI Components", () => {
  describe("Button Component", () => {
    it("primary variant", () => expectNoViolations(<Button>Click me</Button>));
    it("secondary variant", () =>
      expectNoViolations(<Button variant="secondary">Secondary</Button>));
    it("ghost variant", () =>
      expectNoViolations(<Button variant="ghost">Ghost</Button>));
    it("disabled", () =>
      expectNoViolations(<Button disabled>Disabled</Button>));
  });

  describe("ButtonLink Component", () => {
    it("internal", () =>
      expectNoViolations(
        <ButtonLink href="/newsletter">Newsletter</ButtonLink>
      ));
    it("external", () =>
      expectNoViolations(
        <ButtonLink href="https://amazon.com/test">Buy on Amazon</ButtonLink>
      ));
  });

  describe("ArrowLink Component", () => {
    it("internal", () =>
      expectNoViolations(<ArrowLink href="/blog">Read the blog</ArrowLink>));
    it("external", () =>
      expectNoViolations(
        <ArrowLink href="https://medium.com/@easyplantlife">
          Read on Medium
        </ArrowLink>
      ));
  });

  describe("Input Component", () => {
    it("with label", () =>
      expectNoViolations(<Input label="Email" type="email" />));
    it("with hidden label", () =>
      expectNoViolations(<Input label="Email" type="email" hideLabel />));
    it("with hint", () =>
      expectNoViolations(<Input label="Email" hint="Only used to reply." />));
    it("with error state", () =>
      expectNoViolations(
        <Input label="Email" type="email" error="Invalid email" />
      ));
    it("without label but with aria-label", () =>
      expectNoViolations(
        <Input aria-label="Search" placeholder="Search..." />
      ));
  });

  describe("Textarea Component", () => {
    it("with label", () => expectNoViolations(<Textarea label="Message" />));
    it("with error state", () =>
      expectNoViolations(<Textarea label="Message" error="Required" />));
  });

  describe("Link Component", () => {
    it("internal link", () =>
      expectNoViolations(<Link href="/about">About Us</Link>));
    it("external link", () =>
      expectNoViolations(
        <Link href="https://example.com">External Link</Link>
      ));
  });

  describe("Heading, Eyebrow and Text", () => {
    it("h1", () =>
      expectNoViolations(<Heading level={1}>Main Heading</Heading>));
    it("h2", () =>
      expectNoViolations(<Heading level={2}>Section Heading</Heading>));
    it("eyebrow", () => expectNoViolations(<Eyebrow>From the blog</Eyebrow>));
    it("text", () => expectNoViolations(<Text>This is body text</Text>));
  });

  describe("SectionHeader Component", () => {
    it("with action", () =>
      expectNoViolations(
        <section aria-labelledby="sh-title">
          <SectionHeader
            eyebrow="From the blog"
            title="Recent writing"
            titleId="sh-title"
            action={<ArrowLink href="/blog">All posts</ArrowLink>}
          />
        </section>
      ));
  });

  describe("Container Component", () => {
    it("with content", () =>
      expectNoViolations(
        <Container>
          <p>Content inside container</p>
        </Container>
      ));
  });

  describe("Panel Component", () => {
    it("as labelled aside", () =>
      expectNoViolations(
        <Panel as="aside" columns aria-labelledby="panel-title">
          <p id="panel-title">Not sure where to start?</p>
          <ArrowLink href="/books">See the books</ArrowLink>
        </Panel>
      ));
  });

  describe("StatusNote Component", () => {
    it("with actions", () =>
      expectNoViolations(
        <StatusNote
          title="You're on the list."
          actions={<ArrowLink href="/blog">Read something now</ArrowLink>}
        >
          Nothing else arrives until there is something worth sending.
        </StatusNote>
      ));
  });
});

describe("Accessibility Audit - Layout Components", () => {
  it("Header", () =>
    expectNoViolations(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    ));

  it("Footer", () => expectNoViolations(<Footer />));

  it("ThemeToggle", () =>
    expectNoViolations(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    ));
});

describe("Accessibility Audit - Form Components", () => {
  it("NewsletterForm (stacked)", () => expectNoViolations(<NewsletterForm />));
  it("NewsletterForm (inline, hidden label)", () =>
    expectNoViolations(
      <NewsletterForm layout="inline" submitLabel="Get the notes" />
    ));
  it("ContactForm", () => expectNoViolations(<ContactForm />));
});

describe("Accessibility Audit - Home Page Components", () => {
  it("Hero", () => expectNoViolations(<Hero />));
  it("IdeaSection", () => expectNoViolations(<IdeaSection />));
  it("RecentWriting with posts", () =>
    expectNoViolations(<RecentWriting posts={[mockPost]} />));
  it("RecentWriting with feed error", () =>
    expectNoViolations(
      <RecentWriting posts={[]} error="The latest posts could not be loaded." />
    ));
  it("BooksPreview", () => expectNoViolations(<BooksPreview />));
});

describe("Accessibility Audit - About Page Components", () => {
  it("AboutContent", () => expectNoViolations(<AboutContent />));
});

describe("Accessibility Audit - Books Page Components", () => {
  it("BookItem (full)", () => expectNoViolations(<BookItem book={mockBook} />));
  it("BookItem (compact)", () =>
    expectNoViolations(<BookItem book={mockBook} variant="compact" />));
  it("BookItem (coming soon)", () =>
    expectNoViolations(
      <BookItem book={{ ...mockBook, status: "coming-soon" }} />
    ));
  it("BooksList with books", () =>
    expectNoViolations(<BooksList books={[mockBook]} />));
  it("BooksList with empty list", () =>
    expectNoViolations(<BooksList books={[]} />));
});

describe("Accessibility Audit - Blog Page Components", () => {
  it("BlogPostRow", () => expectNoViolations(<BlogPostRow post={mockPost} />));
  it("BlogPostsList with posts", () =>
    expectNoViolations(<BlogPostsList posts={[mockPost]} />));
  it("BlogPostsList with empty list", () =>
    expectNoViolations(<BlogPostsList posts={[]} />));
  it("BlogPostsList with error", () =>
    expectNoViolations(<BlogPostsList posts={[]} error="Could not load." />));
});

describe("Accessibility Audit - Newsletter and Contact Pages", () => {
  it("NewsletterContent", () => expectNoViolations(<NewsletterContent />));
  it("ContactContent", () => expectNoViolations(<ContactContent />));
});

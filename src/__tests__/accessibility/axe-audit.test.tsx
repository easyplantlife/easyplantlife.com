/**
 * Automated Accessibility Audit Tests
 *
 * Uses jest-axe to run automated accessibility audits on all components and pages.
 * Tests for WCAG 2.1 AA compliance.
 */

import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

// Components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Link } from "@/components/ui/Link";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ContactForm } from "@/components/forms/ContactForm";
import { Hero } from "@/components/home/Hero";
import { SecondaryCTAs } from "@/components/home/SecondaryCTAs";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { AboutContent } from "@/components/about/AboutContent";
import { BookCard } from "@/components/books/BookCard";
import { BooksList } from "@/components/books/BooksList";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
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

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage(props: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock analytics
jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
  trackFormView: jest.fn(),
  trackNewsletterSubmit: jest.fn(),
  trackContactSubmit: jest.fn(),
}));

describe("Accessibility Audit - UI Components", () => {
  describe("Button Component", () => {
    it("should have no accessibility violations (primary variant)", async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations (secondary variant)", async () => {
      const { container } = render(
        <Button variant="secondary">Secondary</Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations (ghost variant)", async () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations when disabled", async () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Input Component", () => {
    it("should have no accessibility violations with label", async () => {
      const { container } = render(<Input label="Email" type="email" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations with error state", async () => {
      const { container } = render(
        <Input label="Email" type="email" error="Invalid email" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations without label but with aria-label", async () => {
      const { container } = render(
        <Input aria-label="Search" placeholder="Search..." />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Link Component", () => {
    it("should have no accessibility violations (internal link)", async () => {
      const { container } = render(<Link href="/about">About Us</Link>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations (external link)", async () => {
      const { container } = render(
        <Link href="https://example.com">External Link</Link>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Heading Component", () => {
    it("should have no accessibility violations (h1)", async () => {
      const { container } = render(<Heading level={1}>Main Heading</Heading>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations (h2)", async () => {
      const { container } = render(
        <Heading level={2}>Section Heading</Heading>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Text Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<Text>This is body text</Text>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Container Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(
        <Container>
          <p>Content inside container</p>
        </Container>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Card Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(
        <Card>
          <p>Card content</p>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe("Accessibility Audit - Layout Components", () => {
  describe("Header Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<Header />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Footer Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<Footer />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe("Accessibility Audit - Form Components", () => {
  describe("NewsletterForm Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<NewsletterForm />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("ContactForm Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<ContactForm />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe("Accessibility Audit - Home Page Components", () => {
  describe("Hero Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<Hero />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("SecondaryCTAs Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<SecondaryCTAs />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("NewsletterCTA Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<NewsletterCTA />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe("Accessibility Audit - About Page Components", () => {
  describe("AboutContent Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<AboutContent />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe("Accessibility Audit - Books Page Components", () => {
  const mockBook = {
    id: "test-book",
    title: "Test Book",
    description: "Test description",
    coverImage: "/test-cover.jpg",
    status: "available" as const,
    purchaseLinks: [{ label: "Buy on Amazon", url: "https://amazon.com/test" }],
  };

  describe("BookCard Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<BookCard book={mockBook} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("BooksList Component", () => {
    it("should have no accessibility violations with books", async () => {
      const { container } = render(<BooksList books={[mockBook]} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations with empty list", async () => {
      const { container } = render(<BooksList books={[]} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe("Accessibility Audit - Blog Page Components", () => {
  const mockPost = {
    title: "Test Blog Post",
    excerpt: "This is a test excerpt",
    url: "https://medium.com/test-post",
    publishedDate: new Date("2024-01-01"),
    thumbnail: "/test-thumbnail.jpg",
  };

  describe("BlogPostCard Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<BlogPostCard post={mockPost} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("BlogPostsList Component", () => {
    it("should have no accessibility violations with posts", async () => {
      const { container } = render(<BlogPostsList posts={[mockPost]} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations with empty list", async () => {
      const { container } = render(<BlogPostsList posts={[]} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe("Accessibility Audit - Newsletter Page Components", () => {
  describe("NewsletterContent Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<NewsletterContent />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe("Accessibility Audit - Contact Page Components", () => {
  describe("ContactContent Component", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<ContactContent />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

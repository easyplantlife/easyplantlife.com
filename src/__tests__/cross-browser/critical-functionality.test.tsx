/**
 * Critical Functionality Tests
 *
 * Tests that verify all critical site functionality works correctly.
 * These are the core features that must work across all browsers.
 *
 * Acceptance Criteria:
 * - All critical functionality works
 *
 * Critical functionality includes:
 * - Navigation (all links work)
 * - Forms (newsletter, contact)
 * - Interactive components (mobile menu, buttons)
 * - External links (blog, books)
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Components
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Input } from "@/components/ui/Input";
import { BookCard } from "@/components/books/BookCard";
import { BlogPostCard } from "@/components/blog/BlogPostCard";

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
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
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

describe("Critical Functionality - Navigation", () => {
  describe("Header Navigation Links", () => {
    const expectedLinks = [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Books", href: "/books" },
      { name: "Blog", href: "/blog" },
      { name: "Newsletter", href: "/newsletter" },
      { name: "Contact", href: "/contact" },
    ];

    it("logo links to home page", () => {
      render(<Header />);
      const logoLink = screen.getByText("Easy Plant Life").closest("a");
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("all navigation links have correct href attributes", () => {
      render(<Header />);
      const nav = screen.getByRole("navigation", { name: /main navigation/i });

      for (const link of expectedLinks) {
        const navLink = within(nav).getByRole("link", { name: link.name });
        expect(navLink).toHaveAttribute("href", link.href);
      }
    });

    it("navigation links are clickable elements", () => {
      render(<Header />);
      const nav = screen.getByRole("navigation", { name: /main navigation/i });
      const links = within(nav).getAllByRole("link");

      links.forEach((link) => {
        expect(link.tagName).toBe("A");
      });
    });
  });

  describe("Mobile Navigation Links", () => {
    const navLinks = [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Books", href: "/books" },
      { name: "Blog", href: "/blog" },
      { name: "Newsletter", href: "/newsletter" },
      { name: "Contact", href: "/contact" },
    ];

    it("mobile menu opens when button is clicked", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      await user.click(screen.getByRole("button", { name: /menu/i }));

      expect(
        screen.getByRole("navigation", { name: /mobile/i })
      ).toBeInTheDocument();
    });

    it("mobile menu closes when a link is clicked", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      await user.click(screen.getByRole("button", { name: /menu/i }));

      const nav = screen.getByRole("navigation", { name: /mobile/i });
      await user.click(within(nav).getByRole("link", { name: "About" }));

      expect(screen.getByRole("button", { name: /menu/i })).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("all mobile nav links have correct hrefs", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      await user.click(screen.getByRole("button", { name: /menu/i }));

      const nav = screen.getByRole("navigation", { name: /mobile/i });

      for (const link of navLinks) {
        const navLink = within(nav).getByRole("link", { name: link.name });
        expect(navLink).toHaveAttribute("href", link.href);
      }
    });
  });

  describe("Footer Navigation", () => {
    it("footer contains navigation links", () => {
      render(<Footer />);
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });

    it("footer logo links to home", () => {
      render(<Footer />);
      const logoLink = screen.getByText("Easy Plant Life").closest("a");
      expect(logoLink).toHaveAttribute("href", "/");
    });
  });
});

describe("Critical Functionality - Forms", () => {
  describe("Newsletter Form", () => {
    it("renders email input field", () => {
      render(<NewsletterForm />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it("renders submit button", () => {
      render(<NewsletterForm />);
      expect(
        screen.getByRole("button", { name: /subscribe/i })
      ).toBeInTheDocument();
    });

    it("allows typing in email field", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("calls onSubmit handler with email when form is submitted", async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={handleSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "test@example.com");
      await user.click(screen.getByRole("button", { name: /subscribe/i }));

      expect(handleSubmit).toHaveBeenCalledWith("test@example.com");
    });

    it("submits form when Enter is pressed in email field", async () => {
      const handleSubmit = jest.fn();
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={handleSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "test@example.com{Enter}");

      expect(handleSubmit).toHaveBeenCalledWith("test@example.com");
    });

    it("validates email format", () => {
      render(<NewsletterForm />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute("type", "email");
    });
  });

  describe("Contact Form", () => {
    it("renders all required fields", () => {
      render(<ContactForm />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it("renders submit button", () => {
      render(<ContactForm />);
      expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    });

    it("allows typing in all fields", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(messageInput, "Hello, this is a test message.");

      expect(nameInput).toHaveValue("John Doe");
      expect(emailInput).toHaveValue("john@example.com");
      expect(messageInput).toHaveValue("Hello, this is a test message.");
    });

    it("email field has email type for mobile keyboard optimization", () => {
      render(<ContactForm />);
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("message field is a textarea", () => {
      render(<ContactForm />);
      const messageInput = screen.getByLabelText(/message/i);
      expect(messageInput.tagName).toBe("TEXTAREA");
    });
  });
});

describe("Critical Functionality - Interactive Components", () => {
  describe("Button Component", () => {
    it("responds to click events", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Click Me</Button>);

      await user.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not respond when disabled", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      await user.click(screen.getByRole("button"));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("responds to keyboard Enter", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Press Enter</Button>);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("responds to keyboard Space", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Press Space</Button>);

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Input Component", () => {
    it("accepts text input", async () => {
      const user = userEvent.setup();
      render(<Input label="Test" />);

      const input = screen.getByLabelText("Test");
      await user.type(input, "Hello World");

      expect(input).toHaveValue("Hello World");
    });

    it("shows error state correctly", () => {
      render(<Input label="Email" error="Invalid email" />);
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });

    it("supports different input types", () => {
      render(<Input label="Password" type="password" />);
      const input = screen.getByLabelText("Password");
      expect(input).toHaveAttribute("type", "password");
    });
  });

  describe("Link Component", () => {
    it("internal links use correct href", () => {
      render(<Link href="/about">About Us</Link>);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/about");
    });

    it("external links open in new tab", () => {
      render(<Link href="https://example.com">External</Link>);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});

describe("Critical Functionality - External Links", () => {
  const mockBook = {
    id: "test-book",
    title: "Test Book",
    description: "A great book about plants",
    coverImage: "/test-cover.jpg",
    status: "available" as const,
    purchaseLinks: [
      { label: "Amazon", url: "https://amazon.com/book" },
      { label: "Barnes & Noble", url: "https://bn.com/book" },
    ],
  };

  const mockPost = {
    title: "Test Blog Post",
    excerpt: "This is a test excerpt for the blog post",
    url: "https://medium.com/@author/test-post",
    publishedDate: new Date("2024-01-15"),
    thumbnail: "/test-thumbnail.jpg",
  };

  describe("Book Purchase Links", () => {
    it("renders purchase links for available books", () => {
      render(<BookCard book={mockBook} />);

      const amazonLink = screen.getByRole("link", { name: /amazon/i });
      expect(amazonLink).toHaveAttribute("href", "https://amazon.com/book");
    });

    it("purchase links open in new tab", () => {
      render(<BookCard book={mockBook} />);

      const amazonLink = screen.getByRole("link", { name: /amazon/i });
      expect(amazonLink).toHaveAttribute("target", "_blank");
      expect(amazonLink).toHaveAttribute(
        "rel",
        expect.stringContaining("noopener")
      );
    });
  });

  describe("Blog Post Links", () => {
    it("renders link to full blog post", () => {
      render(<BlogPostCard post={mockPost} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "href",
        "https://medium.com/@author/test-post"
      );
    });

    it("blog links open in new tab (external Medium links)", () => {
      render(<BlogPostCard post={mockPost} />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
    });
  });
});

describe("Critical Functionality - Focus Management", () => {
  it("mobile menu traps focus when open", async () => {
    const user = userEvent.setup();
    const navLinks = [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
    ];
    render(<MobileNav links={navLinks} />);

    await user.click(screen.getByRole("button", { name: /menu/i }));

    // Focus should be on close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toHaveFocus();
  });

  it("focus returns to trigger when mobile menu closes", async () => {
    const user = userEvent.setup();
    const navLinks = [{ name: "Home", href: "/" }];
    render(<MobileNav links={navLinks} />);

    const menuButton = screen.getByRole("button", { name: /menu/i });
    await user.click(menuButton);
    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(menuButton).toHaveFocus();
  });
});

describe("Critical Functionality - Form Validation Feedback", () => {
  it("input shows error message when error prop is provided", () => {
    render(<Input label="Email" error="Please enter a valid email" />);
    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
  });

  it("input has aria-invalid when in error state", () => {
    render(<Input label="Email" error="Invalid" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("input links to error message via aria-describedby", () => {
    render(<Input label="Email" error="Invalid email" />);
    const input = screen.getByLabelText("Email");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();

    const errorMessage = document.getElementById(describedBy!);
    expect(errorMessage).toHaveTextContent("Invalid email");
  });
});

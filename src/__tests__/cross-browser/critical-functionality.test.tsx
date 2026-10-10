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
 * - Navigation (all links work, active page is marked)
 * - Forms (newsletter, contact) including their success states
 * - Interactive components (theme toggle, buttons)
 * - External links (blog, books)
 * - The home page composes and renders with the Medium feed
 */

import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Components
import Home from "@/app/page";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/theme";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Input } from "@/components/ui/Input";
import { BookItem } from "@/components/books/BookItem";
import { BlogPostRow } from "@/components/blog/BlogPostRow";
import { subscribeToNewsletter, sendContactMessage } from "@/lib/api/forms";
import { fetchMediumPosts } from "@/lib/api/medium";

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

// Forms post to the API routes by default; keep the network out of tests.
jest.mock("@/lib/api/forms", () => ({
  subscribeToNewsletter: jest.fn().mockResolvedValue(undefined),
  sendContactMessage: jest.fn().mockResolvedValue(undefined),
}));

// The home page reads the Medium feed on the server.
jest.mock("@/lib/api/medium", () => ({
  fetchMediumPosts: jest.fn().mockResolvedValue([]),
}));

const mockUsePathname = jest.fn<string | null, []>(() => null);
jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockUsePathname.mockReturnValue(null);
  (subscribeToNewsletter as jest.Mock).mockResolvedValue(undefined);
  (sendContactMessage as jest.Mock).mockResolvedValue(undefined);
  (fetchMediumPosts as jest.Mock).mockResolvedValue([]);
});

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  window.localStorage.clear();
});

describe("Critical Functionality - Navigation", () => {
  describe("Header Navigation Links", () => {
    const expectedLinks = [
      { name: "About", href: "/about" },
      { name: "Books", href: "/books" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ];

    it("brand links to home page", () => {
      render(<Header />);
      expect(
        screen.getByRole("link", { name: /easy plant life, home/i })
      ).toHaveAttribute("href", "/");
    });

    it("all navigation links have correct href attributes", () => {
      render(<Header />);
      const nav = screen.getByRole("navigation", { name: /main navigation/i });

      for (const link of expectedLinks) {
        expect(
          within(nav).getByRole("link", { name: link.name })
        ).toHaveAttribute("href", link.href);
      }
    });

    it("newsletter action links to the newsletter page", () => {
      render(<Header />);
      expect(screen.getByRole("link", { name: "Newsletter" })).toHaveAttribute(
        "href",
        "/newsletter"
      );
    });

    it("marks the current page with aria-current", () => {
      mockUsePathname.mockReturnValue("/books");
      render(<Header />);
      expect(screen.getByRole("link", { name: "Books" })).toHaveAttribute(
        "aria-current",
        "page"
      );
      expect(screen.getByRole("link", { name: "Blog" })).not.toHaveAttribute(
        "aria-current"
      );
    });

    it("navigation links are anchors", () => {
      render(<Header />);
      const nav = screen.getByRole("navigation", { name: /main navigation/i });
      within(nav)
        .getAllByRole("link")
        .forEach((link) => expect(link.tagName).toBe("A"));
    });
  });

  describe("Footer Navigation", () => {
    it("footer lists every page", () => {
      render(<Footer />);
      const nav = screen.getByRole("navigation", { name: /footer/i });
      const hrefs = within(nav)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href"));
      expect(hrefs).toEqual([
        "/about",
        "/books",
        "/blog",
        "/newsletter",
        "/contact",
      ]);
    });

    it("footer brand links to home", () => {
      render(<Footer />);
      expect(
        screen.getByRole("link", { name: /easy plant life, home/i })
      ).toHaveAttribute("href", "/");
    });
  });
});

describe("Critical Functionality - Theme", () => {
  it("toggle switches the document theme and remembers it", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    await user.click(screen.getByRole("button", { name: /switch to dark/i }));

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(window.localStorage.getItem("epl-theme")).toBe("dark");
    expect(
      screen.getByRole("button", { name: /switch to light/i })
    ).toBeInTheDocument();
  });
});

describe("Critical Functionality - Forms", () => {
  describe("Newsletter Form", () => {
    it("renders email input field and submit button", () => {
      render(<NewsletterForm />);
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
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
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={handleSubmit} />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.click(screen.getByRole("button", { name: /subscribe/i }));

      expect(handleSubmit).toHaveBeenCalledWith("test@example.com");
    });

    it("submits form when Enter is pressed in email field", async () => {
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={handleSubmit} />);

      await user.type(
        screen.getByLabelText(/email/i),
        "test@example.com{Enter}"
      );

      expect(handleSubmit).toHaveBeenCalledWith("test@example.com");
    });

    it("posts to the newsletter API by default and shows the success note", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.click(screen.getByRole("button", { name: /subscribe/i }));

      expect(subscribeToNewsletter).toHaveBeenCalledWith("test@example.com");
      await waitFor(() =>
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument()
      );
      expect(screen.getByRole("status")).toHaveTextContent(
        /you're on the list/i
      );
    });

    it("rejects an invalid address without calling the API", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm />);

      await user.type(screen.getByLabelText(/email/i), "not-an-email");
      await user.click(screen.getByRole("button", { name: /subscribe/i }));

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toHaveAttribute(
        "aria-invalid",
        "true"
      );
      expect(subscribeToNewsletter).not.toHaveBeenCalled();
    });

    it("shows an error when the API fails", async () => {
      (subscribeToNewsletter as jest.Mock).mockRejectedValueOnce(
        new Error("down")
      );
      const user = userEvent.setup();
      render(<NewsletterForm />);

      await user.type(screen.getByLabelText(/email/i), "test@example.com");
      await user.click(screen.getByRole("button", { name: /subscribe/i }));

      await waitFor(() =>
        expect(screen.getByTestId("newsletter-error")).toBeInTheDocument()
      );
    });
  });

  describe("Contact Form", () => {
    async function fillContactForm(user: ReturnType<typeof userEvent.setup>) {
      await user.type(screen.getByLabelText(/name/i), "John Doe");
      await user.type(screen.getByLabelText(/email/i), "john@example.com");
      await user.type(
        screen.getByLabelText(/message/i),
        "Hello, this is a test message."
      );
    }

    it("renders all required fields and the submit button", () => {
      render(<ContactForm />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
      expect(screen.getByLabelText(/message/i).tagName).toBe("TEXTAREA");
      expect(
        screen.getByRole("button", { name: /send message/i })
      ).toBeInTheDocument();
    });

    it("allows typing in all fields", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillContactForm(user);

      expect(screen.getByLabelText(/name/i)).toHaveValue("John Doe");
      expect(screen.getByLabelText(/email/i)).toHaveValue("john@example.com");
      expect(screen.getByLabelText(/message/i)).toHaveValue(
        "Hello, this is a test message."
      );
    });

    it("posts to the contact API by default and shows the success note", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillContactForm(user);
      await user.click(screen.getByRole("button", { name: /send message/i }));

      expect(sendContactMessage).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello, this is a test message.",
      });
      await waitFor(() =>
        expect(screen.getByTestId("contact-success")).toBeInTheDocument()
      );
      expect(
        screen.getByRole("button", { name: /send another/i })
      ).toBeInTheDocument();
    });

    it("validates required fields before sending", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.click(screen.getByRole("button", { name: /send message/i }));

      expect(screen.getByTestId("contact-error")).toHaveTextContent(
        /please enter your name/i
      );
      expect(sendContactMessage).not.toHaveBeenCalled();
    });

    it("silently succeeds without sending when the honeypot is filled", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await fillContactForm(user);
      await user.type(screen.getByTestId("contact-honeypot"), "spam");
      await user.click(screen.getByRole("button", { name: /send message/i }));

      await waitFor(() =>
        expect(screen.getByTestId("contact-success")).toBeInTheDocument()
      );
      expect(sendContactMessage).not.toHaveBeenCalled();
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

    it("responds to keyboard Enter and Space", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Press</Button>);

      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");
      await user.keyboard(" ");

      expect(handleClick).toHaveBeenCalledTimes(2);
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
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid email");
    });

    it("supports different input types", () => {
      render(<Input label="Password" type="password" />);
      expect(screen.getByLabelText("Password")).toHaveAttribute(
        "type",
        "password"
      );
    });
  });

  describe("Link Component", () => {
    it("internal links use correct href", () => {
      render(<Link href="/about">About Us</Link>);
      expect(screen.getByRole("link")).toHaveAttribute("href", "/about");
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
    tagline: "The practical one",
    description: "A great book about plants",
    coverImage: "/test-cover.jpg",
    status: "available" as const,
    purchaseLinks: [
      { label: "Buy on Amazon", url: "https://amazon.com/book" },
      { label: "Buy at Barnes & Noble", url: "https://bn.com/book" },
    ],
  };

  const mockPost = {
    title: "Test Blog Post",
    excerpt: "This is a test excerpt for the blog post",
    url: "https://medium.com/@author/test-post",
    publishedDate: new Date("2024-01-15"),
  };

  describe("Book Purchase Links", () => {
    it("renders every purchase link for available books", () => {
      render(<BookItem book={mockBook} />);

      expect(screen.getByRole("link", { name: /amazon/i })).toHaveAttribute(
        "href",
        "https://amazon.com/book"
      );
      expect(screen.getByRole("link", { name: /barnes/i })).toHaveAttribute(
        "href",
        "https://bn.com/book"
      );
    });

    it("purchase links open in new tab", () => {
      render(<BookItem book={mockBook} />);

      const amazonLink = screen.getByRole("link", { name: /amazon/i });
      expect(amazonLink).toHaveAttribute("target", "_blank");
      expect(amazonLink).toHaveAttribute(
        "rel",
        expect.stringContaining("noopener")
      );
    });

    it("hides purchase links for coming-soon books", () => {
      render(<BookItem book={{ ...mockBook, status: "coming-soon" }} />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
      expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
    });
  });

  describe("Blog Post Links", () => {
    it("title and read link both point to the Medium post", () => {
      render(<BlogPostRow post={mockPost} />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);
      links.forEach((link) => {
        expect(link).toHaveAttribute(
          "href",
          "https://medium.com/@author/test-post"
        );
        expect(link).toHaveAttribute("target", "_blank");
      });
    });
  });
});

describe("Critical Functionality - Home Page", () => {
  it("renders hero, idea, recent writing and books with the feed loaded", async () => {
    (fetchMediumPosts as jest.Mock).mockResolvedValue([
      {
        id: "1",
        title: "First Post",
        excerpt: "Excerpt",
        url: "https://medium.com/first",
        publishedDate: new Date("2024-01-01"),
      },
    ]);

    render(await Home());

    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("idea-section")).toBeInTheDocument();
    expect(screen.getByTestId("recent-writing")).toBeInTheDocument();
    expect(screen.getByTestId("books-preview")).toBeInTheDocument();
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(fetchMediumPosts).toHaveBeenCalledWith(
      expect.objectContaining({ maxPosts: 3 })
    );
  });

  it("still renders when the Medium feed fails", async () => {
    (fetchMediumPosts as jest.Mock).mockRejectedValue(new Error("offline"));

    render(await Home());

    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(
      within(screen.getByTestId("recent-writing")).getByRole("alert")
    ).toBeInTheDocument();
  });
});

describe("Critical Functionality - Form Validation Feedback", () => {
  it("input shows error message when error prop is provided", () => {
    render(<Input label="Email" error="Please enter a valid email" />);
    expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
  });

  it("input has aria-invalid when in error state", () => {
    render(<Input label="Email" error="Invalid" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("input links to error message via aria-describedby", () => {
    render(<Input label="Email" error="Invalid email" />);
    const input = screen.getByLabelText("Email");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();

    expect(document.getElementById(describedBy!)).toHaveTextContent(
      "Invalid email"
    );
  });
});

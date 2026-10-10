/**
 * Keyboard Navigation Tests
 *
 * Tests that all interactive elements are keyboard accessible.
 * Verifies focus management, tab order, and keyboard interactions.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Link } from "@/components/ui/Link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider, ThemeToggle } from "@/components/theme";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ContactForm } from "@/components/forms/ContactForm";

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

// Mock analytics
jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
  trackFormView: jest.fn(),
  trackNewsletterSubmit: jest.fn(),
  trackContactSubmit: jest.fn(),
}));

describe("Keyboard Navigation - Button Component", () => {
  it("should be focusable with Tab key", async () => {
    const user = userEvent.setup();
    render(<Button>Click me</Button>);

    await user.tab();
    expect(screen.getByRole("button", { name: "Click me" })).toHaveFocus();
  });

  it("should trigger click on Enter key", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    screen.getByRole("button", { name: "Click me" }).focus();
    await user.keyboard("{Enter}");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should trigger click on Space key", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    screen.getByRole("button", { name: "Click me" }).focus();
    await user.keyboard(" ");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not be focusable when disabled", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Button>First</Button>
        <Button disabled>Disabled</Button>
        <Button>Last</Button>
      </>
    );

    await user.tab();
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Last" })).toHaveFocus();
  });
});

describe("Keyboard Navigation - Input and Textarea", () => {
  it("input is focusable with Tab key", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" type="email" />);

    await user.tab();
    expect(screen.getByLabelText("Email")).toHaveFocus();
  });

  it("input allows typing when focused", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" type="email" />);

    const input = screen.getByLabelText("Email");
    await user.click(input);
    await user.type(input, "test@example.com");

    expect(input).toHaveValue("test@example.com");
  });

  it("disabled input is skipped in the tab order", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Input label="First" />
        <Input label="Disabled" disabled />
        <Input label="Last" />
      </>
    );

    await user.tab();
    expect(screen.getByLabelText("First")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("Last")).toHaveFocus();
  });

  it("textarea is focusable and keeps Enter as a newline", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Message" />);

    await user.tab();
    const textarea = screen.getByLabelText("Message");
    expect(textarea).toHaveFocus();

    await user.keyboard("Line 1{Enter}Line 2");
    expect(textarea).toHaveValue("Line 1\nLine 2");
  });
});

describe("Keyboard Navigation - Links", () => {
  it("Link is focusable with Tab key", async () => {
    const user = userEvent.setup();
    render(<Link href="/about">About</Link>);

    await user.tab();
    expect(screen.getByRole("link", { name: "About" })).toHaveFocus();
  });

  it("Link keeps its href for native Enter activation", () => {
    render(<Link href="/about">About</Link>);

    const link = screen.getByRole("link", { name: "About" });
    link.focus();

    expect(link).toHaveFocus();
    expect(link).toHaveAttribute("href", "/about");
  });

  it("ArrowLink and ButtonLink are focusable", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ArrowLink href="/blog">Read the blog</ArrowLink>
        <ButtonLink href="/newsletter">Newsletter</ButtonLink>
      </>
    );

    await user.tab();
    expect(screen.getByRole("link", { name: "Read the blog" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: "Newsletter" })).toHaveFocus();
  });
});

describe("Keyboard Navigation - Header Component", () => {
  function renderHeader() {
    return render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );
  }

  it("tabs through brand, navigation, newsletter and theme toggle in order", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.tab();
    expect(
      screen.getByRole("link", { name: /easy plant life, home/i })
    ).toHaveFocus();

    for (const name of ["About", "Books", "Blog", "Contact", "Newsletter"]) {
      await user.tab();
      expect(screen.getByRole("link", { name })).toHaveFocus();
    }

    await user.tab();
    expect(
      screen.getByRole("button", { name: /switch to .* theme/i })
    ).toHaveFocus();
  });

  it("navigation is always in the document (no hidden mobile menu)", () => {
    renderHeader();
    expect(
      screen.queryByRole("button", { name: /menu/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeVisible();
  });

  it("theme toggle can be operated with the keyboard", async () => {
    const user = userEvent.setup();
    renderHeader();

    const toggle = screen.getByRole("button", { name: /switch to dark/i });
    toggle.focus();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("button", { name: /switch to light/i })
    ).toBeInTheDocument();
    document.documentElement.removeAttribute("data-theme");
    window.localStorage.clear();
  });

  it("has focus-visible ring styles on the brand link", () => {
    renderHeader();
    const brand = screen.getByRole("link", { name: /easy plant life, home/i });

    expect(brand).toHaveClass("focus-visible:ring-2");
    expect(brand).toHaveClass("focus-visible:ring-accent");
  });

  it("has focus-visible ring styles on navigation links", () => {
    renderHeader();
    const link = screen.getByRole("link", { name: "About" });

    expect(link.className).toContain("focus-visible:ring-accent");
  });
});

describe("Keyboard Navigation - Footer Component", () => {
  it("first tab focuses the brand link, then the footer navigation", async () => {
    const user = userEvent.setup();
    render(<Footer />);

    await user.tab();
    expect(
      screen.getByRole("link", { name: /easy plant life, home/i })
    ).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: "About" })).toHaveFocus();
  });

  it("footer links have focus-visible ring styles", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "About" }).className).toContain(
      "focus-visible:ring-accent"
    );
  });
});

describe("Keyboard Navigation - ThemeToggle", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
    window.localStorage.clear();
  });

  it("toggles with Space and Enter", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await user.keyboard(" ");
    expect(screen.getByRole("button")).toHaveAccessibleName(
      /switch to light theme/i
    );

    await user.keyboard("{Enter}");
    expect(screen.getByRole("button")).toHaveAccessibleName(
      /switch to dark theme/i
    );
  });
});

describe("Keyboard Navigation - NewsletterForm Component", () => {
  it("should have correct tab order", async () => {
    const user = userEvent.setup();
    render(<NewsletterForm />);

    await user.tab();
    expect(screen.getByLabelText("Email address")).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Subscribe" })).toHaveFocus();
  });

  it("inline layout keeps the same tab order with a hidden label", async () => {
    const user = userEvent.setup();
    render(<NewsletterForm layout="inline" submitLabel="Get the notes" />);

    await user.tab();
    expect(screen.getByLabelText("Email address")).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Get the notes" })).toHaveFocus();
  });

  it("should submit form with Enter key in input", async () => {
    const handleSubmit = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<NewsletterForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Email address"), "test@example.com");
    await user.keyboard("{Enter}");

    expect(handleSubmit).toHaveBeenCalledWith("test@example.com");
  });
});

describe("Keyboard Navigation - ContactForm Component", () => {
  it("should have correct tab order and skip the honeypot", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.tab();
    expect(screen.getByLabelText("Name")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("Email")).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText("Message")).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "Send message" })).toHaveFocus();
  });

  it("should allow multi-line text input with Enter in textarea", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const messageInput = screen.getByLabelText("Message");
    await user.click(messageInput);
    await user.type(messageInput, "Line 1{Enter}Line 2");

    expect(messageInput).toHaveValue("Line 1\nLine 2");
  });
});

describe("Focus Visible Styles", () => {
  it("Button should have focus-visible ring styles", () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole("button");

    expect(button.className).toContain("focus-visible:ring-2");
    expect(button.className).toContain("focus-visible:ring-accent");
  });

  it("Input should have focus-visible ring styles", () => {
    render(<Input label="Test" />);
    const input = screen.getByLabelText("Test");

    expect(input.className).toContain("focus-visible:ring-2");
    expect(input.className).toContain("focus-visible:ring-accent");
  });

  it("Textarea should have focus-visible ring styles", () => {
    render(<Textarea label="Test" />);
    expect(screen.getByLabelText("Test").className).toContain(
      "focus-visible:ring-accent"
    );
  });

  it("Link should have focus-visible ring styles", () => {
    render(<Link href="/test">Test</Link>);
    const link = screen.getByRole("link");

    expect(link.className).toContain("focus-visible:ring-2");
    expect(link.className).toContain("focus-visible:ring-accent");
  });

  it("ThemeToggle should have focus-visible ring styles", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button").className).toContain(
      "focus-visible:ring-accent"
    );
  });
});

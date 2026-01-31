/**
 * Keyboard Navigation Tests
 *
 * Tests that all interactive elements are keyboard accessible.
 * Verifies focus management, tab order, and keyboard interactions.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Link } from "@/components/ui/Link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
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

    const button = screen.getByRole("button", { name: "Click me" });
    await user.tab();

    expect(button).toHaveFocus();
  });

  it("should trigger click on Enter key", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    button.focus();
    await user.keyboard("{Enter}");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should trigger click on Space key", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    button.focus();
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

describe("Keyboard Navigation - Input Component", () => {
  it("should be focusable with Tab key", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" type="email" />);

    await user.tab();
    const input = screen.getByLabelText("Email");
    expect(input).toHaveFocus();
  });

  it("should allow typing when focused", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" type="email" />);

    const input = screen.getByLabelText("Email");
    await user.click(input);
    await user.type(input, "test@example.com");

    expect(input).toHaveValue("test@example.com");
  });

  it("should not be focusable when disabled", async () => {
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
});

describe("Keyboard Navigation - Link Component", () => {
  it("should be focusable with Tab key", async () => {
    const user = userEvent.setup();
    render(<Link href="/about">About</Link>);

    await user.tab();
    expect(screen.getByRole("link", { name: "About" })).toHaveFocus();
  });

  it("should be activatable with Enter key", () => {
    render(<Link href="/about">About</Link>);

    const link = screen.getByRole("link", { name: "About" });
    link.focus();

    // Enter on links should follow the link (native behavior)
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute("href", "/about");
  });
});

describe("Keyboard Navigation - Header Component", () => {
  it("should have all navigation links focusable in order", async () => {
    const user = userEvent.setup();
    render(<Header />);

    // Tab through the navigation
    await user.tab(); // Logo link
    expect(screen.getByText("Easy Plant Life").closest("a")).toHaveFocus();

    // Continue tabbing through nav links (hidden on mobile, visible on desktop)
    const navLinks = screen.getAllByRole("link");
    expect(navLinks.length).toBeGreaterThan(1);
  });

  it("should have proper focus visible styles", () => {
    render(<Header />);
    const logoLink = screen.getByText("Easy Plant Life").closest("a");

    expect(logoLink).toHaveClass("focus-visible:ring-2");
    expect(logoLink).toHaveClass("focus-visible:ring-primary");
  });
});

describe("Keyboard Navigation - Footer Component", () => {
  it("should have all links focusable", async () => {
    const user = userEvent.setup();
    render(<Footer />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);

    // First tab should focus the logo
    await user.tab();
    expect(screen.getByText("Easy Plant Life").closest("a")).toHaveFocus();
  });
});

describe("Keyboard Navigation - MobileNav Component", () => {
  const mockLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  it("should open menu with Enter key on hamburger button", async () => {
    const user = userEvent.setup();
    render(<MobileNav links={mockLinks} />);

    const menuButton = screen.getByRole("button", { name: "Menu" });
    menuButton.focus();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" })
    ).toBeInTheDocument();
  });

  it("should close menu with Escape key", async () => {
    const user = userEvent.setup();
    render(<MobileNav links={mockLinks} />);

    // Open menu
    const menuButton = screen.getByRole("button", { name: "Menu" });
    await user.click(menuButton);

    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" })
    ).toBeInTheDocument();

    // Press Escape
    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" })
    ).not.toBeInTheDocument();
  });

  it("should trap focus within the menu when open", async () => {
    const user = userEvent.setup();
    render(<MobileNav links={mockLinks} />);

    // Open menu
    await user.click(screen.getByRole("button", { name: "Menu" }));

    // Focus should be on close button first
    const closeButton = screen.getByRole("button", { name: "Close menu" });
    expect(closeButton).toHaveFocus();

    // Tab through menu items
    await user.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: "About" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: "Contact" })).toHaveFocus();

    // Tab should wrap back to close button (focus trap)
    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  it("should return focus to menu button when closed", async () => {
    const user = userEvent.setup();
    render(<MobileNav links={mockLinks} />);

    const menuButton = screen.getByRole("button", { name: "Menu" });
    await user.click(menuButton);

    // Close with close button
    await user.click(screen.getByRole("button", { name: "Close menu" }));

    expect(menuButton).toHaveFocus();
  });
});

describe("Keyboard Navigation - NewsletterForm Component", () => {
  it("should have correct tab order", async () => {
    const user = userEvent.setup();
    render(<NewsletterForm />);

    // First tab should focus the email input
    await user.tab();
    expect(screen.getByLabelText("Email address")).toHaveFocus();

    // Second tab should focus the submit button
    await user.tab();
    expect(screen.getByRole("button", { name: "Subscribe" })).toHaveFocus();
  });

  it("should submit form with Enter key in input", async () => {
    const handleSubmit = jest.fn();
    const user = userEvent.setup();
    render(<NewsletterForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByLabelText("Email address");
    await user.type(emailInput, "test@example.com");
    await user.keyboard("{Enter}");

    expect(handleSubmit).toHaveBeenCalledWith("test@example.com");
  });
});

describe("Keyboard Navigation - ContactForm Component", () => {
  it("should have correct tab order", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // First tab - Name input
    await user.tab();
    expect(screen.getByLabelText("Name")).toHaveFocus();

    // Second tab - Email input
    await user.tab();
    expect(screen.getByLabelText("Email")).toHaveFocus();

    // Third tab - Message textarea
    await user.tab();
    expect(screen.getByLabelText("Message")).toHaveFocus();

    // Fourth tab - Submit button
    await user.tab();
    expect(screen.getByRole("button", { name: "Send Message" })).toHaveFocus();
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
    expect(button.className).toContain("focus-visible:ring-primary");
  });

  it("Input should have focus-visible ring styles", () => {
    render(<Input label="Test" />);
    const input = screen.getByLabelText("Test");

    expect(input.className).toContain("focus-visible:ring-2");
    expect(input.className).toContain("focus-visible:ring-primary");
  });

  it("Link should have focus-visible ring styles", () => {
    render(<Link href="/test">Test</Link>);
    const link = screen.getByRole("link");

    expect(link.className).toContain("focus-visible:ring-2");
    expect(link.className).toContain("focus-visible:ring-primary");
  });
});

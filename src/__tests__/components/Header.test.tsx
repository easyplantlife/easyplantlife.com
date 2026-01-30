import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/Header";

/**
 * Header Component Tests
 *
 * Tests for the site header with logo and navigation.
 * Covers desktop navigation, mobile menu, accessibility, and styling.
 *
 * Acceptance Criteria (Issue #20):
 * - Header component at `/components/Header.tsx`
 * - Logo displayed (mark logo on mobile, can be full on desktop)
 * - Navigation links: Home, About, Books, Blog, Newsletter, Contact
 * - Mobile menu (hamburger or similar minimal solution)
 * - Sticky positioning (optional, consider user preference)
 * - Accessible navigation (nav element, aria labels)
 */

describe("Header Component", () => {
  describe("Rendering", () => {
    it("renders the header element", () => {
      render(<Header />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("renders the logo", () => {
      render(<Header />);
      expect(screen.getByLabelText(/easy plant life/i)).toBeInTheDocument();
    });

    it("renders the main navigation", () => {
      render(<Header />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    const expectedLinks = [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Books", href: "/books" },
      { name: "Blog", href: "/blog" },
      { name: "Newsletter", href: "/newsletter" },
      { name: "Contact", href: "/contact" },
    ];

    it.each(expectedLinks)(
      "renders $name link pointing to $href",
      ({ name, href }) => {
        render(<Header />);
        const nav = screen.getByRole("navigation");
        const link = within(nav).getByRole("link", { name });
        expect(link).toHaveAttribute("href", href);
      }
    );

    it("renders all 6 navigation links", () => {
      render(<Header />);
      const nav = screen.getByRole("navigation");
      const links = within(nav).getAllByRole("link");
      expect(links).toHaveLength(6);
    });
  });

  describe("Logo", () => {
    it("renders logo as a link to home page", () => {
      render(<Header />);
      const logo = screen.getByLabelText(/easy plant life/i);
      expect(logo.closest("a")).toHaveAttribute("href", "/");
    });

    it("has accessible label for the logo", () => {
      render(<Header />);
      expect(screen.getByLabelText(/easy plant life/i)).toBeInTheDocument();
    });
  });

  describe("Mobile Menu", () => {
    it("renders a mobile menu button", () => {
      render(<Header />);
      expect(
        screen.getByRole("button", { name: /menu/i })
      ).toBeInTheDocument();
    });

    it("mobile menu button has aria-expanded attribute", () => {
      render(<Header />);
      const menuButton = screen.getByRole("button", { name: /menu/i });
      expect(menuButton).toHaveAttribute("aria-expanded");
    });

    it("mobile menu is hidden by default", () => {
      render(<Header />);
      const menuButton = screen.getByRole("button", { name: /menu/i });
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });

    it("opens mobile menu when button is clicked", async () => {
      const user = userEvent.setup();
      render(<Header />);
      const menuButton = screen.getByRole("button", { name: /menu/i });

      await user.click(menuButton);

      expect(menuButton).toHaveAttribute("aria-expanded", "true");
    });

    it("closes mobile menu when button is clicked again", async () => {
      const user = userEvent.setup();
      render(<Header />);
      const menuButton = screen.getByRole("button", { name: /menu/i });

      await user.click(menuButton);
      await user.click(menuButton);

      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });

    it("mobile menu button controls navigation panel", () => {
      render(<Header />);
      const menuButton = screen.getByRole("button", { name: /menu/i });
      expect(menuButton).toHaveAttribute("aria-controls");
    });
  });

  describe("Accessibility", () => {
    it("uses semantic header element", () => {
      render(<Header />);
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("uses semantic nav element", () => {
      render(<Header />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("navigation has accessible label", () => {
      render(<Header />);
      const nav = screen.getByRole("navigation");
      expect(nav).toHaveAttribute("aria-label");
    });

    it("all navigation links are focusable", async () => {
      const user = userEvent.setup();
      render(<Header />);
      const nav = screen.getByRole("navigation");
      const links = within(nav).getAllByRole("link");

      for (const link of links) {
        link.focus();
        expect(link).toHaveFocus();
      }
    });

    it("mobile menu button is focusable via keyboard", async () => {
      const user = userEvent.setup();
      render(<Header />);
      const menuButton = screen.getByRole("button", { name: /menu/i });

      menuButton.focus();

      expect(menuButton).toHaveFocus();
    });

    it("mobile menu can be opened with keyboard", async () => {
      const user = userEvent.setup();
      render(<Header />);
      const menuButton = screen.getByRole("button", { name: /menu/i });

      menuButton.focus();
      await user.keyboard("{Enter}");

      expect(menuButton).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Styling", () => {
    it("header has background color", () => {
      render(<Header />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("bg-background");
    });

    it("mobile menu button is hidden on larger screens", () => {
      render(<Header />);
      const menuButton = screen.getByRole("button", { name: /menu/i });
      // On md screens and up, the button should be hidden
      expect(menuButton).toHaveClass("md:hidden");
    });

    it("desktop navigation is hidden on mobile", () => {
      render(<Header />);
      const nav = screen.getByRole("navigation");
      // On mobile, the nav should be hidden, visible on md+
      expect(nav).toHaveClass("hidden");
      expect(nav).toHaveClass("md:flex");
    });
  });

  describe("Layout", () => {
    it("header contains logo and navigation", () => {
      render(<Header />);
      const header = screen.getByRole("banner");
      expect(within(header).getByLabelText(/easy plant life/i)).toBeInTheDocument();
      expect(within(header).getByRole("navigation")).toBeInTheDocument();
    });

    it("logo and navigation are in the same container", () => {
      render(<Header />);
      const header = screen.getByRole("banner");
      const logo = within(header).getByLabelText(/easy plant life/i);
      const nav = within(header).getByRole("navigation");

      // Both should exist within the header
      expect(logo).toBeInTheDocument();
      expect(nav).toBeInTheDocument();
    });
  });
});

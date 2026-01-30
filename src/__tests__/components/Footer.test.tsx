import { render, screen, within } from "@testing-library/react";
import { Footer } from "@/components/Footer";

/**
 * Footer Component Tests
 *
 * Tests for the site footer with logo, essential links, and copyright.
 * Covers semantic structure, accessibility, and brand consistency.
 *
 * Acceptance Criteria (Issue #22):
 * - Footer component at `/components/Footer.tsx`
 * - Logo lockup displayed
 * - Essential links (About, Contact, Newsletter)
 * - Copyright notice with current year
 * - Proper semantic structure (footer element)
 * - Consistent with brand (calm, minimal)
 */

describe("Footer Component", () => {
  describe("Rendering", () => {
    it("renders the footer element", () => {
      render(<Footer />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("renders the logo lockup", () => {
      render(<Footer />);
      expect(screen.getByLabelText(/easy plant life/i)).toBeInTheDocument();
    });

    it("renders the copyright notice", () => {
      render(<Footer />);
      expect(screen.getByText(/©/)).toBeInTheDocument();
    });
  });

  describe("Essential Links", () => {
    const expectedLinks = [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Newsletter", href: "/newsletter" },
    ];

    it.each(expectedLinks)(
      "renders $name link pointing to $href",
      ({ name, href }) => {
        render(<Footer />);
        const footer = screen.getByRole("contentinfo");
        const link = within(footer).getByRole("link", { name });
        expect(link).toHaveAttribute("href", href);
      }
    );

    it("renders all 3 essential navigation links", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      const nav = within(footer).getByRole("navigation");
      const links = within(nav).getAllByRole("link");
      expect(links).toHaveLength(3);
    });
  });

  describe("Logo", () => {
    it("renders logo as a link to home page", () => {
      render(<Footer />);
      const logo = screen.getByLabelText(/easy plant life/i);
      expect(logo.closest("a")).toHaveAttribute("href", "/");
    });

    it("has accessible label for the logo", () => {
      render(<Footer />);
      expect(screen.getByLabelText(/easy plant life/i)).toBeInTheDocument();
    });
  });

  describe("Copyright", () => {
    it("displays the current year in copyright notice", () => {
      render(<Footer />);
      const currentYear = new Date().getFullYear().toString();
      expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
    });

    it("displays Easy Plant Life in the copyright notice", () => {
      render(<Footer />);
      expect(
        screen.getByText(/Easy Plant Life\. All rights reserved\./i)
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("uses semantic footer element", () => {
      render(<Footer />);
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });

    it("uses semantic nav element for links", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      expect(within(footer).getByRole("navigation")).toBeInTheDocument();
    });

    it("navigation has accessible label", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      const nav = within(footer).getByRole("navigation");
      expect(nav).toHaveAttribute("aria-label");
    });

    it("all navigation links are focusable", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      const nav = within(footer).getByRole("navigation");
      const links = within(nav).getAllByRole("link");

      for (const link of links) {
        link.focus();
        expect(link).toHaveFocus();
      }
    });

    it("logo link is focusable", () => {
      render(<Footer />);
      const logo = screen.getByLabelText(/easy plant life/i);
      const logoLink = logo.closest("a");

      if (logoLink) {
        logoLink.focus();
        expect(logoLink).toHaveFocus();
      }
    });
  });

  describe("Styling", () => {
    it("footer has appropriate background styling", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      expect(footer).toHaveClass("bg-background");
    });

    it("footer has border at the top", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      expect(footer).toHaveClass("border-t");
    });
  });

  describe("Layout", () => {
    it("footer contains logo, navigation, and copyright", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      expect(
        within(footer).getByLabelText(/easy plant life/i)
      ).toBeInTheDocument();
      expect(within(footer).getByRole("navigation")).toBeInTheDocument();
      expect(within(footer).getByText(/©/)).toBeInTheDocument();
    });
  });
});

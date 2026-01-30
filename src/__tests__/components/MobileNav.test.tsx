import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileNav } from "@/components/MobileNav";

/**
 * MobileNav Component Tests
 *
 * Tests for the mobile navigation drawer/menu component.
 * The mobile menu should feel calm and intentional with smooth animations.
 *
 * Acceptance Criteria (Issue #21):
 * - Mobile menu component created
 * - Opens/closes smoothly
 * - All navigation links accessible
 * - Closes when link is clicked
 * - Closes when clicking outside
 * - Focus trapped when open (accessibility)
 * - Escape key closes menu
 */

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Books", href: "/books" },
  { name: "Blog", href: "/blog" },
  { name: "Newsletter", href: "/newsletter" },
  { name: "Contact", href: "/contact" },
];

describe("MobileNav Component", () => {
  describe("Rendering", () => {
    it("renders the mobile menu button", () => {
      render(<MobileNav links={navLinks} />);
      expect(screen.getByRole("button", { name: /menu/i })).toBeInTheDocument();
    });

    it("menu is hidden by default", () => {
      render(<MobileNav links={navLinks} />);
      const menuButton = screen.getByRole("button", { name: /menu/i });
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });

    it("renders all navigation links when open", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      const nav = screen.getByRole("navigation", { name: /mobile/i });
      for (const link of navLinks) {
        expect(
          within(nav).getByRole("link", { name: link.name })
        ).toBeInTheDocument();
      }
    });

    it("renders correct href for each link", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      const nav = screen.getByRole("navigation", { name: /mobile/i });
      for (const link of navLinks) {
        expect(
          within(nav).getByRole("link", { name: link.name })
        ).toHaveAttribute("href", link.href);
      }
    });
  });

  describe("Open/Close Behavior", () => {
    it("opens when menu button is clicked", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      expect(menuButton).toHaveAttribute("aria-expanded", "true");
      expect(
        screen.getByRole("navigation", { name: /mobile/i })
      ).toBeInTheDocument();
    });

    it("closes when menu button is clicked again", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);
      await user.click(menuButton);

      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });

    it("closes when a navigation link is clicked", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      const nav = screen.getByRole("navigation", { name: /mobile/i });
      const homeLink = within(nav).getByRole("link", { name: "About" });
      await user.click(homeLink);

      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });

    it("closes when escape key is pressed", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      expect(menuButton).toHaveAttribute("aria-expanded", "true");

      await user.keyboard("{Escape}");

      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });

    it("closes when clicking outside the menu", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <div data-testid="outside-element">Outside content</div>
          <MobileNav links={navLinks} />
        </div>
      );

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      expect(menuButton).toHaveAttribute("aria-expanded", "true");

      const outsideElement = screen.getByTestId("outside-element");
      await user.click(outsideElement);

      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Accessibility", () => {
    it("menu button has aria-expanded attribute", () => {
      render(<MobileNav links={navLinks} />);
      const menuButton = screen.getByRole("button", { name: /menu/i });
      expect(menuButton).toHaveAttribute("aria-expanded");
    });

    it("menu button has aria-controls pointing to the menu", () => {
      render(<MobileNav links={navLinks} />);
      const menuButton = screen.getByRole("button", { name: /menu/i });
      expect(menuButton).toHaveAttribute("aria-controls", "mobile-nav-menu");
    });

    it("navigation has accessible label", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      expect(
        screen.getByRole("navigation", { name: /mobile/i })
      ).toBeInTheDocument();
    });

    it("all links are focusable", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      const nav = screen.getByRole("navigation", { name: /mobile/i });
      const links = within(nav).getAllByRole("link");

      for (const link of links) {
        link.focus();
        expect(link).toHaveFocus();
      }
    });

    it("traps focus within menu when open", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      // Get all focusable elements in the mobile nav
      const nav = screen.getByRole("navigation", { name: /mobile/i });
      const links = within(nav).getAllByRole("link");
      const closeButton = screen.getByRole("button", { name: /close/i });

      // Focus should cycle within the menu
      // Start from the close button and tab through all links
      closeButton.focus();
      expect(closeButton).toHaveFocus();

      // Tab to first link
      await user.tab();
      expect(links[0]).toHaveFocus();

      // Tab through all links
      for (let i = 1; i < links.length; i++) {
        await user.tab();
        expect(links[i]).toHaveFocus();
      }

      // Tab from last link should go back to close button (focus trap)
      await user.tab();
      expect(closeButton).toHaveFocus();
    });

    it("returns focus to menu button when closed", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);

      expect(menuButton).toHaveFocus();
    });

    it("menu can be opened with keyboard (Enter)", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      menuButton.focus();
      await user.keyboard("{Enter}");

      expect(menuButton).toHaveAttribute("aria-expanded", "true");
    });

    it("menu can be opened with keyboard (Space)", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      menuButton.focus();
      await user.keyboard(" ");

      expect(menuButton).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Animation", () => {
    it("menu panel has transition classes for smooth animation", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      const menuPanel = screen.getByTestId("mobile-nav-panel");
      expect(menuPanel).toHaveClass("transition");
    });

    it("overlay/backdrop has transition for smooth appearance", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      const overlay = screen.getByTestId("mobile-nav-overlay");
      expect(overlay).toHaveClass("transition");
    });
  });

  describe("Styling", () => {
    it("menu button is hidden on desktop (md screens and up)", () => {
      render(<MobileNav links={navLinks} />);
      const menuButton = screen.getByRole("button", { name: /menu/i });
      expect(menuButton).toHaveClass("md:hidden");
    });

    it("menu panel slides in from the right", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      const menuPanel = screen.getByTestId("mobile-nav-panel");
      // Should have positioning classes for a right-side drawer
      expect(menuPanel).toHaveClass("right-0");
    });

    it("overlay has semi-transparent background", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      const overlay = screen.getByTestId("mobile-nav-overlay");
      // Should have a background opacity class
      expect(overlay.className).toMatch(/bg-.*\/|opacity/);
    });

    it("close button is visible when menu is open", async () => {
      const user = userEvent.setup();
      render(<MobileNav links={navLinks} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      await user.click(menuButton);

      expect(
        screen.getByRole("button", { name: /close/i })
      ).toBeInTheDocument();
    });
  });

  describe("Integration with Header", () => {
    it("accepts custom links prop", () => {
      const customLinks = [
        { name: "Custom", href: "/custom" },
        { name: "Link", href: "/link" },
      ];
      render(<MobileNav links={customLinks} />);

      // Should not throw and should render the button
      expect(screen.getByRole("button", { name: /menu/i })).toBeInTheDocument();
    });

    it("handles empty links array gracefully", () => {
      render(<MobileNav links={[]} />);
      expect(screen.getByRole("button", { name: /menu/i })).toBeInTheDocument();
    });
  });
});

import { render, screen, within } from "@testing-library/react";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/theme";

const mockUsePathname = jest.fn<string | null, []>(() => "/");

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

function renderHeader() {
  return render(
    <ThemeProvider>
      <Header />
    </ThemeProvider>
  );
}

describe("Header", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

  describe("Structure", () => {
    it("renders a banner landmark", () => {
      renderHeader();
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });

    it("renders the brand linking home", () => {
      renderHeader();
      expect(
        screen.getByRole("link", { name: /easy plant life, home/i })
      ).toHaveAttribute("href", "/");
    });

    it("renders the main navigation with four text links", () => {
      renderHeader();
      const nav = screen.getByRole("navigation", { name: /main/i });
      const links = within(nav).getAllByRole("link");
      expect(links.map((l) => l.textContent)).toEqual([
        "About",
        "Books",
        "Blog",
        "Contact",
      ]);
    });

    it("renders Newsletter as a separate button-styled link", () => {
      renderHeader();
      const link = screen.getByRole("link", { name: "Newsletter" });
      expect(link).toHaveAttribute("href", "/newsletter");
      expect(link.className).toContain("rounded-pill");
    });

    it("renders the theme toggle", () => {
      renderHeader();
      expect(
        screen.getByRole("button", { name: /switch to .* theme/i })
      ).toBeInTheDocument();
    });

    it("does not render a hamburger menu", () => {
      renderHeader();
      expect(
        screen.queryByRole("button", { name: /menu/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Responsive layout", () => {
    it("lets the navigation row wrap instead of hiding it", () => {
      renderHeader();
      const nav = screen.getByRole("navigation", { name: /main/i });
      const list = nav.querySelector("ul");
      expect(list?.className).toContain("flex-wrap");
      expect(nav.className).not.toContain("hidden");
    });

    it("header container wraps its children", () => {
      renderHeader();
      const banner = screen.getByRole("banner");
      const container = banner.firstElementChild as HTMLElement;
      expect(container.className).toContain("flex-wrap");
    });
  });

  describe("Active link", () => {
    it("marks the current page with aria-current", () => {
      mockUsePathname.mockReturnValue("/books");
      renderHeader();
      expect(screen.getByRole("link", { name: "Books" })).toHaveAttribute(
        "aria-current",
        "page"
      );
      expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute(
        "aria-current"
      );
    });

    it("marks nested paths as current", () => {
      mockUsePathname.mockReturnValue("/blog/some-post");
      renderHeader();
      expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
        "aria-current",
        "page"
      );
    });

    it("marks the newsletter action when on the newsletter page", () => {
      mockUsePathname.mockReturnValue("/newsletter");
      renderHeader();
      expect(screen.getByRole("link", { name: "Newsletter" })).toHaveAttribute(
        "aria-current",
        "page"
      );
    });

    it("renders without a router context", () => {
      mockUsePathname.mockReturnValue(null);
      renderHeader();
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });
  });

  describe("Theming", () => {
    it("gives the header its own surface in dark mode", () => {
      renderHeader();
      expect(screen.getByRole("banner").className).toContain("dark:bg-surface");
    });
  });
});

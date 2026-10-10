import { render, screen, within } from "@testing-library/react";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/content/site";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

describe("Footer", () => {
  it("renders a contentinfo landmark", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the brand and tagline", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /easy plant life, home/i })
    ).toHaveAttribute("href", "/");
    expect(screen.getByText(siteConfig.tagline)).toBeInTheDocument();
  });

  it("lists every page in the footer navigation", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: /footer/i });
    const hrefs = within(nav)
      .getAllByRole("link")
      .map((l) => l.getAttribute("href"));
    expect(hrefs).toEqual([
      "/about",
      "/books",
      "/blog",
      "/newsletter",
      "/contact",
    ]);
  });

  it("shows the current year in the copyright line", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${year}`))).toBeInTheDocument();
  });

  it("links to Medium in a new tab", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /writing lives on medium/i });
    expect(link).toHaveAttribute("href", siteConfig.mediumUrl);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("does not repeat the lockup logo or decorative dividers", () => {
    render(<Footer />);
    expect(document.querySelectorAll("img")).toHaveLength(1);
  });
});

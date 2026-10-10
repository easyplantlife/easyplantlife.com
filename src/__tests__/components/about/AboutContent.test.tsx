import { render, screen, within } from "@testing-library/react";
import { AboutContent } from "@/components/about";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

describe("AboutContent", () => {
  it("renders an article with the content test id", () => {
    render(<AboutContent />);
    expect(screen.getByTestId("about-content").tagName).toBe("ARTICLE");
  });

  it("does not render an h1 (PageLayout owns the intro)", () => {
    render(<AboutContent />);
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  describe("Section index", () => {
    it("renders an 'On this page' navigation with four anchor links", () => {
      render(<AboutContent />);
      const nav = screen.getByRole("navigation", { name: /on this page/i });
      const links = within(nav).getAllByRole("link");
      expect(links.map((l) => l.getAttribute("href"))).toEqual([
        "#why",
        "#believe",
        "#not",
        "#who",
      ]);
    });

    it("each anchor targets an existing section", () => {
      render(<AboutContent />);
      for (const id of ["why", "believe", "not", "who"]) {
        expect(document.getElementById(id)).toBeInTheDocument();
      }
    });
  });

  describe("Chapters", () => {
    it("renders the four chapters with h2 headings", () => {
      render(<AboutContent />);
      for (const id of ["why", "believe", "not", "who"]) {
        const section = screen.getByTestId(`about-${id}-section`);
        expect(
          within(section).getByRole("heading", { level: 2 })
        ).toBeInTheDocument();
      }
      expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(4);
    });

    it("numbers the chapters", () => {
      render(<AboutContent />);
      expect(screen.getByTestId("about-why-section")).toHaveTextContent("01");
      expect(screen.getByTestId("about-who-section")).toHaveTextContent("04");
    });

    it("quotes the four values in a blockquote", () => {
      render(<AboutContent />);
      const quote = screen
        .getByTestId("about-believe-section")
        .querySelector("blockquote");
      expect(quote).toHaveTextContent("Simplicity over optimization.");
      expect(quote).toHaveTextContent("Sustainability over perfection.");
      expect(quote).toHaveTextContent("Calm over urgency.");
      expect(quote).toHaveTextContent("Practical over ideological.");
    });

    it("lists what the site is not as a plain list", () => {
      render(<AboutContent />);
      const section = screen.getByTestId("about-not-section");
      const items = within(section).getAllByRole("listitem");
      expect(items).toHaveLength(5);
      expect(section).toHaveTextContent("No lectures about doing more.");
      expect(section).toHaveTextContent(
        "Use what helps. Ignore what does not. That is the whole point."
      );
    });

    it("renders an author photo placeholder", () => {
      render(<AboutContent />);
      expect(
        screen.getByRole("img", { name: "Author photo placeholder" })
      ).toBeInTheDocument();
      expect(screen.getByTestId("about-who-section")).toHaveTextContent(
        /no credentials to wave around/i
      );
    });
  });

  describe("Books panel", () => {
    it("links to the books page twice: text and image", () => {
      render(<AboutContent />);
      const panel = screen.getByTestId("about-books-panel");
      const links = within(panel).getAllByRole("link");
      expect(links).toHaveLength(2);
      for (const link of links) {
        expect(link).toHaveAttribute("href", "/books");
      }
      expect(
        within(panel).getByRole("link", { name: "See the books" })
      ).toBeInTheDocument();
    });

    it("renders the books photo as decorative", () => {
      render(<AboutContent />);
      const panel = screen.getByTestId("about-books-panel");
      expect(panel.querySelector("img")).toHaveAttribute("alt", "");
    });
  });

  describe("Tone", () => {
    it("contains no hype or preachy language", () => {
      render(<AboutContent />);
      const text =
        screen.getByTestId("about-content").textContent?.toLowerCase() ?? "";
      for (const word of ["amazing", "revolutionary", "must", "should", "!"]) {
        expect(text).not.toContain(word);
      }
    });
  });

  it("merges a custom className", () => {
    render(<AboutContent className="mt-8" />);
    expect(screen.getByTestId("about-content").className).toContain("mt-8");
  });
});

import { render, screen, within } from "@testing-library/react";
import AboutPage from "@/app/about/page";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

/**
 * About Page
 *
 * PageLayout intro (eyebrow, h1, lead) followed by AboutContent: a small
 * section index and four short chapters.
 */
describe("About Page", () => {
  describe("Intro", () => {
    it("renders the eyebrow, h1 and lead", () => {
      render(<AboutPage />);
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Living vegan does not need to feel like a project."
      );
      expect(
        screen.getByText(/this site is the quieter alternative/i)
      ).toBeInTheDocument();
    });

    it("renders exactly one h1", () => {
      render(<AboutPage />);
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    });
  });

  describe("Structure", () => {
    it("renders a single main landmark wrapping the content", () => {
      render(<AboutPage />);
      const mains = screen.getAllByRole("main");
      expect(mains).toHaveLength(1);
      expect(mains[0]).toContainElement(screen.getByTestId("about-content"));
    });

    it("renders a section index that links to every chapter", () => {
      render(<AboutPage />);
      const index = screen.getByRole("navigation", { name: /on this page/i });
      const hrefs = within(index)
        .getAllByRole("link")
        .map((a) => a.getAttribute("href"));
      expect(hrefs).toEqual(["#why", "#believe", "#not", "#who"]);
      for (const href of hrefs) {
        expect(document.getElementById(href!.slice(1))).toBeInTheDocument();
      }
    });

    it("renders the four chapters as h2 in order", () => {
      render(<AboutPage />);
      const h2s = screen
        .getAllByRole("heading", { level: 2 })
        .map((h) => h.textContent);
      expect(h2s).toEqual([
        "A place where plant-based living can just be easy",
        "Ease is what lets habits survive real life",
        "We are not here to tell you what to do",
        "Someone who has been doing this quietly for a while",
      ]);
    });

    it("keeps the heading hierarchy sequential", () => {
      render(<AboutPage />);
      const levels = screen
        .getAllByRole("heading")
        .map((h) => Number(h.tagName.slice(1)));
      expect(levels[0]).toBe(1);
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("Content", () => {
    it("states the values as one quote rather than tinted boxes", () => {
      render(<AboutPage />);
      const quote = document.querySelector("blockquote");
      expect(quote).toHaveTextContent(/simplicity over optimization/i);
      expect(quote).toHaveTextContent(/calm over urgency/i);
      expect(quote?.className).toContain("whitespace-pre-line");
    });

    it("lists what the site is not as a plain list", () => {
      render(<AboutPage />);
      const section = screen.getByTestId("about-not-section");
      const items = within(section).getAllByRole("listitem");
      expect(items).toHaveLength(5);
      expect(items[0]).toHaveTextContent(/no judgment/i);
      expect(
        within(section).getByText(/use what helps\. ignore what does not/i)
      ).toBeInTheDocument();
    });

    it("points to the books at the end", () => {
      render(<AboutPage />);
      const panel = screen.getByTestId("about-books-panel");
      expect(
        within(panel).getByRole("link", { name: "See the books" })
      ).toHaveAttribute("href", "/books");
    });

    it("keeps a calm, non-authoritative tone", () => {
      render(<AboutPage />);
      const text = document.body.textContent?.toLowerCase() ?? "";
      for (const word of ["must", "should", "guaranteed", "transform your"]) {
        expect(text).not.toContain(word);
      }
    });
  });

  describe("Readability", () => {
    it("constrains the chapters to a prose width", () => {
      render(<AboutPage />);
      const chapter = screen.getByTestId("about-why-section");
      expect(chapter.parentElement?.className).toContain("max-w-prose");
    });
  });
});

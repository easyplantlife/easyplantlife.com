import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import { fetchMediumPosts } from "@/lib/api/medium";

jest.mock("@/lib/api/medium", () => ({
  fetchMediumPosts: jest.fn(),
}));

jest.mock("@/lib/analytics/events", () => ({
  trackFormView: jest.fn(),
  trackNewsletterSubmit: jest.fn(),
  trackOutboundClick: jest.fn(),
}));

const mockFetchPosts = fetchMediumPosts as jest.MockedFunction<
  typeof fetchMediumPosts
>;

const mockFetch = jest.fn();
global.fetch = mockFetch;

const posts = [
  {
    id: "1",
    title: "Default meals",
    excerpt: "Why having a boring default is the whole trick.",
    url: "https://medium.com/@easyplantlife/default-meals",
    publishedDate: new Date("2026-03-01"),
  },
  {
    id: "2",
    title: "Good enough",
    excerpt: "On giving up perfection.",
    url: "https://medium.com/@easyplantlife/good-enough",
    publishedDate: new Date("2026-02-01"),
  },
];

async function renderHome() {
  return render(await Home());
}

/**
 * Home Page
 *
 * Hero → The idea → Recent writing → Books. One main landmark, one h1,
 * one newsletter form, no feature grid and no card decks.
 */
describe("Home Page", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetchPosts.mockReset();
    mockFetchPosts.mockResolvedValue(posts);
  });

  describe("Page Structure", () => {
    it("renders exactly one main landmark", async () => {
      await renderHome();
      expect(screen.getAllByRole("main")).toHaveLength(1);
    });

    it("renders the sections in order", async () => {
      await renderHome();
      const ids = [
        "hero-section",
        "idea-section",
        "recent-writing",
        "books-preview",
      ];
      const nodes = ids.map((id) => screen.getByTestId(id));
      for (let i = 1; i < nodes.length; i++) {
        expect(
          nodes[i - 1].compareDocumentPosition(nodes[i]) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();
      }
    });

    it("has a single h1", async () => {
      await renderHome();
      const h1s = screen.getAllByRole("heading", { level: 1 });
      expect(h1s).toHaveLength(1);
      expect(h1s[0]).toHaveTextContent(
        /living vegan without turning it into a project/i
      );
    });

    it("keeps the heading hierarchy sequential", async () => {
      await renderHome();
      const levels = screen
        .getAllByRole("heading")
        .map((h) => Number(h.tagName.slice(1)));
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      }
    });

    it("does not render the old feature grid or card decks", async () => {
      await renderHome();
      expect(screen.queryByText(/what you'll find/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/go further/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/stay in the loop/i)).not.toBeInTheDocument();
    });
  });

  describe("Newsletter", () => {
    it("renders exactly one newsletter form, in the hero", async () => {
      await renderHome();
      const forms = screen.getAllByRole("form", { name: /newsletter/i });
      expect(forms).toHaveLength(1);
      expect(screen.getByTestId("hero-section")).toContainElement(forms[0]);
    });

    it("submits to the newsletter API and shows the success state", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
      await renderHome();

      await user.type(screen.getByLabelText("Email address"), "jo@example.com");
      await user.click(screen.getByRole("button", { name: "Get the notes" }));

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/newsletter",
        expect.objectContaining({ method: "POST" })
      );
    });

    it("shows the API error state", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Nope" }),
      });
      await renderHome();

      await user.type(screen.getByLabelText("Email address"), "jo@example.com");
      await user.click(screen.getByRole("button", { name: "Get the notes" }));

      expect(await screen.findByTestId("newsletter-error")).toHaveTextContent(
        /something went wrong/i
      );
    });
  });

  describe("Recent writing", () => {
    it("lists the latest posts with links to Medium", async () => {
      await renderHome();
      const section = screen.getByTestId("recent-writing");
      expect(
        within(section).getByRole("heading", {
          level: 3,
          name: "Default meals",
        })
      ).toBeInTheDocument();
      const readLinks = within(section).getAllByRole("link", {
        name: /read ".*" on medium/i,
      });
      expect(readLinks).toHaveLength(posts.length);
      expect(readLinks[0]).toHaveAttribute("target", "_blank");
    });

    it("asks the feed for only a few posts", async () => {
      await renderHome();
      expect(mockFetchPosts).toHaveBeenCalledWith(
        expect.objectContaining({ maxPosts: 3 })
      );
    });

    it("degrades calmly when the feed fails", async () => {
      mockFetchPosts.mockRejectedValue(new Error("down"));
      await renderHome();
      const section = screen.getByTestId("recent-writing");
      expect(within(section).getByRole("alert")).toHaveTextContent(
        /could not be loaded/i
      );
      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.getByTestId("books-preview")).toBeInTheDocument();
    });
  });

  describe("Books", () => {
    it("shows both books with external purchase links", async () => {
      await renderHome();
      const section = screen.getByTestId("books-preview");
      expect(
        within(section).getByRole("heading", {
          level: 3,
          name: "The Everyday Vegan Playbook",
        })
      ).toBeInTheDocument();
      expect(
        within(section).getByRole("heading", {
          level: 3,
          name: "The Normal Vegan",
        })
      ).toBeInTheDocument();
      const buy = within(section).getAllByRole("link", {
        name: /buy on amazon/i,
      });
      expect(buy).toHaveLength(2);
      for (const link of buy) {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    });
  });
});

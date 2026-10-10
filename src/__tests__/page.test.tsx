import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import { getAllPosts } from "@/lib/blog/posts";
import type { BlogPostEntry } from "@/lib/types/blog";

jest.mock("@/lib/blog/posts", () => ({
  getAllPosts: jest.fn(),
}));

jest.mock("@/lib/analytics/events", () => ({
  trackFormView: jest.fn(),
  trackNewsletterSubmit: jest.fn(),
  trackOutboundClick: jest.fn(),
}));

const mockGetAllPosts = getAllPosts as jest.MockedFunction<typeof getAllPosts>;

const mockFetch = jest.fn();
global.fetch = mockFetch;

const posts: BlogPostEntry[] = [
  {
    slug: "default-meals",
    title: "Default meals",
    excerpt: "Why having a boring default is the whole trick.",
    url: "/blog/default-meals",
    publishedDate: new Date("2026-03-01"),
  },
  {
    slug: "good-enough",
    title: "Good enough",
    excerpt: "On giving up perfection.",
    url: "/blog/good-enough",
    publishedDate: new Date("2026-02-01"),
  },
];

function renderHome() {
  return render(<Home />);
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
    mockGetAllPosts.mockReset();
    mockGetAllPosts.mockReturnValue(posts);
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
    it("lists the latest posts with links to their pages", async () => {
      await renderHome();
      const section = screen.getByTestId("recent-writing");
      expect(
        within(section).getByRole("heading", {
          level: 3,
          name: "Default meals",
        })
      ).toBeInTheDocument();
      const readLinks = within(section).getAllByRole("link", {
        name: /^read ".*"$/i,
      });
      expect(readLinks).toHaveLength(posts.length);
      expect(readLinks[0]).toHaveAttribute("href", "/blog/default-meals");
      expect(readLinks[0]).not.toHaveAttribute("target");
    });

    it("shows only the three newest posts", async () => {
      mockGetAllPosts.mockReturnValue(
        Array.from({ length: 5 }, (_, i) => ({
          ...posts[0],
          slug: `post-${i}`,
          title: `Post ${i}`,
          url: `/blog/post-${i}`,
        }))
      );
      await renderHome();
      const section = screen.getByTestId("recent-writing");
      expect(within(section).getAllByRole("listitem")).toHaveLength(3);
    });

    it("shows a calm empty state when nothing is published", async () => {
      mockGetAllPosts.mockReturnValue([]);
      await renderHome();
      const section = screen.getByTestId("recent-writing");
      expect(
        within(section).getByText(/nothing published yet/i)
      ).toBeInTheDocument();
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

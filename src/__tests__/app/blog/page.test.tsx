import { render, screen, within } from "@testing-library/react";
import BlogPage from "@/app/blog/page";
import { BLOG_FEED_ERROR } from "@/lib/api/blog";
import { fetchMediumPosts, type MediumPost } from "@/lib/api/medium";
import { siteConfig } from "@/content/site";

jest.mock("@/lib/api/medium", () => ({
  fetchMediumPosts: jest.fn(),
}));

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

const mockFetchPosts = fetchMediumPosts as jest.MockedFunction<
  typeof fetchMediumPosts
>;

const mockPosts: MediumPost[] = [
  {
    id: "abc123",
    title: "Default meals",
    excerpt: "Why a boring default is the whole trick.",
    url: "https://medium.com/@easyplantlife/default-meals",
    publishedDate: new Date("2026-01-15"),
  },
  {
    id: "def456",
    title: "Good enough",
    excerpt: "On giving up perfection.",
    url: "https://medium.com/@easyplantlife/good-enough",
    publishedDate: new Date("2026-02-20"),
    thumbnail: "https://example.com/good-enough.jpg",
  },
];

async function renderBlog() {
  return render(await BlogPage());
}

/**
 * Blog Page
 *
 * Fetches the Medium feed on the server, lists posts as hairline rows with
 * honest "Read on Medium" links, degrades calmly when the feed fails.
 */
describe("Blog Page", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    mockFetchPosts.mockReset();
    mockFetchPosts.mockResolvedValue(mockPosts);
    process.env = { ...originalEnv };
    delete process.env.MEDIUM_PUBLICATION_URL;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("Intro", () => {
    it("renders the eyebrow, h1 and lead", async () => {
      await renderBlog();
      expect(screen.getByText("Blog")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Short pieces on easy plant-based living."
      );
      expect(screen.getByText(/published on medium/i)).toBeInTheDocument();
    });

    it("offers a Follow on Medium action", async () => {
      await renderBlog();
      const link = screen.getByRole("link", { name: /follow on medium/i });
      expect(link).toHaveAttribute("href", siteConfig.mediumUrl);
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("renders a single h1 inside a single main", async () => {
      await renderBlog();
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(screen.getAllByRole("main")).toHaveLength(1);
    });
  });

  describe("Feed", () => {
    it("fetches posts on load with the default account", async () => {
      await renderBlog();
      expect(mockFetchPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          username: siteConfig.mediumUsername,
          maxPosts: 10,
        })
      );
    });

    it("uses MEDIUM_PUBLICATION_URL when set", async () => {
      process.env.MEDIUM_PUBLICATION_URL = "https://medium.com/@someone";
      await renderBlog();
      expect(mockFetchPosts).toHaveBeenCalledWith(
        expect.objectContaining({ username: "someone" })
      );
    });

    it("lists posts with h2 titles, newest first label and Medium links", async () => {
      await renderBlog();
      expect(screen.getByTestId("blog-intro")).toHaveTextContent(
        "Newest first"
      );
      const list = screen.getByTestId("blog-posts-list");
      expect(within(list).getAllByRole("listitem")).toHaveLength(2);
      expect(
        within(list).getByRole("heading", { level: 2, name: "Default meals" })
      ).toBeInTheDocument();
      const readLinks = within(list).getAllByRole("link", {
        name: /read ".*" on medium/i,
      });
      expect(readLinks).toHaveLength(2);
      for (const link of readLinks) {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
        expect(link.textContent).toContain("↗");
      }
    });

    it("shows excerpts and dates", async () => {
      await renderBlog();
      expect(
        screen.getByText("Why a boring default is the whole trick.")
      ).toBeInTheDocument();
      expect(document.querySelectorAll("time")).toHaveLength(2);
    });

    it("links to older posts on Medium", async () => {
      await renderBlog();
      expect(
        screen.getByRole("link", { name: /older posts on medium/i })
      ).toHaveAttribute("href", siteConfig.mediumUrl);
    });

    it("shows the empty state when the feed has nothing", async () => {
      mockFetchPosts.mockResolvedValue([]);
      await renderBlog();
      expect(screen.getByText(/nothing published yet/i)).toBeInTheDocument();
    });

    it("degrades calmly when the fetch fails", async () => {
      mockFetchPosts.mockRejectedValue(new Error("Network error"));
      await renderBlog();
      expect(screen.getByRole("alert")).toHaveTextContent(BLOG_FEED_ERROR);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(
        screen.queryByRole("list", { name: /blog posts/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Prefer email", () => {
    it("points to the newsletter after the list", async () => {
      await renderBlog();
      expect(screen.getByText("Prefer email?")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Get the notes" })
      ).toHaveAttribute("href", "/newsletter");
    });
  });
});

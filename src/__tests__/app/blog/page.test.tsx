import { render, screen, within } from "@testing-library/react";
import BlogPage from "@/app/blog/page";
import { getAllPosts } from "@/lib/blog/posts";
import type { BlogPostEntry } from "@/lib/types/blog";

jest.mock("@/lib/blog/posts", () => ({
  getAllPosts: jest.fn(),
}));

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

const mockGetAllPosts = getAllPosts as jest.MockedFunction<typeof getAllPosts>;

const mockPosts: BlogPostEntry[] = [
  {
    slug: "good-enough",
    title: "Good enough",
    excerpt: "On giving up perfection.",
    url: "/blog/good-enough",
    publishedDate: new Date("2026-02-20"),
    readTime: 3,
    thumbnail: "/images/blog/good-enough/01.jpeg",
  },
  {
    slug: "default-meals",
    title: "Default meals",
    excerpt: "Why a boring default is the whole trick.",
    url: "/blog/default-meals",
    publishedDate: new Date("2026-01-15"),
    readTime: 4,
  },
];

function renderBlog() {
  return render(<BlogPage />);
}

/**
 * Blog Page
 *
 * Lists the self-hosted posts as hairline rows, newest first, each linking
 * to its own page on this site.
 */
describe("Blog Page", () => {
  beforeEach(() => {
    mockGetAllPosts.mockReset();
    mockGetAllPosts.mockReturnValue(mockPosts);
  });

  describe("Intro", () => {
    it("renders the eyebrow, h1 and lead", () => {
      renderBlog();
      expect(screen.getByText("Blog")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Short pieces on easy plant-based living."
      );
      expect(screen.getByText(/published here/i)).toBeInTheDocument();
    });

    it("no longer sends visitors to Medium", () => {
      renderBlog();
      expect(
        screen.queryByRole("link", { name: /medium/i })
      ).not.toBeInTheDocument();
    });

    it("renders a single h1 inside a single main", () => {
      renderBlog();
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(screen.getAllByRole("main")).toHaveLength(1);
    });
  });

  describe("Posts", () => {
    it("reads every post once", () => {
      renderBlog();
      expect(mockGetAllPosts).toHaveBeenCalledTimes(1);
    });

    it("lists posts with h2 titles, a newest first label and internal links", () => {
      renderBlog();
      expect(screen.getByTestId("blog-intro")).toHaveTextContent(
        "Newest first"
      );
      const list = screen.getByTestId("blog-posts-list");
      expect(within(list).getAllByRole("listitem")).toHaveLength(2);
      expect(
        within(list).getByRole("heading", { level: 2, name: "Good enough" })
      ).toBeInTheDocument();
      const readLinks = within(list).getAllByRole("link", {
        name: /^read ".*"$/i,
      });
      expect(readLinks).toHaveLength(2);
      expect(readLinks[0]).toHaveAttribute("href", "/blog/good-enough");
      for (const link of readLinks) {
        expect(link).not.toHaveAttribute("target");
        expect(link.textContent).toContain("→");
      }
    });

    it("shows excerpts, dates and read times", () => {
      renderBlog();
      expect(
        screen.getByText("Why a boring default is the whole trick.")
      ).toBeInTheDocument();
      expect(document.querySelectorAll("time")).toHaveLength(2);
      expect(screen.getByText("4 min read")).toBeInTheDocument();
    });

    it("shows the empty state when nothing is published", () => {
      mockGetAllPosts.mockReturnValue([]);
      renderBlog();
      expect(screen.getByText(/nothing published yet/i)).toBeInTheDocument();
    });
  });

  describe("Prefer email", () => {
    it("points to the newsletter after the list", () => {
      renderBlog();
      expect(screen.getByText("Prefer email?")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Get the notes" })
      ).toHaveAttribute("href", "/newsletter");
    });
  });
});

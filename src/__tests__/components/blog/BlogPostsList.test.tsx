import { render, screen, within } from "@testing-library/react";
import { BlogPostsList } from "@/components/blog/BlogPostsList";
import type { BlogPost } from "@/lib/types/blog";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

const posts: BlogPost[] = [
  {
    title: "First post",
    excerpt: "First excerpt",
    url: "/blog/first",
    publishedDate: new Date("2026-03-01T00:00:00Z"),
  },
  {
    title: "Second post",
    excerpt: "Second excerpt",
    url: "/blog/second",
    publishedDate: new Date("2026-02-01T00:00:00Z"),
  },
  {
    title: "Third post",
    excerpt: "Third excerpt",
    url: "/blog/third",
    publishedDate: new Date("2026-01-01T00:00:00Z"),
  },
];

describe("BlogPostsList", () => {
  describe("Posts", () => {
    it("renders a labelled list with one row per post", () => {
      render(<BlogPostsList posts={posts} />);
      const list = screen.getByRole("list", { name: "Blog posts" });
      expect(within(list).getAllByRole("listitem")).toHaveLength(3);
      expect(within(list).getAllByRole("article")).toHaveLength(3);
    });

    it("closes the hairline list with a bottom border", () => {
      render(<BlogPostsList posts={posts} />);
      expect(screen.getByRole("list").className).toContain("border-b");
    });

    it("renders titles, excerpts and read links", () => {
      render(<BlogPostsList posts={posts} />);
      expect(screen.getByText("First excerpt")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: 'Read "Second post"' })
      ).toHaveAttribute("href", posts[1].url);
    });

    it("uses h2 headings by default and h3 on request", () => {
      const { unmount } = render(<BlogPostsList posts={posts} />);
      expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(3);
      unmount();

      render(<BlogPostsList posts={posts} headingLevel={3} />);
      expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    });

    it("limits the number of rows when asked", () => {
      render(<BlogPostsList posts={posts} limit={2} />);
      expect(screen.getAllByRole("article")).toHaveLength(2);
      expect(screen.queryByText("Third post")).not.toBeInTheDocument();
    });

    it("forwards props to the list", () => {
      render(<BlogPostsList posts={posts} data-testid="blog-posts-list" />);
      expect(screen.getByTestId("blog-posts-list")).toBeInTheDocument();
    });
  });

  describe("States", () => {
    it("shows a polite loading status", () => {
      render(<BlogPostsList posts={[]} isLoading />);
      const status = screen.getByRole("status");
      expect(status).toHaveAttribute("aria-live", "polite");
      expect(status).toHaveTextContent(/loading posts/i);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("shows an error as an alert", () => {
      render(<BlogPostsList posts={posts} error="Feed unavailable" />);
      expect(screen.getByRole("alert")).toHaveTextContent("Feed unavailable");
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("shows a calm empty message", () => {
      render(<BlogPostsList posts={[]} />);
      expect(screen.getByText(/nothing published yet/i)).toBeInTheDocument();
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });
});

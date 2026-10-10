import { render, screen } from "@testing-library/react";
import { BlogPostRow } from "@/components/blog/BlogPostRow";
import type { BlogPost } from "@/lib/types/blog";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

const post: BlogPost = {
  title: "Default meals that survive a bad week",
  excerpt: "A short note on the meals that hold up when nothing else does.",
  url: "/blog/default-meals",
  publishedDate: new Date("2026-03-14T12:00:00Z"),
  readTime: 4,
};

describe("BlogPostRow", () => {
  it("renders as an article with a hairline and wrapping layout", () => {
    render(<BlogPostRow post={post} />);
    const article = screen.getByRole("article");
    expect(article.className).toContain("border-t");
    expect(article.className).toContain("flex-wrap");
  });

  it("renders the date in a time element with an ISO dateTime", () => {
    render(<BlogPostRow post={post} />);
    const time = screen.getByText("Mar 14, 2026");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("dateTime", "2026-03-14");
  });

  it("renders the read time when provided", () => {
    render(<BlogPostRow post={post} />);
    expect(screen.getByText("4 min read")).toBeInTheDocument();
  });

  it("omits the read time when missing", () => {
    render(<BlogPostRow post={{ ...post, readTime: undefined }} />);
    expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
  });

  it("links the title to the post on this site", () => {
    render(<BlogPostRow post={post} />);
    const link = screen.getByRole("link", { name: post.title });
    expect(link).toHaveAttribute("href", post.url);
    expect(link).not.toHaveAttribute("target");
  });

  it("renders the excerpt", () => {
    render(<BlogPostRow post={post} />);
    expect(screen.getByText(post.excerpt)).toBeInTheDocument();
  });

  it("renders a Read the post link with a descriptive label", () => {
    render(<BlogPostRow post={post} />);
    const link = screen.getByRole("link", { name: `Read "${post.title}"` });
    expect(link).toHaveAttribute("href", post.url);
    expect(link).toHaveTextContent("Read the post");
    expect(link.textContent).toContain("→");
  });

  it("uses an h3 by default and h2 on request", () => {
    const { unmount } = render(<BlogPostRow post={post} />);
    expect(
      screen.getByRole("heading", { level: 3, name: post.title })
    ).toBeInTheDocument();
    unmount();

    render(<BlogPostRow post={post} headingLevel={2} />);
    expect(
      screen.getByRole("heading", { level: 2, name: post.title })
    ).toBeInTheDocument();
  });

  it("does not render a thumbnail image", () => {
    render(
      <BlogPostRow post={{ ...post, thumbnail: "https://x.test/a.jpg" }} />
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("forwards extra props", () => {
    render(<BlogPostRow post={post} data-testid="row" className="mt-2" />);
    expect(screen.getByTestId("row").className).toContain("mt-2");
  });
});

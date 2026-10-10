import { render, screen, within } from "@testing-library/react";
import { PostArticle } from "@/components/blog/PostArticle";
import type { BlogPostContent } from "@/lib/types/blog";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

const post: BlogPostContent = {
  slug: "default-meals",
  title: "Default meals that survive a bad week",
  excerpt: "A short note.",
  url: "/blog/default-meals",
  publishedDate: new Date("2026-03-14T12:00:00Z"),
  readTime: 4,
  lead: "On the meals that hold up when nothing else does.",
  originalUrl: "https://easyplantlife.medium.com/default-meals-abc123",
  html: '<p>First paragraph.</p>\n<figure><img src="/images/blog/default-meals/01.jpeg" alt="A pot" loading="lazy" decoding="async"><figcaption>One pot.</figcaption></figure>\n',
};

describe("PostArticle", () => {
  it("renders an article with the title as h1 and the lead", () => {
    render(<PostArticle post={post} />);
    const article = screen.getByRole("article");
    expect(
      within(article).getByRole("heading", { level: 1 })
    ).toHaveTextContent(post.title);
    expect(screen.getByText(post.lead!)).toBeInTheDocument();
  });

  it("renders the eyebrow", () => {
    render(<PostArticle post={post} />);
    expect(screen.getByText("Blog")).toBeInTheDocument();
  });

  it("renders the date in a time element with the read time", () => {
    render(<PostArticle post={post} />);
    const time = screen.getByText("March 14, 2026");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("dateTime", "2026-03-14");
    expect(screen.getByText("4 min read")).toBeInTheDocument();
  });

  it("omits the lead and read time when missing", () => {
    render(
      <PostArticle post={{ ...post, lead: undefined, readTime: undefined }} />
    );
    expect(screen.queryByText(post.lead!)).not.toBeInTheDocument();
    expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
  });

  it("renders the body HTML inside the post-body container", () => {
    render(<PostArticle post={post} />);
    const body = screen.getByTestId("post-body");
    expect(body).toHaveClass("post-body");
    expect(within(body).getByText("First paragraph.")).toBeInTheDocument();
    const img = within(body).getByRole("img", { name: "A pot" });
    expect(img).toHaveAttribute("loading", "lazy");
    expect(within(body).getByText("One pot.").tagName).toBe("FIGCAPTION");
  });

  it("links back to all posts", () => {
    render(<PostArticle post={post} />);
    expect(screen.getByRole("link", { name: "All posts" })).toHaveAttribute(
      "href",
      "/blog"
    );
  });

  it("points to the original on Medium in a new tab", () => {
    render(<PostArticle post={post} />);
    const link = screen.getByRole("link", {
      name: /first published on medium/i,
    });
    expect(link).toHaveAttribute("href", post.originalUrl);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("omits the Medium pointer for posts first published here", () => {
    render(<PostArticle post={{ ...post, originalUrl: undefined }} />);
    expect(
      screen.queryByRole("link", { name: /medium/i })
    ).not.toBeInTheDocument();
  });

  it("forwards extra props", () => {
    render(<PostArticle post={post} className="mt-2" id="post" />);
    expect(screen.getByRole("article")).toHaveAttribute("id", "post");
    expect(screen.getByRole("article").className).toContain("mt-2");
  });
});

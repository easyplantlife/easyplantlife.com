import { render, screen, within } from "@testing-library/react";
import {
  RecentWriting,
  RECENT_WRITING_LIMIT,
} from "@/components/home/RecentWriting";
import type { BlogPost } from "@/lib/types/blog";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

function makePosts(count: number): BlogPost[] {
  return Array.from({ length: count }, (_, i) => ({
    title: `Post ${i + 1}`,
    excerpt: `Excerpt ${i + 1}`,
    url: `https://medium.com/@easyplantlife/post-${i + 1}`,
    publishedDate: new Date(2026, 0, i + 1),
  }));
}

describe("RecentWriting", () => {
  it("renders a section labelled by its heading", () => {
    render(<RecentWriting posts={makePosts(2)} />);
    const section = screen.getByTestId("recent-writing");
    expect(section).toHaveAttribute("aria-labelledby", "recent-writing-title");
    expect(
      screen.getByRole("region", { name: "Recent writing" })
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and h2 with the expected id", () => {
    render(<RecentWriting posts={makePosts(1)} />);
    expect(screen.getByText("From the blog")).toBeInTheDocument();
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "Recent writing",
    });
    expect(heading).toHaveAttribute("id", "recent-writing-title");
  });

  it("links to all posts", () => {
    render(<RecentWriting posts={makePosts(1)} />);
    expect(screen.getByRole("link", { name: "All posts" })).toHaveAttribute(
      "href",
      "/blog"
    );
  });

  it("shows at most the default limit of posts", () => {
    render(<RecentWriting posts={makePosts(RECENT_WRITING_LIMIT + 2)} />);
    const list = screen.getByRole("list", { name: /blog posts/i });
    expect(within(list).getAllByRole("listitem")).toHaveLength(
      RECENT_WRITING_LIMIT
    );
  });

  it("respects a custom limit", () => {
    render(<RecentWriting posts={makePosts(5)} limit={2} />);
    const list = screen.getByRole("list", { name: /blog posts/i });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders post titles as h3 so the section h2 stays the parent", () => {
    render(<RecentWriting posts={makePosts(2)} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
    expect(
      screen.getByRole("heading", { level: 3, name: "Post 1" })
    ).toBeInTheDocument();
  });

  it("passes an error through as an alert", () => {
    render(<RecentWriting posts={[]} error="Feed is down" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Feed is down");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("shows an empty message when there are no posts", () => {
    render(<RecentWriting posts={[]} />);
    expect(screen.getByText(/nothing published yet/i)).toBeInTheDocument();
  });
});

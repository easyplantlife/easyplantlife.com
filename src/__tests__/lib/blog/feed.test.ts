import { buildRssFeed, BLOG_FEED_PATH } from "@/lib/blog/feed";
import type { BlogPostContent } from "@/lib/types/blog";

const post: BlogPostContent = {
  slug: "default-meals",
  title: "Default meals & more",
  excerpt: "Why a <boring> default is the whole trick.",
  url: "/blog/default-meals",
  publishedDate: new Date("2026-01-15T12:00:00Z"),
  tags: ["food", "habits"],
  cover: { src: "/images/blog/default-meals/01.jpeg", alt: "A pot" },
  html: '<p>See <a href="/books">the books</a>.</p><figure><img src="/images/blog/default-meals/02.jpeg" alt=""></figure><p>]]></p>',
};

describe("buildRssFeed", () => {
  const feed = buildRssFeed([post]);

  it("is served under the blog", () => {
    expect(BLOG_FEED_PATH).toBe("/blog/feed.xml");
  });

  it("describes the channel with a self link", () => {
    expect(feed).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
    expect(feed).toContain("<link>https://easyplantlife.com/blog</link>");
    expect(feed).toContain(
      '<atom:link href="https://easyplantlife.com/blog/feed.xml" rel="self" type="application/rss+xml"/>'
    );
    expect(feed).toContain(
      "<lastBuildDate>Thu, 15 Jan 2026 12:00:00 GMT</lastBuildDate>"
    );
  });

  it("lists each post with escaped text and a permalink guid", () => {
    expect(feed).toContain("<title>Default meals &amp; more</title>");
    expect(feed).toContain(
      "<description>Why a &lt;boring&gt; default is the whole trick.</description>"
    );
    expect(feed).toContain(
      '<guid isPermaLink="true">https://easyplantlife.com/blog/default-meals</guid>'
    );
    expect(feed).toContain("<pubDate>Thu, 15 Jan 2026 12:00:00 GMT</pubDate>");
    expect(feed).toContain("<category>food</category>");
  });

  it("carries the full body with absolute links and images", () => {
    expect(feed).toContain(
      'src="https://easyplantlife.com/images/blog/default-meals/01.jpeg" alt="A pot"'
    );
    expect(feed).toContain('href="https://easyplantlife.com/books"');
    expect(feed).toContain(
      'src="https://easyplantlife.com/images/blog/default-meals/02.jpeg"'
    );
  });

  it("keeps a stray CDATA terminator from ending the body early", () => {
    expect(feed).toContain("]]]]><![CDATA[>");
  });

  it("is a valid empty channel without posts", () => {
    const empty = buildRssFeed([]);
    expect(empty).toContain("<channel>");
    expect(empty).not.toContain("<item>");
    expect(empty).not.toContain("lastBuildDate");
  });
});

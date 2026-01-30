/**
 * Medium Data Fetching Service Tests
 *
 * Tests for the Medium RSS feed service following TDD approach.
 * Uses mocked fetch to test RSS parsing and error handling.
 *
 * Acceptance Criteria from issue #42:
 * - [ ] Service at `/lib/api/medium.ts`
 * - [ ] Fetches post list from Medium
 * - [ ] Parses required fields: title, excerpt, URL, date
 * - [ ] Handles errors gracefully
 * - [ ] Implements caching (if appropriate)
 * - [ ] TypeScript types for Medium post data
 *
 * Test Cases from issue:
 * GIVEN the Medium service
 * WHEN fetching posts succeeds
 * THEN it returns an array of posts with title, excerpt, url, date
 *
 * GIVEN the Medium service
 * WHEN fetching fails
 * THEN it throws a descriptive error
 */

import {
  fetchMediumPosts,
  type MediumPost,
  type MediumServiceConfig,
} from "@/lib/api/medium";

// Sample RSS response matching Medium's format
const mockRssResponse = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Easy Plant Life - Medium</title>
    <link>https://medium.com/@easyplantlife</link>
    <description>Latest posts from Easy Plant Life</description>
    <item>
      <title>Living Simply with Plants</title>
      <link>https://medium.com/@easyplantlife/living-simply-with-plants-abc123</link>
      <guid>https://medium.com/p/abc123</guid>
      <pubDate>Mon, 15 Jan 2024 10:00:00 GMT</pubDate>
      <description><![CDATA[A gentle introduction to bringing plants into your daily life without the pressure of perfection.]]></description>
      <content:encoded><![CDATA[<p>Full HTML content here...</p>]]></content:encoded>
      <dc:creator>Easy Plant Life</dc:creator>
      <category>plants</category>
      <category>lifestyle</category>
    </item>
    <item>
      <title>The Joy of Low-Maintenance Greenery</title>
      <link>https://medium.com/@easyplantlife/low-maintenance-greenery-def456</link>
      <guid>https://medium.com/p/def456</guid>
      <pubDate>Wed, 10 Jan 2024 08:30:00 GMT</pubDate>
      <description><![CDATA[Discover plants that thrive on neglect—perfect for busy lives.]]></description>
      <dc:creator>Easy Plant Life</dc:creator>
      <category>plants</category>
    </item>
  </channel>
</rss>`;

const mockEmptyRssResponse = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Easy Plant Life - Medium</title>
    <link>https://medium.com/@easyplantlife</link>
    <description>Latest posts from Easy Plant Life</description>
  </channel>
</rss>`;

const mockMalformedRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Easy Plant Life</title>
    <item>
      <title>Post Without Required Fields</title>
    </item>
  </channel>
</rss>`;

describe("Medium Data Fetching Service", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  describe("Service file exists", () => {
    it("exports fetchMediumPosts function", () => {
      expect(typeof fetchMediumPosts).toBe("function");
    });

    it("exports MediumPost type", () => {
      // Type check - if this compiles, the type exists
      const post: MediumPost = {
        id: "test",
        title: "Test",
        excerpt: "Test excerpt",
        url: "https://medium.com/test",
        publishedDate: new Date(),
      };
      expect(post).toBeDefined();
    });

    it("exports MediumServiceConfig type", () => {
      // Type check - if this compiles, the type exists
      const config: MediumServiceConfig = {
        username: "test",
      };
      expect(config).toBeDefined();
    });
  });

  describe("Successful fetch", () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockRssResponse),
      });
    });

    it("returns an array of posts", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBe(2);
    });

    it("parses title correctly", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      expect(posts[0].title).toBe("Living Simply with Plants");
      expect(posts[1].title).toBe("The Joy of Low-Maintenance Greenery");
    });

    it("parses excerpt from description", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      expect(posts[0].excerpt).toContain("gentle introduction");
      expect(posts[1].excerpt).toContain("plants that thrive on neglect");
    });

    it("parses URL correctly", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      expect(posts[0].url).toBe(
        "https://medium.com/@easyplantlife/living-simply-with-plants-abc123"
      );
      expect(posts[1].url).toBe(
        "https://medium.com/@easyplantlife/low-maintenance-greenery-def456"
      );
    });

    it("parses publishedDate as Date object", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      expect(posts[0].publishedDate).toBeInstanceOf(Date);
      expect(posts[0].publishedDate.getFullYear()).toBe(2024);
      expect(posts[0].publishedDate.getMonth()).toBe(0); // January
      expect(posts[0].publishedDate.getDate()).toBe(15);
    });

    it("extracts id from guid", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      expect(posts[0].id).toBe("abc123");
      expect(posts[1].id).toBe("def456");
    });

    it("parses categories when present", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      expect(posts[0].categories).toEqual(["plants", "lifestyle"]);
      expect(posts[1].categories).toEqual(["plants"]);
    });

    it("fetches from correct RSS URL", async () => {
      await fetchMediumPosts({ username: "easyplantlife" });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://medium.com/feed/@easyplantlife",
        expect.any(Object)
      );
    });

    it("respects maxPosts configuration", async () => {
      const posts = await fetchMediumPosts({
        username: "easyplantlife",
        maxPosts: 1,
      });

      expect(posts.length).toBe(1);
    });
  });

  describe("Empty feed handling", () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockEmptyRssResponse),
      });
    });

    it("returns empty array when no posts exist", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBe(0);
    });
  });

  describe("Error handling", () => {
    it("throws descriptive error on network failure", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      await expect(
        fetchMediumPosts({ username: "easyplantlife" })
      ).rejects.toThrow("Failed to fetch Medium posts");
    });

    it("throws error when response is not ok", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(
        fetchMediumPosts({ username: "easyplantlife" })
      ).rejects.toThrow("Failed to fetch Medium RSS feed");
    });

    it("includes original error message in thrown error", async () => {
      global.fetch = jest
        .fn()
        .mockRejectedValue(new Error("Connection refused"));

      await expect(
        fetchMediumPosts({ username: "easyplantlife" })
      ).rejects.toThrow("Connection refused");
    });

    it("handles malformed RSS gracefully", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("not valid xml"),
      });

      await expect(
        fetchMediumPosts({ username: "easyplantlife" })
      ).rejects.toThrow("Failed to parse Medium RSS feed");
    });

    it("skips items missing required fields", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockMalformedRss),
      });

      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      // Should return empty array since the item is missing required fields
      expect(posts.length).toBe(0);
    });
  });

  describe("Configuration options", () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockRssResponse),
      });
    });

    it("uses provided username in feed URL", async () => {
      await fetchMediumPosts({ username: "customuser" });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://medium.com/feed/@customuser",
        expect.any(Object)
      );
    });

    it("handles username with @ prefix", async () => {
      await fetchMediumPosts({ username: "@easyplantlife" });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://medium.com/feed/@easyplantlife",
        expect.any(Object)
      );
    });

    it("defaults maxPosts to 10 when not specified", async () => {
      // Mock with many items
      const manyItemsRss = mockRssResponse.replace(
        "</channel>",
        `
        <item>
          <title>Post 3</title>
          <link>https://medium.com/@easyplantlife/post-3</link>
          <guid>https://medium.com/p/post3</guid>
          <pubDate>Mon, 08 Jan 2024 10:00:00 GMT</pubDate>
          <description>Description 3</description>
        </item>
        </channel>`
      );

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(manyItemsRss),
      });

      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      // Should return all posts (3 in this case) since it's under the default 10
      expect(posts.length).toBe(3);
    });
  });

  describe("Post data structure", () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockRssResponse),
      });
    });

    it("each post has all required fields", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      posts.forEach((post) => {
        expect(post).toHaveProperty("id");
        expect(post).toHaveProperty("title");
        expect(post).toHaveProperty("excerpt");
        expect(post).toHaveProperty("url");
        expect(post).toHaveProperty("publishedDate");
      });
    });

    it("id is a non-empty string", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      posts.forEach((post) => {
        expect(typeof post.id).toBe("string");
        expect(post.id.length).toBeGreaterThan(0);
      });
    });

    it("title is a non-empty string", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      posts.forEach((post) => {
        expect(typeof post.title).toBe("string");
        expect(post.title.length).toBeGreaterThan(0);
      });
    });

    it("excerpt is a non-empty string", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      posts.forEach((post) => {
        expect(typeof post.excerpt).toBe("string");
        expect(post.excerpt.length).toBeGreaterThan(0);
      });
    });

    it("url is a valid URL string", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      posts.forEach((post) => {
        expect(typeof post.url).toBe("string");
        expect(() => new URL(post.url)).not.toThrow();
      });
    });

    it("publishedDate is a valid Date", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      posts.forEach((post) => {
        expect(post.publishedDate).toBeInstanceOf(Date);
        expect(isNaN(post.publishedDate.getTime())).toBe(false);
      });
    });

    it("categories is optional and is an array when present", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      posts.forEach((post) => {
        if (post.categories !== undefined) {
          expect(Array.isArray(post.categories)).toBe(true);
        }
      });
    });

    it("thumbnail is optional and is a string when present", async () => {
      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      posts.forEach((post) => {
        if (post.thumbnail !== undefined) {
          expect(typeof post.thumbnail).toBe("string");
        }
      });
    });
  });

  describe("Excerpt sanitization", () => {
    it("strips HTML tags from excerpt", async () => {
      const rssWithHtmlDescription = mockRssResponse.replace(
        "A gentle introduction",
        "<p><strong>A gentle introduction</strong></p>"
      );

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(rssWithHtmlDescription),
      });

      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      expect(posts[0].excerpt).not.toContain("<p>");
      expect(posts[0].excerpt).not.toContain("<strong>");
      expect(posts[0].excerpt).toContain("A gentle introduction");
    });

    it("decodes HTML entities in excerpt", async () => {
      const rssWithEntities = mockRssResponse.replace(
        "A gentle introduction",
        "A &amp; gentle introduction &mdash; test"
      );

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(rssWithEntities),
      });

      const posts = await fetchMediumPosts({ username: "easyplantlife" });

      expect(posts[0].excerpt).toContain("&");
      expect(posts[0].excerpt).not.toContain("&amp;");
    });
  });
});

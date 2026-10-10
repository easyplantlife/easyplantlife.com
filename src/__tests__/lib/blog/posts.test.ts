import * as fs from "fs";
import * as path from "path";
import {
  POSTS_DIRECTORY,
  estimateReadTime,
  excerptFromBody,
  getAllPosts,
  getPostBySlug,
  getPostSlugs,
  isValidSlug,
  parsePost,
} from "@/lib/blog/posts";

const fixtures = path.join(__dirname, "..", "..", "fixtures");

function fixture(name: string): string {
  return fs.readFileSync(path.join(fixtures, name), "utf8");
}

describe("isValidSlug", () => {
  it("accepts lower-case words joined by hyphens", () => {
    expect(isValidSlug("default-meals")).toBe(true);
    expect(isValidSlug("post2")).toBe(true);
  });

  it("rejects anything that could leave the posts directory", () => {
    expect(isValidSlug("../secrets")).toBe(false);
    expect(isValidSlug("a/b")).toBe(false);
    expect(isValidSlug("Upper-Case")).toBe(false);
    expect(isValidSlug("-leading")).toBe(false);
    expect(isValidSlug("")).toBe(false);
  });
});

describe("parsePost", () => {
  it("maps the front matter onto the post", () => {
    const { entry, body } = parsePost(
      "older-post",
      fixture("posts/older-post.md")
    );
    expect(entry).toMatchObject({
      slug: "older-post",
      title: "An older post",
      excerpt: "A short note about keeping things simple.",
      url: "/blog/older-post",
      lead: "The subtitle line.",
      thumbnail: "/images/blog/older-post/01.jpeg",
      tags: ["habits", "food"],
      originalUrl: "https://easyplantlife.medium.com/an-older-post-abc123",
    });
    expect(entry.publishedDate).toEqual(new Date("2026-01-10T09:00:00.000Z"));
    expect(entry.readTime).toBe(1);
    expect(body.startsWith("![A plain kitchen counter]")).toBe(true);
    expect(entry).not.toHaveProperty("html");
  });

  it("leaves optional fields out when the front matter has none", () => {
    const { entry } = parsePost("newer-post", fixture("posts/newer-post.md"));
    expect(entry.lead).toBeUndefined();
    expect(entry.thumbnail).toBeUndefined();
    expect(entry.tags).toBeUndefined();
    expect(entry.originalUrl).toBeUndefined();
  });

  it("derives the excerpt from the first paragraph when none is set", () => {
    const { entry } = parsePost("newer-post", fixture("posts/newer-post.md"));
    expect(entry.excerpt).toBe(
      "The first real paragraph becomes the excerpt when the front matter has none."
    );
  });

  it("fails loudly without a title", () => {
    expect(() =>
      parsePost("missing-title", fixture("broken-posts/missing-title.md"))
    ).toThrow(/title/);
  });

  it("fails loudly without a valid date", () => {
    expect(() =>
      parsePost("bad-date", fixture("broken-posts/bad-date.md"))
    ).toThrow(/date/);
  });

  it("accepts a date YAML already parsed", () => {
    const { entry } = parsePost(
      "unquoted",
      "---\ntitle: Unquoted\ndate: 2026-03-01\n---\n\nBody.\n"
    );
    expect(entry.publishedDate).toEqual(new Date("2026-03-01"));
  });

  it("ignores tags that are not strings", () => {
    const { entry } = parsePost(
      "odd-tags",
      '---\ntitle: Odd\ndate: "2026-03-01"\ntags: [1, "food"]\n---\n\nBody.\n'
    );
    expect(entry.tags).toEqual(["food"]);
  });
});

describe("getPostSlugs", () => {
  it("reads src/content/posts", () => {
    expect(POSTS_DIRECTORY).toBe(
      path.join(process.cwd(), "src", "content", "posts")
    );
    const slugs = getPostSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    expect(slugs).toEqual([...slugs].sort());
    for (const slug of slugs) {
      expect(isValidSlug(slug)).toBe(true);
    }
  });
});

describe("getAllPosts", () => {
  it("returns every post, newest first, without the body", () => {
    const posts = getAllPosts();
    expect(posts.map((post) => post.slug).sort()).toEqual(getPostSlugs());
    const times = posts.map((post) => post.publishedDate.getTime());
    expect([...times].sort((a, b) => b - a)).toEqual(times);
    for (const post of posts) {
      expect(post.url).toBe(`/blog/${post.slug}`);
      expect(post).not.toHaveProperty("html");
    }
  });
});

describe("getPostBySlug", () => {
  it("renders the body to HTML", () => {
    const slug = getPostSlugs()[0];
    const post = getPostBySlug(slug);
    expect(post?.slug).toBe(slug);
    expect(post?.html).toMatch(/<p>/);
  });

  it("lifts the opening image out of the body as the cover", () => {
    const post = getPostBySlug(getPostSlugs()[0]);
    expect(post?.cover?.src).toBe(post?.thumbnail);
    expect(post?.cover?.alt).toEqual(expect.any(String));
    expect(post?.html).not.toContain(post?.thumbnail);
  });

  it("returns null for an unknown slug", () => {
    expect(getPostBySlug("missing")).toBeNull();
  });

  it("returns null instead of reading outside the directory", () => {
    expect(getPostBySlug("../../package")).toBeNull();
    expect(getPostBySlug("../posts/" + getPostSlugs()[0])).toBeNull();
  });
});

describe("estimateReadTime", () => {
  it("never reports less than a minute", () => {
    expect(estimateReadTime("A few words.")).toBe(1);
  });

  it("rounds words at 200 per minute", () => {
    const words = Array.from({ length: 1000 }, () => "word").join(" ");
    expect(estimateReadTime(words)).toBe(5);
  });

  it("ignores image syntax", () => {
    const body = "![alt text here](/img.jpg)\n\nOne two three.";
    expect(estimateReadTime(body)).toBe(1);
  });
});

describe("excerptFromBody", () => {
  it("skips headings, images and lists", () => {
    const body =
      "## Heading\n\n![alt](/a.jpg)\n\n- item\n\n> quote\n\nThe *real* first paragraph.";
    expect(excerptFromBody(body)).toBe("The real first paragraph.");
  });

  it("joins hard-broken lines with spaces", () => {
    expect(excerptFromBody("One line.\\\nTwo line.")).toBe(
      "One line. Two line."
    );
  });

  it("truncates long paragraphs at a word boundary", () => {
    const body = Array.from({ length: 60 }, () => "word").join(" ");
    const excerpt = excerptFromBody(body);
    expect(excerpt.length).toBeLessThanOrEqual(201);
    expect(excerpt.endsWith("…")).toBe(true);
    expect(excerpt).not.toMatch(/wor…$/);
  });

  it("returns an empty string for an empty body", () => {
    expect(excerptFromBody("")).toBe("");
  });
});

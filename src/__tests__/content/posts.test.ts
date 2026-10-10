/**
 * Published posts
 *
 * Every file in src/content/posts must be a complete, self-contained post:
 * valid front matter, local images that exist, and no leftover Medium
 * markup from the migration.
 */

import * as fs from "fs";
import * as path from "path";
import { getAllPosts, getPostBySlug, getPostSlugs } from "@/lib/blog/posts";

const publicDir = path.join(process.cwd(), "public");
const slugs = getPostSlugs();

const migratedSlugs = [
  "cleanup-is-the-reason-you-dont-cook",
  "you-dont-owe-anyone-an-explanation-for-what-you-eat",
  "the-grocery-store-is-selling-you-a-fantasy",
  "you-dont-need-a-reason-to-be-vegan",
  "why-most-vegan-advice-fails-on-ordinary-days",
];

describe("Published posts", () => {
  it("includes the five posts migrated from Medium", () => {
    for (const slug of migratedSlugs) {
      expect(slugs).toContain(slug);
    }
  });

  it("lists every post newest first with unique slugs and dates", () => {
    const posts = getAllPosts();
    expect(posts).toHaveLength(slugs.length);
    const times = posts.map((post) => post.publishedDate.getTime());
    expect([...times].sort((a, b) => b - a)).toEqual(times);
    expect(new Set(posts.map((post) => post.slug)).size).toBe(posts.length);
  });

  describe.each(slugs)("%s", (slug) => {
    const post = getPostBySlug(slug)!;

    it("has a title, an excerpt and a reading time", () => {
      expect(post.title.length).toBeGreaterThan(0);
      expect(post.excerpt.length).toBeGreaterThan(20);
      expect(post.excerpt.length).toBeLessThanOrEqual(201);
      expect(post.readTime).toBeGreaterThanOrEqual(1);
    });

    it("was published in the past", () => {
      expect(post.publishedDate.getTime()).toBeLessThan(Date.now());
    });

    it("has a cover image that exists", () => {
      expect(post.thumbnail).toMatch(new RegExp(`^/images/blog/${slug}/`));
      expect(fs.existsSync(path.join(publicDir, post.thumbnail!))).toBe(true);
    });

    it("only references local images that exist", () => {
      const sources = [
        ...(post.cover ? [post.cover.src] : []),
        ...[...post.html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(
          (match) => match[1]
        ),
      ];
      expect(sources.length).toBeGreaterThan(0);
      for (const src of sources) {
        expect(src).toMatch(/^\/images\/blog\//);
        expect(fs.existsSync(path.join(publicDir, src))).toBe(true);
      }
    });

    it("carries no Medium markup or tracking", () => {
      expect(post.html).not.toContain("medium.com");
      expect(post.html).not.toContain("cdn-images");
    });

    it("links back to the original on Medium", () => {
      expect(post.originalUrl).toMatch(
        /^https:\/\/easyplantlife\.medium\.com\//
      );
    });
  });
});

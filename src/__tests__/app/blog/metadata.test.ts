/**
 * Blog Page SEO Metadata Tests
 *
 * Tests for the blog page SEO metadata following TDD approach.
 * Based on acceptance criteria from issue #47 (M7-07):
 * - Page title set
 * - Meta description set (under 160 characters)
 * - Appropriate metadata for blog content
 */

import type { Metadata } from "next";

describe("Blog Page SEO Metadata", () => {
  let metadata: Metadata;

  beforeAll(async () => {
    const pageModule = await import("@/app/blog/page");
    metadata = pageModule.metadata;
  });

  describe("Page Title", () => {
    it("has a title set", () => {
      expect(metadata.title).toBeDefined();
    });

    it("title includes brand name", () => {
      const title =
        typeof metadata.title === "string"
          ? metadata.title
          : metadata.title?.toString() || "";
      expect(title.toLowerCase()).toContain("easy plant life");
    });

    it("title indicates blog section", () => {
      const title =
        typeof metadata.title === "string"
          ? metadata.title
          : metadata.title?.toString() || "";
      expect(title.toLowerCase()).toContain("blog");
    });
  });

  describe("Meta Description", () => {
    it("has a description set", () => {
      expect(metadata.description).toBeDefined();
    });

    it("description is under 160 characters", () => {
      const description = metadata.description || "";
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it("description is meaningful (at least 50 characters)", () => {
      const description = metadata.description || "";
      expect(description.length).toBeGreaterThanOrEqual(50);
    });

    it("description reflects blog content", () => {
      const description = (metadata.description || "").toLowerCase();
      // Should contain relevant keywords for blog content
      const hasRelevantContent =
        description.includes("article") ||
        description.includes("post") ||
        description.includes("read") ||
        description.includes("plant") ||
        description.includes("care");
      expect(hasRelevantContent).toBe(true);
    });
  });
});

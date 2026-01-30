/**
 * Newsletter Page SEO Metadata Tests
 *
 * Tests for the Newsletter page SEO metadata following TDD approach.
 * Based on acceptance criteria from issue #54 (M8-07):
 * - Page title: "Newsletter | Easy Plant Life"
 * - Meta description emphasizing value
 * - Open Graph tags
 */

import type { Metadata } from "next";

describe("Newsletter Page SEO Metadata", () => {
  let metadata: Metadata;

  beforeAll(async () => {
    // Dynamic import to get the metadata export
    const pageModule = await import("@/app/newsletter/page");
    metadata = pageModule.metadata;
  });

  describe("Page Title", () => {
    it("has a title set", () => {
      expect(metadata.title).toBeDefined();
    });

    it("title is exactly 'Newsletter | Easy Plant Life'", () => {
      expect(metadata.title).toBe("Newsletter | Easy Plant Life");
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

    it("description emphasizes value to the reader", () => {
      const description = (metadata.description || "").toLowerCase();
      // Should contain value-oriented keywords about what subscribers get
      const hasValueContent =
        description.includes("plant") ||
        description.includes("living") ||
        description.includes("calm") ||
        description.includes("thoughtful") ||
        description.includes("simple") ||
        description.includes("updates") ||
        description.includes("subscribe");
      expect(hasValueContent).toBe(true);
    });
  });

  describe("Open Graph Metadata", () => {
    it("has Open Graph metadata defined", () => {
      expect(metadata.openGraph).toBeDefined();
    });

    it("has Open Graph title", () => {
      expect(metadata.openGraph?.title).toBeDefined();
    });

    it("Open Graph title includes 'Newsletter' and 'Easy Plant Life'", () => {
      const ogTitle = metadata.openGraph?.title?.toString() || "";
      expect(ogTitle.toLowerCase()).toContain("newsletter");
      expect(ogTitle.toLowerCase()).toContain("easy plant life");
    });

    it("has Open Graph description", () => {
      expect(metadata.openGraph?.description).toBeDefined();
    });

    it("has Open Graph type set to website", () => {
      const og = metadata.openGraph as { type?: string } | undefined;
      expect(og?.type).toBe("website");
    });

    it("has Open Graph site name", () => {
      expect(metadata.openGraph?.siteName).toBe("Easy Plant Life");
    });

    it("has Open Graph locale", () => {
      expect(metadata.openGraph?.locale).toBe("en_US");
    });
  });

  describe("Twitter Card Metadata", () => {
    it("has Twitter card metadata defined", () => {
      expect(metadata.twitter).toBeDefined();
    });

    it("has Twitter card type", () => {
      const twitter = metadata.twitter as { card?: string } | undefined;
      expect(twitter?.card).toBeDefined();
      expect(["summary", "summary_large_image"]).toContain(twitter?.card);
    });

    it("has Twitter title", () => {
      expect(metadata.twitter?.title).toBeDefined();
    });

    it("has Twitter description", () => {
      expect(metadata.twitter?.description).toBeDefined();
    });
  });

  describe("Additional SEO Best Practices", () => {
    it("has robots metadata allowing indexing", () => {
      const robots = metadata.robots as
        | { index?: boolean; follow?: boolean }
        | undefined;
      if (robots) {
        expect(robots.index).toBe(true);
        expect(robots.follow).toBe(true);
      }
    });
  });
});

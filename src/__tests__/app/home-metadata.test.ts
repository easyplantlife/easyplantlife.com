/**
 * Home Page SEO Metadata Tests
 *
 * Tests for the home page SEO metadata following TDD approach.
 * Based on acceptance criteria from issue #30 (M4-05):
 * - Page title set
 * - Meta description set (under 160 characters)
 * - Open Graph title and description
 * - Open Graph image (if available)
 * - Twitter card metadata
 */

// Import metadata from the home page
// Note: We test the exported metadata object directly since Next.js
// handles the actual HTML meta tag rendering
import type { Metadata } from "next";

describe("Home Page SEO Metadata", () => {
  // We'll import the metadata dynamically to test its structure
  let metadata: Metadata;

  beforeAll(async () => {
    // Dynamic import to get the metadata export
    const pageModule = await import("@/app/page");
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

    it("description reflects brand messaging", () => {
      const description = (metadata.description || "").toLowerCase();
      // Should contain relevant brand keywords
      const hasRelevantContent =
        description.includes("calm") ||
        description.includes("plant") ||
        description.includes("vegan") ||
        description.includes("simple") ||
        description.includes("easy");
      expect(hasRelevantContent).toBe(true);
    });
  });

  describe("Open Graph Metadata", () => {
    it("has Open Graph metadata defined", () => {
      expect(metadata.openGraph).toBeDefined();
    });

    it("has Open Graph title", () => {
      expect(metadata.openGraph?.title).toBeDefined();
    });

    it("has Open Graph description", () => {
      expect(metadata.openGraph?.description).toBeDefined();
    });

    it("has Open Graph type set to website", () => {
      const og = metadata.openGraph as { type?: string } | undefined;
      expect(og?.type).toBe("website");
    });

    it("has Open Graph site name", () => {
      expect(metadata.openGraph?.siteName).toBeDefined();
    });

    it("has Open Graph locale", () => {
      expect(metadata.openGraph?.locale).toBeDefined();
    });

    it("has Open Graph URL (optional)", () => {
      // URL is optional but recommended
      // Test passes if undefined or valid URL
      const url = metadata.openGraph?.url;
      if (url) {
        expect(typeof url === "string" || url instanceof URL).toBe(true);
      }
    });

    it("has Open Graph images array (optional)", () => {
      // Images are optional for MVP
      const images = metadata.openGraph?.images;
      if (images) {
        expect(Array.isArray(images) || typeof images === "object").toBe(true);
      }
    });
  });

  describe("Twitter Card Metadata", () => {
    it("has Twitter card metadata defined", () => {
      expect(metadata.twitter).toBeDefined();
    });

    it("has Twitter card type", () => {
      const twitter = metadata.twitter as { card?: string } | undefined;
      expect(twitter?.card).toBeDefined();
      // Should be summary or summary_large_image
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
    it("has robots metadata (optional)", () => {
      // Robots metadata is optional but good to have
      const robots = metadata.robots;
      if (robots) {
        expect(robots).toBeDefined();
      }
    });

    it("has keywords metadata (optional)", () => {
      // Keywords are less important for modern SEO but can be included
      const keywords = metadata.keywords;
      if (keywords) {
        expect(keywords).toBeDefined();
      }
    });
  });
});

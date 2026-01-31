/**
 * Robots.txt Tests
 *
 * Tests for the robots.txt file following TDD approach.
 * Based on acceptance criteria from issue #65 (M10-05):
 * - robots.txt at `/robots.txt`
 * - Allows all crawlers
 * - Points to sitemap
 * - Blocks any admin/dev routes if they exist
 */

import type { MetadataRoute } from "next";

describe("Robots.txt Generation", () => {
  let robots: MetadataRoute.Robots;

  beforeAll(async () => {
    // Dynamic import to get the robots function
    const robotsModule = await import("@/app/robots");
    robots = robotsModule.default();
  });

  describe("Basic Structure", () => {
    it("returns a valid robots configuration object", () => {
      expect(robots).toBeDefined();
      expect(typeof robots).toBe("object");
    });

    it("has rules property", () => {
      expect(robots.rules).toBeDefined();
    });

    it("has sitemap property", () => {
      expect(robots.sitemap).toBeDefined();
    });
  });

  describe("Crawler Permissions", () => {
    it("allows all crawlers by default", () => {
      const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
      const allCrawlersRule = rules.find(
        (rule) => rule.userAgent === "*" || rule.userAgent?.includes("*")
      );
      expect(allCrawlersRule).toBeDefined();
    });

    it("allows crawling of public pages", () => {
      const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
      const allCrawlersRule = rules.find(
        (rule) => rule.userAgent === "*" || rule.userAgent?.includes("*")
      );
      // Should either have allow: "/" or not have disallow for public paths
      expect(allCrawlersRule?.allow).toBeDefined();
    });
  });

  describe("Sitemap Reference", () => {
    it("points to the sitemap URL", () => {
      expect(robots.sitemap).toBe("https://easyplantlife.com/sitemap.xml");
    });
  });

  describe("Blocked Routes", () => {
    it("blocks /dev routes from crawlers", () => {
      const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
      const allCrawlersRule = rules.find(
        (rule) => rule.userAgent === "*" || rule.userAgent?.includes("*")
      );

      // disallow can be a string or array
      const disallowed = allCrawlersRule?.disallow;
      const disallowList = Array.isArray(disallowed)
        ? disallowed
        : disallowed
          ? [disallowed]
          : [];

      expect(disallowList).toContain("/dev/");
    });

    it("blocks /api routes from crawlers", () => {
      const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
      const allCrawlersRule = rules.find(
        (rule) => rule.userAgent === "*" || rule.userAgent?.includes("*")
      );

      const disallowed = allCrawlersRule?.disallow;
      const disallowList = Array.isArray(disallowed)
        ? disallowed
        : disallowed
          ? [disallowed]
          : [];

      expect(disallowList).toContain("/api/");
    });
  });
});

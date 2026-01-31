/**
 * Sitemap Generation Tests
 *
 * Tests for the XML sitemap following TDD approach.
 * Based on acceptance criteria from issue #64 (M10-04):
 * - Sitemap generated at `/sitemap.xml`
 * - Includes all public pages
 * - Uses Next.js built-in sitemap generation
 * - Proper lastmod dates if possible
 */

import type { MetadataRoute } from "next";

describe("Sitemap Generation", () => {
  let sitemap: MetadataRoute.Sitemap;

  beforeAll(async () => {
    // Dynamic import to get the sitemap function
    const sitemapModule = await import("@/app/sitemap");
    sitemap = sitemapModule.default();
  });

  describe("Sitemap Structure", () => {
    it("returns an array of sitemap entries", () => {
      expect(Array.isArray(sitemap)).toBe(true);
      expect(sitemap.length).toBeGreaterThan(0);
    });

    it("each entry has a url property", () => {
      sitemap.forEach((entry) => {
        expect(entry.url).toBeDefined();
        expect(typeof entry.url).toBe("string");
      });
    });

    it("all URLs use the correct base URL", () => {
      const baseUrl = "https://easyplantlife.com";
      sitemap.forEach((entry) => {
        expect(entry.url).toMatch(new RegExp(`^${baseUrl}`));
      });
    });
  });

  describe("Public Pages Included", () => {
    const expectedPages = [
      "/", // Home
      "/about",
      "/books",
      "/blog",
      "/newsletter",
      "/contact",
    ];

    expectedPages.forEach((page) => {
      it(`includes ${page === "/" ? "home page" : page} in sitemap`, () => {
        const expectedUrl =
          page === "/"
            ? "https://easyplantlife.com"
            : `https://easyplantlife.com${page}`;
        const found = sitemap.some((entry) => entry.url === expectedUrl);
        expect(found).toBe(true);
      });
    });
  });

  describe("Non-Public Pages Excluded", () => {
    it("does not include /dev routes", () => {
      const devRoutes = sitemap.filter((entry) => entry.url.includes("/dev"));
      expect(devRoutes.length).toBe(0);
    });

    it("does not include /api routes", () => {
      const apiRoutes = sitemap.filter((entry) => entry.url.includes("/api"));
      expect(apiRoutes.length).toBe(0);
    });
  });

  describe("Sitemap Entry Properties", () => {
    it("entries have lastModified dates (optional)", () => {
      // lastModified is optional but recommended
      const hasLastMod = sitemap.some((entry) => entry.lastModified);
      // At least some entries should have lastModified for SEO
      expect(hasLastMod).toBe(true);
    });

    it("lastModified dates are valid when present", () => {
      sitemap.forEach((entry) => {
        if (entry.lastModified) {
          // Should be a Date object or valid date string
          const date = new Date(entry.lastModified);
          expect(date.toString()).not.toBe("Invalid Date");
        }
      });
    });

    it("entries have changeFrequency (optional)", () => {
      // changeFrequency is optional
      const validFrequencies = [
        "always",
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "never",
      ];
      sitemap.forEach((entry) => {
        if (entry.changeFrequency) {
          expect(validFrequencies).toContain(entry.changeFrequency);
        }
      });
    });

    it("entries have priority (optional)", () => {
      // priority is optional, between 0 and 1
      sitemap.forEach((entry) => {
        if (entry.priority !== undefined) {
          expect(entry.priority).toBeGreaterThanOrEqual(0);
          expect(entry.priority).toBeLessThanOrEqual(1);
        }
      });
    });
  });

  describe("Sitemap Priority", () => {
    it("home page has highest priority", () => {
      const homePage = sitemap.find(
        (entry) => entry.url === "https://easyplantlife.com"
      );
      expect(homePage?.priority).toBe(1);
    });

    it("main pages have appropriate priority", () => {
      const mainPages = sitemap.filter((entry) =>
        [
          "https://easyplantlife.com/about",
          "https://easyplantlife.com/books",
          "https://easyplantlife.com/blog",
        ].includes(entry.url)
      );
      mainPages.forEach((page) => {
        expect(page.priority).toBeGreaterThanOrEqual(0.7);
      });
    });
  });
});

/**
 * Default Site-Wide Metadata Tests
 *
 * Tests for M10-03: Configure Site-Wide Default Metadata
 *
 * Acceptance Criteria:
 * - Default title template: "Page | Easy Plant Life"
 * - Default description set
 * - Default Open Graph image
 * - Twitter card type configured
 * - Favicon configured (mark logo)
 * - Apple touch icon configured
 *
 * Test Case:
 * GIVEN the root layout exports metadata
 * WHEN I inspect the metadata configuration
 * THEN it has all default site-wide settings configured
 */

import type { Metadata } from "next";
import * as fs from "fs";
import * as path from "path";

describe("Default Site-Wide Metadata (M10-03)", () => {
  let metadata: Metadata;

  beforeAll(async () => {
    // Dynamic import to get the metadata export from root layout
    const layoutModule = await import("@/app/layout");
    metadata = layoutModule.metadata;
  });

  describe("Default Title Template", () => {
    it("has a title configuration", () => {
      expect(metadata.title).toBeDefined();
    });

    it("uses a title template with suffix pattern", () => {
      // Title should be an object with default and template properties
      // for Next.js title template functionality
      const title = metadata.title;

      if (typeof title === "object" && title !== null) {
        // Check for template pattern
        const templateTitle = title as {
          default?: string;
          template?: string;
        };
        expect(templateTitle.template).toBeDefined();
        expect(templateTitle.template).toContain("Easy Plant Life");
        expect(templateTitle.template).toContain("%s");
      } else if (typeof title === "string") {
        // If it's a string, it should at least contain the brand name
        expect(title).toContain("Easy Plant Life");
      }
    });

    it("has a default title for pages without explicit title", () => {
      const title = metadata.title;

      if (typeof title === "object" && title !== null) {
        const templateTitle = title as {
          default?: string;
          template?: string;
        };
        expect(templateTitle.default).toBeDefined();
        expect(templateTitle.default).toContain("Easy Plant Life");
      }
    });
  });

  describe("Default Description", () => {
    it("has a default description set", () => {
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

    it("description reflects brand values", () => {
      const description = (metadata.description || "").toLowerCase();
      const hasRelevantContent =
        description.includes("calm") ||
        description.includes("plant") ||
        description.includes("simple") ||
        description.includes("easy") ||
        description.includes("vegan");
      expect(hasRelevantContent).toBe(true);
    });
  });

  describe("Default Open Graph Configuration", () => {
    it("has Open Graph metadata defined", () => {
      expect(metadata.openGraph).toBeDefined();
    });

    it("has default Open Graph type set to website", () => {
      const og = metadata.openGraph as { type?: string } | undefined;
      expect(og?.type).toBe("website");
    });

    it("has Open Graph site name", () => {
      expect(metadata.openGraph?.siteName).toBe("Easy Plant Life");
    });

    it("has Open Graph locale set to en_US", () => {
      expect(metadata.openGraph?.locale).toBe("en_US");
    });

    it("has default Open Graph images configured", () => {
      const images = metadata.openGraph?.images;
      expect(images).toBeDefined();

      // Should have at least one image
      if (Array.isArray(images)) {
        expect(images.length).toBeGreaterThan(0);
        // First image should have required properties
        const firstImage = images[0] as {
          url?: string;
          width?: number;
          height?: number;
          alt?: string;
        };
        expect(firstImage.url).toBeDefined();
      }
    });
  });

  describe("Twitter Card Configuration", () => {
    it("has Twitter card metadata defined", () => {
      expect(metadata.twitter).toBeDefined();
    });

    it("has Twitter card type set to summary_large_image", () => {
      const twitter = metadata.twitter as { card?: string } | undefined;
      expect(twitter?.card).toBe("summary_large_image");
    });
  });

  describe("metadataBase Configuration", () => {
    it("has metadataBase configured for absolute URLs", () => {
      expect(metadata.metadataBase).toBeDefined();
    });

    it("metadataBase is a valid URL", () => {
      const base = metadata.metadataBase;
      expect(base).toBeInstanceOf(URL);
    });
  });

  describe("Icon Configuration", () => {
    it("has icons configuration defined", () => {
      expect(metadata.icons).toBeDefined();
    });

    it("has favicon configured", () => {
      const icons = metadata.icons as {
        icon?: unknown;
        shortcut?: unknown;
      } | null;

      // Icons can be configured in different ways
      expect(icons?.icon || icons?.shortcut).toBeDefined();
    });

    it("has Apple touch icon configured", () => {
      const icons = metadata.icons as {
        apple?: unknown;
      } | null;

      expect(icons?.apple).toBeDefined();
    });
  });
});

describe("Static Icon Files", () => {
  const appDir = path.join(process.cwd(), "src", "app");

  it("favicon.ico exists in app directory", () => {
    const faviconPath = path.join(appDir, "favicon.ico");
    expect(fs.existsSync(faviconPath)).toBe(true);
  });

  it("apple-icon.png exists in app directory", () => {
    const appleIconPath = path.join(appDir, "apple-icon.png");
    expect(fs.existsSync(appleIconPath)).toBe(true);
  });

  it("opengraph-image.png exists in app directory", () => {
    const ogImagePath = path.join(appDir, "opengraph-image.png");
    expect(fs.existsSync(ogImagePath)).toBe(true);
  });
});

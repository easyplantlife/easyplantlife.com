/**
 * Pre-Launch Checklist Tests
 *
 * Tests for M11-05: Complete Pre-Launch Checklist
 *
 * This test suite verifies that all launch requirements are properly
 * configured in the codebase. Some items (like DNS, SSL, and production
 * environment variables) require manual verification in the deployment
 * environment - these are documented but not directly testable.
 *
 * Checklist Items:
 * - [ ] Domain configured and DNS propagated (manual)
 * - [ ] SSL certificate active (manual)
 * - [ ] Environment variables set in production (documented)
 * - [x] Analytics tracking verified (code exists)
 * - [x] Newsletter signup tested in production (code exists)
 * - [x] Contact form tested in production (code exists)
 * - [x] 404 page works (code exists)
 * - [x] Sitemap accessible (code exists)
 * - [x] Robots.txt accessible (code exists)
 * - [x] Social preview images work (code exists)
 * - [x] Legal pages if needed (documented)
 */

import * as fs from "fs";
import * as path from "path";
import type { Metadata, MetadataRoute } from "next";

describe("Pre-Launch Checklist (M11-05)", () => {
  const appDir = path.join(process.cwd(), "src", "app");

  describe("1. Critical Files Exist", () => {
    describe("404 Not Found Page", () => {
      it("not-found.tsx exists", () => {
        const notFoundPath = path.join(appDir, "not-found.tsx");
        expect(fs.existsSync(notFoundPath)).toBe(true);
      });

      it("not-found page exports default component", async () => {
        const NotFound = (await import("@/app/not-found")).default;
        expect(NotFound).toBeDefined();
        expect(typeof NotFound).toBe("function");
      });
    });

    describe("Sitemap", () => {
      it("sitemap.ts exists", () => {
        const sitemapPath = path.join(appDir, "sitemap.ts");
        expect(fs.existsSync(sitemapPath)).toBe(true);
      });

      it("sitemap exports valid configuration", async () => {
        const sitemap = (await import("@/app/sitemap")).default;
        const result: MetadataRoute.Sitemap = sitemap();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe("Robots.txt", () => {
      it("robots.ts exists", () => {
        const robotsPath = path.join(appDir, "robots.ts");
        expect(fs.existsSync(robotsPath)).toBe(true);
      });

      it("robots exports valid configuration", async () => {
        const robots = (await import("@/app/robots")).default;
        const result: MetadataRoute.Robots = robots();
        expect(result.rules).toBeDefined();
        expect(result.sitemap).toBeDefined();
      });
    });
  });

  describe("2. Social Preview Images", () => {
    it("opengraph-image.tsx exists for dynamic OG images", () => {
      const ogImagePath = path.join(appDir, "opengraph-image.tsx");
      expect(fs.existsSync(ogImagePath)).toBe(true);
    });

    it("apple-icon.tsx exists for Apple touch icon", () => {
      const appleIconPath = path.join(appDir, "apple-icon.tsx");
      expect(fs.existsSync(appleIconPath)).toBe(true);
    });

    it("favicon.ico exists", () => {
      const faviconPath = path.join(appDir, "favicon.ico");
      expect(fs.existsSync(faviconPath)).toBe(true);
    });
  });

  describe("3. Metadata Configuration", () => {
    let metadata: Metadata;

    beforeAll(async () => {
      const layoutModule = await import("@/app/layout");
      metadata = layoutModule.metadata;
    });

    it("has default title configured", () => {
      expect(metadata.title).toBeDefined();
    });

    it("has default description configured", () => {
      expect(metadata.description).toBeDefined();
    });

    it("has metadataBase configured for absolute URLs", () => {
      expect(metadata.metadataBase).toBeDefined();
    });

    it("has Open Graph configuration", () => {
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.siteName).toBe("Easy Plant Life");
    });

    it("has Twitter card configuration", () => {
      expect(metadata.twitter).toBeDefined();
    });

    it("has icons configuration", () => {
      expect(metadata.icons).toBeDefined();
    });
  });

  describe("4. Analytics Tracking", () => {
    it("GoogleAnalytics component exists", () => {
      const gaComponentPath = path.join(
        process.cwd(),
        "src",
        "components",
        "analytics",
        "GoogleAnalytics.tsx"
      );
      expect(fs.existsSync(gaComponentPath)).toBe(true);
    });

    it("GoogleAnalytics is included in root layout", async () => {
      const layoutContent = fs.readFileSync(
        path.join(appDir, "layout.tsx"),
        "utf-8"
      );
      expect(layoutContent).toContain("GoogleAnalytics");
    });
  });

  describe("5. Newsletter System", () => {
    it("newsletter API route exists", () => {
      const newsletterApiPath = path.join(
        appDir,
        "api",
        "newsletter",
        "route.ts"
      );
      expect(fs.existsSync(newsletterApiPath)).toBe(true);
    });

    it("newsletter page exists", () => {
      const newsletterPagePath = path.join(appDir, "newsletter", "page.tsx");
      expect(fs.existsSync(newsletterPagePath)).toBe(true);
    });
  });

  describe("6. Contact Form", () => {
    it("contact API route exists", () => {
      const contactApiPath = path.join(appDir, "api", "contact", "route.ts");
      expect(fs.existsSync(contactApiPath)).toBe(true);
    });

    it("contact page exists", () => {
      const contactPagePath = path.join(appDir, "contact", "page.tsx");
      expect(fs.existsSync(contactPagePath)).toBe(true);
    });
  });

  describe("7. All Public Pages Exist", () => {
    const publicPages = [
      { name: "Home", path: "page.tsx" },
      { name: "About", path: "about/page.tsx" },
      { name: "Books", path: "books/page.tsx" },
      { name: "Blog", path: "blog/page.tsx" },
      { name: "Newsletter", path: "newsletter/page.tsx" },
      { name: "Contact", path: "contact/page.tsx" },
    ];

    publicPages.forEach(({ name, path: pagePath }) => {
      it(`${name} page exists`, () => {
        const fullPath = path.join(appDir, pagePath);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });
  });

  describe("8. Environment Variables Documentation", () => {
    it(".env.example file exists with required variables", () => {
      const envExamplePath = path.join(process.cwd(), ".env.example");
      expect(fs.existsSync(envExamplePath)).toBe(true);

      const content = fs.readFileSync(envExamplePath, "utf-8");
      expect(content).toContain("NEXT_PUBLIC_GA_MEASUREMENT_ID");
      expect(content).toContain("RESEND_API_KEY");
      expect(content).toContain("RESEND_AUDIENCE_ID");
      expect(content).toContain("MEDIUM_PUBLICATION_URL");
    });
  });

  describe("9. Email Service Configuration", () => {
    it("Resend API client exists", () => {
      const resendPath = path.join(
        process.cwd(),
        "src",
        "lib",
        "api",
        "resend.ts"
      );
      expect(fs.existsSync(resendPath)).toBe(true);
    });

    it("email service exists", () => {
      const emailPath = path.join(
        process.cwd(),
        "src",
        "lib",
        "api",
        "email.ts"
      );
      expect(fs.existsSync(emailPath)).toBe(true);
    });
  });

  describe("10. Production Readiness Checks", () => {
    it("sitemap points to production domain", async () => {
      const sitemap = (await import("@/app/sitemap")).default;
      const result = sitemap();
      expect(result[0].url).toContain("easyplantlife.com");
    });

    it("robots.txt points to production sitemap", async () => {
      const robots = (await import("@/app/robots")).default;
      const result = robots();
      expect(result.sitemap).toBe("https://easyplantlife.com/sitemap.xml");
    });

    it("metadataBase uses production domain", async () => {
      const layoutModule = await import("@/app/layout");
      const base = layoutModule.metadata.metadataBase;
      expect(base?.toString()).toContain("easyplantlife.com");
    });
  });
});

describe("Pre-Launch Manual Verification Checklist", () => {
  /**
   * These tests serve as documentation for items that require
   * manual verification in the production environment.
   *
   * Before launch, manually verify each of these items:
   */

  describe("Infrastructure (Manual Verification Required)", () => {
    it.todo(
      "MANUAL: Domain configured - easyplantlife.com DNS points to hosting"
    );
    it.todo("MANUAL: SSL certificate active - https works without warnings");
    it.todo("MANUAL: CDN configured for optimal performance (if applicable)");
  });

  describe("Production Environment Variables (Manual Verification Required)", () => {
    it.todo("MANUAL: NEXT_PUBLIC_GA_MEASUREMENT_ID set in production");
    it.todo("MANUAL: RESEND_API_KEY set in production");
    it.todo("MANUAL: RESEND_AUDIENCE_ID set in production");
    it.todo("MANUAL: MEDIUM_PUBLICATION_URL set in production");
  });

  describe("Functional Tests (Manual Verification Required)", () => {
    it.todo("MANUAL: Newsletter signup works with real email");
    it.todo("MANUAL: Contact form sends email to correct recipient");
    it.todo("MANUAL: Google Analytics tracking events in real-time view");
    it.todo("MANUAL: Blog posts load from Medium RSS feed");
  });

  describe("Social Sharing (Manual Verification Required)", () => {
    it.todo("MANUAL: Facebook Sharing Debugger shows correct preview");
    it.todo("MANUAL: Twitter Card Validator shows correct preview");
    it.todo("MANUAL: LinkedIn Post Inspector shows correct preview");
  });

  describe("SEO Verification (Manual Verification Required)", () => {
    it.todo("MANUAL: Google Search Console connected and verified");
    it.todo("MANUAL: Submit sitemap to Google Search Console");
    it.todo("MANUAL: Check for crawl errors after initial indexing");
  });
});

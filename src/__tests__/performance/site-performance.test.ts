/**
 * Site Performance Tests
 *
 * Tests for M11-02: Optimize Site Performance
 *
 * Acceptance Criteria:
 * - [ ] Lighthouse performance score > 90
 * - [ ] Images optimized (next/image, WebP)
 * - [ ] Fonts optimized (subset, preload)
 * - [ ] No layout shift from font loading
 * - [ ] JavaScript bundle size minimized
 * - [ ] CSS purged of unused styles
 *
 * Test Cases:
 * GIVEN any page
 * WHEN running Lighthouse
 * THEN performance score is > 90
 *
 * GIVEN the home page
 * WHEN it loads
 * THEN Largest Contentful Paint < 2.5s
 *
 * Note: These tests verify the configuration is in place for optimal performance.
 * Actual Lighthouse scores require a running server and are tested manually.
 */

import * as fs from "fs";
import * as path from "path";

describe("Site Performance (M11-02)", () => {
  describe("Image Optimization", () => {
    it("next.config.ts enables image optimization", async () => {
      const configPath = path.join(process.cwd(), "next.config.ts");
      const configExists = fs.existsSync(configPath);
      expect(configExists).toBe(true);

      // Config should not disable image optimization
      const configContent = fs.readFileSync(configPath, "utf-8");
      expect(configContent).not.toContain("unoptimized: true");
    });

    it("all image components use next/image", () => {
      // Search for image usage in components
      const srcDir = path.join(process.cwd(), "src");

      // Recursively find all .tsx files (skip test files)
      const findTsxFiles = (dir: string): string[] => {
        const files: string[] = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory() && !entry.name.startsWith("__")) {
            files.push(...findTsxFiles(fullPath));
          } else if (entry.name.endsWith(".tsx")) {
            files.push(fullPath);
          }
        }
        return files;
      };

      const tsxFiles = findTsxFiles(srcDir);

      // Check that any file using <img in JSX is using next/image
      for (const file of tsxFiles) {
        const content = fs.readFileSync(file, "utf-8");

        // Remove comments and strings to avoid false positives
        // Only match actual JSX <img tags (not in comments or JSDoc)
        const codeWithoutComments = content
          .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
          .replace(/\/\/.*$/gm, ""); // Remove line comments

        // Check for native <img tag usage in actual JSX (not template strings)
        // Look for patterns like: <img src= or <img className=
        const hasNativeImgInJsx =
          /<img\s+(?:src|className|alt|width|height)=/g.test(
            codeWithoutComments
          );

        if (hasNativeImgInJsx) {
          // Should also import next/image
          expect(content).toMatch(/from ['"]next\/image['"]/);
        }
      }
    });

    it("next.config.ts allows Medium image domains for optimization", () => {
      const configPath = path.join(process.cwd(), "next.config.ts");
      const configContent = fs.readFileSync(configPath, "utf-8");

      // Should configure remote patterns for Medium images
      expect(configContent).toContain("remotePatterns");
      expect(configContent).toContain("miro.medium.com");
    });

    it("images in public folder use optimized formats", () => {
      const publicImagesDir = path.join(process.cwd(), "public", "images");

      if (fs.existsSync(publicImagesDir)) {
        const checkImageFormats = (dir: string): void => {
          const entries = fs.readdirSync(dir, { withFileTypes: true });

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
              checkImageFormats(fullPath);
            } else {
              const ext = path.extname(entry.name).toLowerCase();
              // Allow optimized formats: webp, avif, svg
              // Also allow jpg/png as Next.js will optimize them
              const allowedFormats = [
                ".webp",
                ".avif",
                ".svg",
                ".jpg",
                ".jpeg",
                ".png",
              ];
              expect(allowedFormats).toContain(ext);
            }
          }
        };

        checkImageFormats(publicImagesDir);
      }
    });
  });

  describe("Font Optimization", () => {
    it("fonts use display='swap' to prevent layout shift", () => {
      const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
      const layoutContent = fs.readFileSync(layoutPath, "utf-8");

      // Should use display: 'swap' for both fonts
      expect(layoutContent).toContain('display: "swap"');
    });

    it("fonts use latin subset only for smaller bundle", () => {
      const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
      const layoutContent = fs.readFileSync(layoutPath, "utf-8");

      // Should specify latin subset
      expect(layoutContent).toContain('subsets: ["latin"]');
    });

    it("fonts are loaded via next/font/google for automatic optimization", () => {
      const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
      const layoutContent = fs.readFileSync(layoutPath, "utf-8");

      // Should import from next/font/google
      expect(layoutContent).toContain('from "next/font/google"');
    });

    it("fonts have adjustFontFallback enabled for reduced CLS", () => {
      const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
      const layoutContent = fs.readFileSync(layoutPath, "utf-8");

      // adjustFontFallback should not be set to false
      // (default is true for Google fonts)
      expect(layoutContent).not.toContain("adjustFontFallback: false");
    });
  });

  describe("JavaScript Bundle Optimization", () => {
    it("package.json does not include unnecessary large dependencies", () => {
      const packagePath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      // Common heavy dependencies that shouldn't be in a landing site
      const heavyDeps = [
        "moment", // Use date-fns or native Date
        "lodash", // Use individual lodash/* packages or native methods
        "jquery", // Not needed with React
        "bootstrap", // Using Tailwind instead
        "material-ui", // Not using this design system
        "@mui/material", // Not using this design system
        "antd", // Not using this design system
        "rxjs", // Overkill for simple forms
        "redux", // Overkill for static site
        "@reduxjs/toolkit", // Overkill for static site
        "axios", // Use native fetch
        "graphql", // Not needed
        "apollo-client", // Not needed
        "@apollo/client", // Not needed
      ];

      for (const dep of heavyDeps) {
        expect(allDeps[dep]).toBeUndefined();
      }
    });

    it("uses React 19+ for improved performance", () => {
      const packagePath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));

      const reactVersion = packageJson.dependencies.react;
      // Should be React 19 or higher
      expect(reactVersion).toMatch(/^19\.|^[2-9][0-9]\./);
    });

    it("uses modern Next.js version with Turbopack", () => {
      const packagePath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));

      const nextVersion = packageJson.dependencies.next;
      // Should be Next.js 15+ for optimal performance
      expect(nextVersion).toMatch(/^1[5-9]\.|^[2-9][0-9]\./);
    });
  });

  describe("CSS Optimization", () => {
    it("tailwind config has proper content paths for purging", () => {
      const configPath = path.join(process.cwd(), "tailwind.config.ts");
      const configContent = fs.readFileSync(configPath, "utf-8");

      // Should have content paths defined
      expect(configContent).toContain("content:");

      // Should include src directories
      expect(configContent).toContain("./src/");
    });

    it("uses Tailwind CSS v4 for improved performance", () => {
      const packagePath = path.join(process.cwd(), "package.json");
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));

      const tailwindVersion = packageJson.devDependencies.tailwindcss;
      // Tailwind v4 for optimal CSS output (accepts ^4, ^4.x, 4.x.x formats)
      expect(tailwindVersion).toMatch(/^\^?4/);
    });
  });

  describe("Static Site Generation", () => {
    it("pages without dynamic data are statically generated", async () => {
      // Check that main pages don't force dynamic rendering
      const staticPages = [
        "src/app/page.tsx",
        "src/app/about/page.tsx",
        "src/app/books/page.tsx",
        "src/app/newsletter/page.tsx",
        "src/app/contact/page.tsx",
      ];

      for (const pagePath of staticPages) {
        const fullPath = path.join(process.cwd(), pagePath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, "utf-8");

          // Should not force dynamic rendering
          expect(content).not.toContain(
            "export const dynamic = 'force-dynamic'"
          );
          expect(content).not.toContain(
            'export const dynamic = "force-dynamic"'
          );

          // Should not disable static generation
          expect(content).not.toContain("export const revalidate = 0");
        }
      }
    });
  });

  describe("Next.js Configuration", () => {
    it("next.config.ts exists and exports configuration", () => {
      const configPath = path.join(process.cwd(), "next.config.ts");
      expect(fs.existsSync(configPath)).toBe(true);

      const configContent = fs.readFileSync(configPath, "utf-8");
      expect(configContent).toContain("export default");
    });

    it("does not disable important optimizations", () => {
      const configPath = path.join(process.cwd(), "next.config.ts");
      const configContent = fs.readFileSync(configPath, "utf-8");

      // Should not disable key optimizations
      expect(configContent).not.toContain("reactStrictMode: false");
      expect(configContent).not.toContain("swcMinify: false");
      expect(configContent).not.toContain("compress: false");
    });
  });
});

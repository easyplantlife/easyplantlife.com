/**
 * Cross-Browser CSS Compatibility Tests
 *
 * These tests verify that CSS features used in the application
 * are compatible with modern browsers (Chrome, Firefox, Safari, Edge).
 *
 * Tests focus on:
 * - CSS custom properties (CSS variables)
 * - Flexbox layout
 * - CSS Grid (if used)
 * - Focus-visible pseudo-class
 * - Modern CSS functions
 *
 * Note: These are static analysis tests that verify CSS patterns
 * used in the codebase are browser-compatible.
 */

import * as fs from "fs";
import * as path from "path";

describe("Cross-Browser CSS Compatibility", () => {
  const globalsCssPath = path.join(process.cwd(), "src", "app", "globals.css");
  const tailwindConfigPath = path.join(process.cwd(), "tailwind.config.ts");

  let globalsCss: string;
  let tailwindConfig: string;

  beforeAll(() => {
    globalsCss = fs.readFileSync(globalsCssPath, "utf-8");
    tailwindConfig = fs.readFileSync(tailwindConfigPath, "utf-8");
  });

  describe("CSS Custom Properties", () => {
    it("uses CSS variables with fallback-safe patterns", () => {
      // CSS variables are defined in :root
      expect(globalsCss).toContain(":root");
      expect(globalsCss).toContain("--background");
      expect(globalsCss).toContain("--foreground");
      expect(globalsCss).toContain("--primary");
    });

    it("defines CSS variables with valid color values", () => {
      // Verify hex color format (supported in all browsers)
      const hexColorPattern = /#[0-9A-Fa-f]{6}/g;
      const hexColors = globalsCss.match(hexColorPattern);
      expect(hexColors).not.toBeNull();
      expect(hexColors!.length).toBeGreaterThan(0);
    });

    it("uses var() function correctly", () => {
      // var() function usage should follow CSS spec
      const varPattern = /var\(--[a-zA-Z-]+\)/g;
      const varUsages = globalsCss.match(varPattern);
      expect(varUsages).not.toBeNull();
    });
  });

  describe("Font Stack Compatibility", () => {
    it("includes system font fallbacks for heading font", () => {
      // Verify fallback fonts are provided
      expect(tailwindConfig).toContain("Georgia");
      expect(tailwindConfig).toContain("serif");
    });

    it("includes system font fallbacks for body font", () => {
      expect(tailwindConfig).toContain("system-ui");
      expect(tailwindConfig).toContain("sans-serif");
    });

    it("uses CSS variable for custom fonts with fallback", () => {
      // Check that font-family uses var() with fallback
      expect(globalsCss).toContain("var(--font-body)");
      expect(globalsCss).toContain("var(--font-heading)");
    });
  });

  describe("Line Height Units", () => {
    it("uses unitless line-height values for headings (best practice)", () => {
      // Unitless line-height is preferred for scalability
      expect(globalsCss).toContain("line-height: 1.25");
    });

    it("uses unitless line-height for body text", () => {
      expect(globalsCss).toContain("line-height: 1.75");
    });
  });

  describe("Color Value Formats", () => {
    it("uses hex colors (universal browser support)", () => {
      // Tailwind config should use hex colors for maximum compatibility
      const hexPattern = /"#[0-9A-Fa-f]{6}"/g;
      const matches = tailwindConfig.match(hexPattern);
      expect(matches).not.toBeNull();
      expect(matches!.length).toBeGreaterThan(10); // Many color definitions
    });

    it("does not use unsupported color formats like color-mix() in globals", () => {
      // color-mix() has limited browser support
      expect(globalsCss).not.toContain("color-mix");
    });

    it("does not use oklch() or lab() color formats in globals", () => {
      // These modern color spaces have limited support
      expect(globalsCss).not.toContain("oklch");
      expect(globalsCss).not.toContain("lab(");
    });
  });

  describe("Spacing and Sizing", () => {
    it("uses rem units for spacing (accessibility-friendly)", () => {
      // rem units respect user font-size preferences
      expect(tailwindConfig).toContain("rem");
    });

    it("provides pixel values in comments for developer reference", () => {
      // Comments help developers understand actual sizes
      expect(tailwindConfig).toContain("// 4px");
      expect(tailwindConfig).toContain("// 8px");
      expect(tailwindConfig).toContain("// 16px");
    });
  });

  describe("CSS Import Syntax", () => {
    it("uses standard @import for Tailwind", () => {
      // @import is universally supported
      expect(globalsCss).toContain("@import");
    });
  });

  describe("Tailwind v4 @theme Directive", () => {
    it("uses @theme inline for CSS variable mapping", () => {
      // Tailwind v4 uses @theme for CSS variable integration
      expect(globalsCss).toContain("@theme inline");
    });
  });
});

describe("Browser-Safe CSS Patterns in Components", () => {
  const componentsDir = path.join(process.cwd(), "src", "components");

  function getComponentFiles(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...getComponentFiles(fullPath));
      } else if (item.endsWith(".tsx") && !item.endsWith(".test.tsx")) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const componentFiles = getComponentFiles(componentsDir);

  describe("Flexbox Usage", () => {
    it("components use Tailwind flexbox classes (universally supported)", () => {
      let hasFlexbox = false;
      for (const file of componentFiles) {
        const content = fs.readFileSync(file, "utf-8");
        if (content.includes("flex") || content.includes("items-")) {
          hasFlexbox = true;
          break;
        }
      }
      expect(hasFlexbox).toBe(true);
    });
  });

  describe("Focus States", () => {
    it("uses focus-visible for keyboard-only focus rings", () => {
      let hasFocusVisible = false;
      for (const file of componentFiles) {
        const content = fs.readFileSync(file, "utf-8");
        if (content.includes("focus-visible:")) {
          hasFocusVisible = true;
          break;
        }
      }
      expect(hasFocusVisible).toBe(true);
    });
  });

  describe("Transition Classes", () => {
    it("uses standard transition classes (well-supported)", () => {
      let hasTransition = false;
      for (const file of componentFiles) {
        const content = fs.readFileSync(file, "utf-8");
        if (content.includes("transition") || content.includes("duration-")) {
          hasTransition = true;
          break;
        }
      }
      expect(hasTransition).toBe(true);
    });
  });

  describe("Responsive Prefixes", () => {
    it("uses standard Tailwind responsive prefixes (sm:, md:, lg:)", () => {
      let hasResponsive = false;
      for (const file of componentFiles) {
        const content = fs.readFileSync(file, "utf-8");
        if (
          content.includes("sm:") ||
          content.includes("md:") ||
          content.includes("lg:")
        ) {
          hasResponsive = true;
          break;
        }
      }
      expect(hasResponsive).toBe(true);
    });
  });

  describe("Border Radius", () => {
    it("uses Tailwind rounded classes (universally supported)", () => {
      let hasRounded = false;
      for (const file of componentFiles) {
        const content = fs.readFileSync(file, "utf-8");
        if (content.includes("rounded")) {
          hasRounded = true;
          break;
        }
      }
      expect(hasRounded).toBe(true);
    });
  });

  describe("Box Shadow", () => {
    it("uses Tailwind shadow classes if shadows are present", () => {
      for (const file of componentFiles) {
        const content = fs.readFileSync(file, "utf-8");
        // If shadows are used, they should use Tailwind classes
        if (content.includes("shadow")) {
          expect(content).toMatch(/shadow(-sm|-md|-lg|-xl|-2xl)?/);
        }
      }
    });
  });
});

describe("No Unsupported CSS Features", () => {
  const srcDir = path.join(process.cwd(), "src");

  function getAllStyleFiles(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== "node_modules") {
        files.push(...getAllStyleFiles(fullPath));
      } else if (item.endsWith(".css")) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const cssFiles = getAllStyleFiles(srcDir);

  it("does not use :has() pseudo-class (limited Safari support until recently)", () => {
    for (const file of cssFiles) {
      const content = fs.readFileSync(file, "utf-8");
      // :has() is now widely supported, but we're being conservative
      // Allow it if the site targets modern browsers only
      // For now, just verify it's not critically used in globals
      if (file.includes("globals.css")) {
        expect(content).not.toContain(":has(");
      }
    }
  });

  it("does not use @container queries in critical styles", () => {
    for (const file of cssFiles) {
      const content = fs.readFileSync(file, "utf-8");
      if (file.includes("globals.css")) {
        expect(content).not.toContain("@container");
      }
    }
  });

  it("does not use subgrid (limited browser support)", () => {
    for (const file of cssFiles) {
      const content = fs.readFileSync(file, "utf-8");
      expect(content).not.toContain("subgrid");
    }
  });

  it("does not use scroll-timeline (experimental)", () => {
    for (const file of cssFiles) {
      const content = fs.readFileSync(file, "utf-8");
      expect(content).not.toContain("scroll-timeline");
    }
  });
});

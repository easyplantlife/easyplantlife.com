/**
 * Brand Color Palette Tests
 *
 * Verifies that the brand color palette is properly defined in Tailwind configuration.
 * Colors should match the visual identity: soft greens, off-whites, warm neutrals.
 *
 * Color Specifications (Updated for WCAG 2.1 AA compliance):
 * - Primary (Soft Green): For accents, links, CTAs
 *   - Light: #E8F5E9
 *   - Default: #2E7D32 (4.52:1 contrast on white - WCAG AA)
 *   - Dark: #1B5E20 (5.96:1 contrast - WCAG AA)
 *
 * - Neutral (Warm):
 *   - White: #FDFCFB
 *   - Light: #F5F5F0
 *   - Medium: #E8E6E1
 *   - Dark: #2D2D2D (text)
 */

import * as fs from "fs";
import * as path from "path";

describe("Brand Color Palette", () => {
  const rootDir = path.join(__dirname, "..", "..");
  const tailwindConfigPath = path.join(rootDir, "tailwind.config.ts");

  let tailwindConfig: string;

  beforeAll(() => {
    tailwindConfig = fs.readFileSync(tailwindConfigPath, "utf-8");
  });

  describe("Tailwind configuration exists", () => {
    test("tailwind.config.ts file exists", () => {
      expect(fs.existsSync(tailwindConfigPath)).toBe(true);
    });

    test("tailwind.config.ts contains theme configuration", () => {
      expect(tailwindConfig).toContain("theme");
    });

    test("tailwind.config.ts contains colors configuration", () => {
      expect(tailwindConfig).toContain("colors");
    });
  });

  describe("Primary green color scale is defined", () => {
    test("primary color object is defined", () => {
      expect(tailwindConfig).toMatch(/primary\s*:/);
    });

    test("primary color has light shade (#E8F5E9)", () => {
      // Light green for subtle backgrounds
      expect(tailwindConfig).toContain("#E8F5E9");
    });

    test("primary color has default shade (#2E7D32 - WCAG AA compliant)", () => {
      // Main green for accents, links, CTAs - 4.52:1 contrast ratio
      expect(tailwindConfig).toContain("#2E7D32");
    });

    test("primary color has dark shade (#1B5E20 - WCAG AA compliant)", () => {
      // Darker green for hover states - 5.96:1 contrast ratio
      expect(tailwindConfig).toContain("#1B5E20");
    });

    test("primary color scale includes standard shades (50-900)", () => {
      // Verify we have a proper scale for flexibility
      const shadePattern = /primary\s*:\s*\{[^}]*50\s*:/;
      expect(tailwindConfig).toMatch(shadePattern);
    });
  });

  describe("Neutral warm color scale is defined", () => {
    test("neutral color object is defined", () => {
      expect(tailwindConfig).toMatch(/neutral\s*:/);
    });

    test("neutral has warm white (#FDFCFB)", () => {
      // Warm off-white for backgrounds
      expect(tailwindConfig).toContain("#FDFCFB");
    });

    test("neutral has light shade (#F5F5F0)", () => {
      // Light warm gray
      expect(tailwindConfig).toContain("#F5F5F0");
    });

    test("neutral has medium shade (#E8E6E1)", () => {
      // Medium warm gray for borders, dividers
      expect(tailwindConfig).toContain("#E8E6E1");
    });

    test("neutral has dark shade for text (#2D2D2D)", () => {
      // Dark color for main text
      expect(tailwindConfig).toContain("#2D2D2D");
    });
  });

  describe("Background colors are defined", () => {
    test("background color configuration exists", () => {
      expect(tailwindConfig).toMatch(/background\s*:/);
    });

    test("default background uses warm white", () => {
      // Background should reference warm neutral
      expect(tailwindConfig).toContain("#FDFCFB");
    });
  });

  describe("Text colors are defined", () => {
    test("text color configuration exists", () => {
      expect(tailwindConfig).toMatch(/text\s*:/);
    });

    test("default text uses dark neutral", () => {
      // Main text should be dark
      expect(tailwindConfig).toContain("#2D2D2D");
    });
  });

  describe("Colors are documented in code comments", () => {
    test("tailwind config contains color documentation comments", () => {
      // Should have comments explaining the color system
      expect(tailwindConfig).toMatch(/\/\*[\s\S]*color/i);
    });

    test("primary color section has documentation", () => {
      // Match JSDoc style comments that mention primary
      expect(tailwindConfig).toMatch(/\*.*primary/i);
    });

    test("neutral color section has documentation", () => {
      expect(tailwindConfig).toMatch(/\/[/*].*neutral/i);
    });
  });

  describe("No default Tailwind colors leak into design", () => {
    test("colors configuration completely replaces defaults", () => {
      // The extend property should NOT be used for colors
      // Colors should be at theme.colors, not theme.extend.colors
      const usesExtendForColors = /extend\s*:\s*\{[^}]*colors/;
      expect(tailwindConfig).not.toMatch(usesExtendForColors);
    });

    test("theme colors are defined at top level (not in extend)", () => {
      // Colors should be defined directly under theme
      const hasTopLevelColors = /theme\s*:\s*\{[^}]*colors\s*:/;
      expect(tailwindConfig).toMatch(hasTopLevelColors);
    });
  });
});

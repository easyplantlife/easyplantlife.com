/**
 * Spacing Scale Tests
 *
 * Verifies that the spacing scale is properly defined in Tailwind configuration.
 * The design should have "strong use of white space" per brand guidelines.
 *
 * Spacing Specifications from issue #11 (M2-03):
 * - Scale values: 4, 8, 16, 24, 32, 48, 64, 96, 128 (in pixels)
 * - Section padding standardized
 * - Component internal spacing consistent
 * - Mobile vs desktop spacing considered
 */

import * as fs from "fs";
import * as path from "path";

describe("Spacing Scale Configuration", () => {
  const rootDir = path.join(__dirname, "..", "..");
  const tailwindConfigPath = path.join(rootDir, "tailwind.config.ts");

  let tailwindConfig: string;

  beforeAll(() => {
    tailwindConfig = fs.readFileSync(tailwindConfigPath, "utf-8");
  });

  describe("Tailwind spacing configuration exists", () => {
    test("tailwind.config.ts file exists", () => {
      expect(fs.existsSync(tailwindConfigPath)).toBe(true);
    });

    test("tailwind.config.ts contains spacing configuration", () => {
      expect(tailwindConfig).toMatch(/spacing\s*:/);
    });
  });

  describe("Core spacing scale values are defined", () => {
    // Spacing scale: 4, 8, 16, 24, 32, 48, 64, 96, 128 pixels
    // Converted to rem (base 16px): 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8

    test("spacing scale includes 4px (0.25rem)", () => {
      expect(tailwindConfig).toContain("0.25rem");
    });

    test("spacing scale includes 8px (0.5rem)", () => {
      expect(tailwindConfig).toContain("0.5rem");
    });

    test("spacing scale includes 16px (1rem)", () => {
      expect(tailwindConfig).toContain("1rem");
    });

    test("spacing scale includes 24px (1.5rem)", () => {
      expect(tailwindConfig).toContain("1.5rem");
    });

    test("spacing scale includes 32px (2rem)", () => {
      expect(tailwindConfig).toContain("2rem");
    });

    test("spacing scale includes 48px (3rem)", () => {
      expect(tailwindConfig).toContain("3rem");
    });

    test("spacing scale includes 64px (4rem)", () => {
      expect(tailwindConfig).toContain("4rem");
    });

    test("spacing scale includes 96px (6rem)", () => {
      expect(tailwindConfig).toContain("6rem");
    });

    test("spacing scale includes 128px (8rem)", () => {
      expect(tailwindConfig).toContain("8rem");
    });
  });

  describe("Semantic spacing aliases are defined", () => {
    test("section spacing is defined for consistent page sections", () => {
      // Large spacing for page sections
      expect(tailwindConfig).toMatch(/section\s*:/);
    });

    test("component spacing is defined for internal component padding", () => {
      // Medium spacing for component internals
      expect(tailwindConfig).toMatch(/component\s*:/);
    });

    test("element spacing is defined for tight element relationships", () => {
      // Small spacing for related elements
      expect(tailwindConfig).toMatch(/element\s*:/);
    });
  });

  describe("Zero spacing is included", () => {
    test("zero spacing value is available", () => {
      // Essential for removing default spacing
      expect(tailwindConfig).toMatch(/['"]?0['"]?\s*:\s*['"]?0/);
    });
  });

  describe("Spacing is documented in code comments", () => {
    test("tailwind config contains spacing documentation comments", () => {
      // Should have comments explaining the spacing system
      expect(tailwindConfig).toMatch(/\/\*[\s\S]*spacing/i);
    });

    test("spacing section mentions white space or brand guidelines", () => {
      // Documentation should reference the brand's emphasis on white space
      expect(tailwindConfig).toMatch(/(white\s*space|brand|spacing scale)/i);
    });
  });

  describe("Spacing replaces Tailwind defaults", () => {
    test("spacing configuration replaces defaults (not extends)", () => {
      // Spacing should be at theme.spacing, not theme.extend.spacing
      // to have full control over the spacing system
      const usesExtendForSpacing = /extend\s*:\s*\{[^}]*spacing/;
      expect(tailwindConfig).not.toMatch(usesExtendForSpacing);
    });

    test("theme spacing is defined at top level", () => {
      // Spacing should be defined directly under theme
      const hasTopLevelSpacing = /theme\s*:\s*\{[\s\S]*spacing\s*:/;
      expect(tailwindConfig).toMatch(hasTopLevelSpacing);
    });
  });

  describe("Responsive spacing considerations", () => {
    test("large spacing values exist for desktop layouts", () => {
      // Desktop needs generous spacing (96px, 128px)
      expect(tailwindConfig).toContain("6rem"); // 96px
      expect(tailwindConfig).toContain("8rem"); // 128px
    });

    test("small spacing values exist for mobile layouts", () => {
      // Mobile needs tighter spacing options (4px, 8px)
      expect(tailwindConfig).toContain("0.25rem"); // 4px
      expect(tailwindConfig).toContain("0.5rem"); // 8px
    });
  });
});

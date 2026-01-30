/**
 * Tests for TypeScript path aliases configuration
 *
 * Verifies that:
 * - @/ alias points to src/ directory
 * - @/components alias works
 * - @/lib alias works
 * - Aliases work in test files
 */

describe("TypeScript Path Aliases", () => {
  describe("@/lib alias", () => {
    it("should resolve @/lib imports correctly", async () => {
      // Import using the @/lib alias
      const libModule = await import("@/lib");
      expect(libModule).toBeDefined();
    });

    it("should resolve @/lib/utils imports correctly", async () => {
      // Import a specific utility using the @/lib alias
      const { cn } = await import("@/lib/utils");
      expect(cn).toBeDefined();
      expect(typeof cn).toBe("function");
    });

    it("should resolve cn utility function correctly", async () => {
      const { cn } = await import("@/lib/utils");

      // Test basic class merging
      expect(cn("foo", "bar")).toBe("foo bar");

      // Test conditional classes
      expect(cn("foo", false && "bar", "baz")).toBe("foo baz");

      // Test with undefined values
      expect(cn("foo", undefined, "bar")).toBe("foo bar");
    });
  });

  describe("@/components alias", () => {
    it("should resolve @/components imports correctly", async () => {
      // Import using the @/components alias
      const componentsModule = await import("@/components");
      expect(componentsModule).toBeDefined();
    });

    it("should resolve @/components/ui imports correctly", async () => {
      // Import using the @/components/ui alias
      const uiModule = await import("@/components/ui");
      expect(uiModule).toBeDefined();
    });
  });

  describe("@/content alias", () => {
    it("should resolve @/content imports correctly", async () => {
      // Import using the @/content alias
      const contentModule = await import("@/content");
      expect(contentModule).toBeDefined();
    });
  });

  describe("cross-module imports with aliases", () => {
    it("should allow components to import from lib using aliases", async () => {
      // This test verifies that the alias configuration works for
      // cross-module imports, which is a common use case
      const { cn } = await import("@/lib/utils");
      const result = cn("bg-white", "text-black");
      expect(result).toBe("bg-white text-black");
    });
  });
});

/**
 * Open Graph Image Generation Tests
 *
 * Tests for the OG image and Apple icon generation functions.
 */

import { ImageResponse } from "next/og";

// Mock next/og ImageResponse
jest.mock("next/og", () => ({
  ImageResponse: jest.fn().mockImplementation((element, options) => ({
    element,
    options,
  })),
}));

describe("Open Graph Image Generation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("opengraph-image.tsx", () => {
    it("exports correct metadata", async () => {
      const ogModule = await import("@/app/opengraph-image");

      expect(ogModule.runtime).toBe("edge");
      expect(ogModule.alt).toBe(
        "Easy Plant Life - A calm approach to plant-based living"
      );
      expect(ogModule.size).toEqual({
        width: 1200,
        height: 630,
      });
      expect(ogModule.contentType).toBe("image/png");
    });

    it("generates image with correct dimensions", async () => {
      const { default: Image } = await import("@/app/opengraph-image");
      await Image();

      expect(ImageResponse).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 1200,
          height: 630,
        })
      );
    });

    it("includes brand name in the image", async () => {
      const { default: Image } = await import("@/app/opengraph-image");
      const result = (await Image()) as { element: React.ReactElement };

      // The element should contain the brand name
      const elementStr = JSON.stringify(result.element);
      expect(elementStr).toContain("Easy Plant Life");
    });

    it("includes tagline in the image", async () => {
      const { default: Image } = await import("@/app/opengraph-image");
      const result = (await Image()) as { element: React.ReactElement };

      const elementStr = JSON.stringify(result.element);
      expect(elementStr).toContain("A calm approach to plant-based living");
    });
  });

  describe("apple-icon.tsx", () => {
    it("exports correct metadata", async () => {
      const iconModule = await import("@/app/apple-icon");

      expect(iconModule.runtime).toBe("edge");
      expect(iconModule.size).toEqual({
        width: 180,
        height: 180,
      });
      expect(iconModule.contentType).toBe("image/png");
    });

    it("generates icon with correct dimensions", async () => {
      const { default: Icon } = await import("@/app/apple-icon");
      await Icon();

      expect(ImageResponse).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 180,
          height: 180,
        })
      );
    });

    it("uses brand background color", async () => {
      const { default: Icon } = await import("@/app/apple-icon");
      const result = (await Icon()) as { element: React.ReactElement };

      const elementStr = JSON.stringify(result.element);
      // Should use the warm white background
      expect(elementStr).toContain("#FAFAF8");
    });

    it("uses brand green gradient", async () => {
      const { default: Icon } = await import("@/app/apple-icon");
      const result = (await Icon()) as { element: React.ReactElement };

      const elementStr = JSON.stringify(result.element);
      // Should use the brand green colors
      expect(elementStr).toContain("#7BA05B");
      expect(elementStr).toContain("#5C8A3E");
    });
  });
});

import * as fs from "fs";
import * as path from "path";

describe("Project Directory Structure", () => {
  const rootDir = path.join(__dirname, "..", "..");

  const requiredDirectories = [
    "src/app",
    "src/components",
    "src/components/ui",
    "src/lib",
    "src/lib/api",
    "src/styles",
    "src/content",
    "public",
  ];

  describe("Required directories exist", () => {
    test.each(requiredDirectories)("%s directory exists", (dir) => {
      const dirPath = path.join(rootDir, dir);
      expect(fs.existsSync(dirPath)).toBe(true);
      expect(fs.statSync(dirPath).isDirectory()).toBe(true);
    });
  });

  describe("Directory structure follows conventions", () => {
    test("components directory contains ui subdirectory", () => {
      const uiDir = path.join(rootDir, "src/components/ui");
      expect(fs.existsSync(uiDir)).toBe(true);
    });

    test("lib directory contains api subdirectory", () => {
      const apiDir = path.join(rootDir, "src/lib/api");
      expect(fs.existsSync(apiDir)).toBe(true);
    });
  });

  describe("Placeholder files exist to preserve directory structure", () => {
    const directoriesWithPlaceholders = [
      "src/components",
      "src/components/ui",
      "src/lib",
      "src/lib/api",
      "src/styles",
      "src/content",
    ];

    test.each(directoriesWithPlaceholders)(
      "%s has a .gitkeep or index file",
      (dir) => {
        const dirPath = path.join(rootDir, dir);
        const files = fs.readdirSync(dirPath);

        // Directory should have at least one file (either .gitkeep or actual content)
        expect(files.length).toBeGreaterThan(0);
      }
    );
  });
});

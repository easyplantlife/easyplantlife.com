/**
 * Tests for ESLint and Prettier configuration
 *
 * These tests verify that:
 * 1. ESLint catches formatting errors (via Prettier integration)
 * 2. ESLint catches TypeScript errors
 * 3. ESLint and Prettier configurations exist and are valid
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

describe("ESLint and Prettier Configuration", () => {
  const projectRoot = path.resolve(__dirname, "../..");

  describe("Configuration files", () => {
    it("should have ESLint configuration file", () => {
      const eslintConfigPath = path.join(projectRoot, "eslint.config.mjs");
      expect(fs.existsSync(eslintConfigPath)).toBe(true);
    });

    it("should have Prettier configuration file", () => {
      const prettierConfigPath = path.join(projectRoot, ".prettierrc");
      const prettierConfigJsPath = path.join(projectRoot, "prettier.config.js");
      const prettierConfigMjsPath = path.join(
        projectRoot,
        "prettier.config.mjs"
      );

      const hasPrettierConfig =
        fs.existsSync(prettierConfigPath) ||
        fs.existsSync(prettierConfigJsPath) ||
        fs.existsSync(prettierConfigMjsPath);

      expect(hasPrettierConfig).toBe(true);
    });

    it("should have Prettier ignore file", () => {
      const prettierIgnorePath = path.join(projectRoot, ".prettierignore");
      expect(fs.existsSync(prettierIgnorePath)).toBe(true);
    });
  });

  describe("ESLint functionality", () => {
    it("should catch TypeScript errors when running lint", () => {
      // Create a temporary file with a TypeScript error
      const testFilePath = path.join(
        projectRoot,
        "src/__tests__/temp-ts-error.ts"
      );
      const fileWithTsError = `
// This file intentionally has a TypeScript error for testing
const x: string = 123;  // Type error: number assigned to string
export default x;
`;

      try {
        fs.writeFileSync(testFilePath, fileWithTsError);

        // Run ESLint on the file and expect it to fail
        let lintFailed = false;
        try {
          execSync(`npm run lint -- "${testFilePath}"`, {
            cwd: projectRoot,
            encoding: "utf8",
            stdio: "pipe",
          });
        } catch {
          lintFailed = true;
        }

        expect(lintFailed).toBe(true);
      } finally {
        // Clean up
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });

    it("should catch formatting errors via eslint-plugin-prettier", () => {
      // Create a temporary file with inconsistent formatting
      const testFilePath = path.join(
        projectRoot,
        "src/__tests__/temp-format-error.ts"
      );
      // Intentionally bad formatting: no semicolons when project uses them,
      // inconsistent quotes, bad spacing
      const fileWithFormattingError = `const foo="bar"
const baz    =    "qux"
export {foo,baz}
`;

      try {
        fs.writeFileSync(testFilePath, fileWithFormattingError);

        // Run ESLint on the file and expect it to fail due to formatting
        let lintFailed = false;
        let lintOutput = "";
        try {
          execSync(`npm run lint -- "${testFilePath}"`, {
            cwd: projectRoot,
            encoding: "utf8",
            stdio: "pipe",
          });
        } catch (error: unknown) {
          lintFailed = true;
          if (error && typeof error === "object" && "stdout" in error) {
            lintOutput = String((error as { stdout: unknown }).stdout);
          }
        }

        // The lint should fail because of prettier formatting rules
        expect(lintFailed).toBe(true);
        // Output should mention prettier (formatting) issues
        expect(lintOutput.toLowerCase()).toMatch(/prettier|format/);
      } finally {
        // Clean up
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      }
    });
  });

  describe("npm run lint command", () => {
    it("should run successfully on properly formatted code", () => {
      // Run lint on existing valid files
      let exitCode = 0;
      try {
        execSync("npm run lint -- src/app/page.tsx", {
          cwd: projectRoot,
          encoding: "utf8",
          stdio: "pipe",
        });
      } catch {
        exitCode = 1;
      }

      expect(exitCode).toBe(0);
    });
  });
});

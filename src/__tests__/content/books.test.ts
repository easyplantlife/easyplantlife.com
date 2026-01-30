/**
 * Book Data Model Tests
 *
 * Tests for the Book interface and books content data.
 * Verifies that books data is properly structured according to M6-01 spec.
 *
 * Acceptance Criteria from issue #36:
 * - [ ] Book TypeScript interface defined
 * - [ ] Book data stored in `/content/books.ts`
 * - [ ] Each book has: title, description, cover image, status, purchase links
 * - [ ] Status can be: "available" or "coming-soon"
 * - [ ] At least one book entry (can be placeholder)
 */

import * as fs from "fs";
import * as path from "path";

describe("Book Data Model", () => {
  const rootDir = path.join(__dirname, "..", "..");
  const booksFilePath = path.join(rootDir, "content", "books.ts");

  describe("Books file exists", () => {
    test("src/content/books.ts file exists", () => {
      expect(fs.existsSync(booksFilePath)).toBe(true);
    });
  });

  describe("Book interface is properly defined", () => {
    let booksFileContent: string;

    beforeAll(() => {
      booksFileContent = fs.readFileSync(booksFilePath, "utf-8");
    });

    test("Book interface is exported", () => {
      expect(booksFileContent).toMatch(/export\s+(interface|type)\s+Book\b/);
    });

    test("Book interface has id field of type string", () => {
      expect(booksFileContent).toMatch(/id\s*:\s*string/);
    });

    test("Book interface has title field of type string", () => {
      expect(booksFileContent).toMatch(/title\s*:\s*string/);
    });

    test("Book interface has description field of type string", () => {
      expect(booksFileContent).toMatch(/description\s*:\s*string/);
    });

    test("Book interface has coverImage field of type string", () => {
      expect(booksFileContent).toMatch(/coverImage\s*:\s*string/);
    });

    test("Book interface has status field with available or coming-soon values", () => {
      expect(booksFileContent).toMatch(
        /status\s*:\s*['"]available['"]\s*\|\s*['"]coming-soon['"]/
      );
    });

    test("Book interface has purchaseLinks array", () => {
      expect(booksFileContent).toMatch(/purchaseLinks\s*:/);
    });

    test("PurchaseLink has label field of type string", () => {
      expect(booksFileContent).toMatch(/label\s*:\s*string/);
    });

    test("PurchaseLink has url field of type string", () => {
      expect(booksFileContent).toMatch(/url\s*:\s*string/);
    });
  });

  describe("Books data is properly structured", () => {
    // Dynamic import to test the actual exported data
    let books: unknown[];

    beforeAll(async () => {
      const booksModule = await import("@/content/books");
      books = booksModule.books;
    });

    test("books array is exported", () => {
      expect(Array.isArray(books)).toBe(true);
    });

    test("at least one book entry exists", () => {
      expect(books.length).toBeGreaterThanOrEqual(1);
    });

    test("each book has required id field", () => {
      books.forEach((book: unknown) => {
        const b = book as { id?: unknown };
        expect(typeof b.id).toBe("string");
        expect((b.id as string).length).toBeGreaterThan(0);
      });
    });

    test("each book has required title field", () => {
      books.forEach((book: unknown) => {
        const b = book as { title?: unknown };
        expect(typeof b.title).toBe("string");
        expect((b.title as string).length).toBeGreaterThan(0);
      });
    });

    test("each book has required description field", () => {
      books.forEach((book: unknown) => {
        const b = book as { description?: unknown };
        expect(typeof b.description).toBe("string");
        expect((b.description as string).length).toBeGreaterThan(0);
      });
    });

    test("each book has required coverImage field", () => {
      books.forEach((book: unknown) => {
        const b = book as { coverImage?: unknown };
        expect(typeof b.coverImage).toBe("string");
        expect((b.coverImage as string).length).toBeGreaterThan(0);
      });
    });

    test("each book has valid status (available or coming-soon)", () => {
      books.forEach((book: unknown) => {
        const b = book as { status?: unknown };
        expect(["available", "coming-soon"]).toContain(b.status);
      });
    });

    test("each book has purchaseLinks array", () => {
      books.forEach((book: unknown) => {
        const b = book as { purchaseLinks?: unknown };
        expect(Array.isArray(b.purchaseLinks)).toBe(true);
      });
    });

    test("each purchase link has label and url", () => {
      books.forEach((book: unknown) => {
        const b = book as { purchaseLinks?: unknown[] };
        (b.purchaseLinks || []).forEach((link: unknown) => {
          const l = link as { label?: unknown; url?: unknown };
          expect(typeof l.label).toBe("string");
          expect(typeof l.url).toBe("string");
        });
      });
    });
  });

  describe("Book IDs are unique", () => {
    let books: unknown[];

    beforeAll(async () => {
      const booksModule = await import("@/content/books");
      books = booksModule.books;
    });

    test("all book IDs are unique", () => {
      const ids = books.map((book: unknown) => (book as { id: string }).id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});

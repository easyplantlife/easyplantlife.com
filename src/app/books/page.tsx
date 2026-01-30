import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { BooksList } from "@/components/books/BooksList";
import { books } from "@/content/books";

export const metadata: Metadata = {
  title: "Books | Easy Plant Life",
  description: "Explore our collection of books about living with plants.",
};

/**
 * Books Page
 *
 * Displays the collection of Easy Plant Life books with cover images,
 * descriptions, and purchase links where available.
 *
 * Design principles:
 * - Calm, honest presentation of book content
 * - Clear visual hierarchy with title, intro, and book cards
 * - Responsive layout for all devices
 * - No pressure or marketing language
 */
export default function BooksPage() {
  return (
    <PageLayout title="Books">
      <p
        data-testid="books-intro"
        className="mb-12 text-lg text-text-secondary"
      >
        Simple, honest guides for living with plants. No complicated care
        schedules, no pressure—just calm advice for bringing nature into your
        space.
      </p>
      <BooksList books={books} data-testid="books-list" />
    </PageLayout>
  );
}

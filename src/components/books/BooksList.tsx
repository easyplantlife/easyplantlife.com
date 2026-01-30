import type { HTMLAttributes } from "react";
import { BookCard } from "./BookCard";
import type { Book } from "@/content/books";

export interface BooksListProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of books to display */
  books: Book[];
}

/**
 * BooksList Component
 *
 * Displays a list of books in a responsive grid/column layout.
 * Uses BookCard components for individual book display.
 *
 * Layout:
 * - Single column on mobile for easy scanning
 * - May expand to multi-column on larger screens
 * - Consistent spacing between book cards
 *
 * @example
 * ```tsx
 * import { books } from "@/content/books";
 *
 * <BooksList books={books} />
 * ```
 */
export function BooksList({
  books,
  className = "",
  ...props
}: BooksListProps) {
  return (
    <div
      className={`grid gap-8 sm:gap-12 ${className}`}
      {...props}
    >
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

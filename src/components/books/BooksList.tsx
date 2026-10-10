import type { HTMLAttributes } from "react";
import type { Book } from "@/content/books";
import { cn } from "@/lib/utils";
import { BookItem } from "./BookItem";

export interface BooksListProps extends HTMLAttributes<HTMLDivElement> {
  books: Book[];
}

/**
 * BooksList
 *
 * Full book rows separated by hairlines.
 */
export function BooksList({ books, className = "", ...props }: BooksListProps) {
  return (
    <div
      className={cn("flex flex-col border-b border-line", className)}
      {...props}
    >
      {books.map((book) => (
        <BookItem key={book.id} book={book} variant="full" />
      ))}
    </div>
  );
}

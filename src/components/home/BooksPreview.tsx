import { type HTMLAttributes } from "react";
import { BookItem } from "@/components/books/BookItem";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { books as allBooks, type Book } from "@/content/books";
import { cn } from "@/lib/utils";

export interface BooksPreviewProps extends HTMLAttributes<HTMLElement> {
  books?: Book[];
}

/**
 * BooksPreview
 *
 * The books, cover first, each linking to the books page and to Amazon.
 */
export function BooksPreview({
  books = allBooks,
  className = "",
  ...props
}: BooksPreviewProps) {
  return (
    <section
      aria-labelledby="books-preview-title"
      data-testid="books-preview"
      className={cn("pb-28 pt-24", className)}
      {...props}
    >
      <Container>
        <SectionHeader
          eyebrow="Books"
          title="Two books, one idea"
          titleId="books-preview-title"
          className="mb-10"
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,26rem),1fr))] gap-12">
          {books.map((book) => (
            <BookItem key={book.id} book={book} variant="compact" />
          ))}
        </div>
      </Container>
    </section>
  );
}

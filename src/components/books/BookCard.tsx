import Image from "next/image";
import type { HTMLAttributes } from "react";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { Book } from "@/content/books";

export interface BookCardProps extends HTMLAttributes<HTMLElement> {
  /** The book data to display */
  book: Book;
}

/**
 * BookCard Component
 *
 * Displays a book with its cover image, title, description, status badge,
 * and purchase links. Used on the Books page to showcase available and
 * upcoming books.
 *
 * @example
 * ```tsx
 * <BookCard book={book} />
 * ```
 */
export function BookCard({ book, className = "", ...props }: BookCardProps) {
  const { title, description, coverImage, status, purchaseLinks } = book;

  const isComingSoon = status === "coming-soon";
  const hasLinks = purchaseLinks.length > 0 && !isComingSoon;

  return (
    <Card
      as="article"
      className={className}
      image={
        <Image
          src={coverImage}
          alt={`${title} cover`}
          width={400}
          height={600}
          className="h-auto w-full object-cover"
        />
      }
      {...props}
    >
      <div className="space-y-4">
        <div>
          {isComingSoon && (
            <span className="mb-2 inline-block rounded bg-neutral-100 px-2 py-1 text-sm text-text-secondary">
              Coming Soon
            </span>
          )}
          <Heading level={3} className="mt-2">
            {title}
          </Heading>
          <Text color="secondary" className="mt-2">
            {description}
          </Text>
        </div>

        {hasLinks && (
          <div className="flex flex-wrap gap-3">
            {purchaseLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded border border-neutral-200 px-4 py-2 text-sm text-text transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

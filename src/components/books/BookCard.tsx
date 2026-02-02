import Image from "next/image";
import type { HTMLAttributes } from "react";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import type { Book } from "@/content/books";
import { Card } from "../ui/Card";

export interface BookCardProps extends HTMLAttributes<HTMLElement> {
  /** The book data to display */
  book: Book;
}

/**
 * BookCard Component
 *
 * Displays a book with its cover image, title, description, status badge,
 * and purchase links. Uses a horizontal layout on large screens.
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
      href={hasLinks ? purchaseLinks[0]?.url : undefined}
      target={hasLinks ? "_blank" : undefined}
      rel={hasLinks ? "noopener noreferrer" : undefined}
      className={`group transition-all duration-300 hover:border-primary hover:shadow-lg ${className}`.trim()}
      {...props}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        {/* Cover - on the left for horizontal layout */}
        <div className="shrink-0 overflow-hidden rounded">
          <Image
            src={coverImage}
            alt={`${title} cover`}
            width={160}
            height={240}
            className="h-60 w-40 object-cover sm:h-72 sm:w-48"
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-4">
          {isComingSoon && (
            <span className="inline-block rounded-lg bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-800">
              Coming Soon
            </span>
          )}
          <Heading
            level={3}
            className="group-hover:text-primary transition-colors"
          >
            {title}
          </Heading>
          <Text color="secondary" className="leading-relaxed">
            {description}
          </Text>

          {hasLinks && (
            <div className="flex flex-wrap gap-3 pt-2">
              {purchaseLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      {hasLinks && <span className="sr-only">(opens in new tab)</span>}
    </Card>
  );
}

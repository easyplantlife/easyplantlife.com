import Image from "next/image";
import type { HTMLAttributes } from "react";
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
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border border-primary-200 bg-gradient-to-br from-white to-primary-100/50 shadow-sm lg:flex-row lg:shadow-md ${className}`}
      {...props}
    >
      {/* Cover - constrained width on desktop for better proportions */}
      <div className="shrink-0 overflow-hidden lg:w-64 xl:w-72">
        <Image
          src={coverImage}
          alt={`${title} cover`}
          width={400}
          height={600}
          className="h-auto w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center p-6 lg:p-8">
        <div className="space-y-4">
          <div>
            {isComingSoon && (
              <span className="mb-2 inline-block rounded-lg bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-800">
                Coming Soon
              </span>
            )}
            <Heading level={3} className="text-primary-800">
              {title}
            </Heading>
            <Text color="secondary" className="mt-2 leading-relaxed">
              {description}
            </Text>
          </div>

          {hasLinks && (
            <div className="flex flex-wrap gap-3 pt-2">
              {purchaseLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

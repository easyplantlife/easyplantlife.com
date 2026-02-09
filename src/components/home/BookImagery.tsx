import { type HTMLAttributes } from "react";
import Image from "next/image";
import NextLink from "next/link";

export interface BookImageryProps extends HTMLAttributes<HTMLElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * BookImagery Component
 *
 * A section below "Go Further" with a single book image linking to the books page.
 */
export function BookImagery({ className = "", ...props }: BookImageryProps) {
  return (
    <section
      aria-label="Book imagery"
      data-testid="book-imagery"
      className={`bg-neutral-50/50 py-10 md:py-14 lg:py-16 px-4 md:px-6 lg:px-8 border-t border-neutral-100 ${className}`.trim()}
      {...props}
    >
      <div className="max-w-5xl mx-auto flex justify-center">
        <NextLink
          href="/books"
          className="block rounded-xl overflow-hidden border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label="Easy Plant Life books on a table — View books"
        >
          <Image
            src="/images/easy-plant-life-books-on-table.jpeg"
            alt="Easy Plant Life books on a table with a plant and tea"
            width={800}
            height={533}
            className="w-full max-w-4xl h-auto object-cover"
          />
        </NextLink>
      </div>
    </section>
  );
}

import { type HTMLAttributes } from "react";
import NextLink from "next/link";

export interface SecondaryCTAsProps extends HTMLAttributes<HTMLElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * SecondaryCTAs Component
 *
 * Secondary CTA section for the home page that directs users to
 * Blog and Books pages. Features colorful cards that complement
 * the brand's vibrant aesthetic.
 *
 * Features:
 * - Visually appealing cards for Blog and Books
 * - Consistent with brand colors
 * - Accessible navigation
 *
 * @example
 * ```tsx
 * <SecondaryCTAs />
 * <SecondaryCTAs className="mt-8" />
 * ```
 */
export function SecondaryCTAs({
  className = "",
  ...props
}: SecondaryCTAsProps) {
  return (
    <section
      aria-label="Secondary navigation"
      data-testid="secondary-ctas"
      className={`bg-white py-16 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8 text-center ${className}`.trim()}
      {...props}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <h2 className="font-heading text-2xl md:text-3xl text-primary-800 text-center mb-4">
          Go Further
        </h2>
        <p className="text-neutral-500 text-center mb-12">
          Use what helps. Ignore what does not.
        </p>

        {/* Cards container */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Blog Card */}
          <NextLink
            href="/blog"
            className="group block rounded-xl border border-primary-200 bg-primary-100/80 p-8 transition-all duration-200 hover:border-primary-300 hover:bg-primary-200/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-200/80 text-primary-800">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-primary-800 mb-2">
              Blog
            </h3>
            <p className="text-neutral-600 text-sm">
              Short thoughts. Practical ideas. No fluff.
            </p>
          </NextLink>

          {/* Books Card */}
          <NextLink
            href="/books"
            className="group block rounded-xl border border-primary-200 bg-primary-100/60 p-8 transition-all duration-200 hover:border-primary-300 hover:bg-primary-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-200/80 text-primary-800">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-primary-800 mb-2">
              Books
            </h3>
            <p className="text-neutral-600 text-sm">
              Calm guides for living simply with plants.
            </p>
          </NextLink>
        </div>
      </div>
    </section>
  );
}

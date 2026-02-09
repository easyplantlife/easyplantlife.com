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
      className={`bg-white py-10 md:py-14 lg:py-16 px-4 md:px-6 lg:px-8 text-center border-t border-neutral-100 ${className}`.trim()}
      {...props}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <h2 className="font-heading text-2xl md:text-3xl text-neutral-800 text-center mb-4">
          Go Further
        </h2>
        <p className="text-neutral-600 text-center mb-8 max-w-xl mx-auto">
          Use what helps. Ignore what does not. More depth lives in the blog and
          in longer-form guides.
        </p>

        {/* Cards container */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {/* Blog Card */}
          <NextLink
            href="/blog"
            className="group block rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-primary-50/50 p-7 md:p-8 transition-all duration-300 hover:border-primary-300 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 text-left"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition-colors group-hover:bg-primary-200">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-neutral-800 mb-2 group-hover:text-primary-800 transition-colors">
              Blog
            </h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Short thoughts and practical ideas on plant-based living—no fluff.
              Honest writing about simplicity, sustainability, and what actually
              works.
            </p>
            <span className="inline-flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700">
              Read articles
              <svg
                className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </NextLink>

          {/* Books Card */}
          <NextLink
            href="/books"
            className="group block rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-primary-50/50 p-7 md:p-8 transition-all duration-300 hover:border-primary-300 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 text-left"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition-colors group-hover:bg-primary-200">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="font-heading text-xl text-neutral-800 mb-2 group-hover:text-primary-800 transition-colors">
              Books
            </h3>
            <p className="text-neutral-600 leading-relaxed mb-4">
              Calm guides for living simply with plants. Longer-form work you
              can read at your own pace—practical steps, sustainable approach.
            </p>
            <span className="inline-flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700">
              View books
              <svg
                className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </NextLink>
        </div>
      </div>
    </section>
  );
}

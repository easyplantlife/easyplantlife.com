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
      className={`bg-white py-16 md:py-20 lg:py-24 px-4 md:px-6 lg:px-8 ${className}`.trim()}
      {...props}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <h2 className="font-heading text-2xl md:text-3xl text-neutral-800 text-center mb-10">
          Explore More
        </h2>

        {/* Cards container */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Blog Card */}
          <NextLink
            href="/blog"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-8 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative">
              <span className="text-4xl mb-4 block">📝</span>
              <h3 className="font-heading text-xl text-primary-800 mb-2">
                Blog
              </h3>
              <p className="text-neutral-600 text-sm">
                Thoughtful articles on plant-based living
              </p>
            </div>
          </NextLink>

          {/* Books Card */}
          <NextLink
            href="/books"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-50 to-primary-50 p-8 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform" />
            <div className="relative">
              <span className="text-4xl mb-4 block">📚</span>
              <h3 className="font-heading text-xl text-primary-800 mb-2">
                Books
              </h3>
              <p className="text-neutral-600 text-sm">
                In-depth guides for your journey
              </p>
            </div>
          </NextLink>
        </div>
      </div>
    </section>
  );
}

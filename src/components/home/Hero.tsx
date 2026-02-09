import { type HTMLAttributes } from "react";
import Image from "next/image";
import NextLink from "next/link";

export interface HeroProps extends HTMLAttributes<HTMLElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Hero Component
 *
 * The hero section for the home page. This is the first impression—
 * communicating the brand in under 30 seconds with:
 * - Logo prominently displayed
 * - Short tagline (2-4 words)
 * - Brief brand explanation (2-3 sentences max)
 * - Vibrant, welcoming design with gradient background
 * - Calm and intentional atmosphere
 *
 * @example
 * ```tsx
 * <Hero />
 * <Hero className="mt-8" />
 * ```
 */
export function Hero({ className = "", ...props }: HeroProps) {
  return (
    <section
      aria-label="Hero section"
      data-testid="hero-section"
      className={`bg-gradient-to-b from-primary-100 via-primary-50 to-white py-10 md:py-14 lg:py-20 px-4 md:px-6 lg:px-8 text-center ${className}`.trim()}
      {...props}
    >
      {/* Content */}
      <div className="text-center">
        <div className="max-w-3xl mx-auto">
          {/* Logo - h1 for semantic structure and accessibility */}
          <h1 className="mb-6 flex justify-center font-heading">
            <span className="sr-only">Easy Plant Life</span>
            <Image
              src="/images/lockup-logo.png"
              alt="Easy Plant Life"
              width={400}
              height={150}
              className="w-72 md:w-80 lg:w-96 h-auto drop-shadow-sm"
              priority
            />
          </h1>

          {/* Tagline - 2-4 words */}
          <p
            data-testid="hero-tagline"
            className="font-heading text-2xl md:text-3xl lg:text-4xl text-primary-800 mb-6 font-medium tracking-tight"
          >
            Vegan living made simple.
          </p>

          {/* Brand Explanation - expanded for clarity and content */}
          <div
            data-testid="hero-explanation"
            className="font-body text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto space-y-3"
          >
            <p className="text-neutral-700 font-medium">
              Living vegan does not need to feel like a project.
            </p>
            <p>
              No perfection or rules—just easy choices that fit your real life.
            </p>
            <p className="text-neutral-500">
              Calm guidance, practical ideas, and honest writing for a
              plant-based life that feels sustainable instead of overwhelming.
            </p>
          </div>

          {/* Decorative divider */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary-300" />
            <Image
              src="/images/mark-logo.png"
              alt=""
              width={28}
              height={28}
              className="opacity-60"
              aria-hidden="true"
            />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary-300" />
          </div>
        </div>

        {/* Book imagery - full-width so it can be much larger, links to books page */}
        <div className="mt-8 md:mt-10 flex justify-center px-0 md:px-4" data-testid="hero-books">
          <NextLink
            href="/books"
            className="block w-full max-w-6xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg"
            aria-label="View Easy Plant Life books"
          >
            <Image
              src="/images/easy-plant-life-book-white-bg.png"
              alt="The Normal Vegan and The Everyday Vegan Playbook, Easy Plant Life books"
              width={960}
              height={640}
              className="w-full max-w-4xl sm:max-w-5xl md:max-w-6xl mx-auto h-auto drop-shadow-sm"
            />
          </NextLink>
        </div>
      </div>
    </section>
  );
}

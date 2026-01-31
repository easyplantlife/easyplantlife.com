import { type HTMLAttributes } from "react";
import Image from "next/image";

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
      className={`bg-gradient-to-b from-primary-100 to-white py-24 md:py-32 lg:py-40 px-4 md:px-6 lg:px-8 text-center ${className}`.trim()}
      {...props}
    >
      {/* Content */}
      <div className="text-center">
        <div className="max-w-3xl mx-auto">
          {/* Logo - h1 for semantic structure and accessibility */}
          <h1 className="mb-8 flex justify-center font-heading">
            <span className="sr-only">Easy Plant Life</span>
            <Image
              src="/images/lockup-logo.png"
              alt="Easy Plant Life"
              width={400}
              height={150}
              className="w-64 md:w-80 lg:w-96 h-auto"
              priority
            />
          </h1>

          {/* Tagline - 2-4 words */}
          <p
            data-testid="hero-tagline"
            className="font-heading text-2xl md:text-3xl lg:text-4xl text-primary-800 mb-8 font-medium"
          >
            Vegan living made simple.
          </p>

          {/* Brand Explanation - max 3 sentences */}
          <div
            data-testid="hero-explanation"
            className="font-body text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto space-y-3"
          >
            <p>Living vegan does not need to feel like a project.</p>
            <p>No perfection or rules—just easy choices that fit your real life.</p>
          </div>

          {/* Decorative divider */}
          <div className="mt-14 flex justify-center items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary-300" />
            <Image
              src="/images/mark-logo.png"
              alt=""
              width={28}
              height={28}
              className="opacity-70"
              aria-hidden="true"
            />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary-300" />
          </div>
        </div>
      </div>
    </section>
  );
}

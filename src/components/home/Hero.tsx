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
      className={`relative overflow-hidden ${className}`.trim()}
      {...props}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 opacity-60" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary-300 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent-300 rounded-full opacity-20 blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary-400 rounded-full opacity-10 blur-2xl" />

      {/* Content */}
      <div className="relative py-24 md:py-32 lg:py-40 px-4 md:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/lockup-logo.png"
              alt="Easy Plant Life"
              width={400}
              height={150}
              className="w-64 md:w-80 lg:w-96 h-auto drop-shadow-lg"
              priority
            />
          </div>

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
            className="font-body text-lg md:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto space-y-2"
          >
            <p>Living vegan should not feel like a project.</p>
            <p>No perfection required. No rules to follow.</p>
            <p>Just easy choices that fit your real life.</p>
          </div>

          {/* Decorative leaf divider */}
          <div className="mt-12 flex justify-center items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary-400" />
            <Image
              src="/images/mark-logo.png"
              alt=""
              width={32}
              height={32}
              className="opacity-60"
              aria-hidden="true"
            />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary-400" />
          </div>
        </div>
      </div>
    </section>
  );
}

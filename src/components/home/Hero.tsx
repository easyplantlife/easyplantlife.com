import { type HTMLAttributes } from "react";

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
 * - Generous white space
 * - Calm and intentional design
 *
 * @example
 * ```tsx
 * <Hero />
 * <Hero className="mt-8" />
 * ```
 */
export function Hero({ className = "", ...props }: HeroProps) {
  const baseStyles = [
    // Background
    "bg-background",
    // Generous vertical padding for white space
    "py-24",
    "md:py-32",
    "lg:py-section",
    // Horizontal padding
    "px-4",
    "md:px-6",
    "lg:px-8",
    // Centered content
    "text-center",
  ].join(" ");

  return (
    <section
      aria-label="Hero section"
      data-testid="hero-section"
      className={`${baseStyles} ${className}`.trim()}
      {...props}
    >
      <div className="max-w-3xl mx-auto">
        {/* Logo / Brand Name */}
        <h1 className="font-heading text-5xl md:text-6xl text-text mb-6">
          Easy Plant Life
        </h1>

        {/* Tagline - 2-4 words */}
        <p
          data-testid="hero-tagline"
          className="font-heading text-2xl md:text-3xl text-text-secondary mb-8"
        >
          Living simply, naturally.
        </p>

        {/* Brand Explanation - max 3 sentences */}
        <p
          data-testid="hero-explanation"
          className="font-body text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto"
        >
          Easy Plant Life is about embracing a plant-based lifestyle without the
          pressure to be perfect. We believe in sustainable choices, not rigid
          rules.
        </p>
      </div>
    </section>
  );
}

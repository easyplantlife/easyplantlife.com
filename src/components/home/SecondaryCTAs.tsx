import { type HTMLAttributes } from "react";
import { Link } from "@/components/ui/Link";

export interface SecondaryCTAsProps extends HTMLAttributes<HTMLElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * SecondaryCTAs Component
 *
 * Secondary CTA section for the home page that directs users to
 * Blog and Books pages. Designed to be minimal and not compete
 * with the primary newsletter CTA.
 *
 * Features:
 * - Simple, clear links to Blog and Books
 * - Subtle styling consistent with brand
 * - Less visual prominence than newsletter CTA
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
  const baseStyles = [
    // Background - subtle, consistent with brand
    "bg-background",
    // Moderate vertical padding (less than newsletter CTA)
    "py-12",
    "md:py-16",
    "lg:py-20",
    // Horizontal padding
    "px-4",
    "md:px-6",
    "lg:px-8",
    // Centered content
    "text-center",
  ].join(" ");

  return (
    <section
      aria-label="Secondary navigation"
      data-testid="secondary-ctas"
      className={`${baseStyles} ${className}`.trim()}
      {...props}
    >
      <div className="max-w-xl mx-auto">
        {/* Optional intro text - keep minimal */}
        <p className="font-body text-text-secondary mb-6 text-sm">
          Explore more
        </p>

        {/* Links container */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link
            href="/blog"
            className="font-body text-lg hover:text-primary transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/books"
            className="font-body text-lg hover:text-primary transition-colors"
          >
            Books
          </Link>
        </div>
      </div>
    </section>
  );
}

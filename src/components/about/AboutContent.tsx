import { type HTMLAttributes } from "react";

export interface AboutContentProps extends HTMLAttributes<HTMLElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * AboutContent Component
 *
 * The main content structure for the About page. Explains the brand philosophy
 * with three sections:
 * 1. Why Easy Plant Life exists
 * 2. What we believe (philosophy)
 * 3. What we're not (explicitly)
 *
 * Tone is calm, honest, non-authoritative - not preachy or activist.
 * Emphasizes realism and sustainability over perfection.
 *
 * @example
 * ```tsx
 * <AboutContent />
 * <AboutContent className="mt-8" />
 * ```
 */
export function AboutContent({ className = "", ...props }: AboutContentProps) {
  return (
    <article
      data-testid="about-content"
      className={`space-y-16 ${className}`.trim()}
      {...props}
    >
      {/* Section 1: Why Easy Plant Life Exists */}
      <section data-testid="about-why-section" className="mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-text mb-6">
          Why Easy Plant Life Exists
        </h2>
        <p className="font-body text-lg text-text-secondary leading-relaxed mb-4">
          We started Easy Plant Life because we noticed something: plant-based
          living had become complicated. Somewhere along the way, what began as
          a simple choice turned into a project filled with rules, pressure, and
          endless optimization.
        </p>
        <p className="font-body text-lg text-text-secondary leading-relaxed">
          We wanted a space that felt different. A place where choosing plants
          over other options could just be... easy. No perfection required.
        </p>
      </section>

      {/* Section 2: What We Believe */}
      <section data-testid="about-beliefs-section" className="mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-text mb-6">
          What We Believe
        </h2>
        <p className="font-body text-lg text-text-secondary leading-relaxed mb-4">
          We believe in practical choices that fit real life. Sustainable habits
          that you can maintain over time matter more than perfect days followed
          by burnout.
        </p>
        <p className="font-body text-lg text-text-secondary leading-relaxed mb-4">
          Simplicity is a feature. If something adds complexity without adding
          clarity, it probably doesn&apos;t belong here. We choose calm over
          urgency, honest information over hype.
        </p>
        <p className="font-body text-lg text-text-secondary leading-relaxed">
          Long-term sustainability beats short-term perfection. Every time.
        </p>
      </section>

      {/* Section 3: What We're Not */}
      <section data-testid="about-not-section" className="mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-text mb-6">
          What We&apos;re Not
        </h2>
        <p className="font-body text-lg text-text-secondary leading-relaxed mb-4">
          We&apos;re not here to tell you what to do. There&apos;s no judgment
          for imperfect choices, no lectures about doing more, and no pressure
          to become a different person.
        </p>
        <p className="font-body text-lg text-text-secondary leading-relaxed mb-4">
          We don&apos;t do wellness influencer energy. We don&apos;t sell
          perfection or pretend any of this is complicated. We&apos;re not
          interested in making you feel bad about where you are right now.
        </p>
        <p className="font-body text-lg text-text-secondary leading-relaxed">
          Easy Plant Life is not a lifestyle brand that expects you to buy in
          completely. Take what works for you. Leave the rest. That&apos;s the
          whole point.
        </p>
      </section>
    </article>
  );
}

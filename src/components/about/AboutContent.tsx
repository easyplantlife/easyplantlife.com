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
        <h2 className="font-heading text-3xl md:text-4xl text-neutral-800 mb-8">
          Why Easy Plant Life Exists
        </h2>
        <div className="font-body text-lg text-neutral-600 leading-relaxed space-y-4">
          <p>Living vegan should not feel like a project.</p>
          <p>
            Somewhere along the way, what began as a simple choice turned into
            something complicated. Rules to follow. Recipes to perfect. Pressure
            to optimize.
          </p>
          <p>We wanted something different.</p>
          <p>
            A place where plant-based living could just be easy. Where good
            enough is enough. Where you do not need to prove anything to anyone.
          </p>
        </div>
      </section>

      {/* Section 2: What We Believe */}
      <section data-testid="about-beliefs-section" className="mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-neutral-800 mb-8">
          What We Believe
        </h2>
        <div className="font-body text-lg text-neutral-600 leading-relaxed space-y-4">
          <p>Easy matters because ease is what allows habits to survive real life.</p>
          <p>Most days are average. Some days are rushed. Some days are tiring.</p>
          <p>
            A way of eating that depends on everything going right will eventually
            feel like too much.
          </p>
          <p>Simplicity over optimization.</p>
          <p>Sustainability over perfection.</p>
          <p>Calm over urgency.</p>
          <p>
            If something adds complexity without increasing clarity, it does not
            belong here.
          </p>
        </div>
      </section>

      {/* Section 3: What We're Not */}
      <section data-testid="about-not-section" className="mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-neutral-800 mb-8">
          What We&apos;re Not
        </h2>
        <div className="font-body text-lg text-neutral-600 leading-relaxed space-y-4">
          <p>We are not here to tell you what to do.</p>
          <p>
            No judgment for imperfect choices. No lectures about doing more. No
            pressure to become a different person.
          </p>
          <p>We do not do wellness influencer energy.</p>
          <p>We do not sell perfection.</p>
          <p>We are not interested in making you feel bad about where you are.</p>
          <p>Use what helps. Ignore what does not.</p>
          <p>That is the whole point.</p>
        </div>
      </section>
    </article>
  );
}

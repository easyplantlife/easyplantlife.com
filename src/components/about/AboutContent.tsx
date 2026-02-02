import { type HTMLAttributes } from "react";
import Image from "next/image";

export interface AboutContentProps extends HTMLAttributes<HTMLElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * AboutContent Component
 *
 * The main content structure for the About page. Explains the brand philosophy
 * with four sections:
 * 1. Why Easy Plant Life exists
 * 2. What we believe (philosophy)
 * 3. What we're not (explicitly)
 * 4. Who's behind this
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
      {/* Philosophy Quote */}
      <section className="mb-12">
        <blockquote className="border-l-4 border-primary-300 pl-6 py-2">
          <p className="font-heading text-2xl md:text-3xl text-primary-800 italic leading-relaxed">
            &ldquo;Easy Plant Life is about living vegan without turning it into
            a project.&rdquo;
          </p>
        </blockquote>
      </section>

      {/* Section 1: Why Easy Plant Life Exists */}
      <section data-testid="about-why-section" className="mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-neutral-800 mb-8">
          Why Easy Plant Life Exists
        </h2>
        <div className="text-lg text-neutral-600 leading-relaxed space-y-4">
          <p className="font-body leading-relaxed">
            Living vegan does not need to feel like a project.
          </p>
          <p className="font-body leading-relaxed">
            Somewhere along the way, what began as a simple choice turned into
            something complicated. Rules to follow. Recipes to perfect. Pressure
            to optimize.
          </p>
          <p className="font-body leading-relaxed">
            We wanted something different.
          </p>
          <p className="font-body leading-relaxed">
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
        <div className="text-lg text-neutral-600 leading-relaxed space-y-4">
          <p className="font-body leading-relaxed">
            Easy matters because ease is what allows habits to survive real
            life.
          </p>
          <p className="font-body leading-relaxed">
            Most days are average. Some days are rushed. Some days are tiring.
          </p>
          <p className="font-body leading-relaxed">
            A way of eating that depends on everything going right will
            eventually feel like too much.
          </p>
        </div>

        {/* Values list with visual emphasis */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-primary-50 p-5 text-center">
            <p className="font-heading text-lg text-primary-800">
              Simplicity over optimization
            </p>
          </div>
          <div className="rounded-xl bg-primary-50 p-5 text-center">
            <p className="font-heading text-lg text-primary-800">
              Sustainability over perfection
            </p>
          </div>
          <div className="rounded-xl bg-primary-50 p-5 text-center">
            <p className="font-heading text-lg text-primary-800">
              Calm over urgency
            </p>
          </div>
        </div>

        <p className="font-body text-lg text-neutral-600 leading-relaxed mt-8">
          If something adds complexity without increasing clarity, it does not
          belong here.
        </p>
      </section>

      {/* Section 3: What We're Not */}
      <section data-testid="about-not-section" className="mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-neutral-800 mb-8">
          What We&apos;re Not
        </h2>
        <div className="text-lg text-neutral-600 leading-relaxed space-y-4">
          <p className="font-body leading-relaxed">
            We are not here to tell you what to do.
          </p>
          <p className="font-body leading-relaxed">
            No judgment for imperfect choices. No lectures about doing more. No
            pressure to become a different person.
          </p>
          <p className="font-body leading-relaxed">
            We do not do wellness influencer energy.
          </p>
          <p className="font-body leading-relaxed">
            We do not sell perfection.
          </p>
          <p className="font-body leading-relaxed">
            We are not interested in making you feel bad about where you are.
          </p>
          <p className="font-body leading-relaxed font-medium text-neutral-700">
            Use what helps. Ignore what does not. That is the whole point.
          </p>
        </div>
      </section>

      {/* Section 4: Who's Behind This */}
      <section data-testid="about-founder-section" className="mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-neutral-800 mb-8">
          Who&apos;s Behind This
        </h2>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-200 to-primary-100 flex items-center justify-center">
              <Image
                src="/images/mark-logo.png"
                alt=""
                width={48}
                height={48}
                className="opacity-70"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="text-lg text-neutral-600 leading-relaxed space-y-4">
            <p className="font-body leading-relaxed">
              Easy Plant Life started as a personal experiment in making
              plant-based eating sustainable for everyday life—not just
              Instagram.
            </p>
            <p className="font-body leading-relaxed">
              After years of overthinking meals, tracking nutrients, and feeling
              like vegan eating required constant effort, I realized the problem
              was not the food. It was the approach.
            </p>
            <p className="font-body leading-relaxed">
              This site is a collection of what actually works: simple systems,
              default meals, and an honest perspective on making plant-based
              choices stick without burning out.
            </p>
            <p className="font-body leading-relaxed text-neutral-500 text-base">
              No credentials to wave around. Just someone who has been doing
              this quietly for a while and wanted to share what helps.
            </p>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="flex justify-center items-center gap-4 pt-8">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary-300" />
        <Image
          src="/images/mark-logo.png"
          alt=""
          width={24}
          height={24}
          className="opacity-50"
          aria-hidden="true"
        />
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary-300" />
      </div>
    </article>
  );
}

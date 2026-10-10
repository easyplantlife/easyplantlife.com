import { type HTMLAttributes } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

export interface IdeaSectionProps extends HTMLAttributes<HTMLElement> {
  className?: string;
}

/**
 * IdeaSection
 *
 * The brand values as one serif statement, with two sentences of context.
 * Deliberately not a grid of feature cards.
 */
export function IdeaSection({ className = "", ...props }: IdeaSectionProps) {
  return (
    <section
      aria-labelledby="idea-title"
      data-testid="idea-section"
      className={cn("border-t border-line bg-surface", className)}
      {...props}
    >
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,23rem),1fr))] items-start gap-12 py-[88px]">
        <div className="flex flex-col gap-5">
          <Eyebrow>The idea</Eyebrow>
          <h2
            id="idea-title"
            className="whitespace-pre-line font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-normal leading-[1.25] tracking-[-0.01em] text-ink"
          >
            {
              "Simplicity over optimization.\nSustainability over perfection.\nCalm over urgency."
            }
          </h2>
        </div>
        <div className="flex max-w-[52ch] flex-col gap-5 font-sans text-lg leading-[1.65] text-ink-soft">
          <p>
            Most days are average. Some are rushed. A way of eating that depends
            on everything going right eventually feels like too much.
          </p>
          <p>
            Easy Plant Life is about the version that survives real life:
            default meals, small systems, and honest writing about what actually
            holds up.
          </p>
          <ArrowLink href="/about" className="text-base">
            More about why this exists
          </ArrowLink>
        </div>
      </Container>
    </section>
  );
}

import { type HTMLAttributes } from "react";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

export interface NewsletterContentProps extends HTMLAttributes<HTMLElement> {
  className?: string;
}

const arrives = [
  "Short notes on default meals and small systems",
  "New writing, when it is published",
  "A line when a book is out",
];

const doesNot = [
  "Daily tips or challenges",
  "Recipes you need to plan around",
  "Anything you have to keep up with",
];

/**
 * NewsletterContent
 *
 * The signup form followed by an honest list of what arrives and what does
 * not. The page intro (eyebrow, title, promise) is rendered by PageLayout.
 */
export function NewsletterContent({
  className = "",
  ...props
}: NewsletterContentProps) {
  return (
    <article
      data-testid="newsletter-content"
      className={cn("flex flex-col gap-10", className)}
      {...props}
    >
      <NewsletterForm
        layout="stacked"
        className="w-full max-w-[560px] text-left"
        successActions={
          <ArrowLink href="/blog" className="text-[15px]">
            Read something now
          </ArrowLink>
        }
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-8 border-t border-line pt-10 text-left">
        <div className="flex flex-col gap-2.5">
          <Eyebrow>What arrives</Eyebrow>
          <ul className="list-disc space-y-1 pl-[18px] font-sans text-ink-soft">
            {arrives.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2.5">
          <Eyebrow tone="muted">What does not</Eyebrow>
          <ul className="list-disc space-y-1 pl-[18px] font-sans text-muted">
            {doesNot.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

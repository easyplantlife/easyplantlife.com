import Image from "next/image";
import NextLink from "next/link";
import { type HTMLAttributes } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Panel } from "@/components/ui/Panel";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

export interface AboutContentProps extends HTMLAttributes<HTMLElement> {
  className?: string;
}

const chapters = [
  { id: "why", number: "01", label: "Why this exists" },
  { id: "believe", number: "02", label: "What we believe" },
  { id: "not", number: "03", label: "What this is not" },
  { id: "who", number: "04", label: "Who is behind it" },
] as const;

const notList = [
  "No judgment for imperfect choices.",
  "No lectures about doing more.",
  "No wellness-influencer energy.",
  "No selling perfection.",
  "No pressure to become a different person.",
];

function Chapter({
  id,
  number,
  label,
  title,
  children,
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article
      id={id}
      data-testid={`about-${id}-section`}
      className="flex scroll-mt-8 flex-col gap-[18px]"
    >
      <Eyebrow>
        {number} — {label}
      </Eyebrow>
      <Heading level={2} className="text-[2rem]">
        {title}
      </Heading>
      {children}
    </article>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 font-sans text-lg leading-[1.65] text-ink-soft">
      {children}
    </div>
  );
}

/**
 * AboutContent
 *
 * A small section index beside four short chapters. Tone is calm and
 * non-authoritative: this explains the philosophy, it does not sell it.
 */
export function AboutContent({ className = "", ...props }: AboutContentProps) {
  return (
    <article
      data-testid="about-content"
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-14 border-t border-line pt-12",
        className
      )}
      {...props}
    >
      <nav
        aria-label="On this page"
        className="flex max-w-[220px] flex-col gap-1"
      >
        <Eyebrow className="mb-2.5 text-xs">On this page</Eyebrow>
        {chapters.map((chapter) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            className="rounded-sm py-1.5 font-sans text-[15px] text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {chapter.number} — {chapter.label}
          </a>
        ))}
      </nav>

      <div className="col-span-full flex max-w-prose flex-col gap-[72px] md:col-span-2">
        <Chapter
          {...chapters[0]}
          title="A place where plant-based living can just be easy"
        >
          <Prose>
            <p>
              We wanted something different from the rules and the
              perfectionism.
            </p>
            <p>
              A place where good enough is enough. Where you do not need to
              prove anything to anyone, and where the food simply fits into the
              day you are actually having.
            </p>
          </Prose>
        </Chapter>

        <Chapter
          {...chapters[1]}
          title="Ease is what lets habits survive real life"
        >
          <Prose>
            <p>
              Most days are average. Some days are rushed. Some days are tiring.
              A way of eating that depends on everything going right will
              eventually feel like too much.
            </p>
          </Prose>
          <blockquote className="mt-3 whitespace-pre-line border-l-2 border-accent bg-surface px-8 py-7 font-serif text-2xl leading-[1.4] text-ink">
            {
              "Simplicity over optimization.\nSustainability over perfection.\nCalm over urgency.\nPractical over ideological."
            }
          </blockquote>
          <Prose>
            <p>
              If something adds complexity without increasing clarity, it does
              not belong here.
            </p>
          </Prose>
        </Chapter>

        <Chapter
          {...chapters[2]}
          title="We are not here to tell you what to do"
        >
          <ul className="mt-2 flex flex-col font-sans text-lg text-ink-soft">
            {notList.map((item) => (
              <li
                key={item}
                className="border-t border-line py-3.5 last:border-b"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 font-serif text-[22px] leading-[1.4] text-ink">
            Use what helps. Ignore what does not. That is the whole point.
          </p>
        </Chapter>

        <Chapter
          {...chapters[3]}
          title="Someone who has been doing this quietly for a while"
        >
          <div className="flex flex-wrap items-start gap-6">
            <div
              role="img"
              aria-label="Author photo placeholder"
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-dashed border-tint-line bg-tint font-sans text-xs text-accent"
            >
              Photo
            </div>
            <div className="min-w-0 flex-1 basis-[16rem]">
              <Prose>
                <p>
                  Easy Plant Life started as a personal experiment in making
                  plant-based eating sustainable for everyday life, not just for
                  a feed.
                </p>
                <p>
                  After years of overthinking meals, the problem turned out not
                  to be the food. It was the approach.
                </p>
                <Text color="faint">
                  No credentials to wave around. Just what has actually worked,
                  written down.
                </Text>
              </Prose>
            </div>
          </div>
        </Chapter>

        <Panel columns data-testid="about-books-panel">
          <div className="flex flex-col gap-2">
            <p className="font-serif text-[22px] font-medium leading-snug text-ink">
              The longer version lives in two short books.
            </p>
            <Text color="secondary">
              One is the practical playbook. The other is a story about the same
              idea.
            </Text>
            <ArrowLink href="/books" className="mt-1">
              See the books
            </ArrowLink>
          </div>
          <NextLink
            href="/books"
            aria-label="The Easy Plant Life books"
            className="block overflow-hidden rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <Image
              src="/images/easy-plant-life-books-on-table.png"
              alt=""
              width={640}
              height={400}
              sizes="(max-width: 768px) 100vw, 320px"
              className="block aspect-[16/10] w-full object-cover"
            />
          </NextLink>
        </Panel>
      </div>
    </article>
  );
}

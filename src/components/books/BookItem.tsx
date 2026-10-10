import Image from "next/image";
import NextLink from "next/link";
import type { HTMLAttributes } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading, type HeadingLevel } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { getBookStatusLabel, type Book } from "@/content/books";
import { cn } from "@/lib/utils";

export type BookItemVariant = "full" | "compact";

export interface BookItemProps extends HTMLAttributes<HTMLElement> {
  book: Book;
  /**
   * "full" is the books page row with facts and a buy button.
   * "compact" is the home page preview linking to the books page.
   */
  variant?: BookItemVariant;
  headingLevel?: Extract<HeadingLevel, 2 | 3>;
}

/**
 * BookItem
 *
 * Cover-first presentation of one book. Both variants wrap to a single
 * column on narrow screens.
 */
export function BookItem({
  book,
  variant = "full",
  headingLevel = variant === "full" ? 2 : 3,
  className = "",
  ...props
}: BookItemProps) {
  const { title, tagline, description, coverImage, status, pages } = book;
  const statusLabel = getBookStatusLabel(status);
  const isAvailable = status === "available";
  const purchaseLinks = isAvailable ? book.purchaseLinks : [];

  if (variant === "compact") {
    return (
      <article
        className={cn("flex flex-wrap items-start gap-x-7 gap-y-5", className)}
        {...props}
      >
        <NextLink
          href="/books"
          aria-label={`${title}, on the books page`}
          className="block w-[150px] shrink-0 overflow-hidden rounded-md shadow-cover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
        >
          <Image
            src={coverImage}
            alt=""
            width={150}
            height={225}
            className="block aspect-[2/3] w-full object-cover"
          />
        </NextLink>
        <div className="flex min-w-0 flex-1 basis-[14rem] flex-col gap-2.5">
          <Heading level={headingLevel} className="text-2xl">
            {title}
          </Heading>
          <Text size="sm" color="faint">
            {statusLabel}
          </Text>
          <Text size="lg" color="secondary">
            {description}
          </Text>
          {purchaseLinks.map((link) => (
            <ArrowLink key={link.url} href={link.url}>
              {link.label}
            </ArrowLink>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] items-start gap-x-14 gap-y-8 border-t border-line py-14",
        className
      )}
      {...props}
    >
      <Image
        src={coverImage}
        alt={`Cover of ${title}`}
        width={280}
        height={420}
        className="block aspect-[2/3] w-[280px] max-w-full rounded-md object-cover shadow-cover"
      />

      <div className="col-span-full flex max-w-[620px] flex-col gap-[18px] md:col-span-2">
        <Eyebrow>
          {tagline} · {statusLabel}
        </Eyebrow>
        <Heading level={headingLevel} className="text-[2.25rem] leading-[1.15]">
          {title}
        </Heading>
        <Text size="lg" color="soft" className="leading-[1.65]">
          {description}
        </Text>

        {pages && (
          <dl className="mt-2 grid max-w-[420px] grid-cols-2 gap-x-6 gap-y-3 font-sans text-[15px]">
            <div>
              <dt className="text-faint">Length</dt>
              <dd className="font-medium text-ink">{pages} pages</dd>
            </div>
          </dl>
        )}

        {purchaseLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-4">
            {purchaseLinks.map((link) => (
              <ButtonLink key={link.url} href={link.url}>
                {link.label} <span aria-hidden="true">↗</span>
              </ButtonLink>
            ))}
            <Text size="sm" color="faint">
              Opens in a new tab
            </Text>
          </div>
        )}
      </div>
    </article>
  );
}

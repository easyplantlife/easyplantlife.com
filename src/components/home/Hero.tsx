import Image from "next/image";
import NextLink from "next/link";
import { type HTMLAttributes } from "react";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";

export interface HeroProps extends HTMLAttributes<HTMLElement> {
  className?: string;
}

/**
 * Hero
 *
 * One headline, one promise and the newsletter form, beside the books photo.
 * This is the only place on the home page that asks for anything.
 */
export function Hero({ className = "", ...props }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      data-testid="hero-section"
      className={cn("pb-24 pt-20", className)}
      {...props}
    >
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,27rem),1fr))] items-center gap-16">
        <div className="flex flex-col gap-7">
          <Eyebrow>{siteConfig.name}</Eyebrow>
          <Heading id="hero-title" level={1} className="max-w-[14ch]">
            Living vegan without turning it into a project.
          </Heading>
          <Text
            size="xl"
            color="secondary"
            data-testid="hero-explanation"
            className="max-w-[46ch]"
          >
            Calm, practical writing for people who want plant-based eating to
            fit real life. No rules, no perfection, no pressure.
          </Text>

          <NewsletterForm
            layout="inline"
            submitLabel="Get the notes"
            helpText="Occasional notes. No schedule. Unsubscribe any time."
            className="max-w-[520px]"
          />

          <div className="flex flex-wrap items-center gap-6">
            <ArrowLink href="/blog">Read the blog</ArrowLink>
            <ArrowLink href="/books">See the books</ArrowLink>
          </div>
        </div>

        <NextLink
          href="/books"
          aria-label="The two Easy Plant Life books"
          data-testid="hero-books"
          className="block overflow-hidden rounded-2xl bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
        >
          <Image
            src="/images/easy-plant-life-books-on-table.png"
            alt="The Everyday Vegan Playbook and The Normal Vegan on a wooden table with a plant and tea"
            width={1056}
            height={792}
            priority
            sizes="(max-width: 768px) 100vw, 528px"
            className="block aspect-[4/3] w-full object-cover"
          />
        </NextLink>
      </Container>
    </section>
  );
}

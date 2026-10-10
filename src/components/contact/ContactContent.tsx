import { type HTMLAttributes } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Link } from "@/components/ui/Link";
import { Text } from "@/components/ui/Text";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";

export interface ContactContentProps extends HTMLAttributes<HTMLElement> {
  className?: string;
}

/**
 * ContactContent
 *
 * Two columns: a short invitation with the plain email address, and the form.
 */
export function ContactContent({
  className = "",
  ...props
}: ContactContentProps) {
  return (
    <article
      data-testid="contact-content"
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] items-start gap-x-[72px] gap-y-12",
        className
      )}
      {...props}
    >
      <div className="flex max-w-[440px] flex-col gap-6">
        <Eyebrow>Contact</Eyebrow>
        <Heading level={1}>Say hello.</Heading>
        <Text size="xl" color="secondary">
          Questions about the books, the writing, or something you would like to
          see covered. A short note is fine.
        </Text>
        <div className="flex flex-col gap-1.5 border-t border-line pt-5">
          <Text size="sm" color="faint">
            Prefer your own email app?
          </Text>
          <Link
            href={`mailto:${siteConfig.contactEmail}`}
            variant="plain"
            className="font-sans text-lg font-medium text-accent hover:text-accent-hover hover:underline"
          >
            {siteConfig.contactEmail}
          </Link>
        </div>
        <Text size="sm" color="faint">
          Messages are read by a person. There is no newsletter signup hidden in
          this form.
        </Text>
      </div>

      <ContactForm />
    </article>
  );
}

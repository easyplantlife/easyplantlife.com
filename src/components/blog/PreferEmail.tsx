import type { HTMLAttributes } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Panel } from "@/components/ui/Panel";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

export type PreferEmailProps = HTMLAttributes<HTMLElement>;

/**
 * PreferEmail
 *
 * The one aside the blog pages share: a quiet pointer to the newsletter.
 */
export function PreferEmail({ className = "", ...props }: PreferEmailProps) {
  return (
    <Panel
      as="aside"
      columns
      aria-labelledby="prefer-email"
      className={cn("mt-16", className)}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <p
          id="prefer-email"
          className="font-serif text-[22px] font-medium leading-snug text-ink"
        >
          Prefer email?
        </p>
        <Text color="secondary">
          One short note when there is something worth sharing. No schedule.
        </Text>
      </div>
      <div>
        <ButtonLink href="/newsletter">Get the notes</ButtonLink>
      </div>
    </Panel>
  );
}

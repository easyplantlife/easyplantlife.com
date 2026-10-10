import Image from "next/image";
import NextLink from "next/link";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";

export type BrandSize = "md" | "sm";

export interface BrandProps {
  size?: BrandSize;
  className?: string;
}

const markSize: Record<BrandSize, number> = { md: 34, sm: 28 };

const wordmarkStyles: Record<BrandSize, string> = {
  md: "text-xl",
  sm: "text-lg",
};

/**
 * Brand
 *
 * Mark + wordmark linking home. Used in the header and footer.
 */
export function Brand({ size = "md", className = "" }: BrandProps) {
  const px = markSize[size];

  return (
    <NextLink
      href="/"
      aria-label={`${siteConfig.name}, home`}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-sm text-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ground",
        className
      )}
    >
      <Image
        src="/images/mark-logo.png"
        alt=""
        width={px}
        height={px}
        priority={size === "md"}
        aria-hidden="true"
        className="shrink-0 object-contain"
      />
      <span
        className={cn(
          "font-serif font-medium tracking-[-0.01em]",
          wordmarkStyles[size]
        )}
      >
        {siteConfig.name}
      </span>
    </NextLink>
  );
}

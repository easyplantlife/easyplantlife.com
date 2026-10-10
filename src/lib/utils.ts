/**
 * Joins class names, dropping falsy values.
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * True for links that leave the site (http(s), mailto, tel).
 */
export function isExternalHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/.test(href);
}

/**
 * True when `pathname` is `href` or nested under it (e.g. /blog/post).
 * The home path only matches exactly.
 */
export function isActivePath(
  pathname: string | null | undefined,
  href: string
): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

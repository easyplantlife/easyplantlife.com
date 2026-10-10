/**
 * Theme (light / dark) helpers
 *
 * The theme is stored as a `data-theme` attribute on <html>. CSS tokens in
 * globals.css switch on that attribute, so React never needs to know about
 * individual colors. To avoid a flash of the wrong theme, an inline script
 * (see getThemeInitScript) applies the stored or system preference before the
 * first paint; ThemeProvider then keeps React state in sync.
 */

export const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "light";

/** localStorage key holding the visitor's explicit choice. */
export const THEME_STORAGE_KEY = "epl-theme";

/** Attribute on <html> that CSS tokens react to. */
export const THEME_ATTRIBUTE = "data-theme";

const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export function isTheme(value: unknown): value is Theme {
  return (
    typeof value === "string" && (THEMES as readonly string[]).includes(value)
  );
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

/**
 * Picks the theme to apply: an explicit stored choice wins, otherwise the
 * system preference, otherwise the default.
 */
export function resolveTheme(
  stored: string | null | undefined,
  prefersDark: boolean
): Theme {
  if (isTheme(stored)) return stored;
  return prefersDark ? "dark" : DEFAULT_THEME;
}

/** Reads the theme currently applied to the document. */
export function readDocumentTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const value = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isTheme(value) ? value : DEFAULT_THEME;
}

/** Applies a theme to the document and remembers it for the next visit. */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, blocked). The theme still
    // applies for the current page.
  }
}

/**
 * Inline script that applies the theme before React hydrates.
 * Kept dependency-free and wrapped in try/catch so it can never break a page.
 */
export function getThemeInitScript(): string {
  return [
    "(function(){",
    "try{",
    `var s=window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});`,
    `var t=(s==="dark"||s==="light")?s:(window.matchMedia(${JSON.stringify(DARK_MEDIA_QUERY)}).matches?"dark":${JSON.stringify(DEFAULT_THEME)});`,
    `document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},t);`,
    "}catch(e){}",
    "})();",
  ].join("");
}

import { getThemeInitScript } from "@/lib/theme";

/**
 * ThemeScript
 *
 * Inline script rendered at the top of <body> so the stored or system theme
 * is applied before any content paints, avoiding a light-to-dark flash.
 */
export function ThemeScript() {
  return (
    <script
      id="theme-init"
      // The script is a static string built from constants, not user input.
      dangerouslySetInnerHTML={{ __html: getThemeInitScript() }}
    />
  );
}

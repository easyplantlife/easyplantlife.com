"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  applyTheme,
  DEFAULT_THEME,
  oppositeTheme,
  readDocumentTheme,
  THEME_ATTRIBUTE,
  type Theme,
} from "@/lib/theme";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * Default value used when no provider is mounted (e.g. a component rendered
 * in isolation). The theme reads as light and switching is a no-op.
 */
const fallbackContext: ThemeContextValue = {
  theme: DEFAULT_THEME,
  setTheme: () => {},
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextValue>(fallbackContext);

/**
 * The document's data-theme attribute is the single source of truth. It is
 * set before hydration by the inline init script and changed by applyTheme;
 * React subscribes to it instead of holding a copy in state.
 */
function subscribeToDocumentTheme(onChange: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [THEME_ATTRIBUTE],
  });
  return () => observer.disconnect();
}

function getServerTheme(): Theme {
  return DEFAULT_THEME;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider
 *
 * Exposes the active theme and the switch. During server rendering and
 * hydration the theme reads as light; once hydrated it reflects whatever the
 * init script applied, without a hydration mismatch.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useSyncExternalStore(
    subscribeToDocumentTheme,
    readDocumentTheme,
    getServerTheme
  );

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(oppositeTheme(readDocumentTheme()));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

"use client";

import { type ButtonHTMLAttributes } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

export type ThemeToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "type" | "children"
>;

/**
 * ThemeToggle
 *
 * Icon button that switches between light and dark. The label always names
 * the theme the click will switch to, so screen readers hear the action.
 */
export function ThemeToggle({ className = "", ...props }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      data-theme-toggle={theme}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-pill border border-tint-line text-accent transition-colors",
        "hover:bg-tint hover:text-accent-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ground",
        "dark:border-accent dark:bg-tint",
        className
      )}
      {...props}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

import {
  applyTheme,
  DEFAULT_THEME,
  getThemeInitScript,
  isTheme,
  oppositeTheme,
  readDocumentTheme,
  resolveTheme,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
} from "@/lib/theme";

describe("theme helpers", () => {
  afterEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    window.localStorage.clear();
  });

  describe("isTheme", () => {
    it("accepts light and dark", () => {
      expect(isTheme("light")).toBe(true);
      expect(isTheme("dark")).toBe(true);
    });

    it("rejects anything else", () => {
      expect(isTheme("blue")).toBe(false);
      expect(isTheme(null)).toBe(false);
      expect(isTheme(undefined)).toBe(false);
      expect(isTheme(1)).toBe(false);
    });
  });

  describe("oppositeTheme", () => {
    it("flips the theme", () => {
      expect(oppositeTheme("light")).toBe("dark");
      expect(oppositeTheme("dark")).toBe("light");
    });
  });

  describe("resolveTheme", () => {
    it("prefers an explicit stored choice over the system preference", () => {
      expect(resolveTheme("light", true)).toBe("light");
      expect(resolveTheme("dark", false)).toBe("dark");
    });

    it("falls back to the system preference when nothing is stored", () => {
      expect(resolveTheme(null, true)).toBe("dark");
      expect(resolveTheme(undefined, false)).toBe("light");
    });

    it("ignores invalid stored values", () => {
      expect(resolveTheme("sepia", true)).toBe("dark");
      expect(resolveTheme("sepia", false)).toBe(DEFAULT_THEME);
    });
  });

  describe("readDocumentTheme / applyTheme", () => {
    it("reads the default when no attribute is set", () => {
      expect(readDocumentTheme()).toBe(DEFAULT_THEME);
    });

    it("applies the theme to <html> and stores it", () => {
      applyTheme("dark");
      expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe(
        "dark"
      );
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
      expect(readDocumentTheme()).toBe("dark");
    });

    it("ignores an unknown attribute value", () => {
      document.documentElement.setAttribute(THEME_ATTRIBUTE, "sepia");
      expect(readDocumentTheme()).toBe(DEFAULT_THEME);
    });
  });

  describe("getThemeInitScript", () => {
    it("references the storage key and attribute", () => {
      const script = getThemeInitScript();
      expect(script).toContain(THEME_STORAGE_KEY);
      expect(script).toContain(THEME_ATTRIBUTE);
      expect(script).toContain("prefers-color-scheme: dark");
    });

    it("is wrapped in a try/catch so it can never throw", () => {
      const script = getThemeInitScript();
      expect(script).toContain("try{");
      expect(script).toContain("catch(e){}");
    });

    it("applies the stored theme when evaluated", () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
      new Function(getThemeInitScript())();
      expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe(
        "dark"
      );
    });

    it("falls back to the system preference when evaluated", () => {
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = jest.fn().mockReturnValue({ matches: true });
      new Function(getThemeInitScript())();
      expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe(
        "dark"
      );
      window.matchMedia = originalMatchMedia;
    });
  });
});

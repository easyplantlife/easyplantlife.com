import {
  footerNavigation,
  mainNavigation,
  newsletterNavItem,
} from "@/content/navigation";
import { siteConfig } from "@/content/site";

describe("navigation content", () => {
  it("keeps the header to four text links plus the newsletter action", () => {
    expect(mainNavigation.map((item) => item.label)).toEqual([
      "About",
      "Books",
      "Blog",
      "Contact",
    ]);
    expect(newsletterNavItem).toEqual({
      label: "Newsletter",
      href: "/newsletter",
    });
  });

  it("does not list Home (the brand mark links home)", () => {
    expect(mainNavigation.some((item) => item.href === "/")).toBe(false);
    expect(footerNavigation.some((item) => item.href === "/")).toBe(false);
  });

  it("uses root-relative internal paths everywhere", () => {
    for (const item of [...mainNavigation, ...footerNavigation]) {
      expect(item.href).toMatch(/^\/[a-z-]+$/);
    }
  });

  it("footer lists every page", () => {
    expect(footerNavigation.map((item) => item.href)).toEqual([
      "/about",
      "/books",
      "/blog",
      "/newsletter",
      "/contact",
    ]);
  });
});

describe("siteConfig", () => {
  it("exposes the public contact address and Medium profile", () => {
    expect(siteConfig.contactEmail).toMatch(/@easyplantlife\.com$/);
    expect(siteConfig.mediumUrl).toBe(
      `https://medium.com/@${siteConfig.mediumUsername}`
    );
  });
});

import { cn, isActivePath, isExternalHref } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});

describe("isExternalHref", () => {
  it("detects http, https, mailto and tel links", () => {
    expect(isExternalHref("https://medium.com")).toBe(true);
    expect(isExternalHref("http://example.com")).toBe(true);
    expect(isExternalHref("mailto:hello@easyplantlife.com")).toBe(true);
    expect(isExternalHref("tel:+15551234567")).toBe(true);
  });

  it("treats paths and anchors as internal", () => {
    expect(isExternalHref("/about")).toBe(false);
    expect(isExternalHref("#why")).toBe(false);
  });
});

describe("isActivePath", () => {
  it("matches the exact path", () => {
    expect(isActivePath("/books", "/books")).toBe(true);
  });

  it("matches nested paths", () => {
    expect(isActivePath("/blog/some-post", "/blog")).toBe(true);
  });

  it("does not match prefixes that are not path segments", () => {
    expect(isActivePath("/booksellers", "/books")).toBe(false);
  });

  it("only matches home exactly", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/about", "/")).toBe(false);
  });

  it("is false without a pathname", () => {
    expect(isActivePath(null, "/about")).toBe(false);
    expect(isActivePath(undefined, "/about")).toBe(false);
  });
});

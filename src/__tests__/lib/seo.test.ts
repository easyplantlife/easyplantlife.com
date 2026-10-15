import { absoluteUrl, pageMetadata } from "@/lib/seo";

describe("absoluteUrl", () => {
  it("puts site paths on the canonical host", () => {
    expect(absoluteUrl("/blog")).toBe("https://easyplantlife.com/blog");
    expect(absoluteUrl("blog")).toBe("https://easyplantlife.com/blog");
    expect(absoluteUrl("/")).toBe("https://easyplantlife.com");
  });

  it("leaves absolute URLs alone", () => {
    expect(absoluteUrl("https://medium.com/@easyplantlife")).toBe(
      "https://medium.com/@easyplantlife"
    );
  });
});

describe("pageMetadata", () => {
  const metadata = pageMetadata({
    title: "About",
    description: "A calm description.",
    path: "/about",
  });

  it("leaves the brand suffix to the layout template", () => {
    expect(metadata.title).toBe("About");
  });

  it("sets the canonical URL and keeps the feed link", () => {
    expect(metadata.alternates?.canonical).toBe("/about");
    expect(metadata.alternates?.types).toHaveProperty("application/rss+xml");
  });

  it("gives social cards the full title, URL and brand image", () => {
    expect(metadata.openGraph).toMatchObject({
      title: "About | Easy Plant Life",
      url: "/about",
      description: "A calm description.",
      images: [{ url: "/images/banner.png", width: 1200, height: 630 }],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "About | Easy Plant Life",
      images: ["/images/banner.png"],
    });
  });

  it("can opt out of the title template", () => {
    const home = pageMetadata({
      title: "Easy Plant Life",
      description: "Home.",
      path: "/",
      absoluteTitle: true,
    });
    expect(home.title).toEqual({ absolute: "Easy Plant Life" });
    expect(home.openGraph?.title).toBe("Easy Plant Life");
  });
});

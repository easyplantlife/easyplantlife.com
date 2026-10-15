import { render } from "@testing-library/react";
import { BlogJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import type { BlogPostEntry } from "@/lib/types/blog";

function readSchema(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script?.textContent || "{}");
}

const posts: BlogPostEntry[] = [
  {
    slug: "default-meals",
    title: "Default meals",
    excerpt: "Why a boring default is the whole trick.",
    url: "/blog/default-meals",
    publishedDate: new Date("2026-01-15T12:00:00Z"),
    thumbnail: "/images/blog/default-meals/01.jpeg",
  },
  {
    slug: "good-enough",
    title: "Good enough",
    excerpt: "On meals that are fine.",
    url: "/blog/good-enough",
    publishedDate: new Date("2026-01-01T12:00:00Z"),
  },
];

describe("BlogJsonLd", () => {
  it("describes the blog and lists every post", () => {
    const { container } = render(<BlogJsonLd posts={posts} />);
    const data = readSchema(container);
    expect(data["@type"]).toBe("Blog");
    expect(data.url).toBe("https://easyplantlife.com/blog");
    expect(data.blogPost).toEqual([
      {
        "@type": "BlogPosting",
        "@id": "https://easyplantlife.com/blog/default-meals#article",
        headline: "Default meals",
        url: "https://easyplantlife.com/blog/default-meals",
        datePublished: "2026-01-15T12:00:00.000Z",
        image: "https://easyplantlife.com/images/blog/default-meals/01.jpeg",
      },
      {
        "@type": "BlogPosting",
        "@id": "https://easyplantlife.com/blog/good-enough#article",
        headline: "Good enough",
        url: "https://easyplantlife.com/blog/good-enough",
        datePublished: "2026-01-01T12:00:00.000Z",
      },
    ]);
  });
});

describe("BreadcrumbJsonLd", () => {
  it("numbers the crumbs and makes their URLs absolute", () => {
    const { container } = render(
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />
    );
    expect(readSchema(container)).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://easyplantlife.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: "https://easyplantlife.com/blog",
        },
      ],
    });
  });
});

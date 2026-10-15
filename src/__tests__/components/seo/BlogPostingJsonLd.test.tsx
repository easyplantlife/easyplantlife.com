import { render } from "@testing-library/react";
import { BlogPostingJsonLd } from "@/components/seo/JsonLd";
import type { BlogPostEntry } from "@/lib/types/blog";

const post: BlogPostEntry = {
  slug: "default-meals",
  title: "Default meals",
  excerpt: "Why a boring default is the whole trick.",
  url: "/blog/default-meals",
  publishedDate: new Date("2026-01-15T12:00:00Z"),
  thumbnail: "/images/blog/default-meals/01.jpeg",
};

function renderSchema(entry: BlogPostEntry) {
  const { container } = render(<BlogPostingJsonLd post={entry} />);
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script?.textContent || "{}");
}

describe("BlogPostingJsonLd", () => {
  it("renders a BlogPosting schema with absolute URLs", () => {
    const data = renderSchema(post);
    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "Default meals",
      description: post.excerpt,
      url: "https://easyplantlife.com/blog/default-meals",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://easyplantlife.com/blog/default-meals",
      },
      datePublished: "2026-01-15T12:00:00.000Z",
      dateModified: "2026-01-15T12:00:00.000Z",
      image: {
        "@type": "ImageObject",
        url: "https://easyplantlife.com/images/blog/default-meals/01.jpeg",
      },
    });
    expect(data.author).toEqual({
      "@type": "Organization",
      "@id": "https://easyplantlife.com/#organization",
      name: "Easy Plant Life",
      url: "https://easyplantlife.com",
    });
    expect(data.publisher.name).toBe("Easy Plant Life");
    expect(data.publisher.logo.url).toBe(
      "https://easyplantlife.com/images/mark-logo.png"
    );
  });

  it("uses the revision date as dateModified", () => {
    const data = renderSchema({
      ...post,
      updatedDate: new Date("2026-02-01T12:00:00Z"),
    });
    expect(data.dateModified).toBe("2026-02-01T12:00:00.000Z");
  });

  it("describes topics, length and the original publication", () => {
    const data = renderSchema({
      ...post,
      tags: ["food", "habits"],
      wordCount: 812,
      readTime: 4,
      originalUrl: "https://easyplantlife.medium.com/default-meals",
    });
    expect(data).toMatchObject({
      keywords: "food, habits",
      wordCount: 812,
      timeRequired: "PT4M",
      sameAs: "https://easyplantlife.medium.com/default-meals",
    });
  });

  it("escapes markup so the data cannot close its script", () => {
    const { container } = render(
      <BlogPostingJsonLd post={{ ...post, title: "</script><b>x</b>" }} />
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(script?.innerHTML).not.toContain("</script>");
    expect(JSON.parse(script?.textContent || "{}").headline).toBe(
      "</script><b>x</b>"
    );
  });

  it("omits the image when the post has none", () => {
    const data = renderSchema({ ...post, thumbnail: undefined });
    expect(data).not.toHaveProperty("image");
  });
});

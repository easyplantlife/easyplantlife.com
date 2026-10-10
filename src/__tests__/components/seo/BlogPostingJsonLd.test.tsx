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
      mainEntityOfPage: "https://easyplantlife.com/blog/default-meals",
      datePublished: "2026-01-15T12:00:00.000Z",
      image: "https://easyplantlife.com/images/blog/default-meals/01.jpeg",
    });
    expect(data.author).toEqual({
      "@type": "Organization",
      name: "Easy Plant Life",
    });
    expect(data.publisher.name).toBe("Easy Plant Life");
  });

  it("omits the image when the post has none", () => {
    const data = renderSchema({ ...post, thumbnail: undefined });
    expect(data).not.toHaveProperty("image");
  });
});

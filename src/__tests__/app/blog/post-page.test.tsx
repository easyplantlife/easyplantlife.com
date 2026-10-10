import { render, screen, within } from "@testing-library/react";
import BlogPostPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from "@/app/blog/[slug]/page";
import { getPostBySlug, getPostSlugs } from "@/lib/blog/posts";
import type { BlogPostContent } from "@/lib/types/blog";

jest.mock("@/lib/blog/posts", () => ({
  getPostBySlug: jest.fn(),
  getPostSlugs: jest.fn(),
}));

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

const notFound = jest.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
jest.mock("next/navigation", () => ({
  notFound: () => notFound(),
}));

const mockGetPostBySlug = getPostBySlug as jest.MockedFunction<
  typeof getPostBySlug
>;
const mockGetPostSlugs = getPostSlugs as jest.MockedFunction<
  typeof getPostSlugs
>;

const post: BlogPostContent = {
  slug: "default-meals",
  title: "Default meals",
  excerpt: "Why a boring default is the whole trick.",
  url: "/blog/default-meals",
  publishedDate: new Date("2026-01-15T12:00:00Z"),
  readTime: 4,
  lead: "The meal you do not have to think about.",
  thumbnail: "/images/blog/default-meals/01.jpeg",
  originalUrl: "https://easyplantlife.medium.com/default-meals-abc123",
  cover: { src: "/images/blog/default-meals/01.jpeg", alt: "A pot" },
  html: "<p>The body of the post.</p>\n<h2>A section</h2>\n",
};

const params = Promise.resolve({ slug: "default-meals" });

async function renderPost() {
  return render(await BlogPostPage({ params }));
}

describe("Blog Post Page", () => {
  beforeEach(() => {
    mockGetPostBySlug.mockReset();
    mockGetPostSlugs.mockReset();
    notFound.mockClear();
    mockGetPostBySlug.mockImplementation((slug) =>
      slug === post.slug ? post : null
    );
    mockGetPostSlugs.mockReturnValue(["default-meals", "good-enough"]);
  });

  describe("Static generation", () => {
    it("pre-renders one page per post", () => {
      expect(generateStaticParams()).toEqual([
        { slug: "default-meals" },
        { slug: "good-enough" },
      ]);
    });

    it("does not render unknown slugs on demand", () => {
      expect(dynamicParams).toBe(false);
    });
  });

  describe("Rendering", () => {
    it("renders the post inside a single main with a single h1", async () => {
      await renderPost();
      expect(screen.getAllByRole("main")).toHaveLength(1);
      const h1s = screen.getAllByRole("heading", { level: 1 });
      expect(h1s).toHaveLength(1);
      expect(h1s[0]).toHaveTextContent("Default meals");
    });

    it("renders the lead, the date line and the body", async () => {
      await renderPost();
      expect(
        screen.getByText("The meal you do not have to think about.")
      ).toBeInTheDocument();
      expect(screen.getByText("January 15, 2026").tagName).toBe("TIME");
      expect(screen.getByText("4 min read")).toBeInTheDocument();
      expect(screen.getByText("The body of the post.")).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 2, name: "A section" })
      ).toBeInTheDocument();
    });

    it("renders the cover at the page content width", async () => {
      await renderPost();
      const main = screen.getByRole("main");
      expect(main.querySelector(".max-w-content")).not.toBeNull();
      expect(main.querySelector(":scope > .max-w-prose")).toBeNull();
      expect(screen.getByRole("img", { name: "A pot" })).toBeInTheDocument();
    });

    it("includes BlogPosting structured data", async () => {
      const { container } = await renderPost();
      const script = container.querySelector(
        'script[type="application/ld+json"]'
      );
      const data = JSON.parse(script?.textContent || "{}");
      expect(data["@type"]).toBe("BlogPosting");
      expect(data.headline).toBe("Default meals");
      expect(data.url).toBe("https://easyplantlife.com/blog/default-meals");
    });

    it("links back to all posts and to the newsletter", async () => {
      await renderPost();
      expect(screen.getByRole("link", { name: "All posts" })).toHaveAttribute(
        "href",
        "/blog"
      );
      const aside = screen.getByRole("complementary", {
        name: "Prefer email?",
      });
      expect(
        within(aside).getByRole("link", { name: "Get the notes" })
      ).toHaveAttribute("href", "/newsletter");
    });

    it("calls notFound for an unknown slug", async () => {
      await expect(
        BlogPostPage({ params: Promise.resolve({ slug: "missing" }) })
      ).rejects.toThrow("NEXT_NOT_FOUND");
      expect(notFound).toHaveBeenCalledTimes(1);
    });
  });

  describe("Metadata", () => {
    it("describes the post for search and social", async () => {
      const metadata = await generateMetadata({ params });
      expect(metadata.title).toBe("Default meals");
      expect(metadata.description).toBe(post.excerpt);
      expect(metadata.openGraph).toMatchObject({
        type: "article",
        url: "/blog/default-meals",
        publishedTime: "2026-01-15T12:00:00.000Z",
        images: [{ url: "/images/blog/default-meals/01.jpeg" }],
      });
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    });

    it("falls back to a plain title for an unknown slug", async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: "missing" }),
      });
      expect(metadata.title).toBe("Post not found");
    });
  });
});

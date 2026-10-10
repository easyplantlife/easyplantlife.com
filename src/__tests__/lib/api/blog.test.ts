import {
  BLOG_FEED_ERROR,
  extractMediumUsername,
  getBlogPosts,
  getMediumUsername,
  toBlogPost,
} from "@/lib/api/blog";
import { fetchMediumPosts, type MediumPost } from "@/lib/api/medium";
import { siteConfig } from "@/content/site";

jest.mock("@/lib/api/medium", () => ({
  fetchMediumPosts: jest.fn(),
}));

const mockFetch = fetchMediumPosts as jest.MockedFunction<
  typeof fetchMediumPosts
>;

const post: MediumPost = {
  id: "abc",
  title: "Default meals",
  excerpt: "A short note.",
  url: "https://medium.com/@easyplantlife/default-meals",
  publishedDate: new Date("2026-01-15"),
  thumbnail: "https://example.com/t.jpg",
};

describe("extractMediumUsername", () => {
  it("reads the @username form", () => {
    expect(extractMediumUsername("https://medium.com/@easyplantlife")).toBe(
      "easyplantlife"
    );
    expect(
      extractMediumUsername("https://medium.com/@easyplantlife/some-post")
    ).toBe("easyplantlife");
  });

  it("reads the subdomain form", () => {
    expect(extractMediumUsername("https://easyplantlife.medium.com")).toBe(
      "easyplantlife"
    );
  });

  it("passes anything else through unchanged", () => {
    expect(extractMediumUsername("easyplantlife")).toBe("easyplantlife");
  });
});

describe("getMediumUsername", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.MEDIUM_PUBLICATION_URL;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("uses MEDIUM_PUBLICATION_URL when set", () => {
    process.env.MEDIUM_PUBLICATION_URL = "https://medium.com/@someone";
    expect(getMediumUsername()).toBe("someone");
  });

  it("falls back to the site default", () => {
    expect(getMediumUsername()).toBe(siteConfig.mediumUsername);
  });
});

describe("toBlogPost", () => {
  it("maps a Medium post to a BlogPost", () => {
    expect(toBlogPost(post)).toEqual({
      title: post.title,
      excerpt: post.excerpt,
      url: post.url,
      publishedDate: post.publishedDate,
      thumbnail: post.thumbnail,
    });
  });
});

describe("getBlogPosts", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("returns mapped posts on success", async () => {
    mockFetch.mockResolvedValue([post]);
    const result = await getBlogPosts({ maxPosts: 3 });
    expect(result.error).toBeUndefined();
    expect(result.posts).toEqual([toBlogPost(post)]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({ maxPosts: 3 })
    );
  });

  it("returns an empty list and a calm error on failure", async () => {
    mockFetch.mockRejectedValue(new Error("boom"));
    const result = await getBlogPosts();
    expect(result).toEqual({ posts: [], error: BLOG_FEED_ERROR });
  });
});

import type { MetadataRoute } from "next";
import { books } from "@/content/books";
import { getAllPosts } from "@/lib/blog/posts";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  const allPosts = getAllPosts();

  const posts: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: absoluteUrl(post.url),
    lastModified: post.updatedDate ?? post.publishedDate,
    changeFrequency: "yearly",
    priority: 0.7,
    ...(post.thumbnail ? { images: [absoluteUrl(post.thumbnail)] } : {}),
  }));

  // The blog and the home page change when a post is published.
  const latestPost = allPosts[0]?.publishedDate ?? currentDate;

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/books"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
      images: books.map((book) => absoluteUrl(book.coverImage)),
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/newsletter"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...posts,
  ];
}

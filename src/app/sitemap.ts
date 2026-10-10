import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/posts";

const BASE_URL = "https://easyplantlife.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE_URL}${post.url}`,
    lastModified: post.publishedDate,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/books`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/newsletter`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...posts,
  ];
}

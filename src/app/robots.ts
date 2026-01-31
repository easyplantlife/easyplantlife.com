import type { MetadataRoute } from "next";

const BASE_URL = "https://easyplantlife.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dev/", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

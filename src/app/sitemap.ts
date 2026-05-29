import type { MetadataRoute } from "next";
import { landingPages } from "@/data/landingPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://scholardrill.com.au";
  const now = new Date();
  const staticRoutes = [
    "",
    "/auth",
    "/practice",
    "/dashboard",
    "/coach",
    "/naplan",
    "/naplan/simulator",
    "/journey",
    "/info/about",
    "/info/blog",
    "/info/careers",
    "/info/contact",
    "/info/pricing",
    "/info/privacy",
    "/info/terms",
    "/info/refund",
  ];

  const landingRoutes = landingPages.map((page) => `/lp/${page.slug}`);

  return [...staticRoutes, ...landingRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}

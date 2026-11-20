import type { MetadataRoute } from "next";
import { storeConfig } from "@/data/store-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/carrinho"] }],
    sitemap: `${storeConfig.siteUrl}/sitemap.xml`,
  };
}

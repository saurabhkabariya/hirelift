import { MetadataRoute } from "next";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/dashboard/"], // hide sensitive areas
    },
    sitemap: "https://hirelift.vercel.app/sitemap.xml",
  };
}

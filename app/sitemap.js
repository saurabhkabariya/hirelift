export default function sitemap() {
  const baseUrl = "https://hirelift.vercel.app";

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/audit`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/company-search`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

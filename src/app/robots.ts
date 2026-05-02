import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // IMPORTANT: Don't hardcode the canonical host.
  // When the custom domain isn't live yet, point robots/sitemap at the deployed host.
  // Once DNS is ready, set NEXT_PUBLIC_SITE_URL to your primary domain.
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://aiphotos.icu");
  
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

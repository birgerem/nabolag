// ============================================================
// robots.ts – Forteller søkemotorer hva de kan indeksere
// Blokkerer /admin og /login (private sider)
// ============================================================

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/login", "/login/"],
      },
    ],
    sitemap: "https://www.nabolagshjelpen.com/sitemap.xml",
  };
}

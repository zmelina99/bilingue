import type { MetadataRoute } from "next";
import { locales } from "@/lib/locales";
import { languageAlternates, pagePaths, siteUrl } from "@/lib/site";

// One entry per page and locale, each listing all its language versions.
export default function sitemap(): MetadataRoute.Sitemap {
  return pagePaths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${siteUrl}/${lang}${path}`,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}

import type { Metadata } from "next";
import { defaultLocale, locales } from "./locales";

// Public origin used for canonical, hreflang and sitemap URLs. Set
// NEXT_PUBLIC_SITE_URL per environment; the fallback is the domain named in the
// manuscript (AGB: www.bilingue.ch).
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bilingue.ch"
).replace(/\/$/, "");

// Indexing is opt-in: only the production deployment sets SITE_INDEXING=true.
// Local builds and preview deployments stay noindex and disallowed in robots.txt.
export const isIndexable = process.env.SITE_INDEXING === "true";

// Every page exists under the same path in each locale ("" = home).
export const pagePaths = ["", "/courses", "/editing", "/terms"] as const;
export type PagePath = (typeof pagePaths)[number];

// Reciprocal hreflang set (+ x-default → German) for one page.
export const languageAlternates = (path: PagePath) => ({
  ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
  "x-default": `${siteUrl}/${defaultLocale}${path}`,
});

export const alternatesFor = (
  lang: string,
  path: PagePath,
): Metadata["alternates"] => ({
  canonical: `${siteUrl}/${lang}${path}`,
  languages: languageAlternates(path),
});

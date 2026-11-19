import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import type fr from "@/dictionaries/fr.json";
import { hasLocale, type Locale } from "./locales";

// fr.json defines the shape; de.json and en.json must match it.
export type Dictionary = typeof fr;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default),
  de: () => import("@/dictionaries/de.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}

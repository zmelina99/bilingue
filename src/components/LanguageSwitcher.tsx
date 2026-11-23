"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/locales";

type Props = {
  current: Locale;
  label: string;
  names: Record<Locale, string>;
};

export default function LanguageSwitcher({ current, label, names }: Props) {
  const pathname = usePathname();

  // Keep the current page, swap only the locale prefix: /fr/courses -> /de/courses
  const hrefFor = (locale: Locale) =>
    pathname.replace(/^\/[^/]+/, `/${locale}`);

  return (
    <nav aria-label={label} className="language-switcher">
      <ul className="flex items-center gap-2 text-sm language-switcher__list">
        {locales.map((locale, i) => (
          <li key={locale} className="flex items-center gap-2 language-switcher__item">
            {i > 0 && (
              <span aria-hidden className="text-secondary language-switcher__separator">
                |
              </span>
            )}
            <Link
              href={hrefFor(locale)}
              lang={locale}
              hrefLang={locale}
              title={names[locale]}
              aria-current={locale === current ? "true" : undefined}
              className={`rounded px-1 py-1 uppercase tracking-wide transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground language-switcher__link ${
                locale === current ? "font-bold language-switcher__link--active" : "text-secondary"
              }`}
            >
              {locale}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import Link from "next/link";
import Logo from "@/components/Logo";
import { brand } from "@/data/business";
import { getDictionary, getLocale } from "@/lib/dictionaries";

const link =
  "rounded py-1 transition-colors duration-200 hover:text-primary-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

export default async function Footer() {
  const lang = await getLocale();
  const { header, common, footer } = await getDictionary();

  const links = [
    { href: `/${lang}/courses`, label: header.nav.courses },
    { href: `/${lang}/editing`, label: header.nav.editing },
  ];

  return (
    <footer className="bg-background">
      <div className="page-x flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-8">
        <Logo />
        <nav aria-label={footer.navLabel}>
          <ul className="flex gap-6 text-sm">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={link}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-foreground/10">
        <div className="page-x flex flex-wrap items-center justify-between gap-x-10 gap-y-2 py-4 pr-20 text-xs text-secondary">
          <p>
            © {brand.name} · {brand.descriptor}
          </p>
          <Link href={`/${lang}/terms`} className={link}>
            {common.termsSubtitle}
          </Link>
        </div>
      </div>
    </footer>
  );
}

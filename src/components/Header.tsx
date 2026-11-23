import ButtonLink from "@/components/ButtonLink";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";
import MainNav from "@/components/MainNav";
import MobileMenu from "@/components/MobileMenu";
import { getDictionary, getLocale } from "@/lib/dictionaries";

// One header for every page. `contactHref` defaults to the #contact section
// present at the end of each service page; the landing page passes a mailto.
export default async function Header({
  contactHref = "#contact",
  className = "bg-background/90",
}: {
  contactHref?: string;
  className?: string;
}) {
  const lang = await getLocale();
  const { header, common } = await getDictionary();
  const items = [
    { href: `/${lang}/courses`, label: header.nav.courses },
    { href: `/${lang}/editing`, label: header.nav.editing },
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b border-foreground/10 backdrop-blur-md header ${className}`}
    >
      <div className="page-x relative grid h-16 grid-cols-[1fr_auto] items-center gap-x-4 md:grid-cols-[auto_1fr_auto] lg:gap-x-6 header__inner">
        <Logo className="header__logo" />
        <div className="hidden justify-self-center md:block header__nav">
          <MainNav label={header.nav.label} items={items} />
        </div>
        <div className="flex items-center gap-4 md:gap-6 header__actions">
          <LanguageSwitcher
            current={lang}
            label={header.languageSwitcher}
            names={header.languages}
          />
          <span className="hidden md:block header__contact">
            <ButtonLink href={contactHref} size="sm" className="header__contact-button">
              {common.contact}
            </ButtonLink>
          </span>
          <MobileMenu
            label={header.menu}
            items={items}
            contact={{ href: contactHref, label: common.contact }}
          />
        </div>
      </div>
    </header>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import ArrowLink from "@/components/ArrowLink";
import ButtonLink from "@/components/ButtonLink";
import Header from "@/components/Header";
import library from "@/assets/art/library.jpg";
import { brand, contact, whatsappHref } from "@/data/business";
import { getDictionary, getLocale } from "@/lib/dictionaries";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { meta } = await getDictionary();

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: alternatesFor(lang, ""),
    openGraph: { title: meta.title, description: meta.description },
  };
}

// One-screen landing page: a single choice between the two halves of the business.
export default async function Home() {
  const lang = await getLocale();
  const { hero, header, cta, whatsapp } = await getDictionary();

  return (
    <div className="flex min-h-dvh flex-col bg-surface home">
      <Header className="bg-surface home__header" />
      <main className="relative isolate flex flex-1 flex-col overflow-hidden home__main">
        <section className="page-x grid-page flex-1 items-center py-6 sm:py-8 home__hero">
          {/* Phones: title, service choices, artwork, then the longer text.
              From md up the order is title, text, choices (see `order-*`). */}
          <div className="flex flex-col md:col-span-6 home__content">
            <p className="eyebrow order-1 text-base sm:text-xl home__eyebrow">{brand.owner}</p>
            <h1 className="order-2 mt-2 text-[1.75rem] leading-[1.1] font-semibold tracking-tight text-balance sm:mt-3 sm:text-4xl lg:text-5xl 2xl:text-6xl home__title">
              {hero.title}{" "}
              <span className="text-primary-800 home__title-accent">{hero.accent}</span>
            </h1>

            <div className="order-3 mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4 md:order-5 md:mt-10 home__actions">
              <ButtonLink href={`/${lang}/courses`} size="lg" arrow className="home__action home__action--courses">
                {header.nav.courses}
              </ButtonLink>
              <ButtonLink href={`/${lang}/editing`} variant="outline" size="lg" arrow className="home__action home__action--editing">
                {header.nav.editing}
              </ButtonLink>
            </div>

            <figure
              className="motion-safe:animate-hero-in order-4 mt-6 md:hidden home__figure home__figure--mobile"
            >
              <Image
                src={library}
                alt={hero.imageAlt}
                loading="eager"
                fetchPriority="high"
                // Hidden from md up: request only a tiny variant there.
                sizes="(min-width: 768px) 16px, 100vw"
                className="h-auto w-full object-contain rounded-lg home__image"
              />
            </figure>

            <p className="order-5 mt-5 max-w-xl text-sm leading-relaxed text-foreground/70 sm:mt-6 sm:text-lg md:order-4 home__body">
              {hero.body}
            </p>
            <p className="order-6 mt-4 text-sm sm:text-base md:order-4 home__contact-cta">
              <ArrowLink href="#contact" className="font-normal">
                {cta.contactDanielle}
              </ArrowLink>
            </p>
          </div>

          <figure
            className="motion-safe:animate-hero-in hidden md:col-span-5 md:col-start-8 md:block home__figure home__figure--desktop"
          >
            <div className="relative h-[min(56dvh,32rem)] overflow-hidden home__figure-frame">
              <Image
                src={library}
                alt={hero.imageAlt}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 768px) 45vw, 16px"
                className="object-cover object-[60%_50%] rounded-lg home__image"
              />
            </div>
            <figcaption className="mt-3 text-xs text-secondary home__caption">
              Enrique Serra · El artículo de fondo
            </figcaption>
          </figure>
        </section>

        {/* Target of "Kontakt" and "Danielle kontaktieren" on this page. */}
        <p
          id="contact"
          className="page-x scroll-mt-20 py-3 pr-24 text-xs text-secondary sm:py-4 md:pr-28 home__contact"
        >
          <a
            href={`mailto:${contact.email}`}
            className="link-underline hover:text-primary-800 home__contact-link home__contact-link--email"
          >
            {contact.email}
          </a>
          {" · "}
          <a
            href={contact.phoneHref}
            className="link-underline hover:text-primary-800 home__contact-link home__contact-link--phone"
          >
            {contact.phone}
          </a>
          {" · "}
          <a
            href={contact.mobileHref}
            className="link-underline hover:text-primary-800 home__contact-link home__contact-link--mobile"
          >
            {contact.mobile}
          </a>
          {" · "}
          <a
            href={whatsappHref(whatsapp.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline hover:text-primary-800 home__contact-link home__contact-link--whatsapp"
          >
            {whatsapp.label}
          </a>
        </p>
      </main>
    </div>
  );
}

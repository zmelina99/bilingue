import type { Metadata } from "next";
import Image from "next/image";
import ButtonLink from "@/components/ButtonLink";
import Header from "@/components/Header";
import library from "@/assets/art/library.jpg";
import { brand, contact } from "@/data/business";
import { getDictionary, getLocale } from "@/lib/dictionaries";
import { locales } from "@/lib/locales";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { meta } = await getDictionary();

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: { title: meta.title, description: meta.description },
  };
}

// One-screen landing page: a single choice between the two halves of the business.
export default async function Home() {
  const lang = await getLocale();
  const { hero, header } = await getDictionary();

  return (
    <div className="flex min-h-dvh flex-col bg-surface home">
      <Header
        contactHref={`mailto:${contact.email}`}
        className="bg-surface/90 home__header"
      />
      <main className="relative isolate flex flex-1 flex-col overflow-hidden home__main">
        <section className="page-x grid-page flex-1 items-center py-5 sm:py-6 home__hero">
          <div className="md:col-span-6 home__content">
            <p className="motion-safe:animate-fade-up eyebrow home__eyebrow">{brand.owner}</p>
            <h1
              className="motion-safe:animate-fade-up mt-3 text-[1.75rem] leading-[1.1] font-semibold tracking-tight sm:text-4xl lg:text-5xl 2xl:text-6xl home__title"
              style={{ animationDelay: "80ms" }}
            >
              {hero.title}{" "}
              <span className="text-primary-800 home__title-accent">{hero.accent}</span>
            </h1>

            {/* Phones: the artwork as a real part of the first screen, shown at
                its natural ratio between the headline and the supporting text. */}
            <figure
              className="motion-safe:animate-fade-up mt-5 md:hidden home__figure home__figure--mobile"
              style={{ animationDelay: "160ms" }}
            >
              <Image
                src={library}
                alt={hero.imageAlt}
                priority
                sizes="100vw"
                className="h-auto w-full object-contain rounded-lg home__image"
              />
            </figure>

            <p
              className="motion-safe:animate-fade-up mt-5 max-w-xl text-sm leading-normal text-foreground/70 sm:mt-6 sm:text-lg sm:leading-relaxed home__body"
              style={{ animationDelay: "160ms" }}
            >
              {hero.body}
            </p>
            <div
              className="motion-safe:animate-fade-up mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4 home__actions"
              style={{ animationDelay: "240ms" }}
            >
              <ButtonLink href={`/${lang}/courses`} size="lg" className="home__action home__action--courses">
                {header.nav.courses}
              </ButtonLink>
              <ButtonLink href={`/${lang}/editing`} variant="outline" size="lg" className="home__action home__action--editing">
                {header.nav.editing}
              </ButtonLink>
            </div>
          </div>

          <figure
            className="motion-safe:animate-fade-up hidden md:col-span-5 md:col-start-8 md:block home__figure home__figure--desktop"
            style={{ animationDelay: "320ms" }}
          >
            <div className="relative h-[min(56dvh,32rem)] overflow-hidden home__figure-frame">
              <Image
                src={library}
                alt={hero.imageAlt}
                fill
                priority
                sizes="(min-width: 768px) 45vw, 0px"
                className="object-cover object-[60%_50%] rounded-lg home__image"
              />
            </div>
            <figcaption className="mt-3 text-xs text-secondary home__caption">
              Enrique Serra · El artículo de fondo
            </figcaption>
          </figure>
        </section>

        <p className="page-x py-3 text-xs text-secondary sm:py-4 home__contact">
          <a
            href={`mailto:${contact.email}`}
            className="hover:text-primary-800 hover:underline home__contact-link home__contact-link--email"
          >
            {contact.email}
          </a>
          {" · "}
          <a
            href={contact.phoneHref}
            className="hover:text-primary-800 hover:underline home__contact-link home__contact-link--phone"
          >
            {contact.phone}
          </a>
          {" · "}
          <a
            href={contact.mobileHref}
            className="hover:text-primary-800 hover:underline home__contact-link home__contact-link--mobile"
          >
            {contact.mobile}
          </a>
        </p>
      </main>
    </div>
  );
}

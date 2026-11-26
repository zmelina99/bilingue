import type { Metadata } from "next";
import Image from "next/image";
import ArrowLink from "@/components/ArrowLink";
import ButtonLink from "@/components/ButtonLink";
import Header from "@/components/Header";
import library from "@/assets/art/library.jpg";
import { brand } from "@/data/business";
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
  const { hero, header, cta, contactForm } = await getDictionary();

  return (
    <div className="flex min-h-dvh flex-col bg-surface home">
      <Header contactHref={`/${lang}/courses#contact`} className="bg-surface home__header" />
      <main className="relative isolate flex flex-1 flex-col overflow-hidden home__main">
        <section className="page-x grid-page flex-1 content-start items-center py-6 max-md:gap-y-0 sm:py-8 md:content-center home__hero">
          {/* Phones: title, service choices, artwork, then the longer text.
              From md up the order is title, text, choices (see `order-*`).
              Below md this wrapper is display: contents, so its children and
              the single artwork <figure> share one column ordered by `order-*`. */}
          <div className="flex flex-col max-md:contents md:col-span-6 home__content">
            <p className="eyebrow order-1 text-base text-primary-800 sm:text-xl home__eyebrow">
              {brand.owner}
            </p>
            <h1 className="order-2 mt-2 text-[1.75rem] leading-[1.1] font-semibold tracking-tight text-balance sm:mt-3 sm:text-4xl lg:text-5xl 2xl:text-6xl home__title">
              {hero.title}{" "}
              <span className="text-primary-800 home__title-accent">
                {hero.accent}
              </span>
            </h1>

            <div className="order-3 mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4 md:order-5 md:mt-10 home__actions">
              <ButtonLink
                href={`/${lang}/courses`}
                size="lg"
                arrow
                className="home__action home__action--courses"
              >
                {header.nav.courses}
              </ButtonLink>
              <ButtonLink
                href={`/${lang}/editing`}
                variant="outline"
                size="lg"
                arrow
                className="home__action home__action--editing"
              >
                {header.nav.editing}
              </ButtonLink>
            </div>

            <p className="order-5 mt-5 max-w-xl text-base leading-relaxed text-foreground/80 sm:mt-6 sm:text-lg md:order-4 home__body">
              {hero.body}
            </p>
            <p className="order-6 mt-4 text-sm sm:text-base md:order-4 home__contact-cta">
              <ArrowLink href={`/${lang}/courses#contact`} className="font-normal">
                {cta.contactDanielle}
              </ArrowLink>
            </p>
          </div>

          {/* One artwork for every width (one download): natural aspect on
              phones, a cropped frame beside the text from md up. */}
          <figure className="motion-safe:animate-hero-in order-4 mt-6 md:col-span-5 md:col-start-8 md:mt-0 home__figure">
            <div className="relative aspect-[1245/890] overflow-hidden rounded-lg md:aspect-auto md:h-[min(56dvh,32rem)] home__figure-frame">
              <Image
                src={library}
                alt={hero.imageAlt}
                fill
                preload
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover object-[60%_50%] home__image"
              />
            </div>
            <figcaption className="mt-3 hidden text-xs text-secondary md:block home__caption">
              Enrique Serra · El artículo de fondo
            </figcaption>
          </figure>
        </section>
      </main>
    </div>
  );
}

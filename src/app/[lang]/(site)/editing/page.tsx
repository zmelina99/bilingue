import type { Metadata } from "next";
import Image from "next/image";
import Clients from "@/components/Clients";
import ArrowLink from "@/components/ArrowLink";
import ButtonLink from "@/components/ButtonLink";
import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import PortraitSection from "@/components/PortraitSection";
import RatesList from "@/components/RatesList";
import Section from "@/components/Section";
import ServiceList from "@/components/ServiceList";
import heroArt from "@/assets/art/Thomas_Wilmer_Dewing_-_A_Reading_-_1897.jpg";
import servicesArt from "@/assets/art/mucha-reading.jpg";
import {
  allClients,
  brand,
  featuredClientIds,
  featuredClients,
} from "@/data/business";
import { getDictionary, getLocale } from "@/lib/dictionaries";
import { slugify } from "@/lib/slug";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { header, editing } = await getDictionary();

  return {
    title: header.nav.editing,
    description: editing.meta.description,
    alternates: alternatesFor(lang, "/editing"),
    openGraph: {
      title: header.nav.editing,
      description: editing.meta.description,
    },
  };
}

export default async function EditingPage() {
  const { header, editing, cta } = await getDictionary();
  const { clients: clientsText, services, rates } = editing;

  return (
    <main className="flex flex-1 flex-col editing">
      <Hero
        eyebrow={brand.name}
        title={header.nav.editing}
        image={heroArt}
        imageAlt={editing.imageAlt}
        imageClassName="object-[50%_50%]"
        actions={
          <ButtonLink href="#contact" size="lg" arrow className="editing__contact-button">
            {cta.requestEditing}
          </ButtonLink>
        }
        strip={services.items.map(({ title }) => ({
          label: title,
          href: `#${slugify(title)}`,
        }))}
      />

      <PortraitSection />

      <Section id="services" title={services.title} alignment="center" tone="surface">
        <div className="grid-page items-start editing__services">
          <div className="md:col-span-8 editing__services-list">
            <ServiceList
              items={services.items}
              className="sm:grid-cols-2 editing__service-list"
            />
          </div>
          <figure className="hidden md:block md:col-span-4 md:col-start-10 editing__figure">
            <Image
              src={servicesArt}
              alt={services.imageAlt}
              sizes="(min-width: 768px) 33vw, 100vw"
              className="mx-auto h-auto w-full max-w-[18rem] rounded-2xl md:max-w-none editing__image"
            />
          </figure>
        </div>
        {/* Trust proof sits directly under the services it supports. */}
        <div
          id="clients"
          className="mt-12 scroll-mt-24  pt-10 md:mt-16 editing__clients"
        >
          <Clients
            heading={clientsText.title}
            featured={featuredClients}
            others={allClients.filter(
              (c) => !(featuredClientIds as readonly string[]).includes(c.id),
            )}
            showAllLabel={clientsText.showAll}
            showLessLabel={clientsText.showLess}
            externalLabel={clientsText.external}
          />
        </div>
      </Section>

      <Section
        id="rates"
        title={rates.title}
        flip
        aside={<RatesList rows={rates.rows} />}
      >
        <p className="font-sans max-md:leading-[1.6] editing__rates-intro">{rates.intro}</p>
        <p className="font-sans text-sm max-md:leading-[1.6] editing__rates-note">{rates.note}</p>
        <p className="editing__rates-cta">
          <ArrowLink href="#contact">{cta.requestEditing}</ArrowLink>
        </p>
      </Section>

      <ContactSection inquiryLabel={cta.requestEditing} defaultService="editing" />
    </main>
  );
}

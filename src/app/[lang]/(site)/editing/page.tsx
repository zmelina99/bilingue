import type { Metadata } from "next";
import Image from "next/image";
import Clients from "@/components/Clients";
import ContactButton from "@/components/ContactButton";
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
import { locales } from "@/lib/locales";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { header, editing } = await getDictionary();

  return {
    title: header.nav.editing,
    description: editing.meta.description,
    alternates: {
      canonical: `/${lang}/editing`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/editing`])),
    },
    openGraph: {
      title: header.nav.editing,
      description: editing.meta.description,
    },
  };
}

export default async function EditingPage() {
  const { header, common, editing } = await getDictionary();
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
          <ContactButton className="editing__contact-button">
            {common.contact}
          </ContactButton>
        }
        strip={services.items.map(({ title }) => ({
          label: title,
          href: `#${slugify(title)}`,
        }))}
      />

      <PortraitSection />

      <section
        id="clients"
        className="scroll-mt-16 bg-surface editing__clients"
      >
        <div className="page-x py-8 md:py-10 editing__clients-inner">
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
      </section>

      <Section id="services" title={services.title} alignment="center">
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
      </Section>

      <Section
        id="rates"
        title={rates.title}
        tone="surface"
        aside={<RatesList rows={rates.rows} />}
      >
        <p className="font-sans max-md:leading-[1.6] editing__rates-intro">{rates.intro}</p>
        <p className="font-sans text-sm max-md:leading-[1.6] editing__rates-note">{rates.note}</p>
      </Section>

      <ContactSection />
    </main>
  );
}

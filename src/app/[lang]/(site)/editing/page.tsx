import type { Metadata } from "next";
import Clients from "@/components/Clients";
import ContactButton from "@/components/ContactButton";
import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import PortraitSection from "@/components/PortraitSection";
import RatesList from "@/components/RatesList";
import Section from "@/components/Section";
import ServiceList from "@/components/ServiceList";
import chapbook from "@/assets/art/chapbook.jpg";
import { brand, clients, featuredClients } from "@/data/business";
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
  const { clients: clientsText, services, rates, terms } = editing;

  return (
    <main className="flex flex-1 flex-col">
      <Hero
        eyebrow={brand.name}
        title={header.nav.editing}
        image={chapbook}
        imageAlt={editing.imageAlt}
        imageClassName="object-[50%_50%]"
        actions={<ContactButton>{common.contact}</ContactButton>}
        strip={services.items.map(({ title }) => ({
          label: title,
          href: `#${slugify(title)}`,
        }))}
      />

      <PortraitSection />

      <Section
        id="clients"
        title={clientsText.title}
        eyebrow={clientsText.subtitle}
        tone="surface"
        tight
      >
        <Clients
          featured={featuredClients.map((f) => ({
            ...clients.find((c) => c.name === f.name)!,
            ...f,
          }))}
          others={clients.filter(
            (c) => !featuredClients.some((f) => f.name === c.name),
          )}
          showAllLabel={clientsText.showAll}
          showLessLabel={clientsText.showLess}
          externalLabel={clientsText.external}
        />
      </Section>

      <Section id="services" title={services.title}>
        <ServiceList items={services.items} className="md:grid-cols-2" />
      </Section>

      <Section
        id="rates"
        title={rates.title}
        tone="surface"
        aside={<RatesList rows={rates.rows} />}
      >
        <p>{rates.intro}</p>
        <p className="text-sm">{rates.note}</p>
      </Section>

      <Section
        id="terms"
        title={terms.title}
        collapsible={{ subtitle: common.termsSubtitle }}
      >
        <ol className="max-w-3xl list-decimal space-y-4 pl-6 text-foreground/70 marker:font-bold marker:text-primary-800">
          {terms.items.map((item) => (
            <li key={item} className="pl-2">
              {item}
            </li>
          ))}
        </ol>
      </Section>

      <ContactSection />
    </main>
  );
}

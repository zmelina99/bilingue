import type { Metadata } from "next";
import ContactButton from "@/components/ContactButton";
import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import PortraitSection from "@/components/PortraitSection";
import RatesList from "@/components/RatesList";
import Section from "@/components/Section";
import ServiceList from "@/components/ServiceList";
import reading from "@/assets/art/reading.jpg";
import { brand } from "@/data/business";
import { getDictionary, getLocale } from "@/lib/dictionaries";
import { slugify } from "@/lib/slug";
import { locales } from "@/lib/locales";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { header, courses } = await getDictionary();

  return {
    title: header.nav.courses,
    description: courses.meta.description,
    alternates: {
      canonical: `/${lang}/courses`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/courses`])),
    },
    openGraph: {
      title: header.nav.courses,
      description: courses.meta.description,
    },
  };
}

export default async function CoursesPage() {
  const { header, common, courses } = await getDictionary();
  const { offer, rates, terms } = courses;

  return (
    <main className="flex flex-1 flex-col">
      <Hero
        eyebrow={brand.name}
        title={header.nav.courses}
        image={reading}
        imageAlt={courses.imageAlt}
        actions={<ContactButton>{common.contact}</ContactButton>}
        strip={offer.items.map(({ title }) => ({
          label: title,
          href: `#${slugify(title)}`,
        }))}
      />

      <PortraitSection />

      <Section id="offer" title={offer.title} tone="surface">
        <ServiceList items={offer.items} className="md:grid-cols-3" />
      </Section>

      <Section
        id="rates"
        title={rates.title}
        aside={<RatesList rows={rates.rows} />}
      >
        <p>{rates.intro}</p>
        <p className="text-sm">{rates.note}</p>
      </Section>

      <Section
        id="terms"
        title={terms.title}
        tone="surface"
        collapsible={{ subtitle: common.termsSubtitle }}
      >
        <p className="text-foreground/70">{terms.pending}</p>
      </Section>

      <ContactSection />
    </main>
  );
}

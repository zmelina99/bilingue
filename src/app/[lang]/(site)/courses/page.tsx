import type { Metadata } from "next";
import ArrowLink from "@/components/ArrowLink";
import ButtonLink from "@/components/ButtonLink";
import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import PortraitSection from "@/components/PortraitSection";
import RatesList from "@/components/RatesList";
import Section from "@/components/Section";
import ServiceList from "@/components/ServiceList";
import heroArt from "@/assets/art/SAAM-1971.170_1.jpg";
import deutschArt from "@/assets/art/ancher-reading.jpg";
import franzoesischArt from "@/assets/art/chapbook.jpg";
import konversationArt from "@/assets/art/tea-conversation.jpg";
import { brand } from "@/data/business";
import { getDictionary, getLocale } from "@/lib/dictionaries";
import { slugify } from "@/lib/slug";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { header, courses } = await getDictionary();

  return {
    title: header.nav.courses,
    description: courses.meta.description,
    alternates: alternatesFor(lang, "/courses"),
    openGraph: {
      title: header.nav.courses,
      description: courses.meta.description,
    },
  };
}

export default async function CoursesPage() {
  const { header, common, courses, cta } = await getDictionary();
  const { offer, rates } = courses;

  // Artwork per service, in the dictionary's item order
  // (German lessons, French lessons, conversation courses).
  const offerArt = [deutschArt, franzoesischArt, konversationArt];
  const offerItems = offer.items.map((item, i) => ({
    ...item,
    image: offerArt[i],
  }));

  return (
    <main className="flex flex-1 flex-col courses">
      <Hero
        eyebrow={brand.name}
        title={header.nav.courses}
        image={heroArt}
        imageAlt={courses.imageAlt}
        actions={
          <ButtonLink href="#contact-form" size="lg" arrow className="courses__contact-button">
            {cta.requestLessons}
          </ButtonLink>
        }
        strip={offer.items.map(({ title }) => ({
          label: title,
          href: `#${slugify(title)}`,
        }))}
      />

      <Section id="offer" title={offer.title} tone="surface">
        <ServiceList
          items={offerItems}
          learnMoreLabel={common.learnMore}
          modal={{
            label: header.nav.courses,
            questionsTitle: offer.modal.questionsTitle,
            cta: offer.modal.cta,
            inquiryLabel: cta.requestLessons,
            closeLabel: common.close,
          }}
          className="md:grid-cols-3 courses__services"
        />
      </Section>

      <PortraitSection />

      <Section
        id="rates"
        title={rates.title}
        tone="surface"
        aside={<RatesList rows={rates.rows} />}
      >
        <p className="font-sans max-md:leading-[1.6] courses__rates-intro">{rates.intro}</p>
        <p className="font-sans text-sm max-md:leading-[1.6] courses__rates-note">{rates.note}</p>
        <p className="courses__rates-cta">
          <ArrowLink href="#contact-form">{cta.requestLessons}</ArrowLink>
        </p>
      </Section>

      <ContactSection inquiryLabel={cta.requestLessons} defaultService="coaching" />
    </main>
  );
}

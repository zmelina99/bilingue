import type { Metadata } from "next";
import Section from "@/components/Section";
import { brand } from "@/data/business";
import { getDictionary, getLocale } from "@/lib/dictionaries";
import { alternatesFor } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLocale();
  const { common } = await getDictionary();

  return {
    title: common.termsSubtitle,
    alternates: alternatesFor(lang, "/terms"),
    openGraph: {
      title: common.termsSubtitle,
    },
  };
}

export default async function TermsPage() {
  const { common, editing } = await getDictionary();
  const { terms } = editing;

  return (
    <main className="flex flex-1 flex-col terms">
      <Section id="terms" title={common.termsSubtitle} eyebrow={brand.name}>
        <ol className="max-w-3xl list-decimal space-y-4 pl-6 text-foreground/70 marker:font-bold marker:text-primary-800 terms__list">
          {terms.items.map((item) => (
            <li key={item} className="pl-2 terms__item">
              {item}
            </li>
          ))}
        </ol>
      </Section>
    </main>
  );
}


import Image from "next/image";
import lake from "@/assets/art/lake.jpg";
import ButtonLink from "@/components/ButtonLink";
import { brand, contact } from "@/data/business";
import { getDictionary } from "@/lib/dictionaries";

const label =
  "text-[0.6875rem] font-bold tracking-[0.2em] text-secondary uppercase";

const value =
  "link-underline text-xl hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

// Identical on every page; target of all "Contact" buttons.
export default async function ContactSection({
  inquiryLabel,
}: {
  /** Short CTA label (e.g. "Unterricht anfragen"); falls back to the email address. */
  inquiryLabel?: string;
}) {
  const { contact: t } = await getDictionary();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-16 contact"
    >
      <div className="relative isolate flex min-h-[26rem] items-end overflow-hidden md:min-h-[33.75rem] contact__banner">
        <Image
          src={lake}
          alt={t.imageAlt}
          fill
          sizes="100vw"
          className="-z-10 object-cover object-[50%_40%] contact__image"
        />

        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-tr from-primary-950/80 via-primary-950/25 to-transparent contact__overlay"
        />

        <div className="page-x pt-24 pb-12 text-white md:pb-20 contact__content">
          <p
            id="contact-title"
            className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-white/80 contact__title"
          >
            {t.title}
          </p>

          <p className="mt-5 max-w-[750px] font-title text-[2rem] leading-[1.3] md:text-[2.375rem] contact__body">
            {t.body}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 contact__signoff">
            <p className="font-title text-2xl italic text-white/90 contact__signature">
              {brand.owner}
            </p>
            <ButtonLink
              href={`mailto:${contact.email}`}
              variant="light"
              size="lg"
              arrow
              className="max-w-full break-all contact__cta"
            >
              {inquiryLabel ?? contact.email}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="bg-surface contact__details">
        <dl className="page-x grid grid-cols-1 gap-x-8 gap-y-8 py-10 sm:grid-cols-2 lg:grid-cols-4 contact__list">
          <div className="text-left contact__item contact__item--address">
            <dt className={`${label} contact__label`}>
              {t.labels.address}
            </dt>

            <dd className="mt-2 contact__definition">
              <address className="text-xl leading-snug not-italic contact__address">
                {contact.name}
                <br />
                {contact.street} · {contact.city}
              </address>
            </dd>
          </div>

          <div className="text-left contact__item contact__item--email">
            <dt className={`${label} contact__label`}>
              {t.labels.email}
            </dt>

            <dd className="mt-2 contact__definition">
              <a
                href={`mailto:${contact.email}`}
                className={`${value} contact__link`}
              >
                {contact.email}
              </a>
            </dd>
          </div>

          <div className="text-left contact__item contact__item--phone">
            <dt className={`${label} contact__label`}>
              {t.labels.phone}
            </dt>

            <dd className="mt-2 contact__definition">
              <a
                href={contact.phoneHref}
                className={`${value} contact__link`}
              >
                {contact.phone}
              </a>
            </dd>
          </div>

          <div className="text-left contact__item contact__item--mobile">
            <dt className={`${label} contact__label`}>
              {t.labels.mobile}
            </dt>

            <dd className="mt-2 contact__definition">
              <a
                href={contact.mobileHref}
                className={`${value} contact__link`}
              >
                {contact.mobile}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

import Image from "next/image";
import lake from "@/assets/art/lake.jpg";
import ContactDetails from "@/components/ContactDetails";
import ContactForm from "@/components/ContactForm";
import { brand, contact } from "@/data/business";
import type { Service } from "@/lib/contact-form";
import { getDictionary, getLocale } from "@/lib/dictionaries";
import { CONTACT_SECTION_ID } from "@/lib/contact-anchor";

// Identical on every service page. All contact CTAs point to this whole
// section (#contact); ContactForm scrolls to it and focuses it. The negative
// scroll margin (banner pt-24 − 4rem header − 1.5rem gap) stops the scroll just
// above the "Kontakt" label instead of at the top of the lake image.
export default async function ContactSection({
  inquiryLabel,
  defaultService,
}: {
  /** Short CTA label (e.g. "Unterricht anfragen"); falls back to the email address. */
  inquiryLabel?: string;
  /** Service preselected in the form; omit to leave it unselected. */
  defaultService?: Service;
}) {
  const [lang, { contact: t, contactForm }] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);

  return (
    <section
      id={CONTACT_SECTION_ID}
      tabIndex={-1}
      aria-labelledby="contact-title"
      className="-scroll-mt-1 outline-none contact"
    >
      {/* Compact introduction to the form below. */}
      <div className="relative isolate flex min-h-[27rem] items-start pt-24 overflow-hidden md:min-h-[28rem] contact__banner">
        <Image
          src={lake}
          alt={t.imageAlt}
          fill
          sizes="100vw"
          className="-z-10 object-cover object-[50%_40%] contact__image"
        />

        {/* Dark overlay: strongest behind the text, tapering out toward the lake. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-tr from-primary-950/85 via-primary-950/55 to-primary-950/35 md:via-primary-950/35 md:to-transparent contact__overlay"
          style={{
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 45%, rgb(0 0 0 / 0.6) 70%, transparent 100%)",
          }}
        />

        {/* Fade into the form's background (eased gradient: see .contact__fade
            in globals.css). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] contact__fade"
        />

        <div className="page-x pt-0 pb-12 text-white md:pb-28 contact__content">
          <h2
            id="contact-title"
            className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-white/80 contact__title"
          >
            {t.title}
          </h2>

          <p className="mt-3 max-w-[750px] [text-shadow:0_1px_14px_rgb(0_1_66/0.45)] font-title text-[1.5rem] leading-[1.3] md:text-[1.875rem] contact__body">
            {t.body}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 contact__signoff">
            <p className="font-title text-xl italic text-white/90 [text-shadow:0_1px_14px_rgb(0_1_66/0.45)] md:text-2xl contact__signature">
              {brand.owner}
            </p>
          </div>
        </div>
      </div>

      <div className="relative flow-root bg-surface contact__form-area">
        <div className="relative page-x pt-0 pb-12 md:-mt-12 md:pb-16 lg:pb-20 contact__layout">
          <div className="mx-auto w-full max-w-5xl">
            <ContactForm
              t={contactForm}
              lang={lang}
              email={contact.email}
              defaultService={defaultService}
              aside={<ContactDetails />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import lake from "@/assets/art/lake.jpg";
import { contact } from "@/data/business";
import { getDictionary } from "@/lib/dictionaries";

const label =
  "text-[0.6875rem] font-bold tracking-[0.2em] text-secondary uppercase";
const value =
  "font-title text-xl transition-colors duration-200 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

// Identical on every page; target of all "Contact" buttons.
export default async function ContactSection() {
  const { contact: t } = await getDictionary();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-16"
    >
      <div className="relative isolate overflow-hidden">
        <Image
          src={lake}
          alt={t.imageAlt}
          fill
          sizes="100vw"
          className="-z-10 object-cover object-[50%_40%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-r from-primary-950/75 via-primary-950/40 to-transparent"
        />
        <div className="page-x py-16 text-white md:py-28">
          <h2
            id="contact-title"
            className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-white/80"
          >
            {t.title}
          </h2>
          <p className="mt-5 max-w-3xl font-title text-3xl leading-[1.15] italic md:text-5xl">
            {t.body}
          </p>
        </div>
      </div>

      <div className="bg-surface">
        <dl className="page-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className={label}>{t.labels.address}</dt>
            <dd className="mt-2">
              <address className="font-title text-xl leading-snug not-italic">
                {contact.name}
                <br />
                {contact.street} · {contact.city}
              </address>
            </dd>
          </div>
          <div>
            <dt className={label}>{t.labels.email}</dt>
            <dd className="mt-2">
              <a href={`mailto:${contact.email}`} className={value}>
                {contact.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className={label}>{t.labels.phone}</dt>
            <dd className="mt-2">
              <a href={contact.phoneHref} className={value}>
                {contact.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className={label}>{t.labels.mobile}</dt>
            <dd className="mt-2">
              <a href={contact.mobileHref} className={value}>
                {contact.mobile}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

import { contact, whatsappHref } from "@/data/business";
import { getDictionary } from "@/lib/dictionaries";

const label =
  "text-[0.6875rem] font-bold tracking-[0.2em] text-secondary uppercase";
const value =
  "link-underline text-xl hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

// Direct contact details; sits beside the contact form.
export default async function ContactDetails() {
  const { contact: t, whatsapp } = await getDictionary();

  return (
    <dl className="grid grid-cols-1 gap-y-7 contact__list">
      <div className="text-left contact__item contact__item--address">
        <dt className={`${label} contact__label`}>{t.labels.address}</dt>
        <dd className="mt-2 contact__definition">
          <address className="text-xl leading-snug not-italic contact__address">
            {contact.name}
            <br />
            {contact.street} · {contact.city}
          </address>
        </dd>
      </div>

      <div className="text-left contact__item contact__item--email">
        <dt className={`${label} contact__label`}>{t.labels.email}</dt>
        <dd className="mt-2 contact__definition">
          <a href={`mailto:${contact.email}`} className={`${value} contact__link`}>
            {contact.email}
          </a>
        </dd>
      </div>

      <div className="text-left contact__item contact__item--phone">
        <dt className={`${label} contact__label`}>{t.labels.phone}</dt>
        <dd className="mt-2 contact__definition">
          <a href={contact.phoneHref} className={`${value} contact__link`}>
            {contact.phone}
          </a>
        </dd>
      </div>

      <div className="text-left contact__item contact__item--mobile">
        <dt className={`${label} contact__label`}>{t.labels.mobile}</dt>
        <dd className="mt-2 contact__definition">
          <a href={contact.mobileHref} className={`${value} contact__link`}>
            {contact.mobile}
          </a>
        </dd>
        <dd className="mt-2 contact__definition contact__definition--whatsapp">
          <a
            href={whatsappHref(whatsapp.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-base text-primary-800 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground contact__link contact__link--whatsapp"
          >
            {whatsapp.label}
          </a>
        </dd>
      </div>
    </dl>
  );
}

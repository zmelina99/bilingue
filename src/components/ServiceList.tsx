import Image, { type StaticImageData } from "next/image";
import ServiceModal from "@/components/ServiceModal";
import { slugify } from "@/lib/slug";

type ServiceItem = {
  title: string;
  body: string;
  /** Editorial artwork shown on top of the card (card variant only). */
  image?: StaticImageData;
  imageAlt?: string;
  /** Extended copy shown in the "learn more" modal. */
  details?: { paragraphs: string[]; bullets?: string[] };
};

type Props = {
  items: ServiceItem[];
  /** Grid columns from the md breakpoint up. */
  className?: string;
  /** When set, each card shows a "learn more" action. */
  learnMoreLabel?: string;
  /** Strings for the "learn more" modal; enables it alongside learnMoreLabel. */
  modal?: { label: string; questionsTitle: string; cta: string };
};

// Independent services side by side (no numbering: they are not steps).
// Each gets an anchor id from its title.
// Two variants share one component so the grid/anchor logic stays in one place:
//  - card: artwork on top + title + body + "learn more" (when items carry images)
//  - list: title + body under a hover rule (default, e.g. the editing page)
export default function ServiceList({
  items,
  className = "md:grid-cols-2",
  learnMoreLabel,
  modal,
}: Props) {
  return (
    <ul className={`grid gap-x-8 gap-y-10 md:gap-y-12 lg:gap-x-10 ${className}`}>
      {items.map((item) =>
        item.image ? (
          <li
            key={item.title}
            id={slugify(item.title)}
            className="group flex scroll-mt-24 flex-col"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-surface">
              <Image
                src={item.image}
                alt={item.imageAlt ?? ""}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <h3 className="mt-5 font-title text-2xl font-semibold leading-tight">
              {item.title}
            </h3>
            <p className="mt-3 leading-relaxed text-foreground/70">
              {item.body}
            </p>
            {learnMoreLabel && modal && item.details && (
              <ServiceModal
                label={modal.label}
                title={item.title}
                image={item.image}
                imageAlt={item.imageAlt}
                paragraphs={item.details.paragraphs}
                bullets={item.details.bullets}
                triggerLabel={learnMoreLabel}
                questionsTitle={modal.questionsTitle}
                cta={modal.cta}
              />
            )}
          </li>
        ) : (
          <li
            key={item.title}
            id={slugify(item.title)}
            className="group relative scroll-mt-24 border-t border-foreground/15 pt-6"
          >
            <span
              aria-hidden
              className="absolute -top-px left-0 h-0.5 w-0 bg-primary-800 transition-[width] duration-500 ease-soft group-hover:w-full group-focus-within:w-full"
            />
            <h3 className="text-2xl font-semibold">{item.title}</h3>
            <p className="mt-3 max-w-xl leading-relaxed text-foreground/70">
              {item.body}
            </p>
          </li>
        ),
      )}
    </ul>
  );
}

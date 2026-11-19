import MediaImage from "@/components/MediaImage";
import portrait from "@/assets/brand/portrait.jpg";
import { brand } from "@/data/business";
import { getDictionary } from "@/lib/dictionaries";

// Identical on the language-coaching and editing pages. Split layout like "Tarife":
// label, photo and name in columns 1-4; the text from column 6, top-aligned.
export default async function PortraitSection() {
  const { portrait: t } = await getDictionary();
  const [lead, ...rest] = t.paragraphs;

  return (
    <section
      id="portrait"
      aria-labelledby="portrait-title"
      className="scroll-mt-16"
    >
      <div className="reveal page-x section-y grid-page items-start">
        <div className="md:col-span-4">
          <h2 id="portrait-title" className="eyebrow">
            {t.title}
          </h2>
          <figure className="mt-5 flex items-end gap-5 md:mt-6 md:block">
            <div className="w-32 shrink-0 md:w-full md:max-w-72">
              <MediaImage
                src={portrait}
                alt={t.imageAlt}
                sizes="288px"
                className="aspect-[4/5]"
              />
            </div>
            <figcaption className="md:mt-5">
              <p className="font-title text-2xl leading-tight font-semibold">
                {brand.owner}
              </p>
              <p className="mt-1.5 text-sm text-foreground/60">{t.role}</p>
            </figcaption>
          </figure>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <p className="lead max-w-3xl">{lead}</p>
          <div className="mt-6 max-w-2xl space-y-4 md:mt-8">
            {rest.map((p) => (
              <p key={p} className="body-text">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

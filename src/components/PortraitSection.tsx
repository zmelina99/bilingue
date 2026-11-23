import MediaImage from "@/components/MediaImage";
import portrait from "@/assets/brand/portrait.jpg";
import { brand } from "@/data/business";
import { getDictionary } from "@/lib/dictionaries";

// Identical on the language-coaching and editing pages. Split layout like "Tarife":
// label, photo and name in columns 1-4; the text from column 6, top-aligned.
export default async function PortraitSection() {
  const { portrait: t } = await getDictionary();
  // The manuscript has one biography paragraph; render it whole.
  const biography = t.paragraphs.join(" ");

  return (
    <section
      id="portrait"
      aria-labelledby="portrait-title"
      className="scroll-mt-16 border-t border-primary-800/20 portrait"
    >
      <div className="page-x section-y grid-page items-start portrait__inner">
        <div className="md:col-span-4 portrait__intro">
          <h2 id="portrait-title" className="eyebrow portrait__title">
            {t.title}
          </h2>
          <figure className="mt-5 flex items-end gap-5 md:mt-6 md:block portrait__figure">
            <div className="w-32 shrink-0 md:w-full md:max-w-72 portrait__photo">
              <MediaImage
                src={portrait}
                alt={t.imageAlt}
                sizes="(min-width: 768px) 288px, 128px"
                className="aspect-[4/5] portrait__image"
              />
            </div>
            <figcaption className="md:mt-5 portrait__caption">
              <p className="text-2xl leading-tight font-semibold portrait__name">
                {brand.owner}
              </p>
              <p className="mt-1.5 text-sm text-foreground/60 portrait__role">{t.role}</p>
            </figcaption>
          </figure>
        </div>

        <div className="md:col-span-7 md:col-start-6 portrait__text">
          <p className="max-w-2xl font-sans text-lg leading-[1.6] font-normal md:text-[1.25rem] portrait__biography">
            {biography}
          </p>
        </div>
      </div>
    </section>
  );
}

import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import MediaImage from "@/components/MediaImage";

type Props = {
  eyebrow: string;
  title: string;
  actions?: ReactNode;
  image: StaticImageData;
  imageAlt: string;
  imageClassName?: string;
  /** Quick links shown under the hero, separated by thin vertical rules. */
  strip?: { label: string; href: string }[];
};

// Page opener: grey band, big heading on the left, artwork on the right, quick links below.
export default function Hero({
  eyebrow,
  title,
  actions,
  image,
  imageAlt,
  imageClassName,
  strip,
}: Props) {
  return (
    <section className="bg-surface">
      <div className="page-x grid-page items-center pt-10 md:pt-14">
        <div className="md:col-span-7 lg:col-span-5">
          <p className="motion-safe:animate-fade-up eyebrow">{eyebrow}</p>
          <h1
            className="motion-safe:animate-fade-up mt-3 text-5xl leading-[1.04] font-semibold tracking-tight xl:text-6xl 2xl:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            {title}
          </h1>
          {actions && (
            <div
              className="motion-safe:animate-fade-up mt-6 flex flex-wrap gap-4"
              style={{ animationDelay: "160ms" }}
            >
              {actions}
            </div>
          )}
        </div>
        <div
          className="motion-safe:animate-fade-up md:col-span-5 md:col-start-8 lg:col-span-7 lg:col-start-6"
          style={{ animationDelay: "240ms" }}
        >
          <MediaImage
            src={image}
            alt={imageAlt}
            priority
            still
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[2/1] lg:aspect-[5/2]"
            imageClassName={imageClassName}
          />
        </div>
      </div>

      {strip && (
        <nav className="page-x">
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-foreground/15 py-6 md:mt-14 md:gap-x-10 md:py-8 lg:grid lg:auto-cols-fr lg:grid-flow-col lg:gap-0">
            {strip.map(({ label, href }) => (
              <li
                key={href}
                className="lg:border-l lg:border-foreground/15 lg:pr-4 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <a
                  href={href}
                  className="font-title text-lg font-semibold transition-colors duration-200 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground md:text-xl xl:text-2xl"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {!strip && <div className="h-10 md:h-14" />}
    </section>
  );
}

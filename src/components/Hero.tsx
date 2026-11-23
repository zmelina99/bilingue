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
  /** Quick links shown under the hero. */
  strip?: { label: string; href: string }[];
};

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
    <section className="bg-surface hero">
      {/* Contemporary Literary: text left, artwork right on desktop;
          on mobile the title leads and the artwork follows. */}
      <div className="page-x grid-page relative items-center gap-y-8 py-8 md:gap-y-0 md:py-10 hero__inner">
        {/* Decorative Art Nouveau iris sprig (transparent PNG) growing
            diagonally from the bottom-left corner. Absolutely positioned and
            bottom-anchored, sized by height so the tallest bloom reaches near
            the top without affecting the hero height. Proportions preserved
            (width auto); hidden below lg where the margin is too narrow. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/iris-sprig.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 hidden h-full w-auto select-none lg:block hero__sprig"
        />

        {/* Hero text — left column on desktop, first on mobile.
            At lg+ a left pad clears the full width of the diagonal sprig so the
            text never overlaps it. */}
        <div className="md:col-span-5 md:col-start-1 md:row-start-1 lg:col-span-6 lg:pl-[180px] xl:pl-[220px] hero__content">
          <p className="eyebrow hero__eyebrow">{eyebrow}</p>

          <h1
            className="mt-3 text-[clamp(2.5rem,6vw,5.25rem)] leading-[1.02] font-semibold tracking-tight text-balance break-words [hyphens:auto] hero__title"
          >
            {title}
          </h1>

          <div
            aria-hidden
            className="mt-6 h-px w-16 bg-primary-800 hero__divider"
          />
          {actions && <div className="mt-8 hero__actions">{actions}</div>}
        </div>

        {/* Hero illustration — right column on desktop, below on mobile */}
        <div
          className="motion-safe:animate-fade-up md:col-span-6 md:col-start-7 md:row-start-1 hero__media"
          style={{ animationDelay: "60ms" }}
        >
          <MediaImage
            src={image}
            alt={imageAlt}
            priority
            still
            sizes="(min-width: 768px) 26rem, 100vw"
            className="aspect-[3/2] w-full max-w-[26rem] md:ml-auto hero__image"
            imageClassName={imageClassName}
            borderRadius
          />
        </div>
      </div>

      {/*  TODO Optional quick links */}
      {/* {strip && strip.length > 0 && (
        <nav className="page-x">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-foreground/15 py-6 md:gap-x-10 lg:grid lg:auto-cols-fr lg:grid-flow-col lg:gap-0">
            {strip.map(({ label, href }) => (
              <li
                key={href}
                className="lg:border-l lg:border-foreground/15 lg:pr-4 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <a
                  href={href}
                  className="text-lg font-semibold transition-colors duration-200 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground md:text-xl xl:text-2xl"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )} */}
    </section>
  );
}

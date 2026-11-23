import type { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  /** Short text opposite the heading (desktop), full layout only. */
  intro?: ReactNode;
  tone?: "plain" | "surface";
  /** Main content: text (with `aside`) or any block shown under the heading. */
  children?: ReactNode;
  /** Split layout: heading + text in columns 1-4, this block from column 6. */
  aside?: ReactNode;
  /** Renders as an expandable block (closed by default) showing title + subtitle. */
  collapsible?: { subtitle: string };
  /** Smaller gap between heading and content. */
  tight?: boolean;
  /** Controls the alignment of the section heading. */
  alignment?: "left" | "center";
  titleColor?: string;
};

// Every section is either "split" (aside) or "full" (heading row, then content).
// Both share the 12-column page grid so edges line up from section to section.
export default function Section({
  id,
  title,
  eyebrow,
  intro,
  tone = "plain",
  children,
  aside,
  collapsible,
  tight,
  alignment = "left",
  titleColor,
}: Props) {
  const band = tone === "surface" ? "bg-surface" : "";
  const isCentered = alignment === "center";

  const headingAlignment = isCentered ? "text-center" : "text-left";

  if (collapsible) {
    return (
      <section
        id={id}
        aria-labelledby={`${id}-title`}
        className={`scroll-mt-16 border-t border-foreground/10 section section--collapsible ${tone === "surface" ? "section--surface" : ""} ${band}`}
      >
        <details className="group page-x section__details">
          <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-6 py-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground md:py-8 [&::-webkit-details-marker]:hidden section__summary">
            <p
              id={`${id}-title`}
              className={`font-title text-2xl leading-tight font-semibold tracking-tight md:text-3xl section__title ${headingAlignment}`}
            >
              {title}
            </p>
            <span className="flex items-center gap-4 text-foreground/60 transition-colors group-hover:text-primary-800 section__toggle">
              <span className="hidden text-base sm:inline section__subtitle">
                {collapsible.subtitle}
              </span>
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="size-5 shrink-0 text-primary-800 transition-transform duration-300 ease-soft group-open:rotate-180 motion-reduce:transition-none section__icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 8 5 5 5-5" />
              </svg>
            </span>
          </summary>
          <div className="grid-page pb-12 md:pb-16 section__body">
            <div className="md:col-span-7 md:col-start-6 section__content">
              <p className="mb-6 text-base text-foreground/60 sm:hidden section__subtitle-mobile">
                {collapsible.subtitle}
              </p>
              {children}
            </div>
          </div>
        </details>
      </section>
    );
  }

  const heading = (
    <div className={`${headingAlignment} section__heading`}>
      {eyebrow && <p className="eyebrow section__eyebrow">{eyebrow}</p>}
      <p
        id={`${id}-title`}
        className={`heading-2 section__title ${eyebrow ? "mt-3" : ""}`}
        style={{ color: titleColor }}
      >
        {title}
      </p>
    </div>
  );

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-16 section ${isCentered ? "section--centered" : ""} ${tone === "surface" ? "section--surface" : ""} ${band}`}
    >
      <div className="reveal page-x section-y section__inner">
        {aside ? (
          <div className="grid-page items-start section__split">
            <div className="md:col-span-4 section__main">
              {heading}
              <div className="body-text mt-5 max-w-prose space-y-4 md:mt-6 section__text">
                {children}
              </div>
            </div>
            <div className="-mt-3 md:mt-0 md:col-span-7 md:col-start-6 section__aside">{aside}</div>
          </div>
        ) : (
          <>
            <div className="grid-page items-end section__header">
              <div
                className={`section__heading-wrap ${
                  isCentered && !intro ? "col-span-12" : "md:col-span-7"
                }`}
              >
                {heading}
              </div>
              {intro && (
                <p className="body-text md:col-span-4 md:col-start-9 section__intro">
                  {intro}
                </p>
              )}
            </div>
            {children && (
              <div className={`section__content ${tight ? "mt-8 md:mt-10 section__content--tight" : "mt-8 md:mt-12"}`}>
                {children}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

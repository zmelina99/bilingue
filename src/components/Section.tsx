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
        className={`scroll-mt-16 border-t border-foreground/10 ${band}`}
      >
        <details className="group page-x">
          <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-6 py-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground md:py-8 [&::-webkit-details-marker]:hidden">
            <p
              id={`${id}-title`}
              className={`text-2xl leading-tight font-semibold tracking-tight md:text-3xl ${headingAlignment}`}
            >
              {title}
            </p>
            <span className="flex items-center gap-4 text-foreground/60 transition-colors group-hover:text-primary-800">
              <span className="hidden text-base sm:inline">
                {collapsible.subtitle}
              </span>
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="size-5 shrink-0 text-primary-800 transition-transform duration-300 ease-soft group-open:rotate-180 motion-reduce:transition-none"
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
          <div className="grid-page pb-12 md:pb-16">
            <div className="md:col-span-7 md:col-start-6">
              <p className="mb-6 text-base text-foreground/60 sm:hidden">
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
    <div className={headingAlignment}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <p
        id={`${id}-title`}
        className={`heading-2 ${eyebrow ? "mt-3" : ""}`}
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
      className={`scroll-mt-16 ${band}`}
    >
      <div className="reveal page-x section-y">
        {aside ? (
          <div className="grid-page items-start">
            <div className="md:col-span-4">
              {heading}
              <div className="body-text mt-5 max-w-prose space-y-4 md:mt-6">
                {children}
              </div>
            </div>
            <div className="md:col-span-7 md:col-start-6">{aside}</div>
          </div>
        ) : (
          <>
            <div className="grid-page items-end">
              <div
                className={
                  isCentered && !intro ? "col-span-12" : "md:col-span-7"
                }
              >
                {heading}
              </div>
              {intro && (
                <p className="body-text md:col-span-4 md:col-start-9">
                  {intro}
                </p>
              )}
            </div>
            {children && (
              <div className={tight ? "mt-8 md:mt-10" : "mt-8 md:mt-12"}>
                {children}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

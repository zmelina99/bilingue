"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ButtonLink from "@/components/ButtonLink";

type Props = {
  /** Small uppercase label in the header (e.g. the section name). */
  label: string;
  title: string;
  /** Card artwork, cropped to a vertical strip in the header. */
  image?: StaticImageData;
  imageAlt?: string;
  paragraphs: string[];
  bullets?: string[];
  /** Trigger text shown on the card ("Mehr erfahren"). */
  triggerLabel: string;
  /** Footer prompt + pill button. */
  questionsTitle: string;
  cta: string;
  /** Contact target (same-page hash). */
  contactHref?: string;
};

// One reusable dialog, rendered once per service card. Owns its own open state
// and the "Mehr erfahren" trigger so the courses grid stays a server component.
// Closes on X, Escape, or backdrop click; locks background scroll, traps focus,
// and restores focus to the trigger on close.
export default function ServiceModal({
  label,
  title,
  image,
  imageAlt,
  paragraphs,
  bullets,
  triggerLabel,
  questionsTitle,
  cta,
  contactHref = "#contact",
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

    // Move focus into the dialog once it has rendered.
    focusables()?.[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = focusables();
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary-800 transition-colors hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground service-modal__trigger"
      >
        {triggerLabel}
        <span aria-hidden className="service-modal__trigger-icon">&rarr;</span>
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-ink/40 p-4 py-8 sm:items-center sm:p-6 service-modal__overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative my-auto w-full max-w-[720px] rounded-lg bg-surface p-10 shadow-2xl shadow-ink/20 motion-safe:animate-fade-up md:p-12 service-modal service-modal__panel"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Schließen"
                className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground md:right-5 md:top-5 service-modal__close"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="size-5 service-modal__close-icon"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>

              <div className="flex flex-col-reverse gap-5 pr-8 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:pr-10 service-modal__header">
                <div className="min-w-0 flex-1 service-modal__heading">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-800 service-modal__label">
                    {label}
                  </p>
                  <h2
                    id={titleId}
                    className="mt-3 font-title text-3xl font-semibold leading-tight md:text-4xl service-modal__title"
                  >
                    {title}
                  </h2>
                </div>
                {image && (
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-surface service-modal__media">
                    <Image
                      src={image}
                      alt={imageAlt ?? ""}
                      fill
                      sizes="80px"
                      className="object-cover service-modal__image"
                    />
                  </div>
                )}
              </div>

              <div aria-hidden className="mt-5 h-0.5 w-12 bg-primary-800 service-modal__divider" />

              <div className="mt-6 space-y-4 leading-relaxed text-foreground/75 service-modal__content">
                {paragraphs.map((paragraph, i) => (
                  <p key={i} className="service-modal__paragraph">{paragraph}</p>
                ))}
                {bullets && bullets.length > 0 && (
                  <ul className="space-y-2 service-modal__list">
                    {bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-2.5 service-modal__list-item">
                        <span
                          aria-hidden
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-800 service-modal__bullet"
                        />
                        <span className="service-modal__bullet-text">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-foreground/10 pt-6 sm:flex-row sm:items-center sm:justify-between service-modal__footer">
                <p className="font-title text-xl font-semibold service-modal__questions">
                  {questionsTitle}
                </p>
                <ButtonLink
                  href={contactHref}
                  onClick={close}
                  size="sm"
                  className="self-start sm:self-auto service-modal__cta"
                >
                  {cta}
                </ButtonLink>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

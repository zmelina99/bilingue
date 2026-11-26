"use client";

import Image, { type StaticImageData } from "next/image";
import { useId, useRef } from "react";
import ArrowLink from "@/components/ArrowLink";
import ButtonLink from "@/components/ButtonLink";
import { CONTACT_HREF, goToContactForm } from "@/lib/contact-anchor";

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
  /** Matching inquiry link label ("Unterricht anfragen"); closes the dialog and jumps to contact. */
  inquiryLabel?: string;
  /** Accessible name of the close button. */
  closeLabel: string;
  /** Contact target (same-page hash). */
  contactHref?: string;
};

// One reusable native <dialog>, rendered once per service card. Owns its own
// open state and the "Mehr erfahren" trigger so the courses grid stays a
// server component. showModal() gives focus containment, Escape, an inert
// background and focus return to the trigger; we add backdrop-click close and
// a scroll lock (html:has(dialog[open]) in globals.css).
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
  inquiryLabel,
  closeLabel,
  contactHref = CONTACT_HREF,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  // Close (focus returns to the trigger), then scroll to and focus the contact section.
  const goToContact = (e: React.MouseEvent) => {
    if (contactHref !== CONTACT_HREF) return;
    e.preventDefault();
    close();
    requestAnimationFrame(() => goToContactForm());
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label={`${triggerLabel}: ${title}`}
        className="mt-4 inline-flex cursor-pointer items-center gap-1.5 self-start text-sm font-semibold text-primary-800 transition-colors group-hover:text-primary-900 focus-visible:outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-foreground service-modal__trigger"
      >
        {triggerLabel}
        <span
          aria-hidden
          className="inline-block transition-transform duration-200 ease-soft group-hover:translate-x-1 group-focus-within:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none service-modal__trigger-icon"
        >
          &rarr;
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        // Clicks on the ::backdrop target the <dialog> itself; the panel fills it.
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[720px] overflow-y-auto overscroll-contain rounded-lg bg-transparent p-0 text-foreground shadow-2xl shadow-ink/20 backdrop:bg-ink/40 open:motion-safe:animate-fade-up open:backdrop:motion-safe:animate-fade-in sm:max-h-[calc(100dvh-3rem)] service-modal__overlay"
      >
        <div className="relative bg-surface p-10 md:p-12 service-modal service-modal__panel">
          <button
            type="button"
            onClick={close}
            aria-label={closeLabel}
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
          </div>

          <div
            aria-hidden
            className="mt-5 h-0.5 w-12 bg-primary-800 service-modal__divider"
          />

          <div className="mt-6 space-y-4 leading-relaxed text-foreground/75 service-modal__content">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="service-modal__paragraph">
                {paragraph}
              </p>
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
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 service-modal__actions">
              <ButtonLink
                href={contactHref}
                onClick={goToContact}
                size="sm"
                className="service-modal__cta"
              >
                {cta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

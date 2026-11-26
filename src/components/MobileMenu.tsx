"use client";

import AppLink from "@/components/AppLink";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

type Props = {
  label: string;
  items: { href: string; label: string }[];
  contact: { href: string; label: string };
};

// Phone-only menu: nav links + contact, in a panel under the header bar.
export default function MobileMenu({ label, items, contact }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // While open: focus the first link, close on Escape (focus back to the
  // toggle) and on any press outside the menu.
  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLElement>("nav a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={root} className="md:hidden mobile-menu">
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`-mr-2 inline-flex size-11 items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground mobile-menu__toggle ${open ? "mobile-menu__toggle--open" : ""}`}
      >
        <span className="sr-only mobile-menu__label">{label}</span>
        <span aria-hidden className="relative block h-3 w-6 mobile-menu__icon">
          <span
            className={`absolute inset-x-0 h-px bg-foreground transition-all duration-300 motion-reduce:transition-none mobile-menu__bar mobile-menu__bar--top ${open ? "top-1.5 rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute inset-x-0 h-px bg-foreground transition-all duration-300 motion-reduce:transition-none mobile-menu__bar mobile-menu__bar--bottom ${open ? "top-1.5 -rotate-45" : "top-3"}`}
          />
        </span>
      </button>

      <nav
        id={panelId}
        aria-label={label}
        hidden={!open}
        className={`absolute inset-x-0 top-full border-b border-foreground/10 bg-background mobile-menu__panel ${open ? "mobile-menu__panel--open" : ""}`}
      >
        <ul className="page-x py-2 mobile-menu__list">
          {[...items, contact].map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href} className="border-b border-foreground/10 last:border-0 mobile-menu__item">
                <AppLink
                  href={href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-14 items-center justify-between text-2xl mobile-menu__link ${active ? "text-primary-800 mobile-menu__link--active" : "text-foreground"}`}
                >
                  {label}
                  <span aria-hidden className="text-base text-secondary mobile-menu__arrow">
                    →
                  </span>
                </AppLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

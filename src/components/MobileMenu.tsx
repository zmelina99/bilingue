"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="-mr-2 inline-flex size-11 items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        <span className="sr-only">{label}</span>
        <span aria-hidden className="relative block h-3 w-6">
          <span
            className={`absolute inset-x-0 h-px bg-foreground transition-all duration-300 motion-reduce:transition-none ${open ? "top-1.5 rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute inset-x-0 h-px bg-foreground transition-all duration-300 motion-reduce:transition-none ${open ? "top-1.5 -rotate-45" : "top-3"}`}
          />
        </span>
      </button>

      <nav
        id={panelId}
        aria-label={label}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-foreground/10 bg-background"
      >
        <ul className="page-x py-2">
          {[...items, contact].map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href} className="border-b border-foreground/10 last:border-0">
                <Link
                  href={href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-14 items-center justify-between font-title text-2xl ${active ? "text-primary-800" : "text-foreground"}`}
                >
                  {label}
                  <span aria-hidden className="text-base text-secondary">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

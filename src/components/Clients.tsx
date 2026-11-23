"use client";

import Image from "next/image";
import { useId, useState } from "react";

type Client = {
  name: string;
  url?: string;
  logo?: { src: string; width: number; height: number };
};

type Props = {
  heading: string;
  featured: Client[];
  others: Client[];
  showAllLabel: string;
  showLessLabel: string;
  externalLabel: string;
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground";

function ExternalLink({
  client,
  label,
  className,
  children,
}: {
  client: Client;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  if (!client.url) return <span className={`${className} clients__link`}>{children}</span>;
  return (
    <a
      href={client.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${client.name} (${label})`}
      className={`${className} ${focus} clients__link`}
    >
      {children}
    </a>
  );
}

// A single client logo, normalised to a common visual height/width (its own
// proportions preserved) and rendered monochrome.
function LogoItem({
  client,
  externalLabel,
}: {
  client: Client;
  externalLabel: string;
}) {
  return (
    <li className="flex h-8 items-center justify-center clients__logo-item">
      <ExternalLink
        client={client}
        label={externalLabel}
        className="group flex h-full max-w-full items-center clients__logo-link"
      >
        {client.logo ? (
          <Image
            src={client.logo.src}
            alt={client.name}
            width={client.logo.width}
            height={client.logo.height}
            unoptimized
            className="h-7 w-auto max-w-[7rem] object-contain opacity-70 brightness-0 transition duration-200 group-hover:opacity-100 group-hover:brightness-100 clients__logo"
          />
        ) : (
          <span className="text-xl leading-none font-semibold tracking-tight text-foreground/80 transition-colors duration-200 group-hover:text-primary-800 clients__logo-name">
            {client.name}
          </span>
        )}
      </ExternalLink>
    </li>
  );
}

// Compact client-logo strip: a left-aligned serif heading with a divider and the
// featured logos in one row. A discreet control reveals the remaining client
// names (text only) in columns underneath.
export default function Clients({
  heading,
  featured,
  others,
  showAllLabel,
  showLessLabel,
  externalLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  // Split the remaining names into three balanced, column-major groups.
  const columnCount = 3;
  const perColumn = Math.ceil(others.length / columnCount);
  const columns = Array.from({ length: columnCount }, (_, i) =>
    others.slice(i * perColumn, (i + 1) * perColumn),
  );

  // Shared toggle, centred below the logos (collapsed) or below the list
  // (expanded).
  const toggle = (
    <div className="mt-6 flex justify-center clients__toggle-wrap">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`group inline-flex items-center gap-1.5 py-1 text-sm text-foreground/60 transition-colors duration-200 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground clients__toggle ${open ? "clients__toggle--expanded" : ""}`}
      >
        <span className="clients__toggle-label">{open ? showLessLabel : showAllLabel}</span>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className={`size-4 shrink-0 text-primary-800 transition-transform duration-300 ease-soft motion-reduce:transition-none clients__toggle-icon ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 8 5 5 5-5" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="clients">
      {/* Centred heading with a thin divider on both sides. */}
      <div className="flex items-center gap-5 clients__header">
        <span aria-hidden className="h-px flex-1 bg-foreground/15 clients__divider clients__divider--start" />
        <h2 className="font-title text-xl leading-none font-semibold tracking-tight whitespace-nowrap md:text-2xl clients__title">
          {heading}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-foreground/15 clients__divider clients__divider--end" />
      </div>

      {/* Featured logos evenly distributed in one row (two columns on mobile). */}
      <ul className="mt-7 grid grid-cols-2 items-center gap-x-8 gap-y-5 sm:grid-cols-4 clients__logos">
        {featured.map((client) => (
          <LogoItem
            key={client.name}
            client={client}
            externalLabel={externalLabel}
          />
        ))}
      </ul>

      {/* Expanded: the remaining client names (text only) in three columns. */}
      <div
        id={listId}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-soft motion-reduce:transition-none clients__panel ${open ? "grid-rows-[1fr] opacity-100 clients__panel--expanded" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0 overflow-hidden clients__panel-inner">
          {/* Horizontal divider above the list; three columns spread across the
              full content width with subtle vertical dividers between them.
              Stacks into one column on mobile. */}
          <div className="mt-6 flex flex-col border-t border-foreground/10 pt-6 sm:flex-row sm:justify-between clients__columns">
            {columns.map((column, i) => (
              <ul
                key={i}
                className={
                  i > 0
                    ? "sm:border-l sm:border-foreground/10 sm:pl-8 clients__column"
                    : "clients__column"
                }
              >
                {column.map((client) => (
                  <li key={client.name} className="py-1 clients__name-item">
                    <ExternalLink
                      client={client}
                      label={externalLabel}
                      className="link-underline text-left font-sans text-base text-foreground/80 hover:text-primary-800 clients__name"
                    >
                      {client.name}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {toggle}
    </div>
  );
}

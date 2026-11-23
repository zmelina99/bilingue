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
  if (!client.url) return <span className={className}>{children}</span>;
  return (
    <a
      href={client.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${client.name} (${label})`}
      className={`${className} ${focus}`}
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
    <li className="flex h-8 items-center justify-center">
      <ExternalLink
        client={client}
        label={externalLabel}
        className="group flex h-full max-w-full items-center"
      >
        {client.logo ? (
          <Image
            src={client.logo.src}
            alt={client.name}
            width={client.logo.width}
            height={client.logo.height}
            unoptimized
            className="h-7 w-auto max-w-[7rem] object-contain opacity-70 brightness-0 transition duration-200 group-hover:opacity-100 group-hover:brightness-100"
          />
        ) : (
          <span className="text-xl leading-none font-semibold tracking-tight text-foreground/80 transition-colors duration-200 group-hover:text-primary-800">
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

  return (
    <div>
      {/* Heading with a divider extending to the right. */}
      <div className="flex items-center gap-5">
        <h2 className="font-title text-xl leading-none font-semibold tracking-tight whitespace-nowrap md:text-2xl">
          {heading}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-foreground/15" />
      </div>

      {/* Featured logos in one row (two columns on mobile). */}
      <ul className="mt-7 grid grid-cols-2 items-center gap-x-8 gap-y-5 sm:grid-cols-4">
        {featured.map((client) => (
          <LogoItem
            key={client.name}
            client={client}
            externalLabel={externalLabel}
          />
        ))}
      </ul>

      {/* Discreet, right-aligned toggle. */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
          className="group inline-flex items-center gap-1.5 py-1 text-sm text-foreground/60 transition-colors duration-200 hover:text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          <span>{open ? showLessLabel : showAllLabel}</span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className={`size-4 shrink-0 text-primary-800 transition-transform duration-300 ease-soft motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
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

      {/* Expanded: the remaining client names (text only) in three columns. */}
      <div
        id={listId}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-soft motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-foreground/10 pt-6">
            {/* Mobile: two balanced columns filling the width. From sm up: a
                column-major grid whose columns are each only as wide as their
                own content, centred as a group with equal gaps (8 rows fit the
                ~22 names into three columns). */}
            <ul className="columns-2 gap-x-8 sm:mx-auto sm:grid sm:w-fit sm:grid-flow-col sm:grid-rows-[repeat(8,auto)] sm:gap-x-12">
              {others.map((client) => (
                <li key={client.name} className="break-inside-avoid py-1">
                  <ExternalLink
                    client={client}
                    label={externalLabel}
                    className="text-[0.9375rem] leading-6 text-foreground/80 transition-colors duration-200 hover:text-primary-800 sm:text-base"
                  >
                    {client.name}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

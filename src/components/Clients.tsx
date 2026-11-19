"use client";

import Image from "next/image";
import { useId, useState } from "react";

type Client = {
  name: string;
  url?: string;
  logo?: { src: string; width: number; height: number };
};

type Props = {
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

// Full width of the section container. Spacing (px): 12–20 between logo rows,
// 32–40 logos → control, 16 control → list.
export default function Clients({
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
      <ul className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4 md:gap-y-5">
        {featured.map((client) => (
          <li
            key={client.name}
            className="flex h-14 items-center justify-center md:h-16"
          >
            <ExternalLink
              client={client}
              label={externalLabel}
              className="group flex h-full max-w-full items-center text-foreground/80 transition-colors duration-200 hover:text-primary-800"
            >
              {client.logo ? (
                <Image
                  src={client.logo.src}
                  alt={client.name}
                  width={client.logo.width}
                  height={client.logo.height}
                  unoptimized
                  className="h-auto max-w-full opacity-75 brightness-0 transition duration-200 group-hover:opacity-100 group-hover:brightness-100"
                />
              ) : (
                <span className="font-title text-2xl leading-none font-semibold tracking-tight">
                  {client.name}
                </span>
              )}
            </ExternalLink>
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t border-foreground/10 md:mt-10">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
          className="group flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left text-foreground/70 transition-colors duration-200 hover:text-primary-800 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground"
        >
          <span className="text-base">
            {open ? showLessLabel : showAllLabel}
          </span>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className={`size-5 shrink-0 text-primary-800 transition-transform duration-300 ease-soft motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 8 5 5 5-5" />
          </svg>
        </button>

        <div
          id={listId}
          inert={!open}
          className={`grid transition-[grid-template-rows] duration-300 ease-soft motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <div className="min-h-0 overflow-hidden">
            <ul className="columns-2 gap-x-8 pt-2 pb-1 lg:columns-3">
              {others.map((client) => (
                <li key={client.name} className="break-inside-avoid py-1">
                  <ExternalLink
                    client={client}
                    label={externalLabel}
                    className="text-[0.9375rem] leading-6 text-foreground transition-colors duration-200 hover:text-primary-800 sm:text-base"
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

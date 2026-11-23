import AppLink from "@/components/AppLink";
import type Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
  primary: "bg-primary-800 text-white hover:bg-primary-900",
  outline: "border border-primary-800/40 text-primary-800 hover:bg-primary-50",
  light: "bg-white text-ink hover:bg-primary-100",
  ghost: "border border-white/30 text-white hover:bg-white/10",
};

const sizes = {
  md: "px-6 py-3 md:px-8 text-lg",
  sm: "px-5 py-2 text-base",
  lg: "px-8 py-3 text-base sm:px-10 sm:py-4 sm:text-xl",
};

type Props = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Adds a small arrow that nudges right on hover/focus. */
  arrow?: boolean;
};

export default function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  arrow,
  children,
  ...props
}: Props) {
  return (
    <AppLink
      className={`group inline-flex items-center justify-center gap-2 rounded-full text-center transition duration-300 ease-soft motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${sizes[size]} ${variants[variant]} button-link button-link--${variant} button-link--${size} ${className}`}
      {...props}
    >
      {children}
      {arrow && (
        <span
          aria-hidden
          className="inline-block transition-transform duration-200 ease-soft group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
        >
          &rarr;
        </span>
      )}
    </AppLink>
  );
}

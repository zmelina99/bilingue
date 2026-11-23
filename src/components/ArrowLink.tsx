import Link from "next/link";
import type { ComponentProps } from "react";

// Quiet text link with a small arrow that nudges right on hover and keyboard focus.
// Used between sections; the prominent pill buttons are ButtonLink.
export default function ArrowLink({
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`group inline-flex items-center gap-2 font-semibold text-primary-800 transition-colors duration-200 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground arrow-link ${className}`}
      {...props}
    >
      <span className="link-underline pb-0.5 group-hover:[background-size:100%_1px] group-focus-visible:[background-size:100%_1px]">
        {children}
      </span>
      <span
        aria-hidden
        className="inline-block transition-transform duration-200 ease-soft group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
      >
        &rarr;
      </span>
    </Link>
  );
}

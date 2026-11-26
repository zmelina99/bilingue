import type { ReactNode } from "react";

// Quiet entrance: fades in and rises 8px as the block scrolls into view.
// Pure CSS (scroll-driven animation, see `.reveal-item` in globals.css), so
// content is visible without JavaScript and where the feature is missing.
export default function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`reveal-item ${className}`}>{children}</div>;
}

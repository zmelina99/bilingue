"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// One-time, quiet entrance: fades in and rises 8px the first time the block
// scrolls into view, then stays put. Opacity/transform only, so the box keeps
// its space and the layout never shifts. Reduced motion shows the final state
// at once (see the motion-reduce classes). Works the same on touch screens.
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Stagger in ms, applied from md up where items sit side by side. */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={`reveal-item transition-[opacity,transform] duration-500 ease-soft md:[transition-delay:var(--reveal-delay)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

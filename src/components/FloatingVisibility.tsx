"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CONTACT_SECTION_ID } from "@/lib/contact-anchor";

// Hides the floating button while the contact section is on screen: the
// section lists the same WhatsApp link, and the button would cover the form.
export default function FloatingVisibility({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById(CONTACT_SECTION_ID);
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      rootMargin: "0px 0px -15% 0px",
    });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div
      inert={hidden}
      className={`transition-opacity duration-300 motion-reduce:transition-none ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      {children}
    </div>
  );
}

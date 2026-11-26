export const CONTACT_SECTION_ID = "contact";
export const CONTACT_HREF = `#${CONTACT_SECTION_ID}`;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Bring the whole contact section (banner + form) into view and focus the
 * section itself (never an input, so no mobile keyboard opens). Scrolling
 * honours the section's `scroll-margin-top`, which lands the "Kontakt" label just
 * below the sticky header.
 * `scroll: false` only moves focus (used after the browser scrolled natively).
 */
export function goToContactForm({ scroll = true } = {}) {
  const target = document.getElementById(CONTACT_SECTION_ID);
  if (!target) return;
  if (scroll) {
    target.scrollIntoView({
      behavior: reducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    if (location.hash !== CONTACT_HREF) {
      history.pushState(null, "", CONTACT_HREF);
    }
  }
  target.focus({ preventScroll: true });
}

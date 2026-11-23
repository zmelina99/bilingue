export const CONTACT_FORM_ID = "contact-form";
export const CONTACT_HREF = `#${CONTACT_FORM_ID}`;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Bring the contact form heading into view and put focus on it (never on an
 * input, so no mobile keyboard opens). Scrolling honours the target's
 * `scroll-margin-top`, so the sticky header never covers the heading.
 * `scroll: false` only moves focus (used after the browser scrolled natively).
 */
export function goToContactForm({ scroll = true } = {}) {
  const target = document.getElementById(CONTACT_FORM_ID);
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
  target
    .querySelector<HTMLElement>("[data-contact-heading]")
    ?.focus({ preventScroll: true });
}

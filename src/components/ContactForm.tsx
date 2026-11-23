"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  CONTACT_FORM_ID,
  CONTACT_HREF,
  goToContactForm,
} from "@/lib/contact-anchor";
import {
  limits,
  services,
  validate,
  type FieldError,
  type FieldErrors,
  type Service,
} from "@/lib/contact-form";
import type { Dictionary } from "@/lib/dictionaries";

type Status = "idle" | "sending" | "success" | "error" | "rate";

const field =
  "block w-full rounded-md border border-neutral-300 bg-white px-4 py-3 font-sans text-base text-foreground placeholder:text-secondary hover:border-neutral-400 focus-visible:border-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800 aria-invalid:border-2 aria-invalid:border-red-700";
const label = "mb-2.5 block text-sm font-bold text-foreground";
const errorText =
  "mt-2 flex items-start gap-2 text-base font-medium text-red-800";

function FieldMessage({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} role="alert" className={errorText}>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="mt-[0.2em] h-4 w-4 shrink-0 fill-current"
      >
        <path d="M10 1.5 19 18H1L10 1.5Zm-1 6.5v5h2V8H9Zm0 6.5v2h2v-2H9Z" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

export default function ContactForm({
  t,
  lang,
  email,
  defaultService = "",
  aside,
}: {
  t: Dictionary["contactForm"];
  lang: string;
  /** Public address shown as the fallback when sending fails. */
  email: string;
  defaultService?: Service | "";
  /** Direct contact details, shown beside the form from md up and below it on phones. */
  aside?: ReactNode;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [count, setCount] = useState(0);
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const inFlight = useRef(false);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Anchor behaviour. Ordinary "#contact-form" links are native anchors (the
  // wrapper's scroll-margin-top clears the sticky header). Here we only
  //  - move focus to the heading (never an input, so no mobile keyboard), and
  //  - handle a click on a link whose hash is already in the URL: the browser
  //    may do nothing then, so scroll once ourselves (no second animation).
  useEffect(() => {
    const focusOnly = () => goToContactForm({ scroll: false });
    if (location.hash === CONTACT_HREF) focusOnly();
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]");
      if (a?.getAttribute("href") !== CONTACT_HREF) return;
      if (location.hash === CONTACT_HREF) {
        e.preventDefault();
        goToContactForm();
      } else {
        setTimeout(focusOnly, 0);
      }
    };
    const onHash = () => location.hash === CONTACT_HREF && focusOnly();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
  const sending = status === "sending";

  const fieldMessage = (code: FieldError) =>
    t.errors[code]
      .replace(
        "{max}",
        String(code === "nameLong" ? limits.name : limits.messageMax),
      )
      .replace("{min}", String(limits.messageMin));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = validate(data);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("idle");
      // Move focus to the first invalid field.
      const first = (["name", "email", "service", "message"] as const).find(
        (k) => result.errors[k],
      );
      if (first) {
        const el = formRef.current?.elements.namedItem(first);
        if (el instanceof HTMLElement) el.focus();
      }
      return;
    }
    setErrors({});
    setStatus("sending");
    inFlight.current = true;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lang, startedAt: startedAt.current }),
      });
      if (res.ok) {
        setStatus("success");
      } else if (res.status === 400) {
        const body = await res.json().catch(() => null);
        if (body?.fields) setErrors(body.fields);
        setStatus(body?.fields ? "idle" : "error");
      } else {
        setStatus(res.status === 429 ? "rate" : "error");
      }
    } catch {
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  const err = (k: keyof FieldErrors) => errors[k];
  const describe = (k: keyof FieldErrors) =>
    err(k) ? `${k}-error` : undefined;

  const showCount = count >= limits.messageMax * 0.8;
  const success = status === "success";

  return (
    <div id={CONTACT_FORM_ID} className="scroll-mt-24 contact-form-wrap">
      <div className="mt-8 grid grid-cols-1 gap-y-10 md:mt-10 md:grid-cols-[minmax(0,2fr)_1px_minmax(0,1fr)] md:gap-x-10 lg:gap-x-14 contact-form__layout">
        {success ? (
          <div role="status" className="contact-form contact-form--success">
            <p className="font-title text-3xl leading-tight font-semibold text-primary-800 md:text-4xl">
              {t.successTitle}
            </p>
            <p className="mt-3 text-lg">{t.successBody}</p>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setCount(0);
                startedAt.current = Date.now();
              }}
              className="link-underline mt-5 text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              {t.again}
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            aria-labelledby="contact-form-title"
            className="contact-form"
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2 contact-form__grid">
              <div className="contact-form__field contact-form__field--name">
                <label htmlFor="cf-name" className={label}>
                  {t.name}
                </label>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={limits.name + 50}
                  required
                  aria-required
                  aria-invalid={!!err("name")}
                  aria-describedby={describe("name")}
                  className={field}
                />
                {err("name") && (
                  <FieldMessage id="name-error">
                    {fieldMessage(err("name")!)}
                  </FieldMessage>
                )}
              </div>

              <div className="contact-form__field contact-form__field--email">
                <label htmlFor="cf-email" className={label}>
                  {t.email}
                </label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  aria-required
                  aria-invalid={!!err("email")}
                  aria-describedby={describe("email")}
                  className={field}
                />
                {err("email") && (
                  <FieldMessage id="email-error">
                    {fieldMessage(err("email")!)}
                  </FieldMessage>
                )}
              </div>

              <div className="md:col-span-2 contact-form__field contact-form__field--service">
                <label htmlFor="cf-service" className={label}>
                  {t.service}
                </label>

                <div className="relative">
                  <select
                    id="cf-service"
                    name="service"
                    defaultValue={defaultService}
                    required
                    aria-required
                    aria-invalid={!!err("service")}
                    aria-describedby={describe("service")}
                    className={`${field} appearance-none pr-10`}
                  >
                    <option value="" disabled>
                      {t.choose}
                    </option>
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {t.services[s]}
                      </option>
                    ))}
                  </select>

                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="m3 6 5 5 5-5" />
                  </svg>
                </div>

                {err("service") && (
                  <FieldMessage id="service-error">
                    {fieldMessage(err("service")!)}
                  </FieldMessage>
                )}
              </div>

              <div className="md:col-span-2 contact-form__field contact-form__field--message">
                <label htmlFor="cf-message" className={label}>
                  {t.message}
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={6}
                  required
                  aria-required
                  onChange={(e) => setCount(e.target.value.length)}
                  aria-invalid={!!err("message")}
                  aria-describedby={[
                    describe("message"),
                    showCount ? "message-count" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  className={`${field} resize-y`}
                />
                <div className="flex flex-wrap justify-between gap-x-4">
                  {err("message") ? (
                    <FieldMessage id="message-error">
                      {fieldMessage(err("message")!)}
                    </FieldMessage>
                  ) : (
                    <span />
                  )}
                  {showCount && (
                    <p
                      id="message-count"
                      className={`mt-2 text-sm ${count > limits.messageMax ? "text-red-700" : "text-secondary"}`}
                    >
                      {t.counter
                        .replace("{n}", String(count))
                        .replace("{max}", String(limits.messageMax))}
                    </p>
                  )}
                </div>
              </div>

              {/* Honeypot: invisible to people, tempting to bots. */}
              <div
                aria-hidden
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
              >
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>
            </div>

            {(status === "error" || status === "rate") && (
              <div
                role="alert"
                className="mt-6 rounded-md border border-2 border-red-800 bg-red-50 px-4 py-3 text-base text-red-900 contact-form__alert"
              >
                <p className="font-bold">{t.errorTitle}</p>
                <p className="mt-1">
                  {status === "rate" ? t.errorRate : t.errorBody}{" "}
                  <a
                    href={`mailto:${email}`}
                    className="link-underline font-bold"
                  >
                    {email}
                  </a>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              aria-disabled={sending}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary-800 px-8 py-3 text-base text-white transition duration-300 ease-soft hover:bg-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:px-10 sm:py-4 sm:text-xl contact-form__submit"
            >
              {sending ? t.sending : t.submit}
            </button>
          </form>
        )}

        {aside && (
          <>
            <div
              aria-hidden
              className="hidden bg-black/10 md:block contact-form__divider"
            />
            <aside className="border-t border-black/10 pt-8 md:border-t-0 md:pt-0 contact-form__aside">
              {aside}
            </aside>
          </>
        )}
      </div>
    </div>
  );
}

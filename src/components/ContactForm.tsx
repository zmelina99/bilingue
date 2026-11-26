"use client";

import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { CONTACT_HREF, goToContactForm } from "@/lib/contact-anchor";
import {
  limits,
  services,
  validate,
  type FieldError,
  type FieldErrors,
  type Service,
} from "@/lib/contact-form";
import type { Dictionary } from "@/lib/dictionaries";
import ServiceSelect from "@/components/ServiceSelect";

type Status = "idle" | "sending" | "success" | "error" | "rate";
type Field = keyof FieldErrors;
const fields: readonly Field[] = ["name", "email", "service", "message"];
const isField = (v: string): v is Field => (fields as string[]).includes(v);

// The visible border is drawn by the notched <fieldset> in `Control`; the
// control keeps a transparent 1px border so its size is unchanged.
const field =
  "block w-full rounded-md border border-transparent bg-surface px-3 py-3 font-sans text-base text-foreground outline-none contact-form__input";

/**
 * Outlined field with a floating label: a real <label> that rests inside the
 * control and floats onto the top border, plus an aria-hidden fieldset/legend
 * that cuts a notch in the border behind it (works on any background).
 * States come from CSS variants in globals.css (cf-float, cf-focus, ...).
 */
function Control({
  id,
  label,
  multiline = false,
  children,
}: {
  id: string;
  label: string;
  /** Textarea: the resting label sits on the first line, not centered. */
  multiline?: boolean;
  children: ReactNode;
}) {
  const motion = "duration-200 ease-out motion-reduce:transition-none";
  return (
    <div className="relative contact-form__control">
      {children}
      <fieldset
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 -top-[5px] bottom-0 m-0 min-w-0 rounded-md border border-neutral-300 px-2 text-left transition-colors ${motion} cf-hover:border-neutral-400 cf-focus:border-2 cf-focus:border-primary-800 cf-invalid:border-2 cf-invalid:border-red-700 contact-form__outline`}
      >
        <legend className="invisible float-none h-[11px] w-auto max-w-[0.01px] overflow-hidden p-0 text-xs font-medium whitespace-nowrap transition-[max-width] duration-[50ms] cf-float:max-w-full cf-float:duration-100 cf-float:delay-[50ms] contact-form__notch">
          <span className="inline-block px-1">{label}</span>
        </legend>
      </fieldset>
      <label
        id={`${id}-label`}
        htmlFor={id}
        className={`pointer-events-none absolute left-3 max-w-[calc(100%-1.5rem)] truncate text-base leading-6 font-medium text-secondary transition-[top,translate,font-size,line-height,color] ${motion} ${multiline ? "top-3" : "top-1/2 -translate-y-1/2"} cf-float:top-0 cf-float:-translate-y-1/2 cf-float:text-xs cf-float:leading-4 cf-filled:text-foreground cf-focus:text-primary-800 cf-invalid:text-red-800 contact-form__label`}
      >
        {label}
      </label>
    </div>
  );
}

// Not a live region: after a failed submit focus moves to the first invalid
// field (which reads its description); blur errors go through one polite
// announcer in the form.
function FieldMessage({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-2 text-base font-medium text-red-800"
    >
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
  const [announcement, setAnnouncement] = useState("");
  const [count, setCount] = useState(0);
  const startedAt = useRef(0);
  const inFlight = useRef(false);
  /** Fields the user has typed in; only these are validated on blur. */
  const edited = useRef(new Set<Field>());
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const refocusForm = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // "#contact" links are native anchors: the browser scrolls (also when the
  // hash is already in the URL) and scroll-margin-top clears the sticky header.
  // We only move focus to the section afterwards (never an input, so no
  // mobile keyboard). A same-hash click fires no hashchange, hence the click.
  useEffect(() => {
    const focusOnly = () => goToContactForm({ scroll: false });
    if (location.hash === CONTACT_HREF) focusOnly();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a[href]");
      if (a?.getAttribute("href") === CONTACT_HREF && !e.defaultPrevented)
        setTimeout(focusOnly, 0);
    };
    const onHash = () => location.hash === CONTACT_HREF && focusOnly();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  // Success replaces the form, so move focus to the confirmation (the submit
  // button that had focus is gone); "send another" brings it back to the form.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    else if (refocusForm.current) {
      refocusForm.current = false;
      document.getElementById("cf-name")?.focus();
    }
  }, [status]);

  const sending = status === "sending";

  const fieldMessage = (k: Field, code: FieldError) =>
    code === "required"
      ? t.requiredFields[k]
      : t.errors[code]
          .replace(
            "{max}",
            String(code === "nameLong" ? limits.name : limits.messageMax),
          )
          .replace("{min}", String(limits.messageMin));

  const currentErrors = () =>
    formRef.current
      ? (() => {
          const r = validate(Object.fromEntries(new FormData(formRef.current)));
          return r.ok ? {} : r.errors;
        })()
      : {};

  const setFieldError = (k: Field, code: FieldError | undefined) =>
    setErrors((prev) => {
      if (prev[k] === code) return prev;
      const next = { ...prev };
      if (code) next[k] = code;
      else delete next[k];
      return next;
    });

  // Clear a field's error as soon as its value is fixed (never add one while typing).
  function onInput(e: FormEvent<HTMLFormElement>) {
    const name = (e.target as unknown as HTMLInputElement).name;
    if (!isField(name)) return;
    edited.current.add(name);
    if (errors[name] && !currentErrors()[name]) setFieldError(name, undefined);
  }

  // Validate a field the user edited once they leave it, and announce a new error.
  function onBlur(e: FocusEvent<HTMLFormElement>) {
    const name = (e.target as unknown as HTMLInputElement).name;
    if (!isField(name) || !edited.current.has(name)) return;
    const code = currentErrors()[name];
    if (code && code !== errors[name]) {
      setAnnouncement("");
      setTimeout(() => setAnnouncement(fieldMessage(name, code)), 300);
    }
    setFieldError(name, code);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return;
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = validate(data);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("idle");
      const first = fields.find((k) => result.errors[k]);
      if (first) document.getElementById(`cf-${first}`)?.focus();
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

  const err = (k: Field) => errors[k];
  const describe = (k: Field) => (err(k) ? `${k}-error` : undefined);
  const message = (k: Field) =>
    err(k) && (
      <FieldMessage id={`${k}-error`}>{fieldMessage(k, err(k)!)}</FieldMessage>
    );

  const showCount = count >= limits.messageMax * 0.8;

  return (
    <div className="contact-form-wrap">
      <div className="-mt-2 grid grid-cols-1 gap-y-10 md:grid-cols-[minmax(0,2fr)_1px_minmax(0,1fr)] md:gap-x-10 lg:gap-x-14 contact-form__layout">
        {status === "success" ? (
          <div
            ref={successRef}
            role="status"
            tabIndex={-1}
            className="outline-none contact-form contact-form--success"
          >
            <p className="font-title text-3xl leading-tight font-semibold text-primary-800 md:text-4xl">
              {t.successTitle}
            </p>
            <p className="mt-3 text-lg">{t.successBody}</p>
            <button
              type="button"
              onClick={() => {
                edited.current.clear();
                refocusForm.current = true;
                setStatus("idle");
                setCount(0);
                startedAt.current = Date.now();
              }}
              className="link-underline mt-5 inline-flex min-h-6 items-center text-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              {t.again}
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            onInput={onInput}
            onBlur={onBlur}
            aria-label={t.title}
            className="contact-form"
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-7 md:grid-cols-2 contact-form__grid">
              <div className="contact-form__field contact-form__field--name">
                <Control id="cf-name" label={t.name}>
                  <input
                    id="cf-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={limits.name + 50}
                    required
                    aria-invalid={!!err("name")}
                    aria-describedby={describe("name")}
                    placeholder=" "
                    className={field}
                  />
                </Control>
                {message("name")}
              </div>

              <div className="contact-form__field contact-form__field--email">
                <Control id="cf-email" label={t.email}>
                  <input
                    id="cf-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    aria-invalid={!!err("email")}
                    aria-describedby={describe("email")}
                    placeholder=" "
                    className={field}
                  />
                </Control>
                {message("email")}
              </div>

              <div className="md:col-span-2 contact-form__field contact-form__field--service">
                <Control id="cf-service" label={t.service}>
                  <ServiceSelect
                    id="cf-service"
                    name="service"
                    options={services.map((s) => ({
                      value: s,
                      label: t.services[s],
                    }))}
                    defaultValue={defaultService}
                    placeholder={t.choose}
                    invalid={!!err("service")}
                    describedBy={describe("service")}
                    className={field}
                  />
                </Control>
                {message("service")}
              </div>

              <div className="md:col-span-2 contact-form__field contact-form__field--message">
                <Control id="cf-message" label={t.message} multiline>
                  <textarea
                    id="cf-message"
                    name="message"
                    rows={4}
                    required
                    onChange={(e) => setCount(e.target.value.length)}
                    aria-invalid={!!err("message")}
                    aria-describedby={
                      [describe("message"), showCount ? "message-count" : ""]
                        .filter(Boolean)
                        .join(" ") || undefined
                    }
                    placeholder=" "
                    className={`${field} resize-y`}
                  />
                </Control>
                <div className="flex flex-wrap justify-between gap-x-4">
                  {message("message") || <span />}
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

            <p aria-live="polite" className="sr-only">
              {announcement}
            </p>

            {(status === "error" || status === "rate") && (
              <div
                role="alert"
                className="mt-6 rounded-md border-2 border-red-800 bg-red-50 px-4 py-3 text-base text-red-900 contact-form__alert"
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

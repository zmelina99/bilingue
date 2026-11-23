import { NextResponse } from "next/server";
import { validate } from "@/lib/contact-form";

// Contact form delivery. Credentials and the recipient stay server-side:
//   RESEND_API_KEY     Resend API key
//   CONTACT_FORM_FROM  verified sender, e.g. "Bilingue <kontakt@bilingue.ch>"
//   CONTACT_FORM_TO    recipient inbox (change here to switch inboxes)
// See README.md ("Contact form").

const serviceLabels = {
  coaching: "Sprachcoaching",
  editing: "Lektorat",
  other: "Other",
} as const;

const MAX_BODY_BYTES = 10_000;
const MIN_FILL_MS = 2_000; // humans need more than 2 s to fill the form
const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 };

// Best-effort per-instance rate limit (resets on cold start / per serverless
// instance). Enough to blunt casual abuse; use a shared store if that grows.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > RATE_LIMIT.max;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES)
    return NextResponse.json({ error: "invalid" }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object") throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // Spam: a filled honeypot or an instant submit gets a fake success so bots
  // learn nothing. Nothing is sent.
  const tooFast =
    typeof body.startedAt !== "number" ||
    Date.now() - body.startedAt < MIN_FILL_MS;
  if (body.website || tooFast) return NextResponse.json({ ok: true });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip))
    return NextResponse.json({ error: "rate" }, { status: 429 });

  const result = validate(body);
  if (!result.ok)
    return NextResponse.json({ error: "validation", fields: result.errors }, { status: 400 });
  const { name, email, service, message } = result.data;

  const { RESEND_API_KEY, CONTACT_FORM_FROM, CONTACT_FORM_TO } = process.env;
  if (!RESEND_API_KEY || !CONTACT_FORM_FROM || !CONTACT_FORM_TO) {
    console.error("Contact form: missing RESEND_API_KEY / CONTACT_FORM_FROM / CONTACT_FORM_TO");
    return NextResponse.json({ error: "send" }, { status: 503 });
  }

  const lang = typeof body.lang === "string" ? body.lang.slice(0, 2) : "";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: CONTACT_FORM_FROM,
        to: CONTACT_FORM_TO.split(",").map((a) => a.trim()),
        reply_to: email,
        subject: `Website: ${serviceLabels[service]} – ${oneLine(name)}`,
        text: [
          `Name: ${oneLine(name)}`,
          `Email: ${email}`,
          `Service: ${serviceLabels[service]}`,
          `Site language: ${lang || "?"}`,
          "",
          message,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("Contact form: provider rejected", res.status, await res.text());
      return NextResponse.json({ error: "send" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form: provider unreachable", err);
    return NextResponse.json({ error: "send" }, { status: 502 });
  }
}

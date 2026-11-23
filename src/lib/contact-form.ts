// Shared by the form (client) and the API route (server): one source of truth
// for field names, limits and validation.
export const services = ["coaching", "editing", "other"] as const;
export type Service = (typeof services)[number];

export const limits = {
  name: 100,
  email: 254,
  messageMin: 10,
  messageMax: 2000,
};

export type FieldError =
  | "required"
  | "email"
  | "nameLong"
  | "messageShort"
  | "messageLong";
export type FieldErrors = Partial<
  Record<"name" | "email" | "service" | "message", FieldError>
>;

export type ContactInput = {
  name: string;
  email: string;
  service: Service;
  message: string;
};

const emailPattern = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;

export const isService = (v: unknown): v is Service =>
  typeof v === "string" && (services as readonly string[]).includes(v);

export function validate(raw: {
  name?: unknown;
  email?: unknown;
  service?: unknown;
  message?: unknown;
}): { ok: true; data: ContactInput } | { ok: false; errors: FieldErrors } {
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  const errors: FieldErrors = {};

  if (!name) errors.name = "required";
  else if (name.length > limits.name) errors.name = "nameLong";

  if (!email) errors.email = "required";
  else if (email.length > limits.email || !emailPattern.test(email))
    errors.email = "email";

  if (!isService(raw.service)) errors.service = "required";

  if (!message) errors.message = "required";
  else if (message.length < limits.messageMin) errors.message = "messageShort";
  else if (message.length > limits.messageMax) errors.message = "messageLong";

  if (Object.keys(errors).length || !isService(raw.service))
    return { ok: false, errors };
  return { ok: true, data: { name, email, service: raw.service, message } };
}

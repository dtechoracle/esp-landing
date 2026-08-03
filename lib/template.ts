export type TemplateVars = Record<string, string>;

export type TemplateRecipient = {
  email?: string;
  name?: string;
  role?: string;
  phone?: string;
  whatsappOn?: boolean;
  createdAt?: string;
};

/** Variables available in email subject/body templates. */
export const AVAILABLE_VARS = [
  "firstName",
  "lastName",
  "name",
  "email",
  "role",
  "phone",
  "whatsappOn",
  "joinedDate",
] as const;

function roleLabel(role?: string): string {
  if (role === "venue_owner") return "Venue owner";
  if (role === "planner") return "Event planner";
  return role || "";
}

export function buildTemplateVars(sub: TemplateRecipient): TemplateVars {
  const fullName = (sub.name || "").trim();
  const parts = fullName.split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ");
  const date = sub.createdAt
    ? new Date(sub.createdAt).toLocaleDateString()
    : "";

  return {
    email: (sub.email || "").trim(),
    name: fullName,
    firstName,
    lastName,
    role: roleLabel(sub.role),
    phone: (sub.phone || "").trim(),
    whatsappOn: sub.whatsappOn ? "Yes" : "No",
    joinedDate: date,
  };
}

/**
 * Replace [variable] tokens in a template with the recipient's data.
 * Unknown tokens are left as-is so typos don't silently disappear.
 */
export function renderTemplate(
  template: string,
  vars: TemplateVars
): string {
  return template.replace(
    /\[([a-zA-Z][a-zA-Z0-9_]*)\]/g,
    (match, key: string) => (key in vars ? vars[key] : match)
  );
}

import "server-only";
import nodemailer from "nodemailer";

export type MailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  fromName: string;
  fromEmail: string;
};

export function getMailConfig(): MailConfig | null {
  const host = process.env.SMTP_HOST;
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!host || !fromEmail) return null;

  return {
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || undefined,
    pass: process.env.SMTP_PASS || undefined,
    fromName: process.env.MAIL_FROM_NAME || "EventSpacePro",
    fromEmail,
  };
}

export function smtpReady(): boolean {
  return getMailConfig() !== null;
}

let cachedTransport: nodemailer.Transporter | null = null;

function transport() {
  if (cachedTransport) return cachedTransport;
  const cfg = getMailConfig();
  if (!cfg) throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_FROM and credentials.");
  cachedTransport = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.user
      ? { user: cfg.user, pass: cfg.pass || "" }
      : undefined,
  });
  return cachedTransport;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}): Promise<void> {
  const cfg = getMailConfig();
  if (!cfg) throw new Error("SMTP is not configured on the server.");
  await transport().sendMail({
    from: `"${cfg.fromName}" <${cfg.fromEmail}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}
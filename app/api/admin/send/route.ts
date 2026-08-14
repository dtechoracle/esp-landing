import { NextRequest, NextResponse } from "next/server";
import { recordCampaign, recordMailLog, updateCampaignCounts } from "@/lib/db";
import { sendMail, smtpReady } from "@/lib/mail";
import { buildTemplateVars, renderTemplate, type TemplateRecipient } from "@/lib/template";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  if (!smtpReady()) {
    return NextResponse.json(
      { error: "Email is not configured. Set SMTP_HOST, SMTP_FROM and credentials." },
      { status: 400 }
    );
  }

  let body: {
    recipients?: unknown;
    emails?: unknown;
    subject?: unknown;
    text?: unknown;
    html?: unknown;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  if (!subject) return NextResponse.json({ error: "Subject is required." }, { status: 400 });

  const text = typeof body.text === "string" ? body.text : "";
  const html = typeof body.html === "string" ? body.html : "";
  if (!text && !html) {
    return NextResponse.json({ error: "Email body is required." }, { status: 400 });
  }

  // Resolve recipients. Prefer the rich `recipients` payload (email + fields
  // for variable substitution); fall back to plain `emails` for compatibility.
  const recipients: TemplateRecipient[] = [];
  if (Array.isArray(body.recipients)) {
    for (const r of body.recipients as unknown[]) {
      if (!r || typeof r !== "object") continue;
      const rec = r as Record<string, unknown>;
      const email = typeof rec.email === "string" ? rec.email.trim().toLowerCase() : "";
      if (!EMAIL_RE.test(email)) continue;
      recipients.push({
        email,
        name: typeof rec.name === "string" ? rec.name : undefined,
        firstName: typeof rec.firstName === "string" ? rec.firstName : undefined,
        lastName: typeof rec.lastName === "string" ? rec.lastName : undefined,
        role: typeof rec.role === "string" ? rec.role : undefined,
        phone: typeof rec.phone === "string" ? rec.phone : undefined,
        whatsappOn: typeof rec.whatsappOn === "boolean" ? rec.whatsappOn : undefined,
        createdAt: typeof rec.createdAt === "string" ? rec.createdAt : undefined,
      });
    }
  } else if (Array.isArray(body.emails)) {
    for (const e of body.emails) {
      if (typeof e !== "string") continue;
      const email = e.trim().toLowerCase();
      if (EMAIL_RE.test(email)) recipients.push({ email });
    }
  }

  if (!recipients.length) {
    return NextResponse.json({ error: "No recipient emails found." }, { status: 400 });
  }
  if (recipients.length > 5000) {
    return NextResponse.json(
      { error: "Too many recipients for a single send (max 5000)." },
      { status: 400 }
    );
  }

  const campaignId = recordCampaign({ subject, total: recipients.length, sent: 0, failed: 0 });

  let sent = 0;
  let failed = 0;
  const failures: { email: string; error: string }[] = [];

  for (const recipient of recipients) {
    const vars = buildTemplateVars(recipient);
    const subjectRendered = renderTemplate(subject, vars);
    const textRendered = text ? renderTemplate(text, vars) : "";
    const htmlRendered = html ? renderTemplate(html, vars) : "";

    try {
      await sendMail({
        to: recipient.email!,
        subject: subjectRendered,
        text: textRendered || undefined,
        html: htmlRendered || undefined,
      });
      sent++;
      recordMailLog({ campaignId, email: recipient.email!, subject: subjectRendered, status: "sent" });
    } catch (e) {
      failed++;
      const msg = e instanceof Error ? e.message : String(e);
      failures.push({ email: recipient.email!, error: msg });
      recordMailLog({ campaignId, email: recipient.email!, subject: subjectRendered, status: "failed", error: msg });
    }
  }

  updateCampaignCounts(campaignId, sent, failed);

  return NextResponse.json({
    ok: true,
    campaignId,
    total: recipients.length,
    sent,
    failed,
    failures: failures.slice(0, 25),
  });
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "../components/AdminShell";
import Modal from "../../components/Modal";
import { useAdminAuth } from "@/lib/useAdminAuth";
import {
  fetchWaitlist,
  sendBroadcastEmail,
  type WaitlistEntry,
} from "@/lib/backend-client";
import { buildTemplateVars, renderTemplate } from "@/lib/template";
import VariableField, { type PreviewRecipient } from "./VariableField";
import RichEditor from "./RichEditor";

type Campaign = {
  id: number;
  subject: string;
  total: number;
  sent: number;
  failed: number;
  created_at: string;
};

export default function SendEmail() {
  const token = useAdminAuth();
  const [mode, setMode] = useState<"all" | "selected">("all");
  const [subscribers, setSubscribers] = useState<WaitlistEntry[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customList, setCustomList] = useState<string[]>([]);
  const [customOpen, setCustomOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customErr, setCustomErr] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    total: number;
    queued: number;
    failed: number;
  } | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const result = await fetchWaitlist(token);
      if (result.ok) setSubscribers(result.entries);
    } catch {
      /* ignore */
    }

    try {
      const res = await fetch("/api/admin/campaigns");
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns);
      }
    } catch {
      /* ignore */
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const byEmail = useMemo(
    () => new Map(subscribers.map((s) => [s.email, s])),
    [subscribers]
  );

  /** Waitlist emails that can resolve variables. */
  const registeredEmails = useMemo(
    () => new Set(subscribers.map((s) => (s.email || "").toLowerCase())),
    [subscribers]
  );

  /** Custom emails that have no waitlist profile data. */
  const unregistered = customList.filter(
    (email) => !registeredEmails.has(email.toLowerCase())
  );

  /** Vars for the selected recipients, used by the field preview tooltip. */
  const preview = useMemo<PreviewRecipient[]>(() => {
    if (mode !== "selected") return [];
    const list: PreviewRecipient[] = [];
    for (const email of [...selected]) {
      const s = byEmail.get(email);
      if (!s) continue;
      list.push({
        email: email || "",
        name: s.name || "",
        vars: buildTemplateVars(s),
      });
    }
    return list;
  }, [mode, selected, byEmail]);

  /** Strip tags from rich HTML to get the plain-text version for the email. */
  const textFromHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return (doc.body.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
  };

  async function send() {
    setError("");
    setResult(null);
    if (!token) {
      setError("You must be signed in to send emails.");
      return;
    }
    if (!subject.trim()) {
      setError("Subject is required.");
      return;
    }
    if (!bodyHtml.trim()) {
      setError("Email body is required.");
      return;
    }

    const pick = (s: WaitlistEntry) => ({
      email: s.email || "",
      name: s.name || "",
      role: s.role || "",
      phone: s.phone || "",
      whatsappOn: !!s.whatsappOn,
      createdAt: s.createdAt || "",
    });

    const registered =
      mode === "all"
        ? subscribers.map(pick)
        : [...selected].map((email) =>
            pick(byEmail.get(email) || { email })
          );

    // Merge registered + custom recipients, deduping by email.
    const seen = new Set<string>();
    const recipients: ReturnType<typeof pick>[] = [];
    for (const r of [
      ...registered,
      ...customList.map((email) => ({
        email,
        name: "",
        role: "",
        phone: "",
        whatsappOn: false,
        createdAt: "",
      })),
    ]) {
      const key = r.email.toLowerCase();
      if (!r.email || seen.has(key)) continue;
      seen.add(key);
      recipients.push(r);
    }

    if (!recipients.length) {
      setError("No recipient emails found.");
      return;
    }

    // Variables need per-recipient profile data; custom emails have none.
    const usesVars = [subject.trim(), bodyHtml].some((t) =>
      /\[[a-zA-Z][a-zA-Z0-9_]*\]/.test(t)
    );
    if (usesVars && unregistered.length) {
      setError(
        `Variables can't be resolved for these recipients — they aren't on the waitlist: ${unregistered.join(", ")}. Register them first, or remove the variables.`
      );
      return;
    }

    setSending(true);
    try {
      let queued = 0;
      let failed = 0;

      if (!usesVars) {
        // Same content for everyone → one bulk call to the hosted backend.
        const res = await sendBroadcastEmail(token, {
          emails: recipients.map((r) => r.email),
          subject: subject.trim(),
          message: textFromHtml(bodyHtml) || undefined,
          html: bodyHtml,
        });
        if (!res.ok) {
          setError(res.message || "Failed to send.");
          setResult({ total: recipients.length, queued: 0, failed: recipients.length });
          return;
        }
        queued = res.queuedCount ?? recipients.length;
      } else {
        // Personalized content → one call per recipient with rendered templates.
        for (const r of recipients) {
          const vars = buildTemplateVars(r);
          const html = renderTemplate(bodyHtml, vars);
          const res = await sendBroadcastEmail(token, {
            emails: [r.email],
            subject: renderTemplate(subject.trim(), vars),
            message: textFromHtml(html) || undefined,
            html,
          });
          if (res.ok) queued++;
          else failed++;
        }
      }

      setResult({ total: recipients.length, queued, failed });
      await load();
    } catch {
      setError("Network error while sending.");
      setResult({ total: recipients.length, queued: 0, failed: recipients.length });
    } finally {
      setSending(false);
    }
  }

  const allChecked = subscribers.length > 0 && subscribers.every((s) => selected.has(s.email!));

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allChecked) subscribers.forEach((s) => next.delete(s.email!));
      else subscribers.forEach((s) => s.email && next.add(s.email));
      return next;
    });
  }

  function addCustom() {
    const emails = customInput
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);
    if (!emails.length) return;
    const invalid = emails.filter((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    if (invalid.length) {
      setCustomErr(`Invalid email${invalid.length === 1 ? "" : "s"}: ${invalid.join(", ")}`);
      return;
    }
    setCustomList((prev) => [...new Set([...prev, ...emails.map((e) => e.toLowerCase())])]);
    setCustomInput("");
    setCustomErr("");
  }

  function removeCustom(email: string) {
    setCustomList((prev) => prev.filter((e) => e !== email));
  }

  if (!token) {
    return (
      <AdminShell>
        <div style={{ padding: 24 }}>Checking session…</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <h1 style={{ margin: "0 0 20px", fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>
        Send email
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {/* Compose card */}
        <div
          style={{
            background: "var(--surface-card)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-card)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Compose</h3>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setMode("all")}
              aria-pressed={mode === "all"}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                background: mode === "all" ? "var(--blue-600)" : "rgba(39,34,53,0.05)",
                color: mode === "all" ? "white" : "var(--ink-900)",
              }}
            >
              All subscribers ({subscribers.length})
            </button>
            <button
              onClick={() => setMode("selected")}
              aria-pressed={mode === "selected"}
              style={{
                flex: "0 0 auto",
                padding: "10px 14px",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                background: mode === "selected" ? "var(--blue-600)" : "rgba(39,34,53,0.05)",
                color: mode === "selected" ? "white" : "var(--ink-900)",
              }}
            >
              Selected ({selected.size})
            </button>
            <button
              onClick={() => setCustomOpen(true)}
              title="Add recipients not on the waitlist"
              aria-label="Add recipients not on the waitlist"
              style={{
                flex: "0 0 auto",
                width: 40,
                height: 40,
                padding: 0,
                border: "1px solid var(--line-200)",
                borderRadius: "var(--radius-md)",
                background: "#fff",
                color: "var(--ink-900)",
                fontSize: 20,
                lineHeight: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              +
            </button>
          </div>

          {customList.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {customList.map((email) => (
                <span
                  key={email}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 8px 4px 10px",
                    borderRadius: "var(--radius-pill)",
                    background: "rgba(78,28,216,0.08)",
                    color: "var(--purple-600)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {email}
                  <button
                    onClick={() => removeCustom(email)}
                    title={`Remove ${email}`}
                    aria-label={`Remove ${email}`}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "inherit",
                      fontSize: 14,
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {mode === "selected" && (
            <div
              style={{
                border: "1px solid var(--line-200)",
                borderRadius: "var(--radius-md)",
                maxHeight: 180,
                overflow: "auto",
              }}
            >
              <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--line-100)" }}>
                <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                  Select all ({subscribers.length})
                </label>
              </div>
              {subscribers.map((s) => (
                <label
                  key={s._id || s.email}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(s.email!)}
                    onChange={() => {
                      const e = s.email!;
                      setSelected((prev) => {
                        const next = new Set(prev);
                        if (next.has(e)) next.delete(e);
                        else next.add(e);
                        return next;
                      });
                    }}
                  />
                  {s.email || "—"}
                </label>
              ))}
            </div>
          )}

          <VariableField
            value={subject}
            onChange={setSubject}
            placeholder="Subject (e.g. Hi [firstName], your invite is ready)"
            ariaLabel="Email subject"
            preview={preview}
          />

          <RichEditor
            value={bodyHtml}
            onChange={setBodyHtml}
            placeholder="Compose your email… Use the ＋ Variable button to add subscriber names, emails, etc."
            ariaLabel="Email body"
            preview={preview}
          />

          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            A plain-text version is generated automatically from the formatted body.
          </span>

          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Sending to {(mode === "all" ? subscribers.length : selected.size) + customList.length}{" "}
            recipient{(mode === "all" ? subscribers.length : selected.size) + customList.length === 1 ? "" : "s"}.
          </div>

          {error && (
            <span style={{ fontSize: 13, color: "var(--error-500)", fontWeight: 500 }}>{error}</span>
          )}

          <button
            onClick={send}
            disabled={sending}
            style={{
              height: 46,
              border: "none",
              borderRadius: "var(--radius-pill)",
              background: "var(--accent)",
              color: "white",
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: 16,
              cursor: sending ? "not-allowed" : "pointer",
              opacity: sending ? 0.6 : 1,
            }}
          >
            {sending ? "Sending…" : "Send email"}
          </button>

          {result && (
            <Modal open={!!result} onClose={() => setResult(null)}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "center" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    margin: "0 auto",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    background:
                      result.failed === result.total
                        ? "rgba(239,68,68,0.12)"
                        : "rgba(16,185,129,0.12)",
                    color:
                      result.failed === result.total ? "var(--error-500)" : "var(--success-500)",
                  }}
                >
                  {result.failed === result.total ? "✕" : "✓"}
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  {result.failed === result.total
                    ? "Send failed"
                    : result.failed > 0
                      ? "Partly queued"
                      : "Email queued"}
                </h3>
                <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Queued <strong>{result.queued}</strong> of <strong>{result.total}</strong> email
                  {result.total === 1 ? "" : "s"}.
                  {result.failed > 0 && (
                    <>
                      {" "}
                      <span style={{ color: "var(--error-500)" }}>
                        {result.failed} failed.
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setResult(null)}
                  style={{
                    height: 44,
                    border: "none",
                    borderRadius: "var(--radius-pill)",
                    background: "var(--accent)",
                    color: "white",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: 15,
                    cursor: "pointer",
                    marginTop: 4,
                  }}
                >
                  Done
                </button>
              </div>
            </Modal>
          )}

          {customOpen && (
            <Modal open={customOpen} onClose={() => setCustomOpen(false)}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Add recipients</h3>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  These emails aren't on the waitlist. They'll receive the same content —
                  variables like [firstName] won't resolve for them.
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustom();
                      }
                    }}
                    placeholder="jane@example.com, john@example.com"
                    aria-label="Custom email addresses"
                    style={{
                      flex: 1,
                      outline: "none",
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface-input)",
                      boxShadow: "inset 0 0 0 0.5px var(--surface-input-border)",
                      padding: "0 12px",
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--ink-900)",
                      boxSizing: "border-box",
                      height: 42,
                    }}
                  />
                  <button
                    onClick={addCustom}
                    style={{
                      height: 42,
                      padding: "0 16px",
                      border: "none",
                      borderRadius: "var(--radius-pill)",
                      background: "var(--accent)",
                      color: "white",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 500,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                </div>
                {customErr && (
                  <span style={{ fontSize: 13, color: "var(--error-500)", fontWeight: 500 }}>
                    {customErr}
                  </span>
                )}
                {customList.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      maxHeight: 180,
                      overflow: "auto",
                    }}
                  >
                    {customList.map((email) => (
                      <div
                        key={email}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          padding: "8px 12px",
                          border: "1px solid var(--line-100)",
                          borderRadius: "var(--radius-md)",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {email}
                        <button
                          onClick={() => removeCustom(email)}
                          title={`Remove ${email}`}
                          aria-label={`Remove ${email}`}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "var(--error-500)",
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 600,
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setCustomOpen(false)}
                  style={{
                    height: 44,
                    border: "none",
                    borderRadius: "var(--radius-pill)",
                    background: "rgba(39,34,53,0.06)",
                    color: "var(--ink-900)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Done
                </button>
              </div>
            </Modal>
          )}
        </div>

        {/* Campaign history */}
        <div
          style={{
            background: "var(--surface-card)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-card)",
            padding: 20,
          }}
        >
          <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>Campaign history</h3>
          {campaigns.length === 0 ? (
            <div style={{ fontSize: 14, color: "var(--text-faint)", fontWeight: 500 }}>
              No campaigns sent yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {campaigns.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: "12px 14px",
                    border: "1px solid var(--line-100)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{c.subject}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {new Date(c.created_at).toLocaleString()} · {c.total} recipients ·{" "}
                    <span style={{ color: "var(--success-500)" }}>{c.sent} sent</span>
                    {c.failed > 0 && (
                      <span style={{ color: "var(--error-500)" }}> · {c.failed} failed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

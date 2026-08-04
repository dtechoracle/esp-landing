"use client";

import { useRef, useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { waitlistSignup } from "@/lib/backend-client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s().-]{7,}$/;

const sel = { bg: "var(--blue-600)", color: "white", ring: "none" };
const unsel = {
  bg: "rgba(39,34,53,0.05)",
  color: "var(--ink-900)",
  ring: "none",
};

const inputStyle: React.CSSProperties = {
  height: 46,
  border: "none",
  outline: "none",
  borderRadius: "var(--radius-md)",
  background: "var(--surface-input)",
  boxShadow: "inset 0 0 0 0.5px var(--surface-input-border)",
  padding: "0 16px",
  fontFamily: "var(--font-sans)",
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: "-0.015em",
  color: "var(--ink-900)",
  boxSizing: "border-box",
};

export default function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"planner" | "venue_owner">("planner");
  const [whatsappOn, setWhatsappOn] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState("");
  const [modal, setModal] = useState<{
    type: "success" | "error";
    message?: string;
  } | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const confirmCopy = whatsappOn
    ? "We'll email you and add you to our WhatsApp channel the moment early access opens."
    : "We'll email you the moment early access opens.";

  function reset() {
    setModal(null);
    setStatus("idle");
    setError("");
    setEmail("");
    setName("");
    setPhone("");
    setWhatsappOn(false);
  }

  async function submit() {
    setError("");
    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      emailRef.current?.focus();
      return;
    }
    if (whatsappOn && !PHONE_RE.test(phone)) {
      setError("Enter a valid phone number for WhatsApp updates.");
      return;
    }

    setStatus("submitting");
    try {
      const result = await waitlistSignup({
        email: email.trim(),
        name: name.trim(),
        role,
        whatsappOn,
        phone: phone.trim(),
      });

      if (result.ok || result.status === 409) {
        setStatus("idle");
        setModal({
          type: "success",
          message:
            result.status === 409
              ? "That email is already on the list, we'll be in touch soon!"
              : confirmCopy,
        });
        return;
      }

      setStatus("idle");
      setModal({
        type: "error",
        message:
          result.message ||
          "We couldn't add you to the waitlist. Please try again in a moment.",
      });
    } catch {
      setStatus("idle");
      setModal({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  }

  return (
    <div
      id="waitlist"
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 480,
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.015em" }}>
        Get early access
      </span>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Your name"
        aria-label="Your name"
        style={{ ...inputStyle, width: "100%" }}
      />

      <div style={{ display: "flex", gap: 10 }}>
        {(
          [
            ["planner", "Event planner"],
            ["venue_owner", "Venue owner"],
          ] as const
        ).map(([key, label]) => {
          const active = role === key;
          const s = active ? sel : unsel;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setRole(key)}
              aria-pressed={active}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                height: 44,
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.015em",
                border: "none",
                fontFamily: "var(--font-sans)",
                transition: "all 150ms ease",
                background: s.bg,
                color: s.color,
                boxShadow: s.ring,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="esp-waitlist-actions" style={{ display: "flex", gap: 10 }}>
        <input
          ref={emailRef}
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          style={{ ...inputStyle, flex: 1, minWidth: 0 }}
          aria-label="Email address"
        />
        <Button size="md" onClick={submit} disabled={status === "submitting"}>
          {status === "submitting" ? "Joining…" : "Join"}
        </Button>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "-0.015em",
          color: "var(--ink-900)",
        }}
      >
        <input
          type="checkbox"
          checked={whatsappOn}
          onChange={() => {
            setWhatsappOn((v) => !v);
            setError("");
          }}
          style={{ display: "none" }}
        />
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            flexShrink: 0,
            transition: "all 150ms ease",
            background: whatsappOn ? "var(--blue-600)" : "var(--surface-input)",
            color: "white",
            boxShadow: whatsappOn
              ? "none"
              : "inset 0 0 0 1px var(--surface-input-border)",
          }}
        >
          {whatsappOn ? "✓" : ""}
        </span>
        Add me to the WhatsApp channel for updates, tips and special offers
      </label>

      {whatsappOn && (
        <input
          type="tel"
          placeholder="+1 555 000 0000"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          style={{ ...inputStyle, width: "100%" }}
          aria-label="WhatsApp phone number"
        />
      )}

      {error && (
        <span style={{ fontSize: 13, color: "var(--error-500)", fontWeight: 500 }}>
          {error}
        </span>
      )}

      <span style={{ fontSize: 12, color: "var(--text-faint)", fontWeight: 400 }}>
        No spam. One email when your invite is ready.
      </span>

      {/* Success modal */}
      <Modal
        open={modal?.type === "success"}
        onClose={reset}
        labelledBy="waitlist-success"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <span
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(16,185,129,0.12)",
              color: "var(--success-500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            ✓
          </span>
          <h2
            id="waitlist-success"
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              textAlign: "left",
            }}
          >
            You&apos;re on the list!
          </h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--text-muted)", fontWeight: 500, lineHeight: 1.45 }}>
            {modal?.message || confirmCopy}
          </p>
          <Button size="md" onClick={reset} style={{ width: "100%" }}>
            Done
          </Button>
        </div>
      </Modal>

      {/* Error modal */}
      <Modal
        open={modal?.type === "error"}
        onClose={() => setModal(null)}
        labelledBy="waitlist-error"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <span
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(239,68,68,0.12)",
              color: "var(--error-500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            ✕
          </span>
          <h2
            id="waitlist-error"
            style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", textAlign: "left" }}
          >
            Something went wrong
          </h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--text-muted)", fontWeight: 500, lineHeight: 1.45 }}>
            {modal?.message ||
              "We couldn't add you to the waitlist. Please try again in a moment."}
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" onClick={() => setModal(null)}>
              Try again
            </Button>
            <Button variant="ghost" onClick={reset}>
              Clear form
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
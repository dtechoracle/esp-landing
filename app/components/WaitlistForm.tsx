"use client";

import { useRef, useState } from "react";
import Button from "./Button";
import { waitlistSignup } from "@/lib/backend-client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s().-]{7,}$/;

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
  const [role, setRole] = useState("Event planner");
  const [whatsappOn, setWhatsappOn] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

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
        setError("");
        return;
      }

      setStatus("idle");
      setError(result.message || "We couldn't add you to the waitlist. Please try again in a moment.");
    } catch {
      setStatus("idle");
      setError("Network error. Please check your connection and try again.");
    }
  }

  return (
    <div
      id="waitlist"
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 480,
        boxSizing: "border-box",
        border: "1px solid var(--line-200)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.015em" }}>
          Get early access
        </span>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>Your name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Your name"
          aria-label="Your name"
          style={{ ...inputStyle, width: "100%" }}
        />
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>I&apos;m a…</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ ...inputStyle, width: "100%", cursor: "pointer" }}
        >
          <option value="event_planner">Event planner</option>
          <option value="decorator">Decorator</option>
          <option value="venue_staff">Venue / Venue staff</option>
          <option value="other_creative_pro">Other creative pro</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>Work email</span>
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
          style={{ ...inputStyle, width: "100%" }}
          aria-label="Work email"
        />
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
        Add me to the WhatsApp community and channel for updates, tips and special offers
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
          aria-label="WhatsApp number"
        />
      )}

      {error && (
        <span style={{ fontSize: 13, color: "var(--error-500)", fontWeight: 500 }}>
          {error}
        </span>
      )}

      <Button size="lg" onClick={submit} disabled={status === "submitting"} style={{ width: "100%" }}>
        {status === "submitting" ? "Joining…" : "Join the waitlist"}
      </Button>

      <span style={{ fontSize: 12, color: "var(--text-faint)", fontWeight: 400 }}>
        No spam. One email when your invite is ready.
      </span>

    </div>
  );
}
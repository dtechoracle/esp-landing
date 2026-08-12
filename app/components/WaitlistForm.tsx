"use client";

import { Fragment, useRef, useState } from "react";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("event_planner");
  const [whatsappOn, setWhatsappOn] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  async function submit() {
    setError("");
    if (!firstName.trim()) {
      setError("Enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      setError("Enter your last name.");
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
        name: `${firstName.trim()} ${lastName.trim()}`,
        role,
        whatsappOn,
        phone: phone.trim(),
      });

      if (result.ok || result.status === 409) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setRole("event_planner");
        setWhatsappOn(false);
        setStatus("idle");
        setError("");
        setShowSuccess(true);
        if (whatsappOn) {
          setTimeout(() => {
            window.open("https://whatsapp.com/channel/0029VbDahNlLdQej7Bpe5L3t", "_blank");
          }, 3000);
        }
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
    <>
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
        <div style={{ display: "flex", gap: 10, width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>First name</span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="First name"
              aria-label="First name"
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>Last name</span>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Last name"
              aria-label="Last name"
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>
        </div>
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

      {showSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowSuccess(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface-card)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-card)",
              padding: 32,
              maxWidth: 400,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(16,185,129,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              ✓
            </div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>You&apos;re on the list!</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>
              We&apos;ll send you an email when your invite is ready.
              {whatsappOn && (
                <span> Redirecting to WhatsApp in 3 seconds…</span>
              )}
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              style={{
                height: 44,
                padding: "0 24px",
                border: "none",
                borderRadius: "var(--radius-pill)",
                background: "var(--accent)",
                color: "white",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
                marginTop: 8,
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
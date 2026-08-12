"use client";

import { Fragment, useRef, useState, useMemo } from "react";
import Button from "./Button";
import { waitlistSignup } from "@/lib/backend-client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s().-]{7,}$/;

const countries = [
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "+971", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+51", flag: "🇵🇪", name: "Peru" },
  { code: "+58", flag: "🇻🇪", name: "Venezuela" },
  { code: "+593", flag: "🇪🇨", name: "Ecuador" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay" },
  { code: "+591", flag: "🇧🇴", name: "Bolivia" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+64", flag: "🇳🇿", name: "New Zealand" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "+213", flag: "🇩🇿", name: "Algeria" },
  { code: "+216", flag: "🇹🇳", name: "Tunisia" },
  { code: "+218", flag: "🇱🇾", name: "Libya" },
  { code: "+249", flag: "🇸🇩", name: "Sudan" },
  { code: "+251", flag: "🇪🇹", name: "Ethiopia" },
  { code: "+252", flag: "🇸🇴", name: "Somalia" },
  { code: "+253", flag: "🇩🇯", name: "Djibouti" },
  { code: "+255", flag: "🇹🇿", name: "Tanzania" },
  { code: "+256", flag: "🇺🇬", name: "Uganda" },
  { code: "+257", flag: "🇧🇮", name: "Burundi" },
  { code: "+260", flag: "🇿🇲", name: "Zambia" },
  { code: "+263", flag: "🇿🇼", name: "Zimbabwe" },
  { code: "+264", flag: "🇳🇦", name: "Namibia" },
  { code: "+265", flag: "🇲🇼", name: "Malawi" },
  { code: "+266", flag: "🇱🇸", name: "Lesotho" },
  { code: "+267", flag: "🇧🇼", name: "Botswana" },
  { code: "+268", flag: "🇸🇿", name: "Eswatini" },
  { code: "+269", flag: "🇰🇲", name: "Comoros" },
  { code: "+230", flag: "🇲🇺", name: "Mauritius" },
  { code: "+248", flag: "🇸🇨", name: "Seychelles" },
  { code: "+243", flag: "🇨🇩", name: "DR Congo" },
  { code: "+242", flag: "🇨🇬", name: "Republic of Congo" },
  { code: "+236", flag: "🇨🇫", name: "Central African Republic" },
  { code: "+235", flag: "🇹🇩", name: "Chad" },
  { code: "+237", flag: "🇨🇲", name: "Cameroon" },
  { code: "+240", flag: "🇬🇶", name: "Equatorial Guinea" },
  { code: "+241", flag: "🇬🇦", name: "Gabon" },
  { code: "+228", flag: "🇹🇬", name: "Togo" },
  { code: "+229", flag: "🇧🇯", name: "Benin" },
  { code: "+226", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "+225", flag: "🇨🇮", name: "Ivory Coast" },
  { code: "+223", flag: "🇲🇱", name: "Mali" },
  { code: "+221", flag: "🇸🇳", name: "Senegal" },
  { code: "+220", flag: "🇬🇲", name: "Gambia" },
  { code: "+224", flag: "🇬🇳", name: "Guinea" },
  { code: "+238", flag: "🇨🇻", name: "Cape Verde" },
  { code: "+239", flag: "🇸🇹", name: "São Tomé and Príncipe" },
  { code: "+244", flag: "🇦🇴", name: "Angola" },
  { code: "+245", flag: "🇬🇼", name: "Guinea-Bissau" },
  { code: "+98", flag: "🇮🇷", name: "Iran" },
  { code: "+964", flag: "🇮🇶", name: "Iraq" },
  { code: "+972", flag: "🇮🇱", name: "Israel" },
  { code: "+970", flag: "🇵🇸", name: "Palestine" },
  { code: "+962", flag: "🇯🇴", name: "Jordan" },
  { code: "+961", flag: "🇱🇧", name: "Lebanon" },
  { code: "+963", flag: "🇸🇾", name: "Syria" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+960", flag: "🇲🇻", name: "Maldives" },
  { code: "+975", flag: "🇧🇹", name: "Bhutan" },
  { code: "+95", flag: "🇲🇲", name: "Myanmar" },
  { code: "+856", flag: "🇱🇦", name: "Laos" },
  { code: "+855", flag: "🇰🇭", name: "Cambodia" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },
  { code: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+852", flag: "🇭🇰", name: "Hong Kong" },
  { code: "+853", flag: "🇲🇴", name: "Macau" },
  { code: "+886", flag: "🇹🇼", name: "Taiwan" },
  { code: "+850", flag: "🇰🇵", name: "North Korea" },
  { code: "+976", flag: "🇲🇳", name: "Mongolia" },
  { code: "+7", flag: "🇰🇿", name: "Kazakhstan" },
  { code: "+998", flag: "🇺🇿", name: "Uzbekistan" },
  { code: "+992", flag: "🇹🇯", name: "Tajikistan" },
  { code: "+996", flag: "🇰🇬", name: "Kyrgyzstan" },
  { code: "+993", flag: "🇹🇲", name: "Turkmenistan" },
  { code: "+994", flag: "🇦🇿", name: "Azerbaijan" },
  { code: "+995", flag: "🇬🇪", name: "Georgia" },
  { code: "+374", flag: "🇦🇲", name: "Armenia" },
  { code: "+380", flag: "🇺🇦", name: "Ukraine" },
  { code: "+375", flag: "🇧🇾", name: "Belarus" },
  { code: "+373", flag: "🇲🇩", name: "Moldova" },
  { code: "+48", flag: "🇵🇱", name: "Poland" },
  { code: "+420", flag: "🇨🇿", name: "Czech Republic" },
  { code: "+421", flag: "🇸🇰", name: "Slovakia" },
  { code: "+36", flag: "🇭🇺", name: "Hungary" },
  { code: "+40", flag: "🇷🇴", name: "Romania" },
  { code: "+359", flag: "🇧🇬", name: "Bulgaria" },
  { code: "+381", flag: "🇷🇸", name: "Serbia" },
  { code: "+382", flag: "🇲🇪", name: "Montenegro" },
  { code: "+387", flag: "🇧🇦", name: "Bosnia and Herzegovina" },
  { code: "+389", flag: "🇲🇰", name: "North Macedonia" },
  { code: "+355", flag: "🇦🇱", name: "Albania" },
  { code: "+385", flag: "🇭🇷", name: "Croatia" },
  { code: "+386", flag: "🇸🇮", name: "Slovenia" },
  { code: "+386", flag: "🇸🇮", name: "Slovenia" },
  { code: "+352", flag: "🇱🇺", name: "Luxembourg" },
  { code: "+354", flag: "🇮🇸", name: "Iceland" },
  { code: "+353", flag: "🇮🇪", name: "Ireland" },
  { code: "+356", flag: "🇲🇹", name: "Malta" },
  { code: "+350", flag: "🇬🇮", name: "Gibraltar" },
  { code: "+370", flag: "🇱🇹", name: "Lithuania" },
  { code: "+371", flag: "🇱🇻", name: "Latvia" },
  { code: "+372", flag: "🇪🇪", name: "Estonia" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "+32", flag: "🇧🇪", name: "Belgium" },
  { code: "+41", flag: "🇨🇭", name: "Switzerland" },
  { code: "+43", flag: "🇦🇹", name: "Austria" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "+47", flag: "🇳🇴", name: "Norway" },
  { code: "+45", flag: "🇩🇰", name: "Denmark" },
  { code: "+358", flag: "🇫🇮", name: "Finland" },
  { code: "+354", flag: "🇮🇸", name: "Iceland" },
  { code: "+90", flag: "🇹🇷", name: "Turkey" },
  { code: "+679", flag: "🇫🇯", name: "Fiji" },
  { code: "+685", flag: "🇼🇸", name: "Samoa" },
  { code: "+676", flag: "🇹🇴", name: "Tonga" },
  { code: "+688", flag: "🇹🇻", name: "Tuvalu" },
  { code: "+692", flag: "🇲🇭", name: "Marshall Islands" },
  { code: "+691", flag: "🇫🇲", name: "Micronesia" },
  { code: "+670", flag: "🇹🇱", name: "Timor-Leste" },
  { code: "+673", flag: "🇧🇳", name: "Brunei" },
  { code: "+998", flag: "🇺🇿", name: "Uzbekistan" },
  { code: "+1", flag: "🇯🇲", name: "Jamaica" },
  { code: "+1", flag: "🇹🇹", name: "Trinidad and Tobago" },
  { code: "+1", flag: "🇧🇧", name: "Barbados" },
  { code: "+1", flag: "🇦🇬", name: "Antigua and Barbuda" },
  { code: "+1", flag: "🇩🇲", name: "Dominica" },
  { code: "+1", flag: "🇬🇩", name: "Grenada" },
  { code: "+1", flag: "🇰🇳", name: "Saint Kitts and Nevis" },
  { code: "+1", flag: "🇱🇨", name: "Saint Lucia" },
  { code: "+1", flag: "🇻🇨", name: "Saint Vincent and the Grenadines" },
  { code: "+501", flag: "🇧🇿", name: "Belize" },
  { code: "+502", flag: "🇬🇹", name: "Guatemala" },
  { code: "+503", flag: "🇸🇻", name: "El Salvador" },
  { code: "+504", flag: "🇭🇳", name: "Honduras" },
  { code: "+505", flag: "🇳🇮", name: "Nicaragua" },
  { code: "+506", flag: "🇨🇷", name: "Costa Rica" },
  { code: "+507", flag: "🇵🇦", name: "Panama" },
  { code: "+509", flag: "🇭🇹", name: "Haiti" },
  { code: "+1", flag: "🇩🇴", name: "Dominican Republic" },
  { code: "+502", flag: "🇵🇷", name: "Puerto Rico" },
  { code: "+592", flag: "🇬🇾", name: "Guyana" },
  { code: "+597", flag: "🇸🇷", name: "Suriname" },
];

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
  const [countryCode, setCountryCode] = useState("+1");
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
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
        phone: `${countryCode}${phone.trim()}`,
      });

      if (result.ok || result.status === 409) {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setCountryCode("+1");
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
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>WhatsApp number</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => { setCountryModalOpen(true); setCountrySearch(""); }}
              style={{
                ...inputStyle,
                width: 130,
                flexShrink: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                textAlign: "left",
              }}
            >
              {(() => {
                const found = countries.find((c) => c.code === countryCode);
                return found ? <>{found.flag} {found.code}</> : <>{countryCode}</>;
              })()}
            </button>
            <input
              type="tel"
              placeholder="555 000 0000"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={{ ...inputStyle, width: "100%" }}
              aria-label="WhatsApp number"
            />
          </div>
        </div>
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

      {countryModalOpen && (
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
          onClick={() => setCountryModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface-card)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-card)",
              padding: 0,
              maxWidth: 380,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              maxHeight: "70vh",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "16px 16px 0" }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Select country</div>
              <input
                type="text"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder="Search country name or code…"
                autoFocus
                style={{
                  width: "100%",
                  height: 40,
                  border: "none",
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
                }}
              />
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {countries
                .filter((c) => {
                  const q = countrySearch.toLowerCase();
                  if (!q) return true;
                  return (
                    c.name.toLowerCase().includes(q) ||
                    c.code.includes(q) ||
                    c.flag.includes(q)
                  );
                })
                .map((c, i) => (
                  <button
                    key={`${c.code}-${c.name}-${i}`}
                    onClick={() => { setCountryCode(c.code); setCountryModalOpen(false); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "10px 16px",
                      border: "none",
                      background: c.code === countryCode ? "rgba(0,86,169,0.08)" : "transparent",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      fontSize: 14,
                      fontWeight: c.code === countryCode ? 600 : 400,
                      color: "var(--ink-900)",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => { if (c.code !== countryCode) e.currentTarget.style.background = "rgba(39,34,53,0.04)"; }}
                    onMouseLeave={(e) => { if (c.code !== countryCode) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{c.flag}</span>
                    <span style={{ flex: 1 }}>{c.name}</span>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{c.code}</span>
                  </button>
                ))}
            </div>
            <div style={{ padding: "8px 16px", borderTop: "1px solid var(--line-100)" }}>
              <button
                onClick={() => setCountryModalOpen(false)}
                style={{
                  width: "100%",
                  height: 40,
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(39,34,53,0.05)",
                  color: "var(--ink-900)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
"use client";

import { Fragment, useRef, useState, useMemo } from "react";
import Button from "./Button";
import { waitlistSignup } from "@/lib/backend-client";
import * as FlagIcons from "country-flag-icons/react/3x2";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s().-]{7,}$/;

const countries = [
  { code: "+1", iso: "us", name: "United States" },
  { code: "+1", iso: "ca", name: "Canada" },
  { code: "+44", iso: "gb", name: "United Kingdom" },
  { code: "+234", iso: "ng", name: "Nigeria" },
  { code: "+27", iso: "za", name: "South Africa" },
  { code: "+254", iso: "ke", name: "Kenya" },
  { code: "+233", iso: "gh", name: "Ghana" },
  { code: "+971", iso: "ae", name: "United Arab Emirates" },
  { code: "+966", iso: "sa", name: "Saudi Arabia" },
  { code: "+91", iso: "in", name: "India" },
  { code: "+86", iso: "cn", name: "China" },
  { code: "+81", iso: "jp", name: "Japan" },
  { code: "+82", iso: "kr", name: "South Korea" },
  { code: "+49", iso: "de", name: "Germany" },
  { code: "+33", iso: "fr", name: "France" },
  { code: "+39", iso: "it", name: "Italy" },
  { code: "+34", iso: "es", name: "Spain" },
  { code: "+351", iso: "pt", name: "Portugal" },
  { code: "+55", iso: "br", name: "Brazil" },
  { code: "+52", iso: "mx", name: "Mexico" },
  { code: "+54", iso: "ar", name: "Argentina" },
  { code: "+56", iso: "cl", name: "Chile" },
  { code: "+57", iso: "co", name: "Colombia" },
  { code: "+51", iso: "pe", name: "Peru" },
  { code: "+58", iso: "ve", name: "Venezuela" },
  { code: "+593", iso: "ec", name: "Ecuador" },
  { code: "+595", iso: "py", name: "Paraguay" },
  { code: "+598", iso: "uy", name: "Uruguay" },
  { code: "+591", iso: "bo", name: "Bolivia" },
  { code: "+61", iso: "au", name: "Australia" },
  { code: "+64", iso: "nz", name: "New Zealand" },
  { code: "+20", iso: "eg", name: "Egypt" },
  { code: "+212", iso: "ma", name: "Morocco" },
  { code: "+213", iso: "dz", name: "Algeria" },
  { code: "+216", iso: "tn", name: "Tunisia" },
  { code: "+218", iso: "ly", name: "Libya" },
  { code: "+249", iso: "sd", name: "Sudan" },
  { code: "+251", iso: "et", name: "Ethiopia" },
  { code: "+252", iso: "so", name: "Somalia" },
  { code: "+253", iso: "dj", name: "Djibouti" },
  { code: "+255", iso: "tz", name: "Tanzania" },
  { code: "+256", iso: "ug", name: "Uganda" },
  { code: "+257", iso: "bi", name: "Burundi" },
  { code: "+260", iso: "zm", name: "Zambia" },
  { code: "+263", iso: "zw", name: "Zimbabwe" },
  { code: "+264", iso: "na", name: "Namibia" },
  { code: "+265", iso: "mw", name: "Malawi" },
  { code: "+266", iso: "ls", name: "Lesotho" },
  { code: "+267", iso: "bw", name: "Botswana" },
  { code: "+268", iso: "sz", name: "Eswatini" },
  { code: "+269", iso: "km", name: "Comoros" },
  { code: "+230", iso: "mu", name: "Mauritius" },
  { code: "+248", iso: "sc", name: "Seychelles" },
  { code: "+243", iso: "cd", name: "DR Congo" },
  { code: "+242", iso: "cg", name: "Republic of Congo" },
  { code: "+236", iso: "cf", name: "Central African Republic" },
  { code: "+235", iso: "td", name: "Chad" },
  { code: "+237", iso: "cm", name: "Cameroon" },
  { code: "+240", iso: "gq", name: "Equatorial Guinea" },
  { code: "+241", iso: "ga", name: "Gabon" },
  { code: "+228", iso: "tg", name: "Togo" },
  { code: "+229", iso: "bj", name: "Benin" },
  { code: "+226", iso: "bf", name: "Burkina Faso" },
  { code: "+225", iso: "ci", name: "Ivory Coast" },
  { code: "+223", iso: "ml", name: "Mali" },
  { code: "+221", iso: "sn", name: "Senegal" },
  { code: "+220", iso: "gm", name: "Gambia" },
  { code: "+224", iso: "gn", name: "Guinea" },
  { code: "+238", iso: "cv", name: "Cape Verde" },
  { code: "+239", iso: "st", name: "São Tomé and Príncipe" },
  { code: "+244", iso: "ao", name: "Angola" },
  { code: "+245", iso: "gw", name: "Guinea-Bissau" },
  { code: "+98", iso: "ir", name: "Iran" },
  { code: "+964", iso: "iq", name: "Iraq" },
  { code: "+972", iso: "il", name: "Israel" },
  { code: "+970", iso: "ps", name: "Palestine" },
  { code: "+962", iso: "jo", name: "Jordan" },
  { code: "+961", iso: "lb", name: "Lebanon" },
  { code: "+963", iso: "sy", name: "Syria" },
  { code: "+968", iso: "om", name: "Oman" },
  { code: "+974", iso: "qa", name: "Qatar" },
  { code: "+973", iso: "bh", name: "Bahrain" },
  { code: "+965", iso: "kw", name: "Kuwait" },
  { code: "+977", iso: "np", name: "Nepal" },
  { code: "+94", iso: "lk", name: "Sri Lanka" },
  { code: "+92", iso: "pk", name: "Pakistan" },
  { code: "+880", iso: "bd", name: "Bangladesh" },
  { code: "+960", iso: "mv", name: "Maldives" },
  { code: "+975", iso: "bt", name: "Bhutan" },
  { code: "+95", iso: "mm", name: "Myanmar" },
  { code: "+856", iso: "la", name: "Laos" },
  { code: "+855", iso: "kh", name: "Cambodia" },
  { code: "+84", iso: "vn", name: "Vietnam" },
  { code: "+66", iso: "th", name: "Thailand" },
  { code: "+60", iso: "my", name: "Malaysia" },
  { code: "+65", iso: "sg", name: "Singapore" },
  { code: "+63", iso: "ph", name: "Philippines" },
  { code: "+62", iso: "id", name: "Indonesia" },
  { code: "+852", iso: "hk", name: "Hong Kong" },
  { code: "+853", iso: "mo", name: "Macau" },
  { code: "+886", iso: "tw", name: "Taiwan" },
  { code: "+850", iso: "kp", name: "North Korea" },
  { code: "+976", iso: "mn", name: "Mongolia" },
  { code: "+7", iso: "kz", name: "Kazakhstan" },
  { code: "+998", iso: "uz", name: "Uzbekistan" },
  { code: "+992", iso: "tj", name: "Tajikistan" },
  { code: "+996", iso: "kg", name: "Kyrgyzstan" },
  { code: "+993", iso: "tm", name: "Turkmenistan" },
  { code: "+994", iso: "az", name: "Azerbaijan" },
  { code: "+995", iso: "ge", name: "Georgia" },
  { code: "+374", iso: "am", name: "Armenia" },
  { code: "+380", iso: "ua", name: "Ukraine" },
  { code: "+375", iso: "by", name: "Belarus" },
  { code: "+373", iso: "md", name: "Moldova" },
  { code: "+48", iso: "pl", name: "Poland" },
  { code: "+420", iso: "cz", name: "Czech Republic" },
  { code: "+421", iso: "sk", name: "Slovakia" },
  { code: "+36", iso: "hu", name: "Hungary" },
  { code: "+40", iso: "ro", name: "Romania" },
  { code: "+359", iso: "bg", name: "Bulgaria" },
  { code: "+381", iso: "rs", name: "Serbia" },
  { code: "+382", iso: "me", name: "Montenegro" },
  { code: "+387", iso: "ba", name: "Bosnia and Herzegovina" },
  { code: "+389", iso: "mk", name: "North Macedonia" },
  { code: "+355", iso: "al", name: "Albania" },
  { code: "+385", iso: "hr", name: "Croatia" },
  { code: "+386", iso: "si", name: "Slovenia" },
  { code: "+352", iso: "lu", name: "Luxembourg" },
  { code: "+354", iso: "is", name: "Iceland" },
  { code: "+353", iso: "ie", name: "Ireland" },
  { code: "+356", iso: "mt", name: "Malta" },
  { code: "+350", iso: "gi", name: "Gibraltar" },
  { code: "+370", iso: "lt", name: "Lithuania" },
  { code: "+371", iso: "lv", name: "Latvia" },
  { code: "+372", iso: "ee", name: "Estonia" },
  { code: "+31", iso: "nl", name: "Netherlands" },
  { code: "+32", iso: "be", name: "Belgium" },
  { code: "+41", iso: "ch", name: "Switzerland" },
  { code: "+43", iso: "at", name: "Austria" },
  { code: "+46", iso: "se", name: "Sweden" },
  { code: "+47", iso: "no", name: "Norway" },
  { code: "+45", iso: "dk", name: "Denmark" },
  { code: "+358", iso: "fi", name: "Finland" },
  { code: "+90", iso: "tr", name: "Turkey" },
  { code: "+679", iso: "fj", name: "Fiji" },
  { code: "+685", iso: "ws", name: "Samoa" },
  { code: "+676", iso: "to", name: "Tonga" },
  { code: "+688", iso: "tv", name: "Tuvalu" },
  { code: "+692", iso: "mh", name: "Marshall Islands" },
  { code: "+691", iso: "fm", name: "Micronesia" },
  { code: "+670", iso: "tl", name: "Timor-Leste" },
  { code: "+673", iso: "bn", name: "Brunei" },
  { code: "+1", iso: "jm", name: "Jamaica" },
  { code: "+1", iso: "tt", name: "Trinidad and Tobago" },
  { code: "+1", iso: "bb", name: "Barbados" },
  { code: "+1", iso: "ag", name: "Antigua and Barbuda" },
  { code: "+1", iso: "dm", name: "Dominica" },
  { code: "+1", iso: "gd", name: "Grenada" },
  { code: "+1", iso: "kn", name: "Saint Kitts and Nevis" },
  { code: "+1", iso: "lc", name: "Saint Lucia" },
  { code: "+1", iso: "vc", name: "Saint Vincent and the Grenadines" },
  { code: "+501", iso: "bz", name: "Belize" },
  { code: "+502", iso: "gt", name: "Guatemala" },
  { code: "+503", iso: "sv", name: "El Salvador" },
  { code: "+504", iso: "hn", name: "Honduras" },
  { code: "+505", iso: "ni", name: "Nicaragua" },
  { code: "+506", iso: "cr", name: "Costa Rica" },
  { code: "+507", iso: "pa", name: "Panama" },
  { code: "+509", iso: "ht", name: "Haiti" },
  { code: "+1", iso: "do", name: "Dominican Republic" },
  { code: "+1", iso: "pr", name: "Puerto Rico" },
  { code: "+592", iso: "gy", name: "Guyana" },
  { code: "+597", iso: "sr", name: "Suriname" },
];

const priority = ["ng", "gb", "us"];
countries.sort((a, b) => {
  const aIdx = priority.indexOf(a.iso);
  const bIdx = priority.indexOf(b.iso);
  if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
  if (aIdx !== -1) return -1;
  if (bIdx !== -1) return 1;
  return a.name.localeCompare(b.name);
});

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
  const [successMessage, setSuccessMessage] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
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
        phone: whatsappOn ? `${countryCode}${phone.trim()}` : "",
      });

      if (result.ok || result.status === 409) {
        const msg = result.message || "You're on the list! We'll send you an email when your invite is ready.";
        const shouldRedirect = whatsappOn;
        const duplicate = result.status === 409;
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setCountryCode("+1");
        setRole("event_planner");
        setWhatsappOn(false);
        setStatus("idle");
        setError("");
        setSuccessMessage(msg);
        setIsDuplicate(duplicate);
        setShowSuccess(true);
        if (shouldRedirect && !duplicate) {
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
                const Flag = found ? (FlagIcons as Record<string, React.ComponentType<{ title?: string; style?: React.CSSProperties }>>)[found.iso.toUpperCase()] : null;
                return (
                  <>
                    {Flag && found && <Flag title={found.name} style={{ width: 24, height: 16, borderRadius: 2, display: "block" }} />}
                    {found ? found.code : countryCode}
                  </>
                );
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
              maxWidth: 320,
              width: "calc(100% - 48px)",
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
                background: isDuplicate ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              {isDuplicate ? "!" : "✓"}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              {isDuplicate ? "Already registered" : "Success!"}
            </div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>
              {successMessage}
              {!isDuplicate && whatsappOn && (
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
                    c.iso.includes(q)
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
                    {(() => {
                      const Flag = (FlagIcons as Record<string, React.ComponentType<{ title?: string; style?: React.CSSProperties }>>)[c.iso.toUpperCase()];
                      return Flag ? <Flag title={c.name} style={{ width: 24, height: 16, borderRadius: 2, display: "block", flexShrink: 0 }} /> : null;
                    })()}
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
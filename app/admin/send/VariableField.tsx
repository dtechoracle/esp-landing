"use client";

import { useMemo, useRef, useState } from "react";
import { AVAILABLE_VARS, type TemplateVars } from "@/lib/template";

type VarMeta = { hint: string; example: string };

const VAR_META: Record<string, VarMeta> = {
  firstName: { hint: "Subscriber's first name", example: "Jane" },
  lastName: { hint: "Subscriber's last name", example: "Doe" },
  name: { hint: "Subscriber's full name", example: "Jane Doe" },
  email: { hint: "Subscriber's email address", example: "jane@example.com" },
  role: { hint: "Role they signed up as", example: "Venue owner" },
  phone: { hint: "Phone number", example: "+2348012345678" },
  whatsappOn: { hint: "WhatsApp opt-in", example: "Yes" },
  joinedDate: { hint: "Date they joined the waitlist", example: "8/3/2026" },
};

export type PreviewRecipient = {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  vars: TemplateVars;
};

const PREVIEW_CAP = 5;

function extractTokens(text: string): string[] {
  const found: string[] = [];
  const re = /\[([a-zA-Z][a-zA-Z0-9_]*)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (!found.includes(m[1])) found.push(m[1]);
  }
  return found;
}

export default function VariableField({
  value,
  onChange,
  placeholder,
  ariaLabel,
  rows,
  multiline,
  style,
  preview,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  rows?: number;
  multiline?: boolean;
  style?: React.CSSProperties;
  /** Selected recipients used to show a live preview of variable values. */
  preview?: PreviewRecipient[];
}) {
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [focused, setFocused] = useState(false);

  const suggestions = useMemo(() => {
    if (!open) return [];
    return AVAILABLE_VARS.filter((v) => v.toLowerCase().startsWith(query));
  }, [open, query]);

  const tokens = useMemo(() => extractTokens(value), [value]);

  function detect(caret: number) {
    const before = value.slice(0, caret);
    const m = before.match(/\[([a-zA-Z]*)$/);
    if (m) {
      setQuery(m[1].toLowerCase());
      setActiveIndex(0);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  function insert(name: string) {
    const el = ref.current;
    if (!el) return;
    const caret = el.selectionStart ?? 0;
    const before = value.slice(0, caret);
    const start = before.lastIndexOf("[");
    const token = `[${name}]`;
    const next = before.slice(0, start) + token + value.slice(caret);
    onChange(next);
    setOpen(false);
    requestAnimationFrame(() => {
      const pos = (before.slice(0, start) + token).length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      insert(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    onChange(e.target.value);
    detect(e.target.selectionStart ?? 0);
  }

  function handleBlur() {
    setTimeout(() => {
      setFocused(false);
      setOpen(false);
    }, 150);
  }

  const showPreview = focused && tokens.length > 0 && !!preview && preview.length > 0;
  const previewShown = showPreview ? preview!.slice(0, PREVIEW_CAP) : [];
  const previewMore = showPreview ? preview!.length - PREVIEW_CAP : 0;

  // Example shown in the autocomplete hint: use the first selected
  // subscriber's real data when available, otherwise the generic example.
  const exampleFor = (name: string): string | undefined => {
    const first = preview?.[0];
    const real = first ? first.vars[name] : undefined;
    return real !== undefined ? real : VAR_META[name]?.example;
  };

  const common: React.CSSProperties = {
    outline: "none",
    borderRadius: "var(--radius-md)",
    background: "var(--surface-input)",
    boxShadow: "inset 0 0 0 0.5px var(--surface-input-border)",
    padding: "0 14px",
    fontFamily: "var(--font-sans)",
    fontSize: 14,
    fontWeight: 500,
    color: "var(--ink-900)",
    boxSizing: "border-box",
    width: "100%",
    height: 46,
    ...style,
  };

  return (
    <div style={{ position: "relative" }}>
      {multiline ? (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          aria-label={ariaLabel}
          rows={rows}
          style={{ ...common, height: "auto", padding: "12px 14px", resize: "vertical" }}
        />
      ) : (
        <input
          ref={ref as React.RefObject<HTMLInputElement>}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          aria-label={ariaLabel}
          style={common}
        />
      )}

      {open && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            zIndex: 50,
            background: "#fff",
            border: "1px solid var(--line-200)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-dropdown)",
            maxHeight: 240,
            overflow: "auto",
            padding: 4,
          }}
        >
          {suggestions.map((name, i) => (
            <button
              key={name}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                insert(name);
              }}
              onMouseEnter={() => setActiveIndex(i)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 2,
                width: "100%",
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: "var(--radius-md)",
                border: "none",
                background: i === activeIndex ? "rgba(78,28,216,0.08)" : "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--purple-600)" }}>
                [{name}]
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {VAR_META[name]?.hint} — e.g. “{exampleFor(name)}”
              </span>
            </button>
          ))}
        </div>
      )}

      {showPreview && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            zIndex: 60,
            background: "#fff",
            border: "1px solid var(--line-200)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-dropdown)",
            padding: 10,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-900)" }}>
            Preview for {preview!.length} selected subscriber{preview!.length === 1 ? "" : "s"}
          </div>
          {tokens.map((tok) => (
            <div key={tok} style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600, color: "var(--purple-600)" }}>[{tok}]</span>
              {" → "}
              {previewShown
                .map((p) => {
                  const resolved = p.vars[tok];
                  const label = p.name || p.email;
                  return resolved !== undefined
                    ? `${resolved} (${label})`
                    : `${tok} (${label})`;
                })
                .join(" · ")}
              {previewMore > 0 ? ` · +${previewMore} more` : ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

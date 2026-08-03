"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AVAILABLE_VARS, type TemplateVars } from "@/lib/template";

export type PreviewRecipient = {
  email: string;
  name?: string;
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

function ToolbarButton({
  label,
  title,
  onMouseDown,
}: {
  label: string;
  title: string;
  onMouseDown: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown();
      }}
      style={{
        minWidth: 30,
        height: 30,
        padding: "0 8px",
        border: "none",
        borderRadius: "var(--radius-sm)",
        background: "transparent",
        color: "var(--ink-900)",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(39,34,53,0.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {label}
    </button>
  );
}

export default function RichEditor({
  value,
  onChange,
  placeholder,
  ariaLabel,
  preview,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  /** Selected recipients used to show a live preview of variable values. */
  preview?: PreviewRecipient[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [varOpen, setVarOpen] = useState(false);

  // Sync external value into the editor, but never while the user is typing
  // (avoids caret jumps caused by browser HTML normalization).
  useEffect(() => {
    const el = ref.current;
    if (!el || focused) return;
    if (el.innerHTML !== value) el.innerHTML = value || "";
  }, [value, focused]);

  const tokens = useMemo(
    () => extractTokens(value ? value.replace(/<[^>]*>/g, " ") : ""),
    [value]
  );

  function run(command: string, arg?: string) {
    const el = ref.current;
    if (!el) return;
    el.focus();
    document.execCommand(command, false, arg);
    onChange(el.innerHTML);
  }

  function insertVariable(name: string) {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const token = `[${name}]`;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const node = document.createTextNode(token);
      range.insertNode(node);
      range.setStartAfter(node);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      document.execCommand("insertText", false, token);
    }
    onChange(el.innerHTML);
    setVarOpen(false);
  }

  function addLink() {
    const url = window.prompt("Link URL (https://…):");
    if (url === null) return;
    run(url.trim() ? "createLink" : "unlink", url.trim());
  }

  const showPreview = focused && tokens.length > 0 && !!preview && preview.length > 0;
  const previewShown = showPreview ? preview!.slice(0, PREVIEW_CAP) : [];
  const previewMore = showPreview ? preview!.length - PREVIEW_CAP : 0;

  const editorStyle: React.CSSProperties = {
    outline: "none",
    borderRadius: "var(--radius-md)",
    background: "var(--surface-input)",
    boxShadow: "inset 0 0 0 0.5px var(--surface-input-border)",
    padding: "14px",
    fontFamily: "var(--font-sans)",
    fontSize: 14,
    fontWeight: 500,
    color: "var(--ink-900)",
    boxSizing: "border-box",
    minHeight: 200,
    width: "100%",
    lineHeight: 1.6,
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          border: "1px solid var(--line-200)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            padding: "6px 8px",
            background: "rgba(39,34,53,0.03)",
            borderBottom: "1px solid var(--line-200)",
          }}
        >
          <ToolbarButton label="B" title="Bold" onMouseDown={() => run("bold")} />
          <ToolbarButton label="I" title="Italic" onMouseDown={() => run("italic")} />
          <ToolbarButton label="U" title="Underline" onMouseDown={() => run("underline")} />
          <span style={{ width: 1, height: 18, background: "var(--line-200)", margin: "0 4px" }} />
          <ToolbarButton label="H2" title="Heading" onMouseDown={() => run("formatBlock", "h2")} />
          <ToolbarButton
            label="• List"
            title="Bulleted list"
            onMouseDown={() => run("insertUnorderedList")}
          />
          <ToolbarButton
            label="1. List"
            title="Numbered list"
            onMouseDown={() => run("insertOrderedList")}
          />
          <ToolbarButton label="Quote" title="Blockquote" onMouseDown={() => run("formatBlock", "blockquote")} />
          <ToolbarButton label="🔗" title="Link" onMouseDown={addLink} />
          <span style={{ width: 1, height: 18, background: "var(--line-200)", margin: "0 4px" }} />
          <div style={{ position: "relative" }}>
            <ToolbarButton
              label="＋ Variable ▾"
              title="Insert a subscriber variable"
              onMouseDown={() => setVarOpen((v) => !v)}
            />
            {varOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: 4,
                  zIndex: 50,
                  background: "#fff",
                  border: "1px solid var(--line-200)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-dropdown)",
                  maxHeight: 240,
                  overflow: "auto",
                  padding: 4,
                  width: 220,
                }}
              >
                {AVAILABLE_VARS.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      insertVariable(name);
                    }}
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
                      background: "transparent",
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(78,28,216,0.08)")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--purple-600)" }}>
                      [{name}]
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {name === "firstName"
                        ? "Subscriber's first name"
                        : name === "lastName"
                          ? "Subscriber's last name"
                          : name === "name"
                            ? "Subscriber's full name"
                            : name === "email"
                              ? "Subscriber's email address"
                              : name === "role"
                                ? "Role they signed up as"
                                : name === "phone"
                                  ? "Phone number"
                                  : name === "whatsappOn"
                                    ? "WhatsApp opt-in"
                                    : "Date they joined the waitlist"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label={ariaLabel}
          aria-multiline="true"
          onInput={() => onChange(ref.current?.innerHTML || "")}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={editorStyle}
        />
        {!value && !focused && placeholder && (
          <div
            style={{
              position: "absolute",
              top: 46,
              left: 15,
              right: 15,
              color: "var(--text-faint)",
              fontSize: 14,
              fontWeight: 500,
              pointerEvents: "none",
            }}
          >
            {placeholder}
          </div>
        )}
      </div>

      {showPreview && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
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

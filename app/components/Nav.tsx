"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "./Button";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#audiences", label: "Who it's for" },
];

function scrollToWaitlist() {
  const el = document.getElementById("waitlist");
  if (el)
    el.scrollIntoView({ behavior: "smooth", block: "center" });
}

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        padding: "20px 24px",
        maxWidth: 1240,
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 40,
      }}
    >
      <a href="#top" aria-label="EventSpacePro home">
        <img
          src="/assets/mainLogo.svg"
          alt="EventSpacePro"
          style={{ height: 34, display: "block" }}
        />
      </a>

      {/* Desktop nav */}
      <nav
        className="esp-nav-desktop"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: "-0.015em",
        }}
      >
        {links.map((l) => (
          <a key={l.href} href={l.href} style={{ color: "var(--ink-900)" }}>
            {l.label}
          </a>
        ))}
        <Button size="sm" onClick={scrollToWaitlist}>
          Join the waitlist
        </Button>
      </nav>

      {/* Mobile hamburger */}
      <button
        className="esp-nav-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
        style={{
          display: "none",
          background: "transparent",
          border: "1px solid var(--line-300)",
          borderRadius: "var(--radius-md)",
          width: 40,
          height: 40,
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <span
          style={{
            width: 18,
            height: 2,
            background: "var(--ink-900)",
            borderRadius: 2,
            transition: "transform 200ms ease, opacity 200ms ease",
            transform: open ? "translateY(7px) rotate(45deg)" : "none",
          }}
        />
        <span
          style={{
            width: 18,
            height: 2,
            background: "var(--ink-900)",
            borderRadius: 2,
            transition: "opacity 200ms ease",
            opacity: open ? 0 : 1,
          }}
        />
        <span
          style={{
            width: 18,
            height: 2,
            background: "var(--ink-900)",
            borderRadius: 2,
            transition: "transform 200ms ease",
            transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
          }}
        />
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="esp-nav-mobile"
          style={{
            position: "absolute",
            top: "100%",
            left: 16,
            right: 16,
            background: "var(--surface-card)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-dropdown)",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            zIndex: 50,
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                color: "var(--ink-900)",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                fontWeight: 500,
              }}
            >
              {l.label}
            </a>
          ))}
          <Button
            size="sm"
            style={{ marginTop: 8, width: "100%" }}
            onClick={() => {
              setOpen(false);
              scrollToWaitlist();
            }}
          >
            Join the waitlist
          </Button>
        </div>
      )}
    </header>
  );
}
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { clearToken } from "@/lib/backend-client";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/send", label: "Send email" },
];

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
        {label}
      </span>
      <span
        style={{
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: accent || "var(--ink-900)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export { StatCard };

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    clearToken();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface-page)",
        color: "var(--ink-900)",
        fontFamily: "var(--font-sans)",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <aside
        className="esp-admin-sidebar"
        style={{
          width: 240,
          flexShrink: 0,
          background: "var(--navy-900)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "20px 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
          boxSizing: "border-box",
          zIndex: 30,
        }}
      >
        <a href="/admin" style={{ padding: "4px 8px 20px", display: "block" }}>
          <img
            src="/assets/mainLogoLight.svg"
            alt="EventSpacePro"
            style={{ height: 24, display: "block" }}
          />
        </a>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  color: active ? "white" : "rgba(255,255,255,0.6)",
                  background: active ? "rgba(255,255,255,0.12)" : "transparent",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />
        <a
          href="/"
          style={{ color: "rgba(255,255,255,0.6)", padding: "10px 12px", fontSize: 13 }}
        >
          ← View site
        </a>
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.6)",
            padding: "10px 12px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            textAlign: "left",
            borderRadius: "var(--radius-md)",
          }}
        >
          Sign out
        </button>
      </aside>

      {/* Main */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          className="esp-admin-topbar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "14px 24px",
            background: "var(--surface-card)",
            borderBottom: "1px solid var(--line-100)",
          }}
        >
          <button
            className="esp-admin-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle admin menu"
            style={{
              display: "none",
              background: "transparent",
              border: "1px solid var(--line-300)",
              borderRadius: "var(--radius-md)",
              width: 36,
              height: 36,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 16 }}>☰</span>
          </button>
          <span style={{ fontSize: 15, fontWeight: 600 }}>EventSpacePro Admin</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }} suppressHydrationWarning>
            {new Date().toLocaleDateString()}
          </span>
        </header>

        {open && (
          <div
            className="esp-admin-mobile-nav"
            style={{
              background: "var(--surface-card)",
              padding: 8,
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-dropdown)",
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                  color: "var(--ink-900)",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </a>
            ))}
            <div style={{ height: 1, background: "var(--line-100)", margin: "4px 0" }} />
            <a
              href="/"
              style={{
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                color: "var(--ink-900)",
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              ← View site
            </a>
            <button
              onClick={() => { handleLogout(); setOpen(false); }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--error-500)",
                padding: "12px 16px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                textAlign: "left",
                borderRadius: "var(--radius-md)",
              }}
            >
              Sign out
            </button>
          </div>
        )}

        <main style={{ padding: 24, flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
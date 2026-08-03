"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import { adminLogin, getToken, setToken } from "@/lib/backend-client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (getToken()) {
      router.replace("/admin");
      router.refresh();
    } else {
      setChecking(false);
    }
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Enter your admin email.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setLoading(true);
    try {
      const result = await adminLogin(email.trim(), password);
      if (!result.ok || !result.token) {
        setError(result.message || "Login failed.");
        setLoading(false);
        return;
      }
      setToken(result.token);
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (checking) {
    return <div style={{ padding: 24 }}>Checking session…</div>;
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "var(--surface-card)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-card)",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <img
            src="/assets/mainLogo.svg"
            alt="EventSpacePro"
            style={{ height: 26, alignSelf: "flex-start" }}
          />
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Admin sign in
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>
            Sign in to manage waitlist subscribers and email campaigns.
          </p>
        </div>

        <input
          type="email"
          autoFocus
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          placeholder="Admin email"
          aria-label="Admin email"
          style={inputStyle}
        />

        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          placeholder="Password"
          aria-label="Password"
          style={inputStyle}
        />

        {error && (
          <span style={{ fontSize: 13, color: "var(--error-500)", fontWeight: 500 }}>
            {error}
          </span>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            height: 46,
            border: "none",
            borderRadius: "var(--radius-pill)",
            background: "var(--accent)",
            color: "white",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: 16,
            cursor: "pointer",
            transition: "filter 150ms ease, box-shadow 150ms ease",
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <span style={{ fontSize: 12, color: "var(--text-faint)", fontWeight: 400 }}>
          Protected area. Contact the site owner for access.
        </span>
      </form>
    </div>
  );
}

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
  color: "var(--ink-900)",
  boxSizing: "border-box",
};

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreateUser, getToken } from "@/lib/backend-client";
import AdminShell from "../components/AdminShell";

export default function UsersClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [createdUser, setCreatedUser] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setStatus("loading");
    setMessage("");
    setCreatedUser(null);

    const res = await adminCreateUser(token, { email, firstName, lastName, password });

    if (res.ok) {
      setStatus("success");
      setMessage("User created successfully.");
      setCreatedUser(res.user);
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
    } else {
      setStatus("error");
      setMessage(res.message || "An error occurred.");
    }
  }

  return (
    <AdminShell>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.02em" }}>Users</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Create a new regular user account. They will be marked as email verified and can log in immediately.
          </p>
        </div>

        <div
          style={{
            background: "var(--surface-card)",
            padding: 24,
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Create User</h2>

          {status === "error" && (
            <div
              style={{
                padding: 12,
                borderRadius: "var(--radius-md)",
                background: "var(--error-50)",
                color: "var(--error-600)",
                marginBottom: 16,
                fontSize: 14,
              }}
            >
              {message}
            </div>
          )}

          {status === "success" && (
            <div
              style={{
                padding: 12,
                borderRadius: "var(--radius-md)",
                background: "var(--success-50)",
                color: "var(--success-600)",
                marginBottom: 16,
                fontSize: 14,
              }}
            >
              {message}
              {createdUser && (
                <div style={{ marginTop: 4, fontWeight: 500 }}>
                  Account created for {(createdUser.data || createdUser).firstName || ""} {(createdUser.data || createdUser).lastName || ""} ({(createdUser.data || createdUser).email})
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label
                htmlFor="email"
                style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--line-300)",
                  fontSize: 15,
                  boxSizing: "border-box",
                }}
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="firstName"
                style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}
              >
                First name
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--line-300)",
                  fontSize: 15,
                  boxSizing: "border-box",
                }}
                placeholder="Jane"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}
              >
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--line-300)",
                  fontSize: 15,
                  boxSizing: "border-box",
                }}
                placeholder="Doe"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--line-300)",
                  fontSize: 15,
                  boxSizing: "border-box",
                }}
                placeholder="Secure password"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                marginTop: 8,
                height: 46,
                border: "none",
                borderRadius: "var(--radius-pill)",
                background: "var(--accent)",
                color: "white",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: 16,
                cursor: status === "loading" ? "not-allowed" : "pointer",
                opacity: status === "loading" ? 0.6 : 1,
              }}
            >
              {status === "loading" ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "../components/AdminShell";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { fetchWaitlist, type WaitlistEntry } from "@/lib/backend-client";

const PAGE_SIZE = 25;

function roleLabel(role?: string): string {
  if (role === "venue_owner") return "Venue owner";
  if (role === "planner") return "Event planner";
  return role || "";
}

function matchesSearch(s: WaitlistEntry, needle: string): boolean {
  const hay = [
    s.email,
    s.name,
    s.phone,
    roleLabel(s.role),
    s.role,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
}

export default function Subscribers() {
  const token = useAdminAuth();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const result = await fetchWaitlist(token);
      if (!result.ok) {
        setError(result.message || "Failed to load subscribers.");
      } else {
        setEntries(result.entries);
      }
    } catch {
      setError("Failed to load subscribers.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((s) => matchesSearch(s, needle));
  }, [entries, search]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        (b.createdAt || "").localeCompare(a.createdAt || "")
      ),
    [filtered]
  );

  // Reset to the first page whenever the search or dataset changes.
  useEffect(() => {
    setPage(0);
  }, [search, entries]);

  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rows = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  function exportCsv() {
    const header = "name,email,role,phone,whatsapp,joined";
    const lines = rows.map((s) =>
      [
        s.name || "",
        s.email || "",
        roleLabel(s.role),
        s.phone || "",
        s.whatsappOn ? "yes" : "no",
        s.createdAt ? new Date(s.createdAt).toLocaleString() : "",
      ]
        .map((v) => `"${String(v).replaceAll('"', '""')}"`)
        .join(",")
    );
    const blob = new Blob([[header, ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "waitlist-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!token) {
    return (
      <AdminShell>
        <div style={{ padding: 24 }}>Checking session…</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>
          Subscribers
        </h1>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone or role…"
            aria-label="Search subscribers"
            style={inputStyle}
          />
          <button onClick={exportCsv} style={ghostBtnStyle}>
            Export CSV
          </button>
        </div>
      </div>

      {error && <div style={{ color: "var(--error-500)", padding: "12px 0" }}>{error}</div>}

      <div
        style={{
          background: "var(--surface-card)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-card)",
          overflow: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line-200)" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>WhatsApp</th>
              <th style={thStyle}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                  {search.trim() ? "No subscribers match your search." : "No subscribers yet."}
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr key={s._id || s.email} style={{ borderBottom: "1px solid var(--line-100)" }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600 }}>{s.name || "—"}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600 }}>{s.email || "—"}</div>
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: "var(--radius-pill)",
                        background:
                          s.role === "venue_owner"
                            ? "rgba(78,28,216,0.1)"
                            : "rgba(0,86,169,0.1)",
                        color:
                          s.role === "venue_owner"
                            ? "var(--purple-600)"
                            : "var(--blue-600)",
                      }}
                    >
                      {roleLabel(s.role) || "—"}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{s.phone || "—"}</td>
                  <td style={tdStyle}>{s.whatsappOn ? "✓" : "—"}</td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 16,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {total} subscriber{total === 1 ? "" : "s"}
          {search.trim() ? ` matching “${search.trim()}”` : ""}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            style={ghostBtnStyle}
          >
            ← Prev
          </button>
          <span style={{ fontSize: 13, alignSelf: "center", color: "var(--text-muted)" }}>
            Page {page + 1} / {pages}
          </span>
          <button
            disabled={page + 1 >= pages}
            onClick={() => setPage((p) => p + 1)}
            style={ghostBtnStyle}
          >
            Next →
          </button>
        </div>
      </div>
    </AdminShell>
  );
}

const inputStyle: React.CSSProperties = {
  height: 38,
  border: "none",
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
  minWidth: 0,
  width: 260,
};

const ghostBtnStyle: React.CSSProperties = {
  height: 38,
  padding: "0 14px",
  border: "none",
  borderRadius: "var(--radius-md)",
  background: "rgba(39,34,53,0.05)",
  color: "var(--ink-900)",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const thStyle: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--text-muted)",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: 14,
  verticalAlign: "middle",
};

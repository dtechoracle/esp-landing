"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "../components/AdminShell";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { fetchWaitlist, backendBaseUrl, type WaitlistEntry } from "@/lib/backend-client";

const PAGE_SIZE = 25;

const roles = [
  { value: "all", label: "All" },
  { value: "event_planner", label: "Event planner" },
  { value: "decorator", label: "Decorator" },
  { value: "venue_staff", label: "Venue / Venue staff" },
  { value: "other_creative_pro", label: "Other Creative Pro" },
];

function roleLabel(role?: string): string {
  if (role === "planner") return "Event planner";
  const found = roles.find((r) => r.value === role);
  return found ? found.label : role || "";
}

function roleColor(role?: string): { bg: string; color: string } {
  switch (role) {
    case "event_planner":
    case "planner":
      return { bg: "rgba(0,86,169,0.1)", color: "var(--blue-600)" };
    case "decorator":
      return { bg: "rgba(78,28,216,0.1)", color: "var(--purple-600)" };
    case "venue_staff":
      return { bg: "rgba(2,25,56,0.08)", color: "var(--navy-900)" };
    case "other_creative_pro":
      return { bg: "rgba(16,185,129,0.1)", color: "var(--success-500)" };
    default:
      return { bg: "rgba(0,86,169,0.1)", color: "var(--blue-600)" };
  }
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
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<WaitlistEntry | null>(null);

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
    let result = entries;
    if (roleFilter !== "all") {
      result = result.filter((s) => {
        if (roleFilter === "event_planner") {
          return s.role === "event_planner" || s.role === "planner";
        }
        return s.role === roleFilter;
      });
    }
    const needle = search.trim().toLowerCase();
    if (needle) {
      result = result.filter((s) => matchesSearch(s, needle));
    }
    return result;
  }, [entries, search, roleFilter]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        (b.createdAt || "").localeCompare(a.createdAt || "")
      ),
    [filtered]
  );

  useEffect(() => {
    setPage(0);
  }, [search, roleFilter, entries]);

  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rows = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  async function deleteSubscriber(id: string) {
    if (!token) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${backendBaseUrl()}/api/admin/waitlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e._id !== id));
        setConfirmDelete(null);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Failed to delete subscriber.");
      }
    } catch {
      setError("Failed to delete subscriber.");
    } finally {
      setDeletingId(null);
    }
  }

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
        <div style={{ padding: 24 }}>Checking session...</div>
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
            placeholder="Search name, email, phone or role..."
            aria-label="Search subscribers"
            style={inputStyle}
          />
          <button onClick={exportCsv} style={ghostBtnStyle}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Role filter tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {roles.map((r) => {
          const active = roleFilter === r.value;
          const count = r.value === "all"
            ? entries.length
            : r.value === "event_planner"
              ? entries.filter((e) => e.role === "event_planner" || e.role === "planner").length
              : entries.filter((e) => e.role === r.value).length;
          return (
            <button
              key={r.value}
              onClick={() => setRoleFilter(r.value)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                height: 36,
                padding: "0 14px",
                borderRadius: "var(--radius-pill)",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
                transition: "all 150ms ease",
                background: active ? "var(--navy-900)" : "rgba(39,34,53,0.05)",
                color: active ? "white" : "var(--ink-900)",
              }}
            >
              {r.label}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 7px",
                  borderRadius: "var(--radius-pill)",
                  background: active ? "rgba(255,255,255,0.2)" : "rgba(39,34,53,0.08)",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
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
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 820 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line-200)" }}>
              <th style={thStyle}>First Name</th>
              <th style={thStyle}>Last Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>WhatsApp</th>
              <th style={thStyle}>Joined</th>
              <th style={{ ...thStyle, width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                  {search.trim() || roleFilter !== "all"
                    ? "No subscribers match your filters."
                    : "No subscribers yet."}
                </td>
              </tr>
            ) : (
              rows.map((s) => {
                const colors = roleColor(s.role);
                const nameParts = (s.name || "").split(" ");
                const firstName = nameParts[0] || "—";
                const lastName = nameParts.slice(1).join(" ") || "—";
                return (
                  <tr key={s._id || s.email} style={{ borderBottom: "1px solid var(--line-100)" }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{firstName}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>{lastName}</div>
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
                          background: colors.bg,
                          color: colors.color,
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
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <button
                        onClick={() => setConfirmDelete(s)}
                        disabled={deletingId === s._id}
                        title="Delete subscriber"
                        style={{
                          border: "none",
                          background: "transparent",
                          color: deletingId === s._id ? "var(--text-muted)" : "var(--error-500)",
                          cursor: deletingId === s._id ? "not-allowed" : "pointer",
                          fontSize: 16,
                          padding: "4px 8px",
                          borderRadius: "var(--radius-md)",
                          opacity: deletingId === s._id ? 0.5 : 1,
                          transition: "background 150ms ease",
                        }}
                        onMouseEnter={(e) => { if (deletingId !== s._id) e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        {deletingId === s._id ? "…" : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
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
          {roleFilter !== "all" ? ` in ${roleLabel(roleFilter)}` : ""}
          {search.trim() ? ` matching "${search.trim()}"` : ""}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            style={ghostBtnStyle}
          >
            Prev
          </button>
          <span style={{ fontSize: 13, alignSelf: "center", color: "var(--text-muted)" }}>
            Page {page + 1} / {pages}
          </span>
          <button
            disabled={page + 1 >= pages}
            onClick={() => setPage((p) => p + 1)}
            style={ghostBtnStyle}
          >
            Next
          </button>
        </div>
      </div>

      {confirmDelete && (
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
          onClick={() => setConfirmDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface-card)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-card)",
              padding: 24,
              maxWidth: 380,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 600 }}>Delete subscriber?</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>
              This will permanently remove <strong>{confirmDelete.email}</strong> from the waitlist. This action cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  height: 38,
                  padding: "0 16px",
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
              <button
                onClick={() => confirmDelete._id && deleteSubscriber(confirmDelete._id)}
                disabled={!confirmDelete._id || deletingId === confirmDelete._id}
                style={{
                  height: 38,
                  padding: "0 16px",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  background: "var(--error-500)",
                  color: "white",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: deletingId === confirmDelete._id ? "not-allowed" : "pointer",
                  opacity: deletingId === confirmDelete._id ? 0.6 : 1,
                }}
              >
                {deletingId === confirmDelete._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
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

"use client";

import { useCallback, useEffect, useState } from "react";
import AdminShell, { StatCard } from "./components/AdminShell";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { backendBaseUrl, fetchWaitlist } from "@/lib/backend-client";

type BroadcastCampaign = {
  campaignId: string;
  webId: number;
  subject: string;
  status: string;
  emailsSent: number;
  sendTime: string;
  createTime: string;
  archiveUrl: string;
  recipientCount: number;
};

export default function Dashboard() {
  const token = useAdminAuth();
  const [total, setTotal] = useState<number | null>(null);
  const [recent, setRecent] = useState<
    { _id?: string; email?: string; name?: string; firstName?: string; lastName?: string; createdAt?: string }[]
  >([]);
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>([]);
  const [totalEmailsSent, setTotalEmailsSent] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (showSpinner = true) => {
      if (!token) return;
      if (showSpinner) setLoading(true);
      setError("");

      try {
        const result = await fetchWaitlist(token);
        if (!result.ok) {
          setError(result.message || "Failed to load subscribers.");
        } else {
          const sorted = [...result.entries].sort((a, b) =>
            (b.createdAt || "").localeCompare(a.createdAt || "")
          );
          setTotal(result.entries.length);
          setRecent(sorted.slice(0, 6));
        }
      } catch {
        setError("Failed to load subscribers.");
      } finally {
        if (showSpinner) setLoading(false);
      }

      try {
        const res = await fetch(`${backendBaseUrl()}/api/admin/broadcast-emails/sent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          const camps = json.data || [];
          setCampaigns(camps);
          setTotalEmailsSent(camps.reduce((sum: number, c: BroadcastCampaign) => sum + (c.emailsSent || 0), 0));
        }
      } catch {
        /* ignore */
      }
    },
    [token]
  );

  useEffect(() => {
    load();
  }, [load]);

  async function refresh() {
    setRefreshing(true);
    await load(false);
    setRefreshing(false);
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
      <h1 style={{ margin: "0 0 20px", fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>
        Dashboard
      </h1>

      {error && (
        <div style={{ color: "var(--error-500)", padding: "12px 0" }}>{error}</div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          background: "var(--surface-card)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-card)",
          padding: "16px 20px",
          marginBottom: 16,
        }}
      >
        {/* <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Live backend</span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Subscribers are fetched directly from {backendBaseUrl()}/api/admin/waitlist.
          </span>
        </div> */}
        <button
          onClick={refresh}
          disabled={refreshing}
          style={{
            height: 40,
            padding: "0 18px",
            border: "none",
            borderRadius: "var(--radius-pill)",
            background: "var(--accent)",
            color: "white",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: 14,
            cursor: refreshing ? "not-allowed" : "pointer",
            opacity: refreshing ? 0.6 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard label="Subscribers" value={loading ? "…" : total ?? "–"} />
        <StatCard label="Success" value={loading ? "…" : totalEmailsSent ?? "–"} accent="var(--success-500)" />
        <StatCard label="Total" value={loading ? "…" : campaigns.length} />
      </div>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        <Panel title="Recent signups">
          {loading ? (
            <Empty>Loading…</Empty>
          ) : recent.length ? (
            recent.map((s) => (
              <div
                key={s._id || s.email}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--line-100)",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.email}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {s.firstName || s.lastName
                      ? `${s.firstName || "—"} ${s.lastName || ""}`
                      : s.name || "—"}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-faint)", whiteSpace: "nowrap" }}>
                  {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>
            ))
          ) : (
            <Empty>No subscribers yet.</Empty>
          )}
        </Panel>

        <Panel title="Recent campaigns">
          {campaigns.length ? (
            campaigns.slice(0, 5).map((c) => (
              <div
                key={c.campaignId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--line-100)",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {c.subject || "(no subject)"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {c.emailsSent} recipients · {new Date(c.sendTime).toLocaleDateString()}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--success-500)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.emailsSent} sent
                </span>
              </div>
            ))
          ) : (
            <Empty>No campaigns sent yet.</Empty>
          )}
        </Panel>
      </div>
    </AdminShell>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        padding: 20,
      }}
    >
      <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>{title}</h3>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, color: "var(--text-faint)", fontWeight: 500 }}>{children}</div>
  );
}

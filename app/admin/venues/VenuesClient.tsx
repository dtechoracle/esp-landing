"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../components/AdminShell";
import {
  getToken,
  fetchAdminRecentEvents,
  fetchAdminPreviewEvent,
  adminConvertVenue,
  fetchAdminVenues,
  adminDeleteVenue,
} from "@/lib/backend-client";

type RecentEvent = {
  id: string;
  name: string;
  type: string;
  updatedAt: string;
  thumbnail: string | null;
  counts: {
    shapes: number;
    assets: number;
    walls: number;
    canvasAssets: number;
  };
};

type FetchedEventPreview = {
  id: string;
  name: string;
  type: string;
  width: number;
  height: number;
  counts: {
    shapes: number;
    assets: number;
    walls: number;
    canvasAssets: number;
    textAnnotations: number;
  };
  thumbnail: string | null;
  tempThumbnailSvg: string;
  tempThumbnailDataUri: string;
};

export default function VenuesClient() {
  const router = useRouter();
  const [eventId, setEventId] = useState("");
  const [fetching, setFetching] = useState(false);
  const [preview, setPreview] = useState<FetchedEventPreview | null>(null);

  // Form fields
  const [venueName, setVenueName] = useState("");
  const [venueSlug, setVenueSlug] = useState("");
  const [width, setWidth] = useState(50000);
  const [height, setHeight] = useState(40000);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState("Up to 1,500 guests");

  // Status
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Lists
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [venues, setVenues] = useState<any[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/admin/login");
      return;
    }
    loadRecent(token);
    loadVenues(token);
  }, [router]);

  async function loadRecent(token?: string) {
    const t = token || getToken();
    if (!t) return;
    setLoadingRecent(true);
    const res = await fetchAdminRecentEvents(t);
    if (res.ok && res.events) {
      setRecentEvents(res.events);
    }
    setLoadingRecent(false);
  }

  async function loadVenues(token?: string) {
    const t = token || getToken();
    if (!t) return;
    setLoadingVenues(true);
    const res = await fetchAdminVenues(t);
    if (res.ok && res.venues) {
      setVenues(res.venues);
    }
    setLoadingVenues(false);
  }

  async function handleFetchEvent(idToFetch?: string) {
    const targetId = (idToFetch || eventId).trim();
    if (!targetId) {
      setMessage("Please enter an Event ID.");
      setStatus("error");
      return;
    }

    const token = getToken();
    if (!token) return;

    setFetching(true);
    setStatus("idle");
    setMessage("");
    setPreview(null);

    const res = await fetchAdminPreviewEvent(token, targetId);
    if (res.ok && res.event) {
      const ev: FetchedEventPreview = res.event;
      setPreview(ev);
      setEventId(ev.id);
      setVenueName(ev.name);
      setVenueSlug(
        ev.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      );
      setWidth(ev.width);
      setHeight(ev.height);
      setDescription(`Architectural layout converted from event: ${ev.name}`);
      setAddress(`${ev.name}, Lagos, Nigeria`);
      setStatus("idle");
    } else {
      setStatus("error");
      setMessage(res.message || "Failed to fetch event.");
    }
    setFetching(false);
  }

  async function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    if (!preview) return;

    const token = getToken();
    if (!token) return;

    setStatus("loading");
    setMessage("");

    const res = await adminConvertVenue(token, {
      eventId: preview.id,
      venueName: venueName.trim() || preview.name,
      venueSlug: venueSlug.trim(),
      customWidth: width,
      customHeight: height,
      description: description.trim(),
      address: address.trim(),
      capacity: capacity.trim(),
    });

    if (res.ok) {
      setStatus("success");
      setMessage(res.message || "Venue converted successfully!");
      setPreview(null);
      setEventId("");
      loadVenues(token);
    } else {
      setStatus("error");
      setMessage(res.message || "Failed to convert venue.");
    }
  }

  async function handleDeleteVenue(venueId: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}" from venues?`)) return;
    const token = getToken();
    if (!token) return;

    setIsDeleting(venueId);
    const res = await adminDeleteVenue(token, venueId);
    if (res.ok) {
      loadVenues(token);
    } else {
      alert(res.message || "Failed to delete venue.");
    }
    setIsDeleting(null);
  }

  return (
    <AdminShell>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* Header */}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.02em" }}>
            Venues & Templates
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Convert any saved event layout into a reusable venue template that appears under &quot;Venues&quot; in the editor&apos;s Asset Library.
          </p>
        </div>

        {/* Status Messages */}
        {status === "error" && message && (
          <div
            style={{
              padding: 14,
              borderRadius: "var(--radius-md)",
              background: "var(--error-50)",
              color: "var(--error-600)",
              fontSize: 14,
            }}
          >
            {message}
          </div>
        )}

        {status === "success" && message && (
          <div
            style={{
              padding: 14,
              borderRadius: "var(--radius-md)",
              background: "var(--success-50)",
              color: "var(--success-600)",
              fontSize: 14,
            }}
          >
            ✓ {message}
          </div>
        )}

        {/* Step 1: Enter Event ID */}
        <div
          style={{
            background: "var(--surface-card)",
            padding: 24,
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            1. Enter Event ID to Convert
          </h2>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              type="text"
              placeholder="e.g. 6ae1f1134b8125cfc263d27b"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleFetchEvent();
                }
              }}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--line-300)",
                fontSize: 14,
                fontFamily: "monospace",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => handleFetchEvent()}
              disabled={fetching || !eventId.trim()}
              style={{
                padding: "0 20px",
                height: 42,
                border: "none",
                borderRadius: "var(--radius-pill)",
                background: "var(--accent)",
                color: "white",
                fontWeight: 500,
                fontSize: 14,
                cursor: fetching || !eventId.trim() ? "not-allowed" : "pointer",
                opacity: fetching || !eventId.trim() ? 0.6 : 1,
              }}
            >
              {fetching ? "Fetching..." : "Fetch Event"}
            </button>
          </div>

          {/* Quick Pick from Recent Events */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>
                Quick pick from recent events:
              </span>
              <button
                type="button"
                onClick={() => loadRecent()}
                disabled={loadingRecent}
                style={{ fontSize: 12, background: "none", border: "none", color: "var(--accent)", cursor: "pointer" }}
              >
                {loadingRecent ? "Refreshing..." : "Refresh list"}
              </button>
            </div>

            {loadingRecent ? (
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Loading recent events...</p>
            ) : recentEvents.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No recent events found.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8 }}>
                {recentEvents.slice(0, 6).map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => handleFetchEvent(ev.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: eventId === ev.id ? "1.5px solid var(--accent)" : "1px solid var(--line-300)",
                      background: eventId === ev.id ? "rgba(59, 130, 246, 0.05)" : "var(--surface-card)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)" }} title={ev.name}>
                        {ev.name.length > 20 ? ev.name.substring(0, 18) + "..." : ev.name}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 500 }}>Select →</span>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>
                      ID: {ev.id.substring(0, 12)}...
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {ev.counts.shapes + ev.counts.canvasAssets} elements • {ev.counts.walls} walls
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Configure & Convert (Shown when preview is loaded) */}
        {preview && (
          <div
            style={{
              background: "var(--surface-card)",
              padding: 24,
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-card)",
              border: "1.5px solid var(--accent)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600 }}>2. Configure & Convert Venue</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 2 }}>
                  Loaded: <strong style={{ color: "var(--ink-900)" }}>{preview.name}</strong> ({preview.counts.shapes + preview.counts.canvasAssets} items, {preview.counts.walls} walls)
                </p>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "monospace",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-pill)",
                  background: "rgba(59, 130, 246, 0.1)",
                  color: "var(--accent)",
                  fontWeight: 600,
                }}
              >
                {Math.round(preview.width / 1000)}m × {Math.round(preview.height / 1000)}m
              </span>
            </div>

            <form onSubmit={handleConvert} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    Venue Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--line-300)",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    Venue Slug / Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    value={venueSlug}
                    onChange={(e) => setVenueSlug(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--line-300)",
                      fontSize: 14,
                      fontFamily: "monospace",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    Width (mm)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--line-300)",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    Height (mm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--line-300)",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    Address / Location
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Victoria Island, Lagos"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--line-300)",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    Capacity
                  </label>
                  <input
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="e.g. Up to 1,500 guests"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--line-300)",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--line-300)",
                    fontSize: 14,
                    boxSizing: "border-box",
                    resize: "none",
                  }}
                />
              </div>

              {/* Temporary Blueprint Thumbnail Card */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                  Temporary Blueprint Thumbnail (Auto-Generated)
                </label>
                <div
                  style={{
                    maxWidth: 240,
                    aspectRatio: "4 / 3",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--line-300)",
                    background: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 8,
                  }}
                >
                  <img
                    src={preview.tempThumbnailDataUri}
                    alt="Temporary Thumbnail"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6, fontStyle: "italic" }}>
                  This temporary thumbnail card will represent the venue in the Assets Sidebar until an image is uploaded.
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  style={{
                    padding: "0 18px",
                    height: 42,
                    border: "1px solid var(--line-300)",
                    borderRadius: "var(--radius-pill)",
                    background: "none",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    padding: "0 24px",
                    height: 42,
                    border: "none",
                    borderRadius: "var(--radius-pill)",
                    background: "var(--accent)",
                    color: "white",
                    fontWeight: 500,
                    fontSize: 14,
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    opacity: status === "loading" ? 0.6 : 1,
                  }}
                >
                  {status === "loading" ? "Converting..." : "Convert & Add to Venues"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Converted Venues */}
        <div
          style={{
            background: "var(--surface-card)",
            padding: 24,
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Converted Venues ({venues.length})</h2>
            <button
              onClick={() => loadVenues()}
              style={{
                fontSize: 13,
                background: "none",
                border: "1px solid var(--line-300)",
                borderRadius: "var(--radius-md)",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
          </div>

          {loadingVenues ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading venues...</p>
          ) : venues.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              No custom venues converted yet. Use the tool above to add your first venue!
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {venues.map((v) => (
                <div
                  key={v.id || v._id}
                  style={{
                    border: "1px solid var(--line-300)",
                    borderRadius: "var(--radius-lg)",
                    padding: 16,
                    background: "var(--surface-card)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", gap: 12 }}>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: "var(--radius-md)",
                        background: "#0f172a",
                        overflow: "hidden",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {v.thumbnail ? (
                        <img src={v.thumbnail} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <span style={{ color: "white", fontSize: 16, fontWeight: 700 }}>
                          {(v.name || "VN").slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={v.name}>
                        {v.name}
                      </h4>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "4px 0 0", fontFamily: "monospace" }}>
                        {v.id}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--accent)", margin: "4px 0 0", fontWeight: 500 }}>
                        {Math.round((v.width || 50000) / 1000)}m × {Math.round((v.height || 40000) / 1000)}m
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line-300)", paddingTop: 10 }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "Custom"}
                    </span>
                    <button
                      type="button"
                      disabled={isDeleting === v.id}
                      onClick={() => handleDeleteVenue(v.id, v.name)}
                      style={{
                        fontSize: 12,
                        color: "var(--error-600)",
                        background: "none",
                        border: "none",
                        cursor: isDeleting === v.id ? "not-allowed" : "pointer",
                        fontWeight: 500,
                      }}
                    >
                      {isDeleting === v.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

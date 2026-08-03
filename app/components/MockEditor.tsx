export default function MockEditor() {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          background: "var(--surface-card)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-dropdown)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 16px",
            background: "var(--surface-sunken-2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--line-300)",
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--line-300)",
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--line-300)",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              letterSpacing: "-0.015em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Rivera Wedding — Grand Hall
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              background: "var(--blue-600)",
              color: "white",
              borderRadius: "var(--radius-pill)",
              padding: "4px 10px",
              whiteSpace: "nowrap",
            }}
          >
            3D preview
          </span>
        </div>

        <div
          style={{
            position: "relative",
            height: "var(--mock-height)",
            background:
              "repeating-linear-gradient(0deg, transparent 0 23px, rgba(2,25,56,0.05) 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, rgba(2,25,56,0.05) 23px 24px), var(--surface-0)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "24px",
              border: "2px solid var(--navy-900)",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "var(--mock-stage-top)",
              left: "var(--mock-stage-left)",
              width: "var(--mock-stage-w)",
              height: "var(--mock-stage-h)",
              background: "rgba(0,86,169,0.12)",
              border: "1.5px solid var(--blue-600)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--blue-700)",
            }}
          >
            Stage
          </div>
          <div
            style={{
              position: "absolute",
              top: "var(--mock-circles-top)",
              left: "var(--mock-circles-left)",
              display: "grid",
              gridTemplateColumns: "repeat(4, 26px)",
              gap: 14,
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  border: "1.5px solid var(--ink-900)",
                  opacity: 0.55,
                }}
              />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              top: "var(--mock-buffet-top)",
              right: "var(--mock-buffet-right)",
              width: "var(--mock-buffet-w)",
              height: "var(--mock-buffet-h)",
              background: "rgba(39,34,53,0.06)",
              border: "1.5px dashed var(--gray-500)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--gray-500)",
            }}
          >
            Buffet
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "var(--mock-dance-bottom)",
              right: "var(--mock-dance-right)",
              width: "var(--mock-dance-w)",
              height: "var(--mock-dance-h)",
              background: "rgba(78,28,216,0.08)",
              border: "1.5px solid var(--purple-600)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--purple-600)",
            }}
          >
            Dance floor
          </div>

          {/* AI prompt chip */}
          <div
            className="esp-ai-chip"
            style={{
              position: "absolute",
              left: "50%",
              bottom: 18,
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--navy-900)",
              color: "white",
              borderRadius: "var(--radius-pill)",
              padding: "10px 18px",
              boxShadow: "var(--shadow-dropdown)",
              animation: "espFloat 5s ease-in-out infinite",
              maxWidth: "calc(100% - 48px)",
              boxSizing: "border-box",
            }}
          >
            <span style={{ color: "#9db8ff", fontSize: 14, flexShrink: 0 }}>
              ✦
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "-0.015em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              &quot;Seat 120 guests banquet-style&quot;
            </span>
          </div>

          {/* toolbar */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: -1,
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              background: "var(--surface-card)",
              borderRadius: "0 12px 12px 0",
              boxShadow: "var(--shadow-dropdown)",
              padding: "8px 6px",
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "var(--blue-600)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              ⬚
            </span>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "var(--ink-900)",
              }}
            >
              ▭
            </span>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "var(--ink-900)",
              }}
            >
              ○
            </span>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "var(--ink-900)",
              }}
            >
              ✋
            </span>
          </div>
        </div>
      </div>

      <div
        className="esp-capacity-chip"
        style={{
          position: "absolute",
          bottom: -16,
          left: -12,
          background: "var(--surface-card)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-dropdown)",
          padding: "10px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>
          Capacity
        </span>
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>
          120/150 Guests
        </span>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

const ROOM = 320; // floor width / depth
const WALL_H = 260; // wall height
const DEPTH_HALF = ROOM / 2; // 160
const HEIGHT_HALF = WALL_H / 2; // 130

export default function RoomPreview() {
  const [rx, setRx] = useState(58);
  const [ry, setRy] = useState(-38);
  const [dragging, setDragging] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [hint, setHint] = useState(true);
  const drag = useRef<{ x: number; y: number; rx: number; ry: number } | null>(
    null
  );

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, rx, ry };
    setDragging(true);
    setHint(false);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    setRy(drag.current.ry + dx * 0.35);
    setRx(Math.max(15, Math.min(80, drag.current.rx - dy * 0.35)));
  }
  function onPointerUp() {
    drag.current = null;
    setDragging(false);
  }

  const tables = [
    [70, 128],
    [150, 128],
    [230, 128],
    [70, 208],
    [150, 208],
    [230, 208],
  ];

  return (
    <div
      style={{
        position: "relative",
        height: "var(--mock-height)",
        overflow: "hidden",
        background: "var(--surface-0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 900,
      }}
    >
      <div
        className="esp-room-scale"
        style={{
          position: "relative",
          width: ROOM,
          height: ROOM,
          transformStyle: "preserve-3d",
          cursor: dragging ? "grabbing" : "grab",
          touchAction: "none",
          userSelect: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
          }}
        >
          <div
            className={playing ? "esp-room-sway" : ""}
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
              transform: "rotateX(0deg) rotateY(0deg)",
            }}
          >
            {/* Floor (top face) with the 2D floor plan */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: ROOM,
                height: ROOM,
                transform: `rotateX(90deg) translateZ(${HEIGHT_HALF}px)`,
                backfaceVisibility: "hidden",
                background:
                  "repeating-linear-gradient(0deg, transparent 0 23px, rgba(2,25,56,0.05) 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, rgba(2,25,56,0.05) 23px 24px), #f7f5fa",
                border: "2px solid var(--navy-900)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  top: 20,
                  width: 90,
                  height: 54,
                  background: "rgba(0,86,169,0.12)",
                  border: "1.5px solid var(--blue-600)",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--blue-700)",
                }}
              >
                Stage
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 20,
                  top: 30,
                  width: 70,
                  height: 120,
                  background: "rgba(39,34,53,0.06)",
                  border: "1.5px dashed var(--gray-500)",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--gray-500)",
                }}
              >
                Buffet
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  width: 120,
                  height: 60,
                  background: "rgba(78,28,216,0.08)",
                  border: "1.5px solid var(--purple-600)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--purple-600)",
                }}
              >
                Dance floor
              </div>
              {tables.map(([x, y], i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "1.5px solid var(--ink-900)",
                    opacity: 0.55,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "var(--blue-600)",
                      opacity: 1,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Front wall */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: ROOM,
                height: WALL_H,
                transform: `translateZ(${DEPTH_HALF}px)`,
                backfaceVisibility: "hidden",
                background: "linear-gradient(180deg,#eef0f6,#e4e7ef)",
                border: "2px solid var(--navy-900)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 24,
                  top: 28,
                  width: 110,
                  height: 84,
                  background: "rgba(158,196,255,0.35)",
                  border: "2px solid var(--navy-900)",
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: "var(--navy-900)",
                    opacity: 0.6,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "var(--navy-900)",
                    opacity: 0.6,
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 28,
                  bottom: 0,
                  width: 64,
                  height: 150,
                  background: "var(--navy-900)",
                  opacity: 0.9,
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 78,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "white",
                  }}
                />
              </div>
            </div>

            {/* Right wall */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: ROOM,
                height: WALL_H,
                transform: `rotateY(90deg) translateZ(${DEPTH_HALF}px)`,
                backfaceVisibility: "hidden",
                background: "linear-gradient(180deg,#f1f3f8,#e9ebf2)",
                border: "2px solid var(--navy-900)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 26,
                  width: 96,
                  height: 70,
                  transform: "translateX(-50%)",
                  background: "rgba(2,25,56,0.08)",
                  border: "1.5px solid var(--navy-900)",
                  borderRadius: 4,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 0,
                  transform: "translateX(-50%)",
                  width: 70,
                  height: 130,
                  background: "rgba(2,25,56,0.12)",
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6,
                }}
              />
            </div>

            {/* Left wall */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: ROOM,
                height: WALL_H,
                transform: `rotateY(-90deg) translateZ(${DEPTH_HALF}px)`,
                backfaceVisibility: "hidden",
                background: "linear-gradient(180deg,#f1f3f8,#e9ebf2)",
                border: "2px solid var(--navy-900)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 30,
                  transform: "translateX(-50%)",
                  width: 140,
                  height: 90,
                  background: "rgba(2,25,56,0.06)",
                  border: "1.5px dashed var(--gray-500)",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* drag hint */}
      {hint && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--navy-900)",
            color: "white",
            borderRadius: "var(--radius-pill)",
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 600,
            boxShadow: "var(--shadow-dropdown)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            zIndex: 5,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 13 }}>✋</span> Drag to look around
        </div>
      )}

      {/* play / pause */}
      <button
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause rotation" : "Play rotation"}
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.92)",
          boxShadow: "var(--shadow-dropdown)",
          color: "var(--ink-900)",
          fontSize: 14,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
        }}
      >
        {playing ? "❚❚" : "▶"}
      </button>
    </div>
  );
}

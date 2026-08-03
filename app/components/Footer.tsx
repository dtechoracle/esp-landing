"use client";

import Button from "./Button";

function scrollToWaitlist() {
  const el = document.getElementById("waitlist");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
}

export default function Footer() {
  return (
    <footer style={{ background: "var(--navy-900)", color: "white" }}>
      <div
        className="container esp-section"
        style={{
          padding: "72px 24px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: 560,
            }}
          >
            Ready to design smarter events?
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "-0.015em",
            }}
          >
            Join the waitlist and be first in when early access opens.
          </p>
          <Button size="lg" onClick={scrollToWaitlist}>
            Join the waitlist
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 24,
          }}
        >
          <img
            src="/assets/mainLogoLight.svg"
            alt="EventSpacePro"
            style={{ height: 26, display: "block" }}
          />
          <span
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              fontWeight: 500,
            }}
          >
            © {new Date().getFullYear()} EventSpacePro. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
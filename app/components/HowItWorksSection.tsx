export default function HowItWorksSection() {
  return (
    <section
      className="section"
      id="how-it-works"
      style={{ background: "linear-gradient(180deg, #fff, var(--canvas))" }}
      aria-labelledby="how-title"
    >
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">How it works</span>
          <h2 className="h2 center" id="how-title" style={{ maxWidth: 720 }}>
            From empty space to a finished floor plan in four steps.
          </h2>
        </div>
        <div className="how-grid">
          {/* Step 1 */}
          <article className="how">
            <div className="how-visual" aria-hidden="true">
              <div className="app-modal">
                <div className="am-back">← Back</div>
                <div className="am-title">Select Venue Type</div>
                <div className="am-grid">
                  <div className="am-opt">
                    <span className="am-ic" style={{ background: "#dcfce7", color: "#16a34a" }}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      >
                        <path d="M12 6v12M6 12h12" />
                      </svg>
                    </span>
                    <b>Custom Venue</b>
                    <small>Start from scratch</small>
                  </div>
                  <div className="am-opt">
                    <span className="am-ic" style={{ background: "#fef3c7", color: "#d97706" }}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.4 6.4-.7-.7M6.3 6.3l-.7-.7m12.8 0-.7.7M6.3 17.7l-.7.7" />
                      </svg>
                    </span>
                    <b>Outdoor Venue</b>
                    <small>Open-air space</small>
                  </div>
                  <div className="am-opt">
                    <span className="am-ic" style={{ background: "#f3e8ff", color: "#9333ea" }}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12l9-8 9 8M5 10v10h14V10" />
                      </svg>
                    </span>
                    <b>Marquee</b>
                    <small>Tent/canopy event</small>
                  </div>
                  <div className="am-opt on">
                    <span className="am-ic" style={{ background: "#dbeafe", color: "#2563eb" }}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <path d="m4 16 4.6-4.6a2 2 0 0 1 2.8 0L16 16m-2-2 1.6-1.6a2 2 0 0 1 2.8 0L20 14" />
                      </svg>
                    </span>
                    <b>Preloaded Venue</b>
                    <small>Real-life venues</small>
                  </div>
                </div>
              </div>
            </div>
            <span className="how-num">1</span>
            <h3>Pick a space</h3>
            <p>Choose a listed venue, start from a template, or enter your own dimensions, indoors or out.</p>
          </article>

          {/* Step 2 */}
          <article className="how">
            <div className="how-visual" aria-hidden="true">
              <div className="mock" style={{ background: "transparent", border: 0, boxShadow: "none", padding: 0 }}>
                <div className="mock-bubble">250 guests, theater seating, two bars</div>
                <div className="mock-avatars" style={{ justifyContent: "flex-start", marginTop: 10 }}>
                  <span
                    className="badge"
                    style={{ background: "#fff", border: "1px solid var(--line)", color: "var(--muted)" }}
                  >
                    Drafting layout…
                  </span>
                </div>
              </div>
            </div>
            <span className="how-num">2</span>
            <h3>Describe the event</h3>
            <p>Tell the AI assistant the guest count, style, and must-haves.</p>
          </article>

          {/* Step 3 */}
          <article className="how">
            <div className="how-visual canvas" aria-hidden="true">
              <svg className="canvas-svg" viewBox="0 0 300 172" preserveAspectRatio="xMidYMid slice">
                <rect width="300" height="172" fill="url(#p-grid-lg)" stroke="none" />
                <rect x="60" y="14" width="180" height="26" rx="2" />
                <text x="150" y="31" textAnchor="middle" fontSize="9">
                  STAGE
                </text>
                <use href="#a-round10" x="24" y="58" width="52" height="52" />
                <use href="#a-round10" x="92" y="58" width="52" height="52" />
                <use href="#a-round10" x="224" y="58" width="52" height="52" />
                <use href="#a-round10" x="58" y="114" width="52" height="52" />
                <use href="#a-round10" x="190" y="114" width="52" height="52" />
                {/* table being dragged, with the editor's selection handles */}
                <use href="#a-round10" x="158" y="64" width="52" height="52" />
                <g stroke="none">
                  <rect x="156" y="62" width="56" height="56" fill="none" stroke="#3B82F6" strokeWidth="1.2" />
                  <line x1="184" y1="62" x2="184" y2="50" stroke="#3B82F6" strokeWidth="1.2" />
                  <circle cx="184" cy="47" r="4.2" fill="#10B981" stroke="#fff" strokeWidth="1.6" />
                  <rect x="152.5" y="58.5" width="7" height="7" rx="1.5" fill="#3B82F6" stroke="#fff" strokeWidth="1.6" />
                  <rect x="208.5" y="58.5" width="7" height="7" rx="1.5" fill="#3B82F6" stroke="#fff" strokeWidth="1.6" />
                  <rect x="152.5" y="114.5" width="7" height="7" rx="1.5" fill="#3B82F6" stroke="#fff" strokeWidth="1.6" />
                  <rect x="208.5" y="114.5" width="7" height="7" rx="1.5" fill="#3B82F6" stroke="#fff" strokeWidth="1.6" />
                </g>
              </svg>
            </div>
            <span className="how-num">3</span>
            <h3>Refine in 2D</h3>
            <p>Drag tables, stages, and assets until the plan is exactly right.</p>
          </article>

          {/* Step 4 */}
          <article className="how">
            <div className="how-visual" aria-hidden="true">
              <div style={{ width: "100%" }}>
                <div className="mock-link">
                  <svg width="14" height="14" style={{ color: "var(--blue)", flexShrink: 0 }}>
                    <use href="#i-link" />
                  </svg>
                  <span>eventspacepro.com/plan/tomi-chioma</span>
                </div>
                <div className="mock-avatars">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
            <span className="how-num">4</span>
            <h3>Share and sign off</h3>
            <p>
              Send your client and the venue a live plan link, so everyone signs off on the same layout. No
              surprises on the day.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

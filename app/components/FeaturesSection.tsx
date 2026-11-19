import Image from "next/image";

export default function FeaturesSection() {
  return (
    <>
      {/* 5. FEATURES + EXAMPLE PLAN */}
      <section className="section" id="features" style={{ paddingTop: 0 }} aria-labelledby="features-title">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Features</span>
            <h2 className="h2" id="features-title">
              Available now, plus what comes next.
            </h2>
          </div>
          <div className="feature-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <article className="card">
              <div className="ic">
                <svg width="20" height="20">
                  <use href="#i-grid" />
                </svg>
              </div>
              <h3>
                2D floor-plan editor <span className="badge">Available now</span>
              </h3>
              <p>
                Drag-and-drop walls, tables, stages, and assets on a precise grid. Real dimensions, real
                capacity counts, no CAD required.
              </p>
            </article>

            <article className="card">
              <div className="ic">
                <svg width="20" height="20">
                  <use href="#i-spark" />
                </svg>
              </div>
              <h3>
                AI layout assistant <span className="badge">Available now</span>
              </h3>
              <p>
                Describe the event, &ldquo;250 guests, theater seating, two bars&rdquo;, and get a compliant
                layout in seconds. Then tweak it by hand.
              </p>
            </article>

            <article className="card muted">
              <div className="ic">
                <svg width="20" height="20">
                  <use href="#i-cube" />
                </svg>
              </div>
              <h3>
                3D walkthrough preview <span className="badge soon">Early 2027</span>
              </h3>
              <p>
                In build now: flip any plan into 3D and walk the room before load-in day. Every plan you draw
                today carries straight over.
              </p>
            </article>
          </div>

          <div className="plan-stage">
            <figure className="plan-frame" style={{ margin: 0 }}>
              <div className="plan-bar">
                <div className="dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="plan-title">Tomi &amp; Chioma Wedding — Harbour Point Event Centre</span>
                <div className="seg" aria-hidden="true">
                  <span className="on">2D editor</span>
                  <span>3D · 2027</span>
                </div>
              </div>
              <div className="plan-img">
                <Image
                  src="/assets/editor-1600.webp"
                  alt="The EventSpacePro 2D editor showing a wedding hall floor plan with 84 numbered round tables, a stage and a dance floor."
                  width={1600}
                  height={590}
                  sizes="(max-width: 640px) 100vw, 1120px"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                />
              </div>
            </figure>
            <p className="plan-caption">
              84 numbered tables across a 64.95 &times; 25.18 m hall drawn to real dimensions and numbered
              automatically.
            </p>
          </div>
        </div>
      </section>

      {/* 6. ALSO INCLUDED */}
      <section className="section" style={{ paddingTop: 0 }} aria-labelledby="included-title">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Also included</span>
            <h2 className="h2" id="included-title" style={{ fontSize: "clamp(24px, 3vw, 32px)" }}>
              Everything else you need on the plan.
            </h2>
          </div>
          <div className="included">
            <article className="mini">
              <div className="ic">
                <svg width="18" height="18">
                  <use href="#i-box" />
                </svg>
              </div>
              <h3>Asset library</h3>
              <p>Tables, chairs, stages, bars, and props drag-ready and sized to real dimensions.</p>
            </article>

            <article className="mini">
              <div className="ic">
                <svg width="18" height="18">
                  <use href="#i-team" />
                </svg>
              </div>
              <h3>Real-time collaboration</h3>
              <p>Plan alongside your team and the venue in one file. Changes appear as they happen.</p>
            </article>

            <article className="mini">
              <div className="ic">
                <svg width="18" height="18">
                  <use href="#i-layers" />
                </svg>
              </div>
              <h3>Venue templates</h3>
              <p>
                Save any layout, including marquees and outdoor spaces, as a reusable template and start your
                next event from it.
              </p>
            </article>

            <article className="mini">
              <div className="ic">
                <svg width="18" height="18">
                  <use href="#i-pin" />
                </svg>
              </div>
              <h3>Preloaded venues</h3>
              <p>Listed spaces arrive with accurate plans and locations already built in.</p>
            </article>

            <article className="mini">
              <div className="ic">
                <svg width="18" height="18">
                  <use href="#i-hash" />
                </svg>
              </div>
              <h3>Table numbering</h3>
              <p>Auto-number tables and seats, then export the list for place cards and charts.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

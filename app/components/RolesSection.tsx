"use client";

export default function RolesSection() {
  function handleScrollToCta(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const el = document.getElementById("early-access");
    if (el) {
      el.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center",
      });
      setTimeout(() => {
        const first = document.getElementById("f-first") as HTMLInputElement | null;
        if (first) first.focus({ preventScroll: true });
      }, 500);
    }
  }

  return (
    <section className="section" id="who-its-for" aria-labelledby="roles-title">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Who it&apos;s for</span>
          <h2 className="h2" id="roles-title">
            Made for the people who set the space.
          </h2>
        </div>

        <article className="role-lead">
          <div>
            <span className="eyebrow">For event planners</span>
            <h3>Pitch layouts clients can actually read.</h3>
            <ul className="ticks">
              <li>
                <svg width="16" height="16">
                  <use href="#i-check" />
                </svg>
                Start from a preloaded venue plan or your own dimensions
              </li>
              <li>
                <svg width="16" height="16">
                  <use href="#i-check" />
                </svg>
                Design seating, staging, and guest flow to scale
              </li>
              <li>
                <svg width="16" height="16">
                  <use href="#i-check" />
                </svg>
                Share a live plan link instead of a flat PDF
              </li>
            </ul>
            <div className="role-cta">
              <a className="btn btn-primary btn-lg js-cta" href="#early-access" onClick={handleScrollToCta}>
                Get early access
              </a>
            </div>
          </div>

          <div className="role-visual" aria-hidden="true">
            <div className="rv-head">
              Reception layout<span>2D editor</span>
            </div>
            <svg
              className="canvas-svg"
              viewBox="0 0 400 236"
              preserveAspectRatio="xMidYMid meet"
              style={{ height: "auto", aspectRatio: "400/236" }}
            >
              <rect width="400" height="236" fill="url(#p-grid-lg)" stroke="none" />
              <rect x="120" y="12" width="160" height="34" rx="2" />
              <text x="200" y="33" textAnchor="middle" fontSize="10">
                STAGE
              </text>
              <rect x="146" y="92" width="108" height="100" fill="url(#p-hatch)" />
              <rect x="146" y="92" width="108" height="100" fill="none" />
              <text x="200" y="146" textAnchor="middle" fontSize="9">
                DANCE FLOOR
              </text>
              <use href="#a-round10" x="18" y="64" width="46" height="46" />
              <use href="#a-round10" x="18" y="120" width="46" height="46" />
              <use href="#a-round10" x="18" y="176" width="46" height="46" />
              <use href="#a-round10" x="74" y="64" width="46" height="46" />
              <use href="#a-round10" x="74" y="120" width="46" height="46" />
              <use href="#a-round10" x="74" y="176" width="46" height="46" />
              <use href="#a-round10" x="282" y="64" width="46" height="46" />
              <use href="#a-round10" x="282" y="120" width="46" height="46" />
              <use href="#a-round10" x="282" y="176" width="46" height="46" />
              <use href="#a-round10" x="338" y="64" width="46" height="46" />
              <use href="#a-round10" x="338" y="120" width="46" height="46" />
              <use href="#a-round10" x="338" y="176" width="46" height="46" />
              <g stroke="none">
                <rect x="280" y="118" width="50" height="50" fill="none" stroke="#3B82F6" strokeWidth="1.2" />
                <line x1="305" y1="118" x2="305" y2="107" stroke="#3B82F6" strokeWidth="1.2" />
                <circle cx="305" cy="104" r="4" fill="#10B981" stroke="#fff" strokeWidth="1.6" />
                <rect x="276.5" y="114.5" width="7" height="7" rx="1.5" fill="#3B82F6" stroke="#fff" strokeWidth="1.6" />
                <rect x="326.5" y="114.5" width="7" height="7" rx="1.5" fill="#3B82F6" stroke="#fff" strokeWidth="1.6" />
                <rect x="276.5" y="164.5" width="7" height="7" rx="1.5" fill="#3B82F6" stroke="#fff" strokeWidth="1.6" />
                <rect x="326.5" y="164.5" width="7" height="7" rx="1.5" fill="#3B82F6" stroke="#fff" strokeWidth="1.6" />
              </g>
            </svg>
            <div className="rv-foot">
              <i />
              Live link shared with client
            </div>
          </div>
        </article>

        <div className="roles-3">
          <article className="role">
            <span className="eyebrow">For decorators</span>
            <h3>Show the look before a single prop moves.</h3>
            <ul className="ticks">
              <li>
                <svg width="16" height="16">
                  <use href="#i-check" />
                </svg>
                Place drapery, florals, and props to scale from the asset library
              </li>
              <li>
                <svg width="16" height="16">
                  <use href="#i-check" />
                </svg>
                Check sightlines and clearance long before load-in day
              </li>
              <li>
                <svg width="16" height="16">
                  <use href="#i-check" />
                </svg>
                Hand the crew an exact placement list, not a mood board
              </li>
            </ul>
          </article>

          <article className="role">
            <span className="eyebrow">For venues and venue staff</span>
            <h3>Show every space exactly as it is.</h3>
            <ul className="ticks">
              <li>
                <svg width="16" height="16">
                  <use href="#i-check" />
                </svg>
                Digitize your spaces once into reusable floor plans
              </li>
              <li>
                <svg width="16" height="16">
                  <use href="#i-check" />
                </svg>
                Check any layout against real capacity before you approve it
              </li>
              <li>
                <svg width="16" height="16">
                  <use href="#i-check" />
                </svg>
                Fewer site visits, fewer surprises on the day
              </li>
            </ul>
          </article>

          <article className="role">
            <span className="eyebrow">For other creative pros</span>
            <h3>Know the space before you arrive.</h3>
            <ul className="ticks">
              <li>
                <svg width="16" height="16">
                  <use href="#i-check" />
                </svg>
                AV, catering, and entertainment plan against the real footprint
              </li>
              <li>
                <svg width="16" height="16">
                  <use href="#i-check" />
                </svg>
                Mark rigging, power, and service routes on the shared plan
              </li>
              <li>
                <svg width="16" height="16">
                  <use href="#i-check" />
                </svg>
                Work in the same file as the planner, in real time
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

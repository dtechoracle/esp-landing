"use client";

export default function FinalCtaSection() {
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
    <section className="final" aria-labelledby="final-title">
      <div className="wrap">
        <div className="final-stage">
          <div className="final-card">
            <h2 id="final-title">Ready to design smarter events?</h2>
            <p>Get early access to the 2D editor and AI assistant today, and get 3D the day it ships.</p>
            <div className="actions">
              <a className="btn btn-primary btn-lg js-cta" href="#early-access" onClick={handleScrollToCta}>
                Get early access
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

export default function FaqSection() {
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
    <section className="section" id="faq" style={{ paddingTop: 24 }} aria-labelledby="faq-title">
      <div className="wrap faq-wrap">
        <div className="faq-side">
          <span className="eyebrow">FAQ</span>
          <h2 className="h2" id="faq-title" style={{ marginTop: 14 }}>
            Frequently asked questions
          </h2>
          <p>Still deciding? Early access is open, so you can try it today.</p>
          <a className="text-link js-cta" href="#early-access" onClick={handleScrollToCta}>
            Get early access →
          </a>
        </div>
        <div className="faq-list">
          <details>
            <summary>
              What is EventSpacePro?
              <span className="plus" aria-hidden="true">
                <svg width="14" height="14">
                  <use href="#i-plus" />
                </svg>
              </span>
            </summary>
            <div className="answer">
              EventSpacePro is a 2D floor plan editor designed for event planners, decorators, and venues. It
              features an AI layout assistant that creates an initial draft from a text prompt, which you can
              then edit on a precise grid with real-world dimensions.
            </div>
          </details>

          <details>
            <summary>
              Do I need any CAD or design experience?
              <span className="plus" aria-hidden="true">
                <svg width="14" height="14">
                  <use href="#i-plus" />
                </svg>
              </span>
            </summary>
            <div className="answer">
              Not at all. The interface is completely drag-and-drop. You can let the AI generate the first layout
              and simply tweak the tables, stages, and elements until it&apos;s exactly right.
            </div>
          </details>

          <details>
            <summary>
              Is there a 3D view?
              <span className="plus" aria-hidden="true">
                <svg width="14" height="14">
                  <use href="#i-plus" />
                </svg>
              </span>
            </summary>
            <div className="answer">
              Yes, our 3D walkthrough preview is currently in development and will launch in early 2027. Any 2D
              plans you create now will automatically be compatible with the 3D viewer when it&apos;s released.
            </div>
          </details>

          <details>
            <summary>
              Can I collaborate with my team or the venue?
              <span className="plus" aria-hidden="true">
                <svg width="14" height="14">
                  <use href="#i-plus" />
                </svg>
              </span>
            </summary>
            <div className="answer">
              Yes! EventSpacePro includes real-time collaboration. You can plan alongside your team or the venue
              in a single file, and all changes will appear as they happen.
            </div>
          </details>

          <details>
            <summary>
              Can I use EventSpacePro now?
              <span className="plus" aria-hidden="true">
                <svg width="14" height="14">
                  <use href="#i-plus" />
                </svg>
              </span>
            </summary>
            <div className="answer">
              Yes. Early access is open now. Fill in the{" "}
              <a
                className="js-cta"
                href="#early-access"
                onClick={handleScrollToCta}
                style={{ color: "var(--blue)", fontWeight: 600 }}
              >
                form at the top of this page
              </a>{" "}
              with your name, email and WhatsApp number, and you&apos;ll go straight to sign-up to create your
              account in under a minute. The 2D editor and AI layout assistant are ready to use today, and 3D
              arrives in early 2027.
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}

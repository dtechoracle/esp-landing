"use client";

import { useEffect, useState } from "react";

export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const visibleMap: Record<string, boolean> = {};

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          const key = en.target.id || en.target.className;
          visibleMap[key] = en.isIntersecting;
        });

        const anyVisible = Object.values(visibleMap).some(Boolean);
        setShow(!anyVisible);
      },
      { threshold: 0 }
    );

    const heroStage = document.getElementById("hero-stage");
    const finalStage = document.querySelector(".final-stage");
    const footer = document.querySelector(".footer");

    if (heroStage) io.observe(heroStage);
    if (finalStage) io.observe(finalStage);
    if (footer) io.observe(footer);

    return () => {
      io.disconnect();
    };
  }, []);

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
    <div className={`sticky-cta ${show ? "show" : ""}`} id="sticky-cta" aria-hidden="true">
      <a
        className="btn btn-primary btn-lg btn-block js-cta"
        href="#early-access"
        tabIndex={-1}
        onClick={handleScrollToCta}
      >
        Get early access
      </a>
    </div>
  );
}

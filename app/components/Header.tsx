"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  isTutorialsPage?: boolean;
}

export default function Header({ isTutorialsPage = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const prefix = isTutorialsPage ? "/" : "";

  function handleScrollToCta(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isTutorialsPage) {
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
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Main">
        <Link href={isTutorialsPage ? "/" : "#top"} className="nav-logo" aria-label="EventSpacePro home">
          <Image
            src="/assets/mainLogo.svg"
            alt="EventSpacePro"
            width={79}
            height={30}
            priority
            style={{ width: "auto", height: 30 }}
          />
        </Link>
        <div className="nav-links">
          <Link href={`${prefix}#features`}>Features</Link>
          <Link href={`${prefix}#how-it-works`}>How it works</Link>
          <Link href={`${prefix}#who-its-for`}>Who it&apos;s for</Link>
          <Link href={`${prefix}#faq`}>FAQ</Link>
          <Link href="/tutorials">Tutorials</Link>
        </div>
        <Link
          className="btn btn-primary btn-sm nav-cta js-cta"
          href={`${prefix}#early-access`}
          onClick={handleScrollToCta}
        >
          Get early access
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="20" height="20">
            <use href="#i-menu" />
          </svg>
        </button>
      </nav>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} id="mobile-menu">
        <Link href={`${prefix}#features`} onClick={() => setMenuOpen(false)}>
          Features
        </Link>
        <Link href={`${prefix}#how-it-works`} onClick={() => setMenuOpen(false)}>
          How it works
        </Link>
        <Link href={`${prefix}#who-its-for`} onClick={() => setMenuOpen(false)}>
          Who it&apos;s for
        </Link>
        <Link href={`${prefix}#faq`} onClick={() => setMenuOpen(false)}>
          FAQ
        </Link>
        <Link href="/tutorials" onClick={() => setMenuOpen(false)}>
          Tutorials
        </Link>
      </div>
    </header>
  );
}

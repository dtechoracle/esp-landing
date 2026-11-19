"use client";

import Link from "next/link";
import Image from "next/image";
import { CONTENT } from "@/content/site";

const SOCIAL_ICONS: Record<string, { label: string; renderSvg: () => React.ReactNode }> = {
  instagram: {
    label: "Instagram",
    renderSvg: () => (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
      </>
    ),
  },
  tiktok: {
    label: "TikTok",
    renderSvg: () => (
      <path
        fill="currentColor"
        d="M16.6 2.5c.3 2.3 1.7 4 4 4.3v3.3c-1.5 0-2.9-.4-4-1.2v6.4a6.3 6.3 0 1 1-6.3-6.3c.3 0 .7 0 1 .1v3.4a2.9 2.9 0 1 0 2 2.8V2.5h3.3z"
      />
    ),
  },
  facebook: {
    label: "Facebook",
    renderSvg: () => (
      <path
        fill="currentColor"
        d="M13.5 21.5v-8h2.7l.4-3.2h-3.1V8.3c0-.9.3-1.6 1.6-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4v3.2h2.8v8h3.3z"
      />
    ),
  },
  whatsapp: {
    label: "WhatsApp channel",
    renderSvg: () => (
      <>
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          d="M3.6 20.4l1.2-4.3A8.6 8.6 0 1 1 8 19.3z"
        />
        <path
          fill="currentColor"
          d="M9 7.6c-.3 0-.7.1-.9.5-.4.5-.8 1.2-.6 2.2.4 1.8 2.7 4.6 5.5 5.6 1 .4 1.8.2 2.3-.2.4-.3.6-.8.6-1.2l-.1-.3-1.9-.9c-.2-.1-.4 0-.5.1l-.6.8c-.1.1-.3.2-.5.1-1.1-.5-2-1.3-2.6-2.4-.1-.2 0-.3.1-.4l.5-.6c.1-.2.1-.3.1-.5l-.8-1.9c-.1-.3-.3-.4-.6-.4H9z"
        />
      </>
    ),
  },
  youtube: {
    label: "YouTube",
    renderSvg: () => (
      <>
        <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
        <path d="M10 9v6l5.2-3z" fill="#fff" />
      </>
    ),
  },
  linkedin: {
    label: "LinkedIn",
    renderSvg: () => (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
        <path
          fill="#fff"
          d="M7 10h2.4v7H7zm1.2-3.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8zM11 10h2.3v1c.4-.7 1.2-1.2 2.4-1.2 2.2 0 2.6 1.4 2.6 3.3V17h-2.4v-3.4c0-.9 0-1.9-1.2-1.9s-1.4.9-1.4 1.8V17H11z"
        />
      </>
    ),
  },
  x: {
    label: "X",
    renderSvg: () => (
      <path
        fill="currentColor"
        d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.3l-4.9-6.3L5.3 21H2.2l7.3-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"
      />
    ),
  },
};

const ORDER = ["instagram", "tiktok", "facebook", "whatsapp", "youtube", "linkedin", "x"];

interface FooterProps {
  isTutorialsPage?: boolean;
}

export default function Footer({ isTutorialsPage = false }: FooterProps) {
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
  }

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image
              src="/assets/mainLogo.svg"
              alt="EventSpacePro"
              width={84}
              height={32}
              loading="lazy"
              style={{ width: "auto", height: 32 }}
            />
            <p className="tag">See the space before it&apos;s set.</p>
            <p className="org">A product of AB Imaging Concepts. Lagos, established 2007.</p>
            <div className="socials" aria-label="EventSpacePro on social media">
              {ORDER.map((key) => {
                const url = CONTENT.SOCIALS[key];
                const icon = SOCIAL_ICONS[key];
                if (!url || !icon) return null;
                return (
                  <a
                    key={key}
                    className="social"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`EventSpacePro on ${icon.label}`}
                    title={icon.label}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      {icon.renderSvg()}
                    </svg>
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li>
                <Link href={`${prefix}#features`}>Features</Link>
              </li>
              <li>
                <Link href={`${prefix}#how-it-works`}>How it works</Link>
              </li>
              <li>
                <Link href={`${prefix}#who-its-for`}>Who it&apos;s for</Link>
              </li>
              <li>
                <Link href={`${prefix}#faq`}>FAQ</Link>
              </li>
              <li>
                <Link href="/tutorials">Tutorials</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Get started</h4>
            <ul>
              <li>
                <Link href={`${prefix}#early-access`} onClick={handleScrollToCta}>
                  Get early access
                </Link>
              </li>
              <li>
                <a href={CONTENT.LOG_IN_URL} target="_blank" rel="noopener noreferrer">
                  Log in
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">&copy; 2026 EventSpacePro. All rights reserved.</div>
      </div>
    </footer>
  );
}

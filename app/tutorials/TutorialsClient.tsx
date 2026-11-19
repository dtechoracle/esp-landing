"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CONTENT, getYoutubeId, Tutorial } from "@/content/site";

export default function TutorialsClient() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const ytChannel = CONTENT.SOCIALS.youtube?.trim();

  const tutorialsWithIds = useMemo(() => {
    return CONTENT.TUTORIALS.map((t) => ({
      ...t,
      id: getYoutubeId(t.youtube),
    })).filter((t) => t.id && t.title);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    CONTENT.TUTORIALS.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, []);

  const filteredTutorials = useMemo(() => {
    if (selectedCategory === "All") return tutorialsWithIds;
    return tutorialsWithIds.filter((t) => t.category === selectedCategory);
  }, [selectedCategory, tutorialsWithIds]);

  return (
    <>
      <Header isTutorialsPage={true} />

      <main id="top">
        {/* TUTORIALS HERO */}
        <section className="tut-hero" aria-labelledby="tut-title">
          <div className="wrap">
            <span className="eyebrow">Video tutorials</span>
            <h1 id="tut-title">Learn how to plan with EventSpacePro.</h1>
            <p className="hero-sub center">
              Step-by-step videos to take you from a blank floor to an approved layout.
            </p>

            {ytChannel && (
              <div className="tut-actions">
                <a
                  className="btn btn-ghost btn-sm"
                  id="yt-channel"
                  href={ytChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit our YouTube channel →
                </a>
              </div>
            )}

            {categories.length > 1 && (
              <div className="chips" id="tut-chips" role="toolbar" aria-label="Filter by topic">
                {["All", ...categories].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="chip"
                    aria-pressed={selectedCategory === c}
                    onClick={() => setSelectedCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* TUTORIALS GRID OR EMPTY STATE */}
        <section className="section" style={{ paddingTop: 0 }} aria-label="Video tutorials">
          <div className="wrap">
            {tutorialsWithIds.length === 0 ? (
              <div className="tut-empty" id="tut-empty">
                <div className="tut-empty-card">
                  <span className="tile tile-ai">
                    <svg>
                      <use href="#i-spark" />
                    </svg>
                  </span>
                  <h2>Video tutorials are on the way.</h2>
                  <p>Follow our socials or subscribe on YouTube to see the first videos when they drop.</p>
                  {ytChannel && (
                    <a
                      className="btn btn-primary btn-sm"
                      href={ytChannel}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit our YouTube channel
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="tut-grid" id="tut-grid">
                {filteredTutorials.map((t) => {
                  const href = `https://www.youtube.com/watch?v=${t.id}`;
                  const thumb = `https://i.ytimg.com/vi/${t.id}/hqdefault.jpg`;

                  return (
                    <a
                      key={t.id}
                      className="tut"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="tut-thumb">
                        <img
                          src={thumb}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width={480}
                          height={360}
                        />
                        <span className="tut-play" aria-hidden="true">
                          <svg width="22" height="22" viewBox="0 0 24 24">
                            <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />
                          </svg>
                        </span>
                        {t.duration && <span className="tut-dur">{t.duration}</span>}
                      </div>
                      <div className="tut-body">
                        {t.category && <span className="tut-cat">{t.category}</span>}
                        <h3>{t.title}</h3>
                        {t.description && <p>{t.description}</p>}
                        <span className="tut-watch">
                          Watch on YouTube <span aria-hidden="true">→</span>
                          <span className="sr-only">(opens in a new tab)</span>
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final" aria-labelledby="final-title">
          <div className="wrap">
            <div className="final-stage">
              <div className="final-card">
                <h2 id="final-title">Ready to design smarter events?</h2>
                <p>Get early access to the 2D editor and AI assistant today, and get 3D the day it ships.</p>
                <div className="actions">
                  <Link className="btn btn-primary btn-lg" href="/#early-access">
                    Get early access
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer isTutorialsPage={true} />
    </>
  );
}

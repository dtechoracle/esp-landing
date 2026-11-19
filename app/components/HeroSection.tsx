"use client";

import EarlyAccessForm from "./EarlyAccessForm";
import { CONTENT } from "@/content/site";

export default function HeroSection() {
  const lm = CONTENT.LEAD_MAGNET;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap">
        <h1 id="hero-title">
          Design your event floor plan{" "}
          <span className="tile tile-plan" aria-hidden="true">
            <svg>
              <use href="#i-grid" />
            </svg>
          </span>{" "}
          in 2D. Let AI{" "}
          <span className="tile tile-ai" aria-hidden="true">
            <svg>
              <use href="#i-spark" />
            </svg>
          </span>{" "}
          do the first draft.
        </h1>
        <p className="hero-sub">
          Show your client the room before the day. Describe the event, get a to-scale 2D floor plan drafted
          by AI, then fine-tune every table yourself.
        </p>
      </div>

      <div className="wrap">
        <div className="stage" id="hero-stage">
          <EarlyAccessForm />

          <div className="hero-below">
            <ul className="objections">
              <li>
                <svg width="18" height="18">
                  <use href="#i-check" />
                </svg>
                No CAD or design skills needed
              </li>
              <li>
                <svg width="18" height="18">
                  <use href="#i-check" />
                </svg>
                Start from a template, not a blank page
              </li>
              <li>
                <svg width="18" height="18">
                  <use href="#i-check" />
                </svg>
                Works on laptop, desktop and tablet
              </li>
            </ul>

            {lm && lm.title && (
              <p className="lead-magnet" id="lead-magnet">
                Not ready yet? <a href={lm.url || "#"}>Get {lm.title} free</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

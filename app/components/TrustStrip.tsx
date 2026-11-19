import Image from "next/image";
import { CONTENT } from "@/content/site";

export default function TrustStrip() {
  const te = CONTENT.TRUST_EXTRAS;
  const hasLogos = te.logos && te.logos.length > 0;
  const hasStats = te.stats && te.stats.length > 0;

  return (
    <section className="trust" aria-label="About EventSpacePro">
      <div className="wrap trust-inner">
        <span className="trust-fact">
          <span className="flag">
            <svg width="15" height="15">
              <use href="#i-pin" />
            </svg>
          </span>
          Built in Lagos by AB Imaging Concepts, designing event floor plans since 2007
        </span>

        {(hasLogos || hasStats) && (
          <div className="trust-extras" id="trust-extras">
            {te.logos?.map((l, i) => (
              <Image
                key={i}
                src={l.src}
                alt={l.alt || ""}
                width={100}
                height={28}
                loading="lazy"
                style={{ height: 28, width: "auto" }}
              />
            ))}
            {te.stats?.map((s, i) => (
              <span key={i} className="trust-stat">
                <b>{s.value}</b> {s.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

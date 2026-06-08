'use client'
import React, { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPTypefaceCarousel — three-slide type specimen that types out a pangram in
 * each of the brand's typefaces. Replaces the old cursor-spotlight (which
 * re-rendered the giant text on every mousemove and felt shaky).
 *
 * Slide 1 — Brasil        (display)
 * Slide 2 — Space Grotesk (text)
 * Slide 3 — DM Mono       (mono)
 */

type Typeface = "sans" | "public" | "mono";

// Each typeface gets a true pangram — a meaningful sentence that exercises
// every letter, which is exactly what a specimen is for.
const SPECIMENS: Record<Typeface, { name: string; text: string; family: string }> = {
  sans:   { name: "Brasil",        text: "The quick brown fox jumps over the lazy dog", family: "'Brasil', Georgia, serif" },
  public: { name: "Space Grotesk", text: "Pack my box with five dozen liquor jugs",     family: "var(--loaded-space-grotesk), system-ui, sans-serif" },
  mono:   { name: "DM Mono",       text: "How vexingly quick daft zebras jump",          family: "var(--loaded-dm-mono), ui-monospace, monospace" },
};

const ORDER: Typeface[] = ["sans", "public", "mono"];

interface Props {
  fontWeight: number;
  monoFontWeight: number;
  publicFontWeight: number;
  onTypefaceChange: (t: Typeface) => void;
  activeTypeface: Typeface;
}

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function BPTypefaceCarousel({ fontWeight, monoFontWeight, publicFontWeight, onTypefaceChange, activeTypeface }: Props) {
  const isMobile = useIsMobile();
  const [hoverLeft, setHoverLeft]   = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [typed, setTyped] = useState("");

  const idx = ORDER.indexOf(activeTypeface);
  const isFirst = idx <= 0;
  const isLast  = idx >= ORDER.length - 1;
  const spec = SPECIMENS[activeTypeface];
  const weight = activeTypeface === "sans" ? fontWeight : activeTypeface === "public" ? publicFontWeight : monoFontWeight;

  const goLeft  = () => { if (!isFirst) onTypefaceChange(ORDER[idx - 1]); };
  const goRight = () => { if (!isLast)  onTypefaceChange(ORDER[idx + 1]); };

  // Typewriter: retype whenever the active typeface changes.
  const fullRef = useRef(spec.text);
  fullRef.current = spec.text;
  useEffect(() => {
    const full = SPECIMENS[activeTypeface].text;
    setTyped("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) window.clearInterval(id);
    }, 45);
    return () => window.clearInterval(id);
  }, [activeTypeface]);

  const ArrowNav = () => (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
      <span style={{ fontFamily: "var(--loaded-dm-mono), monospace", fontSize: "13px", color: "#8C8C8C", letterSpacing: "0.08em", marginRight: "4px", textTransform: "uppercase" }}>
        {spec.name}
      </span>
      <span style={{ fontFamily: "var(--loaded-dm-mono), monospace", fontSize: "13px", color: "#8C8C8C", letterSpacing: "0.05em", marginRight: "8px" }}>
        {String(idx + 1).padStart(2, "0")} / 03
      </span>
      <button
        onClick={goLeft} disabled={isFirst} aria-label="Previous typeface"
        onMouseEnter={() => setHoverLeft(true)} onMouseLeave={() => setHoverLeft(false)}
        style={{
          width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "50%", border: `1px solid ${isFirst ? "#D1D0CC" : "#242424"}`,
          backgroundColor: hoverLeft && !isFirst ? "#242424" : "transparent",
          color: isFirst ? "#D1D0CC" : hoverLeft ? "#FFFFFF" : "#242424",
          cursor: isFirst ? "not-allowed" : "pointer", transition: "all 0.2s ease", flexShrink: 0,
        }}
      >
        <ChevronLeft />
      </button>
      <button
        onClick={goRight} disabled={isLast} aria-label="Next typeface"
        onMouseEnter={() => setHoverRight(true)} onMouseLeave={() => setHoverRight(false)}
        style={{
          width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "50%", border: `1px solid ${isLast ? "#D1D0CC" : "#242424"}`,
          backgroundColor: hoverRight && !isLast ? "#242424" : "transparent",
          color: isLast ? "#D1D0CC" : hoverRight ? "#FFFFFF" : "#242424",
          cursor: isLast ? "not-allowed" : "pointer", transition: "all 0.2s ease", flexShrink: 0,
        }}
      >
        <ChevronRight />
      </button>
    </div>
  );

  return (
    <section style={{ backgroundColor: "#F4F3EF", width: "100%", paddingBottom: isMobile ? "48px" : "112px", boxSizing: "border-box" }}>
      <style>{`@keyframes bpCaretBlink { 0%,49%{opacity:1} 50%,100%{opacity:0} }`}</style>

      <div style={{ padding: isMobile ? "32px 24px" : "40px 64px", display: "flex", justifyContent: "flex-end" }}>
        <ArrowNav />
      </div>

      <div style={{ padding: isMobile ? "0 24px" : "0 64px", minHeight: isMobile ? "40vh" : "46vh", display: "flex", alignItems: "center" }}>
        <p
          aria-label={spec.text}
          style={{
            fontFamily: spec.family,
            fontWeight: weight,
            fontSize: isMobile ? "clamp(30px, 9vw, 44px)" : "clamp(48px, 6.4vw, 104px)",
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "#242424",
            width: "100%",
          }}
        >
          {typed}
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "0.06em",
              height: "0.92em",
              marginLeft: "0.06em",
              transform: "translateY(0.1em)",
              backgroundColor: "#BB3308",
              animation: "bpCaretBlink 1s step-end infinite",
            }}
          />
        </p>
      </div>
    </section>
  );
}

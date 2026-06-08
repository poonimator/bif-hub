'use client'
import React, { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPTypefaceCarousel — interactive type tester.
 *
 * Arrows toggle the three brand typefaces (Brasil · Space Grotesk · DM Mono).
 * A weight slider sits directly under the toggle, and a short paragraph renders
 * in the active typeface, weight and colour.
 */

const FONTS = [
  { key: "brasil", name: "Brasil",        family: "'Brasil', Georgia, serif",                       color: "#242424", weights: [200, 300, 400, 500, 700, 900], def: 500, download: "/brasil-font.zip" },
  { key: "space",  name: "Space Grotesk", family: "var(--loaded-space-grotesk), system-ui, sans-serif", color: "#51C8FF", weights: [300, 400, 500, 600, 700],      def: 500, download: "https://fonts.google.com/specimen/Space+Grotesk" },
  { key: "dm",     name: "DM Mono",        family: "var(--loaded-dm-mono), ui-monospace, monospace",  color: "#BB3308", weights: [400, 500],                    def: 500, download: "https://fonts.google.com/specimen/DM+Mono" },
];

const PARAGRAPH =
  "Human abundance is the belief that mindful societies, intelligent economies and regenerative systems can help every life flourish — where ancient wisdom and new intelligence meet, and progress is measured by how well we live.";

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function BPTypefaceCarousel() {
  const isMobile = useIsMobile();
  const [i, setI] = useState(0);
  const font = FONTS[i];
  const [weight, setWeight] = useState<number>(font.def);
  const [hoverL, setHoverL] = useState(false);
  const [hoverR, setHoverR] = useState(false);

  const isFirst = i <= 0;
  const isLast = i >= FONTS.length - 1;

  const select = (idx: number) => { setI(idx); setWeight(FONTS[idx].def); };

  // slider maps over the active font's available weights
  const wIdx = Math.max(0, font.weights.indexOf(weight));

  const arrowStyle = (disabled: boolean, hover: boolean): React.CSSProperties => ({
    width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: "50%", border: `1px solid ${disabled ? "#D1D0CC" : "#242424"}`,
    backgroundColor: hover && !disabled ? "#242424" : "transparent",
    color: disabled ? "#D1D0CC" : hover ? "#FFFFFF" : "#242424",
    cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s ease", flexShrink: 0,
  });

  return (
    <section style={{ backgroundColor: "#F4F3EF", width: "100%", padding: isMobile ? "32px 24px 56px" : "48px 64px 112px", boxSizing: "border-box" }}>
      <style>{`
        input[type=range].bp-tt { -webkit-appearance:none; appearance:none; width:240px; max-width:60vw; height:4px; border-radius:2px; outline:none; cursor:pointer; }
        input[type=range].bp-tt::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#242424; cursor:pointer; }
        input[type=range].bp-tt::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:#242424; border:none; cursor:pointer; }
      `}</style>

      {/* Controls — toggle · weight slider · download, all on one line (desktop) */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 24 : 32, margin: "0 0 40px" }}>
        {/* Font toggle */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--loaded-dm-mono), monospace", fontSize: 13, color: "#8C8C8C", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: 4 }}>{font.name}</span>
          <span style={{ fontFamily: "var(--loaded-dm-mono), monospace", fontSize: 13, color: "#8C8C8C", letterSpacing: "0.05em", marginRight: 8 }}>{String(i + 1).padStart(2, "0")} / 0{FONTS.length}</span>
          <button onClick={() => !isFirst && select(i - 1)} disabled={isFirst} aria-label="Previous typeface" onMouseEnter={() => setHoverL(true)} onMouseLeave={() => setHoverL(false)} style={arrowStyle(isFirst, hoverL)}><ChevronLeft /></button>
          <button onClick={() => !isLast && select(i + 1)} disabled={isLast} aria-label="Next typeface" onMouseEnter={() => setHoverR(true)} onMouseLeave={() => setHoverR(false)} style={arrowStyle(isLast, hoverR)}><ChevronRight /></button>
        </div>

        {/* Weight slider */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--loaded-dm-mono), monospace", fontSize: 13, color: "#8C8C8C", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>Weight — {weight}</span>
          <input
            className="bp-tt"
            type="range"
            min={0}
            max={font.weights.length - 1}
            step={1}
            value={wIdx}
            onChange={(e) => setWeight(font.weights[Number(e.target.value)])}
            aria-label={`Font weight: ${weight}`}
            style={{ background: `linear-gradient(to right, #242424 0%, #242424 ${(wIdx / (font.weights.length - 1)) * 100}%, #C9C8C3 ${(wIdx / (font.weights.length - 1)) * 100}%, #C9C8C3 100%)` }}
          />
        </div>

        {/* Download — pushed to the far right on desktop */}
        <a
          href={font.download}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#BB3308", color: "#fff", fontFamily: "var(--loaded-dm-mono), monospace", fontSize: 13, letterSpacing: "0.02em", padding: "10px 16px", borderRadius: 4, textDecoration: "none", flexShrink: 0, marginLeft: isMobile ? 0 : "auto" }}
        >
          Download {font.name} <ArrowIcon />
        </a>
      </div>

      {/* Specimen paragraph — active typeface / weight / colour */}
      <p
        style={{
          fontFamily: font.family,
          fontWeight: weight,
          fontSize: isMobile ? "clamp(22px, 5.4vw, 30px)" : "clamp(30px, 3.4vw, 52px)",
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
          margin: 0,
          color: font.color,
          maxWidth: 1100,
        }}
      >
        {PARAGRAPH}
      </p>
    </section>
  );
}

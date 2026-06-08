'use client'
import React, { useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPTypefaceCarousel — type specimen.
 *
 * Row 1 — Brasil (display, dark)
 * Row 2 — Space Grotesk (Ember) + DM Mono (Azure)
 *
 * Four themed lines, all about human abundance. The Brasil row types in; the
 * arrows cycle through the four themes.
 */

const EMBER = "#BB3308";
const AZURE = "#0B6FB8"; // Azure (#51C8FF) is too light on the paper bg — darkened for legibility
const INK = "#242424";

const SLIDES = [
  { theme: "Human Abundance",      line: "Human abundance lets every life flourish." },
  { theme: "Mindful Societies",    line: "Mindful societies prize quiet, present wisdom." },
  { theme: "Intelligent Economies",line: "Intelligent economies weave craft with progress." },
  { theme: "Regenerative Systems", line: "Regenerative systems renew forest, river and soil." },
];

interface Props {
  fontWeight: number;
  monoFontWeight: number;
  publicFontWeight: number;
  onTypefaceChange: (t: "sans" | "public" | "mono") => void;
  activeTypeface: "sans" | "public" | "mono";
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

export default function BPTypefaceCarousel({ fontWeight }: Props) {
  const isMobile = useIsMobile();
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");
  const [hoverL, setHoverL] = useState(false);
  const [hoverR, setHoverR] = useState(false);

  const slide = SLIDES[i];
  const isFirst = i <= 0;
  const isLast = i >= SLIDES.length - 1;

  useEffect(() => {
    const full = SLIDES[i].line;
    setTyped("");
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setTyped(full.slice(0, n));
      if (n >= full.length) window.clearInterval(id);
    }, 38);
    return () => window.clearInterval(id);
  }, [i]);

  const rowSize = isMobile ? "clamp(26px, 7vw, 38px)" : "clamp(36px, 4.6vw, 76px)";
  const arrowBtn = (dir: "l" | "r") => {
    const disabled = dir === "l" ? isFirst : isLast;
    const hover = dir === "l" ? hoverL : hoverR;
    return {
      width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: "50%", border: `1px solid ${disabled ? "#D1D0CC" : "#242424"}`,
      backgroundColor: hover && !disabled ? "#242424" : "transparent",
      color: disabled ? "#D1D0CC" : hover ? "#FFFFFF" : "#242424",
      cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s ease", flexShrink: 0,
    } as React.CSSProperties;
  };

  return (
    <section style={{ backgroundColor: "#F4F3EF", width: "100%", padding: isMobile ? "32px 24px 56px" : "48px 64px 112px", boxSizing: "border-box" }}>
      <style>{`@keyframes bpCaret { 0%,49%{opacity:1} 50%,100%{opacity:0} }`}</style>

      {/* Nav row — aligned left */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12, marginBottom: isMobile ? 28 : 48 }}>
        <span style={{ fontFamily: "var(--loaded-dm-mono), monospace", fontSize: 13, color: "#8C8C8C", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: 4 }}>{slide.theme}</span>
        <span style={{ fontFamily: "var(--loaded-dm-mono), monospace", fontSize: 13, color: "#8C8C8C", letterSpacing: "0.05em", marginRight: 8 }}>{String(i + 1).padStart(2, "0")} / 0{SLIDES.length}</span>
        <button onClick={() => !isFirst && setI(i - 1)} disabled={isFirst} aria-label="Previous" onMouseEnter={() => setHoverL(true)} onMouseLeave={() => setHoverL(false)} style={arrowBtn("l")}><ChevronLeft /></button>
        <button onClick={() => !isLast && setI(i + 1)} disabled={isLast} aria-label="Next" onMouseEnter={() => setHoverR(true)} onMouseLeave={() => setHoverR(false)} style={arrowBtn("r")}><ChevronRight /></button>
      </div>

      {/* Row 1 — Brasil */}
      <p style={{ fontFamily: "'Brasil', Georgia, serif", fontWeight, fontSize: rowSize, lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0, color: INK }}>
        {typed}
        <span aria-hidden="true" style={{ display: "inline-block", width: "0.05em", height: "0.85em", marginLeft: "0.06em", transform: "translateY(0.08em)", backgroundColor: EMBER, animation: "bpCaret 1s step-end infinite" }} />
      </p>

      {/* Row 2 — Space Grotesk (Ember) + DM Mono (Azure) */}
      <p style={{ fontFamily: "var(--loaded-space-grotesk), system-ui, sans-serif", fontWeight: 500, fontSize: rowSize, lineHeight: 1.1, letterSpacing: "-0.01em", margin: `${isMobile ? 20 : 28}px 0 0`, color: EMBER }}>
        {slide.line}
      </p>
      <p style={{ fontFamily: "var(--loaded-dm-mono), ui-monospace, monospace", fontWeight: 400, fontSize: isMobile ? "clamp(20px, 5vw, 28px)" : "clamp(26px, 3vw, 46px)", lineHeight: 1.2, margin: `${isMobile ? 12 : 16}px 0 0`, color: AZURE }}>
        {slide.line}
      </p>
    </section>
  );
}

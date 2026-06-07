'use client'
import React, { useRef, useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPTypefaceCarousel — Three-slide character set carousel
 *
 * Slide 1 (Brasil — display)
 * Slide 2 (Space Mono — labels)
 * Slide 3 (Public Sans — body)
 *
 * Desktop: a cursor-following spotlight reveals red text over the character set.
 */

const SANS_TEXT    = "AaBbCcDdEeFfGg\nHhIiJjKkLlMmNn\nOoPpQqRrSsTtUu\nVvWwXxYyZz012\n356789!@#$^";
const PUBLIC_TEXT  = "AaBbCcDdEeFfGg\nHhIiJjKkLlMmNn\nOoPpQqRrSsTtUu\nVvWwXxYyZz012\n356789!@#$^";
// Cursor spotlight is masked to the BIF lion mark (the chat logo, 1:1).
const LOGO_W = 560;
const LOGO_H = 560;

type Typeface = "sans" | "mono" | "public";

interface Props {
  fontWeight: number;
  monoFontWeight: number;
  publicFontWeight: number;
  onTypefaceChange: (t: Typeface) => void;
  activeTypeface: Typeface;
}

/* ── Arrow icons ── */
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

  /* Spotlight cursor-follow state */
  const [circlePos, setCirclePos] = useState({ x: 756, y: 350 });
  const containerRef = useRef<HTMLDivElement>(null);

  const isFirst = activeTypeface === "sans";
  const isLast  = activeTypeface === "public";

  const goLeft = () => {
    if (activeTypeface === "mono")   onTypefaceChange("sans");
    if (activeTypeface === "public") onTypefaceChange("mono");
  };
  const goRight = () => {
    if (activeTypeface === "sans") onTypefaceChange("mono");
    if (activeTypeface === "mono") onTypefaceChange("public");
  };

  /* Cursor-follow handler — position relative to the container */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCirclePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  /* ── Shared: navigation arrows ── */
  const ArrowNav = () => (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
      <span
        style={{
          fontFamily: "'Public Sans', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "20px",
          color: "#8C8C8C",
          letterSpacing: "0.05em",
          marginRight: "8px",
        }}
      >
        {activeTypeface === "sans" ? "01" : activeTypeface === "mono" ? "02" : "03"} / 03
      </span>

      <button
        onClick={goLeft}
        disabled={isFirst}
        aria-label="Previous typeface"
        onMouseEnter={() => setHoverLeft(true)}
        onMouseLeave={() => setHoverLeft(false)}
        style={{
          width: "48px", height: "48px",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "50%",
          border: `1px solid ${isFirst ? "#D1D0CC" : "#242424"}`,
          backgroundColor: hoverLeft && !isFirst ? "#242424" : "transparent",
          color: isFirst ? "#D1D0CC" : hoverLeft ? "#FFFFFF" : "#242424",
          cursor: isFirst ? "not-allowed" : "pointer",
          transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
          flexShrink: 0,
        }}
      >
        <ChevronLeft />
      </button>

      <button
        onClick={goRight}
        disabled={isLast}
        aria-label="Next typeface"
        onMouseEnter={() => setHoverRight(true)}
        onMouseLeave={() => setHoverRight(false)}
        style={{
          width: "48px", height: "48px",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "50%",
          border: `1px solid ${isLast ? "#D1D0CC" : "#242424"}`,
          backgroundColor: hoverRight && !isLast ? "#242424" : "transparent",
          color: isLast ? "#D1D0CC" : hoverRight ? "#FFFFFF" : "#242424",
          cursor: isLast ? "not-allowed" : "pointer",
          transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
          flexShrink: 0,
        }}
      >
        <ChevronRight />
      </button>
    </div>
  );

  /* ── Mobile layout — no spotlight ── */
  if (isMobile) {
    return (
      <section
        style={{
          backgroundColor: "#F4F3EF",
          width: "100%",
          padding: "32px 24px 48px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        <p
          style={{
            fontFamily: activeTypeface === "public"
              ? "'Public Sans', system-ui, sans-serif"
              : activeTypeface === "mono"
              ? "'Space Mono', monospace"
              : "'Brasil', Georgia, serif",
            fontWeight: activeTypeface === "public" ? publicFontWeight
              : activeTypeface === "mono" ? monoFontWeight
              : fontWeight,
            fontSize: "48px",
            lineHeight: "58px",
            letterSpacing: "-0.03em",
            margin: 0,
            width: "100%",
          }}
        >
          {activeTypeface === "sans" && (
            <span style={{ color: "#242424" }}>{"AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz012356789!@#$^"}</span>
          )}
          {activeTypeface === "mono" && (
            <span style={{ color: "#242424" }}>{"AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz012356789@#$^"}</span>
          )}
          {activeTypeface === "public" && (
            <span style={{ color: "#242424" }}>{"AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz012356789!@#$^"}</span>
          )}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ArrowNav />
        </div>
      </section>
    );
  }

  /* ── Desktop: shared content & text styles for all four slides ── */
  const textContent = activeTypeface === "sans"   ? SANS_TEXT
    : activeTypeface === "mono"   ? "AaBbCcDdEeFfG\ngHhIiJjKkLlMm\nNnOoPpQqRrSsT\ntUuVvWwXxYyZz\n012356789@#$^"
    : PUBLIC_TEXT;

  const textStyle: React.CSSProperties = {
    fontFamily: activeTypeface === "public" ? "'Public Sans', system-ui, sans-serif"
      : activeTypeface === "mono"   ? "'Space Mono', monospace"
      : "'Brasil', Georgia, serif",
    fontWeight: activeTypeface === "public" ? publicFontWeight
      : activeTypeface === "mono"   ? monoFontWeight
      : fontWeight,
    fontSize:      "175px",
    lineHeight:    "200px",
    letterSpacing: "-0.03em",
    margin:        0,
    width:         "100%",
    whiteSpace:    "pre-wrap",
  };

  return (
    <section
      style={{
        backgroundColor: "#F4F3EF",
        width:           "100%",
        paddingBottom:   "128px",
        boxSizing:       "border-box",
      }}
    >
      {/* Nav row — kept inside the 64px margins */}
      <div
        style={{
          paddingTop:   "40px",
          paddingBottom: "40px",
          paddingLeft:  "64px",
          paddingRight: "64px",
          display:      "flex",
          justifyContent: "flex-end",
        }}
      >
        <ArrowNav />
      </div>

      {/*
       * Cursor-follow container — full section width, no horizontal padding.
       * The 64px letter margin lives on the <p> elements inside.
       */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        style={{
          position: "relative",
          cursor:   "none",
        }}
      >
        {/* Base layer — dark text, 64px side padding */}
        <p style={{ ...textStyle, color: "#242424", paddingLeft: "64px", paddingRight: "64px" }}>
          {textContent}
        </p>

        {/*
         * Spotlight overlay — full width (no horizontal padding on the div).
         * Masked to the BIF logo silhouette, which follows the cursor, so the
         * red text is revealed through a logo-shaped window instead of a square.
         * The light <p> keeps 64px padding so letters align with the base layer.
         */}
        <div
          style={{
            position:           "absolute",
            inset:              0,
            maskImage:          "url(/bif-logo.svg)",
            WebkitMaskImage:    "url(/bif-logo.svg)",
            maskRepeat:         "no-repeat",
            WebkitMaskRepeat:   "no-repeat",
            maskSize:           `${LOGO_W}px ${LOGO_H}px`,
            WebkitMaskSize:     `${LOGO_W}px ${LOGO_H}px`,
            maskPosition:       `${circlePos.x - LOGO_W / 2}px ${circlePos.y - LOGO_H / 2}px`,
            WebkitMaskPosition: `${circlePos.x - LOGO_W / 2}px ${circlePos.y - LOGO_H / 2}px`,
            pointerEvents:      "none",
          }}
        >
          {/* Dark fill */}
          <div style={{ position: "absolute", inset: 0, backgroundColor: "#1A1A1A" }} />

          {/* Highlight text — same padding as base so it sits exactly on top */}
          <p
            style={{
              ...textStyle,
              color:        "#BB3308",
              paddingLeft:  "64px",
              paddingRight: "64px",
              position:     "relative", /* renders above dark fill */
            }}
          >
            {textContent}
          </p>
        </div>
      </div>
    </section>
  );
}

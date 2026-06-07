'use client'
import React, { useRef, useState, useCallback } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useScrollWhenVisible } from "../../hooks/useScrollWhenVisible";

/**
 * BPIndustryStatement — sticky-scroll soft reveal
 *
 * Source: Figma node 167:793 (Magic file / Brand page)
 *
 * Lines are hardcoded to enforce the exact 5-line structure:
 *   1. We design
 *   2. confidence        ← red band highlight
 *   3. through outcomes
 *   4. validated with
 *   5. the industry.
 */

const SCROLLS = 5; // sticky-scroll window in viewport heights
const DIM     = 0; // unrevealed lines are fully hidden

const LINES = [
  "We design",
  "confidence",
  "through outcomes",
  "validated with",
  "the industry.",
];

export default function BPIndustryStatement() {
  const isMobile = useIsMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [revealedCount, setRevealedCount] = useState(0);

  /* ── Scroll-driven reveal ── */
  const zoomed = typeof document !== 'undefined' ? document.getElementById('zoomedContent') : null;
  const update = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect       = wrapper.getBoundingClientRect();
    const scrollable = wrapper.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const traveled = Math.max(0, -rect.top);
    const progress = Math.min(1, traveled / scrollable);
    setRevealedCount(Math.min(LINES.length, Math.floor(progress * LINES.length) + 1));
  }, []);
  useScrollWhenVisible(wrapperRef, update, zoomed ?? undefined);

  /* ── Shared styles ── */
  const wrapperHeight = `${(SCROLLS + 1) * 100}vh`;

  const sectionStyle: React.CSSProperties = {
    position:        "sticky",
    top:             0,
    height:          "100vh",
    backgroundColor: "#FFFFFF",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  isMobile ? "flex-start" : "flex-end",
    padding:         isMobile ? "0 24px" : "0 64px",
    boxSizing:       "border-box",
  };

  const pStyle: React.CSSProperties = {
    fontFamily:    "'Brasil', Georgia, serif",
    fontWeight:    500,
    fontSize:      isMobile ? "36px" : "80px",
    lineHeight:    isMobile ? "46px" : "96px",
    letterSpacing: "-0.03em",
    color:         "#000000",
    margin:        0,
    width:         isMobile ? undefined : "681px",
    flexShrink:    0,
  };

  const lh = isMobile ? "46px" : "96px";

  /* ── Inline helper: render a line, wrapping "confidence" in a red band ── */
  const renderLine = (line: string) => {
    const WORD = "confidence";
    const idx  = line.indexOf(WORD);
    if (idx === -1) return line;

    return (
      <>
        {line.slice(0, idx)}
        <span
          style={{
            display:         "inline-block",
            verticalAlign:   "middle",
            position:        "relative",
            width:           isMobile ? "200px" : "420px",
            height:          isMobile ? "44px"  : "83px",
            backgroundColor: "#BB3308",
            transform:       "rotate(-1deg)",
            transformOrigin: "center center",
            overflow:        "visible",
          }}
        >
          <span
            style={{
              position:   "absolute",
              top:        "50%",
              left:       "50%",
              transform:  "translate(-50%, -50%) rotate(1deg)",
              color:      "#FFFFFF",
              whiteSpace: "nowrap",
            }}
          >
            {WORD}
          </span>
        </span>
        {line.slice(idx + WORD.length)}
      </>
    );
  };

  /* ── Phase 2 render: sticky scroll with soft opacity reveal ── */
  return (
    <div ref={wrapperRef} style={{ height: wrapperHeight, position: "relative" }}>
      <section style={sectionStyle}>
        <p style={pStyle}>
          {LINES.map((line, lineIdx) => (
            <span
              key={lineIdx}
              style={{
                display:    "block",
                lineHeight: lh,
                color:      "#000000",
                opacity:    lineIdx < revealedCount ? 1 : DIM,
                transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "opacity",
              }}
            >
              {renderLine(line)}
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}

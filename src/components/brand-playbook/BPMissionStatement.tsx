'use client'
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useScrollWhenVisible } from "../../hooks/useScrollWhenVisible";

/**
 * BPMissionStatement — sticky-scroll soft reveal
 *
 * Source: Figma node 167:801 (Magic file)
 *
 * All lines are fully hidden at the start (opacity 0).
 * As the user scrolls through the sticky window, each line fades in to
 * full white one at a time, spread evenly across SCROLLS viewport-heights.
 *
 * Scroll is the light switch — each line appears from nothing with a
 * smooth opacity transition, no position movement.
 *
 * Line detection: useLayoutEffect measures each word's offsetTop before
 * the first paint so the browser's natural line-wrapping determines the
 * groups (no hard-coded breaks).
 */

const SCROLLS = 5; // sticky-scroll window in viewport heights
const DIM     = 0; // unrevealed lines are fully hidden

//   = non-breaking space between "lifelong" and "&" keeps them on one
// line so "passion, lifelong &" is always a single highlight phrase.
const TEXT =
  "We are the catalyst for future change makers, driven by passion, lifelong & applied learning and deep industry practice.";

const WORDS = TEXT.split(" ");

export default function BPMissionStatement() {
  const isMobile = useIsMobile();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wordRefs   = useRef<(HTMLSpanElement | null)[]>([]);

  const [lines, setLines]                 = useState<string[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);

  /* ── Phase 1: group words into visual lines via DOM measurement ──
   * Runs after mount and retries via ResizeObserver if the component
   * is initially hidden (display:none inside #brand-react-mount),
   * which causes all offsetTop values to be 0. */
  useEffect(() => {
    const measure = (): boolean => {
      const spans = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (spans.length === 0) return false;
      // If all offsetTops are 0 the element isn't laid out yet — skip
      if (spans.every(s => s.offsetTop === 0)) return false;

      const groups: string[][] = [];
      let current: string[]    = [];
      let lastTop: number | null = null;

      spans.forEach((span, i) => {
        const top = span.offsetTop;
        if (lastTop !== null && top !== lastTop) {
          groups.push(current);
          current = [];
        }
        current.push(WORDS[i]);
        lastTop = top;
      });
      if (current.length > 0) groups.push(current);

      setLines(groups.map(g => g.join(" ")));
      return true;
    };

    if (measure()) return;

    // Element not visible yet — retry when wrapper is resized into view
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ro = new ResizeObserver(() => { if (measure()) ro.disconnect(); });
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [isMobile]);

  const zoomed = typeof document !== 'undefined' ? document.getElementById('zoomedContent') : null;
  const scrollUpdate = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || lines.length === 0) return;
    const rect       = wrapper.getBoundingClientRect();
    const scrollable = wrapper.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const traveled = Math.max(0, -rect.top);
    const progress = Math.min(1, traveled / scrollable);
    setRevealedCount(Math.min(lines.length, Math.floor(progress * lines.length) + 1));
  }, [lines]);
  useScrollWhenVisible(wrapperRef, scrollUpdate, zoomed ?? undefined);

  /* ── Shared styles ── */
  const wrapperHeight = `${(SCROLLS + 1) * 100}vh`;

  const sectionStyle: React.CSSProperties = {
    position:        "sticky",
    top:             0,
    height:          "100vh",
    backgroundColor: "#000000",
    display:         "flex",
    alignItems:      "center",
    padding:         isMobile ? "0 24px" : "0 64px",
    boxSizing:       "border-box",
  };

  const pStyle: React.CSSProperties = {
    fontFamily:    "'Brasil', Georgia, serif",
    fontWeight:    500,
    fontSize:      isMobile ? "40px" : "80px",
    lineHeight:    isMobile ? "52px" : "96px",
    letterSpacing: "-0.03em",
    margin:        0,
    maxWidth:      isMobile ? undefined : "684px",
  };

  const lh = isMobile ? "52px" : "96px";

  /* ── Phase 1 render: invisible word spans for measurement ── */
  if (lines.length === 0) {
    return (
      <div ref={wrapperRef} style={{ height: wrapperHeight, position: "relative" }}>
        <section style={{ ...sectionStyle, visibility: "hidden" }}>
          <p style={pStyle}>
            {WORDS.map((word, i) => (
              <React.Fragment key={i}>
                <span ref={el => { wordRefs.current[i] = el; }}>{word}</span>
                {i < WORDS.length - 1 && " "}
              </React.Fragment>
            ))}
          </p>
        </section>
      </div>
    );
  }

  /* ── Inline helper: render a line, wrapping highlighted phrases in red bands ── */
  const renderLine = (line: string): React.ReactNode => {
    // Two highlights matching the Figma design (node 167:801).
    // "passion, lifelong &" stays together on one line via non-breaking space.
    const highlights = [
      { word: "passion, lifelong &" },
      { word: "applied learning" },
    ];

    // Collect ALL matches in this line (a line may contain more than one highlight)
    const matches: { idx: number; end: number; word: string }[] = [];
    for (const { word } of highlights) {
      const idx = line.indexOf(word);
      if (idx !== -1) matches.push({ idx, end: idx + word.length, word });
    }

    if (matches.length === 0) return line;

    matches.sort((a, b) => a.idx - b.idx);

    const parts: React.ReactNode[] = [];
    let cursor = 0;
    for (const { idx, end, word } of matches) {
      if (cursor < idx) parts.push(line.slice(cursor, idx));
      parts.push(
        <span
          key={`hl-${idx}`}
          style={{
            display:         "inline-block",
            verticalAlign:   "middle",
            backgroundColor: "#BB3308",
            transform:       "rotate(-1deg)",
            transformOrigin: "center center",
            height:          isMobile ? "43px" : "86px",
            lineHeight:      isMobile ? "43px" : "86px",
            padding:         isMobile ? "0 8px" : "0 14px",
            color:           "#FFFFFF",
            whiteSpace:      "nowrap",
          }}
        >
          {word.replace(/ /g, " ")}
        </span>
      );
      cursor = end;
    }
    if (cursor < line.length) parts.push(line.slice(cursor));

    return <>{parts}</>;
  };

  /* ── Phase 2 render: sticky scroll with soft opacity reveal ── */
  return (
    <div ref={wrapperRef} style={{ height: wrapperHeight, position: "relative" }}>
      <section style={sectionStyle}>
        <p style={pStyle}>
          {lines.map((line, lineIdx) => (
            <span
              key={lineIdx}
              style={{
                display:    "block",
                lineHeight: lh,
                color:      "#FFFFFF",
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

'use client'
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPHero — Brand Playbook opening hero
 *
 * Source: Figma node 142:1131 in Magic file (lLz7GdE0xaW5GFEN3JTlNj)
 *
 * Headline uses a word-by-word slot-machine reveal:
 * each word is clipped inside an overflow:hidden wrapper and rises from
 * below into view, staggered left-to-right. Same visual mechanic as the
 * typeface specimen letters.
 */

const WORDS = [
  { text: "To",           color: "#232323" },
  { text: "gather",       color: "#232323" },
  { text: "the",          color: "#232323" },
  { text: "world",        color: "#232323" },
  { text: "where",        color: "#232323" },
  { text: "progress",     color: "#232323" },
  { text: "is",           color: "#232323" },
  { text: "measured",     color: "#232323" },
  { text: "in",           color: "#232323" },
  { text: "flourishing.", color: "#17FF3E" },
];

export default function BPHero() {
  const isMobile = useIsMobile();
  const ref      = useRef<HTMLElement>(null);
  const inView   = useInView(ref, { once: true, amount: 0.2 });

  /**
   * Render the headline with per-word rise animation.
   * Each word is wrapped in an overflow:hidden inline-block that clips the
   * word while it travels from y=115% (hidden below) to y=0 (in place).
   */
  const headline = (
    fontSize:   string,
    lineHeight: string,
    margin:     React.CSSProperties["margin"],
    maxWidth:   string | undefined,
    stagger:    number,
  ) => (
    <h1
      style={{
        margin,
        fontFamily:    "'Brasil', Georgia, serif",
        fontWeight:    500,
        fontSize,
        lineHeight,
        letterSpacing: "-0.03em",
        maxWidth,
        textAlign: "justify",
        textTransform: "uppercase",
      }}
    >
      {WORDS.map((word, i) => (
        <React.Fragment key={i}>
          {/* Clip wrapper — hides the word while it sits below the baseline.
               paddingBottom + negative marginBottom creates room for descenders
               (g, y, p) without shifting surrounding layout. */}
          <span
            style={{
              display:       "inline-block",
              overflow:      "hidden",
              verticalAlign: "bottom",
              paddingBottom: "0.15em",
              marginBottom:  "-0.15em",
            }}
          >
            <motion.span
              style={{ display: "inline-block", color: word.color }}
              initial={{ y: "115%" }}
              animate={inView ? { y: "0%" } : { y: "115%" }}
              transition={{
                duration: 0.9,
                delay:    0.1 + i * stagger,
                ease:     [0.16, 1, 0.3, 1],
              }}
            >
              {word.text}
            </motion.span>
          </span>
          {/* Natural space between words — outside the clip so it's always visible */}
          {i < WORDS.length - 1 && " "}
        </React.Fragment>
      ))}
    </h1>
  );

  /* ── Mobile layout ── */
  if (isMobile) {
    return (
      <section
        ref={ref}
        style={{
          fontFamily:      "'Public Sans', system-ui, sans-serif",
          backgroundColor: "#FFFFFF",
          padding:         "96px 32px",
          display:         "flex",
          flexDirection:   "column",
          gap:             "40px",
        }}
      >
        {headline("56px", "normal", 0, undefined, 0.10)}
      </section>
    );
  }

  /* ── Desktop layout ── */
  return (
    <section
      ref={ref}
      style={{
        fontFamily:      "'Public Sans', system-ui, sans-serif",
        backgroundColor: "#FFFFFF",
        width:           "100%",
        padding:         "128px 32px",
        display:         "flex",
        flexDirection:   "column",
        boxSizing:       "border-box",
      }}
    >
      {headline("180px", "normal", "0", undefined, 0.15)}
    </section>
  );
}

'use client'
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPClosingStatement — closing line sized to fill the full width. The text is
 * rendered as an SVG whose viewBox is set to the measured glyph bounding box,
 * so scaling the SVG to 100% width makes the line touch the side padding
 * exactly, at any viewport size.
 */
const TEXT = "The oldest wisdom, for the newest age.";
const SIDE = 32; // matches the Ask Rigpai / Agent Mode 32px viewport inset

export default function BPClosingStatement() {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [vb, setVb] = useState<string | null>(null);

  useEffect(() => {
    const t = textRef.current;
    if (!t) return;
    const measure = () => {
      try {
        const b = t.getBBox();
        if (b.width > 0) setVb(`${b.x} ${b.y} ${b.width} ${b.height}`);
      } catch {
        /* getBBox can throw if not yet rendered — retried on fonts.ready */
      }
    };
    measure();
    // Re-measure once Brasil is loaded so the box reflects the real font.
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: "#BB3308",
        width: "100%",
        padding: isMobile ? `96px ${SIDE}px` : `22vh ${SIDE}px`,
        boxSizing: "border-box",
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: "hidden",
      }}
    >
      <motion.svg
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        viewBox={vb ?? undefined}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={TEXT}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          overflow: "visible",
          visibility: vb ? "visible" : "hidden",
        }}
      >
        <text
          ref={textRef}
          x="0"
          y="0"
          dominantBaseline="text-before-edge"
          fill="#F4EFE6"
          style={{
            fontFamily: "'Brasil', Georgia, serif",
            fontWeight: 500,
            fontSize: "100px",
            letterSpacing: "-0.02em",
            whiteSpace: "pre",
          }}
        >
          {TEXT.toUpperCase()}
        </text>
      </motion.svg>
    </section>
  );
}

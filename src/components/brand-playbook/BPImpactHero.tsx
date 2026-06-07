'use client'
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useIsMobile } from "../../hooks/useIsMobile";
import LoopingVideo from "../LoopingVideo";

/**
 * BPImpactHero — "The University for Industry" full-bleed hero
 *
 * Source: Figma node 243:579 (Magic file)
 * Size: 1512×868px
 *
 * Layout:
 *   - Background: hero-impact.jpg campus photo + 10% black overlay
 *   - "The\nUniversity" — absolute left:64 top:230, Brasil SemiBold 140px
 *   - "for\nIndustry"   — absolute left:908 top:386, same font — diagonal stagger
 *   - Search bar        — absolute left:531 top:648, 450×56px translucent warm fill
 *
 * Both text blocks fade+slide up on scroll entry.
 */


export default function BPImpactHero() {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.25 });

  const textStyle: React.CSSProperties = {
    fontFamily: "'Brasil', Georgia, serif",
    fontWeight: 500,
    fontSize: "120px",
    lineHeight: "90%",
    letterSpacing: "-0.03em",
    color: "#FFFFFF",
    margin: 0,
    position: "absolute",
    whiteSpace: "pre-line",
  };

  /* ── Mobile ── */
  if (isMobile) {
    return (
      <section
        ref={ref}
        style={{ position: "relative", width: "100%", height: "480px", overflow: "hidden", backgroundColor: "#16150F" }}
      >
        <LoopingVideo
          src="/videos/monastery.mp4"
          poster="/images/monastery-poster.webp"
          playbackRate={0.4}
          crossfadeSeconds={2}
          style={{ objectPosition: "center", zIndex: 1 }}
        />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.10)", zIndex: 2 }} />

        {/* Mobile: stacked centered text */}
        <motion.div
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 24px",
            boxSizing: "border-box",
            zIndex: 3,
          }}
        >
          <p
            style={{
              fontFamily: "'Brasil', Georgia, serif",
              fontWeight: 500,
              fontSize: "44px",
              lineHeight: "95%",
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              textAlign: "center",
              margin: 0,
            }}
          >
            A monastery for the intelligent age.
          </p>
        </motion.div>
      </section>
    );
  }

  /* ── Desktop ── */
  return (
    <section
      ref={ref}
      style={{ position: "relative", width: "100%", height: "868px", overflow: "hidden", backgroundColor: "#16150F" }}
    >
      {/* Background cinemagraph — monastery courtyard, crossfade loop */}
      <LoopingVideo
        src="/videos/monastery.mp4"
        poster="/images/monastery-poster.webp"
        playbackRate={0.4}
        crossfadeSeconds={2}
        style={{ objectPosition: "center", zIndex: 1 }}
      />

      {/* 10% black overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.10)", zIndex: 2 }} />

      {/* Centred headline */}
      <motion.p
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          ...textStyle,
          inset: 0,
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 80px",
          boxSizing: "border-box",
        }}
      >
        A monastery for the intelligent age.
      </motion.p>

    </section>
  );
}

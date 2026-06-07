'use client'
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPWhatWeStandFor — Brand statement / mission section
 *
 * Source: Figma node 142:1132 (Magic file)
 * Size: 1512×508px
 *
 * Two-column horizontal layout — heading left, editorial body text right.
 * Both columns are 683px wide with a 10px gap. The group is pushed
 * right (justify-content: flex-end) so they sit flush against the
 * right padding boundary, leaving ~8px of natural breathing room on the left.
 *
 * The 32px body text is deliberate — this is a brand manifesto moment,
 * not regular body copy. It should feel weighty and intentional.
 */
export default function BPWhatWeStandFor() {
  const isMobile = useIsMobile();

  /* ── Mobile: stack vertically ── */
  if (isMobile) {
    return (
      <section
        style={{
          backgroundColor: "#ffffff",
          padding: "64px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: "'Brasil', Georgia, serif",
            fontWeight: 500,
            fontSize: "28px",
            lineHeight: "1.3",
            letterSpacing: 0,
            color: "#242424",
          }}
        >
          Human Abundance
        </h2>
        <p
          style={{
            margin: 0,
            fontFamily: "'Public Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "18px",
            lineHeight: "1.6",
            letterSpacing: 0,
            color: "#242424",
          }}
        >
          The world taught us that more is better. Bhutan knows otherwise. In the
          first nation to measure Gross National Happiness — and home to Gelephu
          Mindfulness City — we&apos;re defining the societal operating system for an
          intelligent age. Not more, but more meaning. This is human abundance.
        </p>
      </section>
    );
  }

  /* ── Desktop: exact Figma layout ── */
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        /*
         * Max-width matches the Figma frame width.
         * margin: 0 auto centres it on wider viewports.
         */
        maxWidth: "1512px",
        margin: "0 auto",
        boxSizing: "border-box",
        /*
         * Exact padding from Figma: T128 R64 B128 L64.
         * The tall top/bottom padding gives this section the
         * "breathing room" that makes the brand statement feel important.
         */
        padding: "128px 64px",
        display: "flex",
        flexDirection: "row",
        /*
         * justify-content: flex-end mirrors Figma's primaryAxisAlignItems: MAX.
         * With both columns totalling 1376px in a 1384px content area,
         * this pushes the pair ~8px rightward — matching the x:72 offset
         * observed on the heading node in Figma.
         */
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      {/* ── Left column: section heading ── */}
      <h2
        style={{
          margin: 0,
          fontFamily: "'Brasil', Georgia, serif",
          fontWeight: 500,
          fontSize: "40px",
          lineHeight: "normal",
          letterSpacing: 0,
          color: "#242424",
          flex: 1,
        }}
      >
        Human Abundance
      </h2>

      {/* ── Right column: brand manifesto body ── */}
      <p
        style={{
          margin: 0,
          fontFamily: "'Brasil', Georgia, serif",
          fontWeight: 300,
          fontSize: "32px",
          lineHeight: "normal",
          letterSpacing: 0,
          color: "#242424",
          flex: 1,
        }}
      >
        The world taught us that more is better. Bhutan knows otherwise. In the
        first nation to measure Gross National Happiness — and home to Gelephu
        Mindfulness City — we&apos;re defining the societal operating system for an
        intelligent age. Not more, but more meaning. This is human abundance.
      </p>
    </section>
  );
}

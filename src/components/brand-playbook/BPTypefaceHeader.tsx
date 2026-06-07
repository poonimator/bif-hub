'use client'
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPTypefaceHeader — Typeface section divider bar
 *
 * Source: Figma node 176:1070 (Magic file)
 * Size: 1512×159px
 *
 * A full-width black bar with two column labels sitting at the bottom.
 * The 128px top padding creates the tall black block above the labels —
 * this is a deliberate editorial transition from the previous content
 * into the typeface showcase below.
 *
 * Left:  "Primary Typeface - Brasil"
 * Right: "Secondary Typeface - Space Mono"
 */
export default function BPTypefaceHeader() {
  const isMobile = useIsMobile();

  /* ── Mobile: stacked labels ── */
  if (isMobile) {
    return (
      <section
        style={{
          backgroundColor: "#000000",
          padding: "48px 24px 0",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontFamily: "'Public Sans', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "normal",
            color: "#ffffff",
          }}
        >
          Brasil
        </span>
        <span
          style={{
            fontFamily: "'Public Sans', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "normal",
            color: "#ffffff",
          }}
        >
          Space Mono
        </span>
      </section>
    );
  }

  /* ── Desktop: exact Figma layout ── */
  return (
    <section
      style={{
        backgroundColor: "#000000",
        maxWidth: "1512px",
        margin: "0 auto",
        boxSizing: "border-box",
        /*
         * Padding T:128 R:64 B:0 L:64 from Figma.
         * The large top padding IS the design — it creates the tall black
         * block that visually separates sections. Bottom padding is 0 so
         * the labels sit flush at the bottom edge of the frame.
         */
        padding: "128px 64px 0",
        display: "flex",
        flexDirection: "row",
        /* mainAxis: MIN = items start from the left */
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: "10px",
        /* Clip any sub-pixel overflow from the fixed column widths */
        overflow: "hidden",
      }}
    >
      {/* ── Left label: Primary typeface ── */}
      <span
        style={{
          fontFamily: "'Public Sans', system-ui, sans-serif",
          fontWeight: 600,
          /* Exact from Figma: 24px SemiBold white */
          fontSize: "24px",
          lineHeight: "normal",
          color: "#ffffff",
          /*
           * Fixed width from Figma: 766px.
           * flex-shrink: 0 prevents compression on slightly
           * narrower viewports below 1512px.
           */
          width: "766px",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        Brasil
      </span>

      {/* ── Right label: Secondary typeface ── */}
      <span
        style={{
          fontFamily: "'Public Sans', system-ui, sans-serif",
          fontWeight: 600,
          /* Exact from Figma: 24px SemiBold white */
          fontSize: "24px",
          lineHeight: "normal",
          color: "#ffffff",
          /* Fixed width from Figma: 683px */
          width: "683px",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        Space Mono
      </span>
    </section>
  );
}

'use client'
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPChineseTypefaceHeader — Public Sans typeface section divider bar
 *
 * Mirrors BPTypefaceHeader (same black bar, same 24px SemiBold label).
 * Labels the third BIF typeface: Public Sans (body / long-form).
 */
export default function BPChineseTypefaceHeader() {
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
          Public Sans
        </span>
      </section>
    );
  }

  /* ── Desktop ── */
  return (
    <section
      style={{
        backgroundColor: "#000000",
        maxWidth: "1512px",
        margin: "0 auto",
        boxSizing: "border-box",
        padding: "40px 64px 0",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: "10px",
        overflow: "hidden",
      }}
    >
      {/* ── Label: Public Sans ── */}
      <span
        style={{
          fontFamily: "'Public Sans', system-ui, sans-serif",
          fontWeight: 600,
          fontSize: "24px",
          lineHeight: "normal",
          color: "#ffffff",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        Public Sans
      </span>
    </section>
  );
}

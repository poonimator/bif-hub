'use client'
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

const SANS = "'Brasil', Georgia, serif";

export default function BPClosing() {
  const isMobile = useIsMobile();

  /* ── Mobile: column layout — headline full-width, logo bottom-right ── */
  if (isMobile) {
    return (
      <section
        style={{
          backgroundColor: "#ffffff",
          minHeight:       400,
          display:         "flex",
          flexDirection:   "column",
          justifyContent:  "flex-end",
          gap:             "32px",
          padding:         "64px 24px 80px",
          boxSizing:       "border-box",
          width:           "100%",
        }}
      >
        <div>
          <span style={{ fontFamily: SANS, fontSize: 44, lineHeight: "52px", fontWeight: 500, letterSpacing: "-0.03em", display: "block", color: "#1a1a1a" }}>The University</span>
          <span style={{ fontFamily: SANS, fontSize: 44, lineHeight: "52px", fontWeight: 500, letterSpacing: "-0.03em", display: "block", color: "#1a1a1a" }}>for <span style={{ color: "#BB3308" }}>Industry</span></span>
        </div>
        <img
          src="/images/brand-playbook/sit-logo.png"
          alt="Singapore Institute of Technology"
          style={{ width: 100, height: 46, objectFit: "contain", alignSelf: "flex-end" }}
        />
      </section>
    );
  }

  /* ── Desktop: headline bottom-left, logo bottom-right ── */
  const lineStyle: React.CSSProperties = {
    fontFamily:    SANS,
    fontSize:      140,
    lineHeight:    "140px",
    fontWeight:    700,
    letterSpacing: "-0.03em",
    margin:        0,
    display:       "block",
  };

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        minHeight:       817,
        display:         "flex",
        alignItems:      "flex-end",
        justifyContent:  "space-between",
        padding:         "0 64px 80px",
        boxSizing:       "border-box",
        width:           "100%",
      }}
    >
      <div>
        <span style={{ ...lineStyle, color: "#1a1a1a" }}>The University</span>
        <span style={{ ...lineStyle, color: "#1a1a1a" }}>for <span style={{ color: "#BB3308" }}>Industry</span></span>
      </div>
      <img
        src="/images/brand-playbook/sit-logo.png"
        alt="Singapore Institute of Technology"
        style={{ width: 251, height: 116, objectFit: "contain", flexShrink: 0 }}
      />
    </section>
  );
}

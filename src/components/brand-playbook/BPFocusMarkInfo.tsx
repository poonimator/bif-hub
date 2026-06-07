'use client'
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPFocusMarkInfo — "Visual System" 2-column description section
 *
 * Source: Figma node 167:965 (Magic file / Brand page)
 * Size: 1512×634px
 *
 * Layout: horizontal flex, justify-content flex-end (MAX), 10px gap.
 * Two fixed-width columns together fill the padded content area (1384px).
 *
 * Left col  (683px): "Visual System" heading — Brasil 600 / 40px / 52px lh
 * Right col (682px): body copy — Brasil 400 / 32px / 41.6px lh, 2 paragraphs
 *
 * Both columns: color #242424, background white, padding 128px top/bottom, 64px sides
 */

export default function BPFocusMarkInfo() {
  const isMobile = useIsMobile();

  /* ── Mobile — stacked ── */
  if (isMobile) {
    return (
      <section
        style={{
          backgroundColor: "#FFFFFF",
          padding:         "64px 24px",
          boxSizing:       "border-box",
          display:         "flex",
          flexDirection:   "column",
          gap:             "32px",
        }}
      >
        <p
          style={{
            fontFamily:    "'Brasil', Georgia, serif",
            fontWeight:    500,
            fontSize:      "28px",
            lineHeight:    "36px",
            color:         "#242424",
            margin:        0,
          }}
        >
          Visual System
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <p
            style={{
              fontFamily: "'Public Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize:   "18px",
              lineHeight: "26px",
              color:      "#242424",
              margin:     0,
            }}
          >
            The Focus Mark is SIT's visual device for highlighting key points. Set at a 1° angle, it suggests that even a slight but deliberate shift in focus can lead to stronger relevance in industry.
          </p>
          <p
            style={{
              fontFamily: "'Public Sans', system-ui, sans-serif",
              fontWeight: 400,
              fontSize:   "18px",
              lineHeight: "26px",
              color:      "#242424",
              margin:     0,
            }}
          >
            This is an internal idea that informs the system, rather than a message to be explicitly communicated.
          </p>
        </div>
      </section>
    );
  }

  /* ── Desktop ── */
  return (
    <section
      style={{
        backgroundColor: "#FFFFFF",
        width:           "100%",
        boxSizing:       "border-box",
        paddingTop:      "128px",
        paddingBottom:   "128px",
        paddingLeft:     "64px",
        paddingRight:    "64px",
        display:         "flex",
        flexDirection:   "row",
        justifyContent:  "flex-start",
        gap:             "10px",
      }}
    >
      {/* Left column — section label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily:    "'Brasil', Georgia, serif",
            fontWeight:    500,
            fontSize:      "40px",
            lineHeight:    "52px",
            color:         "#242424",
            margin:        0,
          }}
        >
          Visual System
        </p>
      </div>

      {/* Right column — description, 2 paragraphs */}
      <div
        style={{
          flex:          1,
          minWidth:      0,
          display:       "flex",
          flexDirection: "column",
          gap:           "41px", /* ~1 line-height gap between paragraphs */
        }}
      >
        <p
          style={{
            fontFamily: "'Brasil', Georgia, serif",
            fontWeight: 300,
            fontSize:   "32px",
            lineHeight: "41.6px",
            color:      "#242424",
            margin:     0,
          }}
        >
          The Focus Mark is SIT's visual device for highlighting key points. Set at a 1° angle, it suggests that even a slight but deliberate shift in focus can lead to stronger relevance in industry.
        </p>
        <p
          style={{
            fontFamily: "'Brasil', Georgia, serif",
            fontWeight: 300,
            fontSize:   "32px",
            lineHeight: "41.6px",
            color:      "#242424",
            margin:     0,
          }}
        >
          This is an internal idea that informs the system, rather than a message to be explicitly communicated.
        </p>
      </div>
    </section>
  );
}

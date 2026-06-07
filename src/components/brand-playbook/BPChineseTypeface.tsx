'use client'
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPChineseTypeface — Noto Sans SC / TC specimens
 *
 * Source: Figma node 52:3699 (sit-pweb reference) — 1512×912px
 * Background: #F4F3EF (warm off-white)
 *
 * Desktop — 2-col layout:
 *   Left (394px): title + description + download button
 *   Right (554px): SC specimen text + TC specimen text, each with a label
 *
 * Fonts loaded via Google Fonts (preconnect in Astro head recommended).
 */
export default function BPChineseTypeface() {
  const isMobile = useIsMobile();

  /* ── Mobile ── */
  if (isMobile) {
    return (
      <section
        style={{
          fontFamily: "'Public Sans', system-ui, sans-serif",
          backgroundColor: "#F4F3EF",
          padding: "64px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: "#242424", margin: 0 }}>
            Chinese Typeface
          </h3>
          <p style={{ fontSize: 14, fontWeight: 400, lineHeight: "22px", color: "#242424", margin: 0 }}>
            Noto Sans SC and Noto Sans TC are the designated Chinese typefaces. They harmonise
            perfectly with Brasil, ensuring a seamless and consistent visual experience
            across English and Chinese communications.
          </p>
          <a
            href="https://fonts.google.com/noto/specimen/Noto+Sans+SC"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Public Sans', system-ui, sans-serif",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#BB3308",
              color: "#FFFFFF",
              fontSize: 14,
              fontWeight: 500,
              padding: "10px 20px",
              borderRadius: 4,
              textDecoration: "none",
              width: "fit-content",
            }}
          >
            Download Noto Sans SC/TC
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Specimens */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <p
              style={{
                fontFamily: "'Noto Sans SC', 'Public Sans', sans-serif",
                fontSize: 36,
                fontWeight: 500,
                lineHeight: "48px",
                color: "#242424",
                margin: 0,
              }}
            >
              未来领导者与行业共同创造影响力的地方
            </p>
            <p style={{ fontFamily: "'Public Sans', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: "#8C8C8C", margin: "8px 0 0" }}>
              思源黑体
            </p>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Noto Sans TC', 'Public Sans', sans-serif",
                fontSize: 36,
                fontWeight: 500,
                lineHeight: "48px",
                color: "#242424",
                margin: 0,
              }}
            >
              未來領袖與行業共同創造影響力的地方
            </p>
            <p style={{ fontFamily: "'Public Sans', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: "#8C8C8C", margin: "8px 0 0" }}>
              思源黑體
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ── Desktop — matches Figma 1512×912px ── */
  return (
    <section
      style={{
        fontFamily: "'Public Sans', system-ui, sans-serif",
        backgroundColor: "#F4F3EF",
        padding: "128px 64px",
        display: "flex",
        alignItems: "flex-start",
        gap: 338,
        minHeight: 912,
        boxSizing: "border-box",
      }}
    >
      {/* Left — info + download (394px) */}
      <div
        style={{
          width: 394,
          minWidth: 394,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignSelf: "stretch",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ fontSize: 24, fontWeight: 600, color: "#242424", margin: 0 }}>
            Chinese Typeface
          </h3>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: "26px", color: "#242424", margin: 0 }}>
            Noto Sans SC and Noto Sans TC are the designated Chinese typefaces. They have been
            chosen to harmonise perfectly with Brasil, ensuring a seamless and consistent
            visual experience across both English and Chinese communications. To maintain brand
            integrity, do not substitute these with any other Chinese fonts not described in
            these guidelines.
          </p>
        </div>
        <a
          href="https://fonts.google.com/noto/specimen/Noto+Sans+SC"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Public Sans', system-ui, sans-serif",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#BB3308",
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: 500,
            padding: "12px 24px",
            borderRadius: 4,
            textDecoration: "none",
            width: "fit-content",
          }}
        >
          Download Noto Sans SC/TC
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* Right — Chinese character specimens (554px) */}
      <div
        style={{
          width: 554,
          display: "flex",
          flexDirection: "column",
          gap: 48,
        }}
      >
        {/* Simplified Chinese */}
        <div>
          <p
            style={{
              fontFamily: "'Noto Sans SC', 'Public Sans', sans-serif",
              fontSize: 72,
              fontWeight: 500,
              lineHeight: "90px",
              color: "#242424",
              margin: 0,
            }}
          >
            未来领导者与行业共同创造影响力的地方
          </p>
          <p
            style={{
              fontFamily: "'Noto Sans SC', 'Public Sans', sans-serif",
              fontSize: 24,
              fontWeight: 500,
              color: "#8C8C8C",
              margin: "16px 0 0",
            }}
          >
            思源黑体
          </p>
        </div>

        {/* Traditional Chinese */}
        <div>
          <p
            style={{
              fontFamily: "'Noto Sans TC', 'Public Sans', sans-serif",
              fontSize: 72,
              fontWeight: 500,
              lineHeight: "90px",
              color: "#242424",
              margin: 0,
            }}
          >
            未來領袖與行業共同創造影響力的地方
          </p>
          <p
            style={{
              fontFamily: "'Noto Sans TC', 'Public Sans', sans-serif",
              fontSize: 24,
              fontWeight: 500,
              color: "#8C8C8C",
              margin: "16px 0 0",
            }}
          >
            思源黑體
          </p>
        </div>
      </div>
    </section>
  );
}

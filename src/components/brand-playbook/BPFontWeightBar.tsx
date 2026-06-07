'use client'
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPFontWeightBar — Font weight slider + download button control bar
 *
 * Source: Figma node 176:1051 (Magic file)
 * Size: 1512×144px
 *
 * Left:  "Font Weight" label over a custom range slider.
 *        Dragging changes the Brasil weight in the specimen above.
 *        Track = 257px; gray full width, red filled-left to thumb position.
 *        Thumb = 16×16 red circle.
 *
 * Right: Red "Download Brasil" button with arrow icon.
 *        Links to the typeface specimen (Brasil is a custom face, no public URL).
 *
 * Weights exposed: 100 → 700 in steps of 100 (all Brasil weights).
 * Default Figma slider position ≈ 50% → weight 400 (Regular).
 */

interface Props {
  weight: number;
  onWeightChange: (w: number) => void;
  monoWeight: number;
  onMonoWeightChange: (w: number) => void;
  publicWeight: number;
  onPublicWeightChange: (w: number) => void;
  activeTypeface?: "sans" | "mono" | "public";
}

/* Map weight value to a human-readable label shown in the slider label */
const WEIGHT_LABELS: Record<number, string> = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
};

export default function BPFontWeightBar({ weight, onWeightChange, monoWeight, onMonoWeightChange, publicWeight, onPublicWeightChange, activeTypeface = "sans" }: Props) {
  const isMono   = activeTypeface === "mono";
  const isPublic = activeTypeface === "public";
  /* Active weight and handler depending on which slide is showing */
  const activeWeight   = isPublic ? publicWeight : isMono ? monoWeight : weight;
  const activeOnChange = isPublic ? onPublicWeightChange : isMono ? onMonoWeightChange : onWeightChange;
  const isMobile = useIsMobile();

  /*
   * fillPercent drives the two-tone track background.
   * At weight=400: (400-100)/600 = 50% — matches Figma slider position.
   */
  const fillPercent = ((activeWeight - 100) / 600) * 100;

  /* ── Shared: the arrow icon inside the download button ── */
  const ArrowIcon = () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  /* ── Mobile: compact stacked layout ── */
  if (isMobile) {
    return (
      <section
        style={{
          backgroundColor: "#F4F3EF",
          width: "100%",
          borderTop: "1px solid #8C8C8C",
          borderBottom: "1px solid #8C8C8C",
          padding: "32px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span
            style={{
              fontFamily: "'Public Sans', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "20px",
              letterSpacing: "-0.03em",
              color: "#8C8C8C",
            }}
          >
            Font Weight — {WEIGHT_LABELS[activeWeight]}
          </span>
          <style>{`
            input[type=range].bp-fw-slider {
              -webkit-appearance: none;
              appearance: none;
              height: 4px;
              border-radius: 2px;
              outline: none;
              cursor: pointer;
              width: 100%;
            }
            input[type=range].bp-fw-slider:focus-visible {
              outline: 2px solid #BB3308;
              outline-offset: 4px;
              border-radius: 2px;
            }
            input[type=range].bp-fw-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #BB3308;
              cursor: pointer;
            }
            input[type=range].bp-fw-slider::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #BB3308;
              cursor: pointer;
              border: none;
            }
          `}</style>
          <input
            type="range"
            className="bp-fw-slider"
            min={100}
            max={700}
            step={100}
            value={activeWeight}
            onChange={(e) => activeOnChange(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #BB3308 0%, #BB3308 ${fillPercent}%, #8C8C8C ${fillPercent}%, #8C8C8C 100%)`,
            }}
          />
        </div>
        {/* Download button — label and href swap based on active typeface */}
        <a
          href={isPublic ? "https://fonts.google.com/specimen/Public+Sans" : isMono ? "https://fonts.google.com/specimen/Space+Mono" : undefined}
          aria-disabled={!isPublic && !isMono}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#BB3308",
            color: "#FFFFFF",
            fontFamily: "'Public Sans', system-ui, sans-serif",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "20px",
            padding: "10px 16px",
            borderRadius: "4px",
            textDecoration: "none",
            alignSelf: "flex-start",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8F2706")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#BB3308")}
        >
          {isPublic ? "Download Public Sans" : isMono ? "Download Space Mono" : "Download Brasil"}
          <ArrowIcon />
        </a>
      </section>
    );
  }

  /* ── Desktop: exact Figma layout ── */
  return (
    <section
      style={{
        backgroundColor: "#F4F3EF",
        width: "100%",
        height: "144px",
        /*
         * Border from Figma strokes: #8C8C8C top and bottom —
         * visually separates this control bar from the black sections above/below.
         */
        borderTop: "1px solid #8C8C8C",
        borderBottom: "1px solid #8C8C8C",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/*
       * Inner content row — max-width 1512px, padding L:64 R:64.
       * justify-content: space-between pushes slider to far left, button to far right.
       * align-items: flex-end aligns both to the bottom of the 64px content zone.
       */}
      <div
        style={{
          width: "100%",
          maxWidth: "1512px",
          margin: "0 auto",
          padding: "0 64px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          height: "64px",
        }}
      >
        {/* ── Left: Font Weight slider — hidden on Mono slide ── */}
        {/* ── Left: Font Weight slider — works for both Sans and Mono ── */}
        <div
          style={{
            width: "257px",
            height: "64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "'Public Sans', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "-0.03em",
              color: "#8C8C8C",
              whiteSpace: "nowrap",
            }}
          >
            Font Weight — {WEIGHT_LABELS[activeWeight]}
          </span>
          <style>{`
            input[type=range].bp-fw-slider {
              -webkit-appearance: none;
              appearance: none;
              width: 257px;
              height: 4px;
              border-radius: 2px;
              outline: none;
              cursor: pointer;
              flex-shrink: 0;
            }
            input[type=range].bp-fw-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #BB3308;
              cursor: pointer;
            }
            input[type=range].bp-fw-slider::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #BB3308;
              cursor: pointer;
              border: none;
            }
            input[type=range].bp-fw-slider:focus {
              outline: none;
            }
          `}</style>
          <input
            type="range"
            className="bp-fw-slider"
            min={100}
            max={700}
            step={100}
            value={activeWeight}
            onChange={(e) => activeOnChange(Number(e.target.value))}
            aria-label={`Font weight: ${WEIGHT_LABELS[activeWeight]}`}
            style={{
              background: `linear-gradient(to right, #BB3308 0%, #BB3308 ${fillPercent}%, #8C8C8C ${fillPercent}%, #8C8C8C 100%)`,
            }}
          />
        </div>

        {/* ── Right: Download button — label swaps with active typeface ── */}
        <a
          href={isPublic ? "https://fonts.google.com/specimen/Public+Sans" : isMono ? "https://fonts.google.com/specimen/Space+Mono" : undefined}
          aria-disabled={!isPublic && !isMono}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#BB3308",
            color: "#FFFFFF",
            fontFamily: "'Public Sans', system-ui, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "22px",
            padding: "12px 16px",
            borderRadius: "4px",
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8F2706")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#BB3308")}
        >
          {isPublic ? "Download Public Sans" : isMono ? "Download Space Mono" : "Download Brasil"}
          <ArrowIcon />
        </a>
      </div>
    </section>
  );
}

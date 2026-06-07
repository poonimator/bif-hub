'use client'
import React, { useState, useCallback } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPColourGuide — Primary colour swatch grid
 *
 * Source: Figma node 160:544 (Magic file)
 * Size: 1512×900px
 *
 * Click any colour swatch to copy its HEX value to the clipboard.
 * A "Copied!" badge replaces the colour name for 1.5s as confirmation.
 */

/* ── Colour data ── */
const SIT_RED_LINES   = ["HEX:      #BB3308", "RGB:      218 / 41 / 28", "CMYK:  C0 M95 Y100 K0",  "Pantone:  PANTONE 485C"];
const SIT_WHITE_LINES = ["HEX:      #FFFFFF",  "RGB:      255 / 255 / 255", "CMYK:     C0 M0 Y0 K0", "Pantone:  PANTONE 000C"];
const SIT_BLACK_LINES = ["HEX:       #27251F",  "RGB:      39 / 37 / 31",  "CMYK:  C0 M95 Y0 K100", "Pantone:  PANTONE BLACK C"];

/* ── Checkmark icon ── */
const Check = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Shared colour-values block ── */
interface SwatchInfoProps {
  lines: string[];
  name: string;
  textColor: string;
  copied: boolean;
}

function SwatchInfo({ lines, name, textColor, copied }: SwatchInfoProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "53px",
        left: "31px",
        right: "31px",
        bottom: "35px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        pointerEvents: "none", // clicks pass through to parent swatch
      }}
    >
      {/* Colour value lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {lines.map((line, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "20px",
              color: textColor,
              whiteSpace: "pre",
            }}
          >
            {line}
          </span>
        ))}
      </div>

      {/*
       * Bottom row: colour name or "Copied!" confirmation.
       * Swaps instantly on copy, resets after 1.5s.
       */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {copied && <Check color={textColor} />}
        <span
          style={{
            fontFamily: "'Public Sans', system-ui, sans-serif",
            fontWeight: 500,
            fontSize: "24px",
            lineHeight: "34px",
            letterSpacing: "-0.02em",
            color: textColor,
            transition: "opacity 0.15s ease",
          }}
        >
          {copied ? "Copied!" : name}
        </span>
      </div>
    </div>
  );
}

/* ── Swatch wrapper — handles click + hover cursor ── */
interface SwatchProps {
  bg: string;
  lines: string[];
  name: string;
  hex: string;
  textColor: string;
  style?: React.CSSProperties;
  copied: boolean;
  onCopy: () => void;
}

function Swatch({ bg, lines, name, textColor, style, copied, onCopy }: SwatchProps) {
  return (
    <div
      onClick={onCopy}
      role="button"
      aria-label={`Copy ${name} HEX colour`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onCopy(); }}
      style={{
        position: "relative",
        backgroundColor: bg,
        cursor: "pointer",
        userSelect: "none",
        ...style,
      }}
    >
      {/* Subtle hover overlay — darkens/lightens the swatch slightly */}
      <div
        className="swatch-hover-overlay"
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0)",
          transition: "background-color 0.2s ease",
          pointerEvents: "none",
        }}
      />
      <SwatchInfo lines={lines} name={name} textColor={textColor} copied={copied} />

      <style>{`
        [role="button"]:hover .swatch-hover-overlay {
          background-color: rgba(0,0,0,0.06) !important;
        }
      `}</style>
    </div>
  );
}

export default function BPColourGuide() {
  const isMobile = useIsMobile();

  /* Track which swatch is in "copied" state — only one at a time */
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback((id: string, hex: string) => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  /* ── Mobile ── */
  if (isMobile) {
    return (
      <section style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
        <Swatch
          bg="#BB3308" lines={SIT_RED_LINES} name="SIT Red" hex="#BB3308"
          textColor="#FFFFFF" style={{ width: "100%", height: "320px" }}
          copied={copiedId === "red"} onCopy={() => copy("red", "#BB3308")}
        />
        <Swatch
          bg="#FFFFFF" lines={SIT_WHITE_LINES} name="SIT White" hex="#FFFFFF"
          textColor="#242424"
          style={{ width: "100%", height: "320px", border: "1px solid #E8E8E8", boxSizing: "border-box" }}
          copied={copiedId === "white"} onCopy={() => copy("white", "#FFFFFF")}
        />
        <Swatch
          bg="#000000" lines={SIT_BLACK_LINES} name="SIT Black" hex="#27251F"
          textColor="#FFFFFF" style={{ width: "100%", height: "320px" }}
          copied={copiedId === "black"} onCopy={() => copy("black", "#27251F")}
        />

        {/* Statement — not clickable */}
        <div style={{ backgroundColor: "#BB3308", padding: "64px 24px", boxSizing: "border-box" }}>
          <p style={{ fontFamily: "'Brasil', Georgia, serif", fontWeight: 500, fontSize: "48px", lineHeight: "52px", color: "#FFFFFF", margin: 0 }}>
            Made for industries of tomorrow
          </p>
        </div>
      </section>
    );
  }

  /* ── Desktop ── */
  return (
    <section
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "450px 450px 1fr",
        gridTemplateRows: "450px 450px",
        overflow: "hidden",
      }}
    >
      {/* Row 1 Col 1 — SIT Red */}
      <Swatch
        bg="#BB3308" lines={SIT_RED_LINES} name="SIT Red" hex="#BB3308"
        textColor="#FFFFFF" style={{ gridColumn: 1, gridRow: 1 }}
        copied={copiedId === "red"} onCopy={() => copy("red", "#BB3308")}
      />

      {/* Row 2 Col 1 — Video (not clickable) */}
      <div style={{ gridColumn: 1, gridRow: 2, overflow: "hidden" }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
        >
          <source src="/images/brand-playbook/Video_Discussion.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Row 1 Col 2 — SIT White */}
      <Swatch
        bg="#FFFFFF" lines={SIT_WHITE_LINES} name="SIT White" hex="#FFFFFF"
        textColor="#242424" style={{ gridColumn: 2, gridRow: 1 }}
        copied={copiedId === "white"} onCopy={() => copy("white", "#FFFFFF")}
      />

      {/* Row 2 Col 2 — SIT Black */}
      <Swatch
        bg="#000000" lines={SIT_BLACK_LINES} name="SIT Black" hex="#27251F"
        textColor="#FFFFFF" style={{ gridColumn: 2, gridRow: 2 }}
        copied={copiedId === "black"} onCopy={() => copy("black", "#27251F")}
      />

      {/* Col 3 — Statement panel (not clickable) */}
      <div style={{ gridColumn: 3, gridRow: "1 / 3", backgroundColor: "#BB3308", position: "relative" }}>
        <p
          style={{
            position: "absolute",
            top: "49px",
            left: "30px",
            right: "30px",
            fontFamily: "'Brasil', Georgia, serif",
            fontWeight: 500,
            fontSize: "80px",
            lineHeight: "72px",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          Made for industries of tomorrow
        </p>
      </div>
    </section>
  );
}

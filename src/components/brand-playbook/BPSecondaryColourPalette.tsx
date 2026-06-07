'use client'
import React, { useState, useCallback } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPSecondaryColourPalette — 5-row secondary colour grid
 *
 * Source: Figma node 167:996 (Magic file)
 * Size: 1512×1000px (5 rows × 200px)
 *
 * Per row — 3 columns:
 *   Col 1 (450px): 100% dark swatch — CMYK/RGB/HEX/PANTONE at top-left (Space Mono 14px white)
 *   Col 2 (450px): 75% tint — colour name at bottom-left (Brasil 24px/500, dark colour)
 *   Col 3 (612px): 50% tint (top 100px) stacked over 25% tint (bottom 100px)
 *
 * Click any swatch to copy its HEX. "Copied!" badge for 1.5 s.
 */

interface RowDef {
  id: string;
  dark:  { hex: string; specs: string[] };
  tint75: { hex: string; name: string };
  tint50: { hex: string };
  tint25: { hex: string };
}

const ROWS: RowDef[] = [
  {
    id: "burgundy",
    dark:   { hex: "#912F46", specs: ["CMYK 0, 68, 52, 43", "RGB 145, 47, 70", "HEX/HTML #912F46", "PANTONE 7637 C"] },
    tint75: { hex: "#FABBC8", name: "Promise Pink" },
    tint50: { hex: "#FCD6DE" },
    tint25: { hex: "#FDE9EE" },
  },
  {
    id: "steelblue",
    dark:   { hex: "#425563", specs: ["CMYK 33, 14, 0, 61", "RGB 66, 85, 99", "HEX/HTML #425563", "PANTONE 7545 C"] },
    tint75: { hex: "#B9D9EB", name: "Horizon Blue" },
    tint50: { hex: "#D6EAF4" },
    tint25: { hex: "#EBF5FA" },
  },
  {
    id: "gold",
    dark:   { hex: "#897A27", specs: ["CMYK 0, 11, 72, 46", "RGB 137, 122, 39", "HEX/HTML #897A27"] },
    tint75: { hex: "#F2F0A1", name: "Rise Yellow" },
    tint50: { hex: "#F7F6C8" },
    tint25: { hex: "#FBFBE4" },
  },
  {
    id: "purple",
    dark:   { hex: "#535486", specs: ["CMYK 38, 37, 0, 47", "RGB 83, 84, 134", "HEX/HTML #535486", "PANTONE 7673 C"] },
    tint75: { hex: "#B6B8DC", name: "Vision Purple" },
    tint50: { hex: "#D5D6EB" },
    tint25: { hex: "#EAEAF5" },
  },
  {
    id: "forest",
    dark:   { hex: "#44693D", specs: ["CMYK 35, 0, 42, 59", "RGB 68, 105, 61", "HEX/HTML #44693D", "PANTONE 7743 C"] },
    tint75: { hex: "#B9DCD2", name: "Flourish Green" },
    tint50: { hex: "#D6EDE6" },
    tint25: { hex: "#EBF6F2" },
  },
];

/* ── Checkmark icon ── */
const Check = ({ color }: { color: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function BPSecondaryColourPalette() {
  const isMobile = useIsMobile();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback((id: string, hex: string) => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }, []);

  /* ── Mobile — 4 compact equal-width swatches per row ── */
  if (isMobile) {
    return (
      <section style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
        {ROWS.map((row) => (
          <div key={row.id} style={{ display: "flex", width: "100%", height: "100px" }}>
            {[
              { id: `${row.id}-100`, hex: row.dark.hex },
              { id: `${row.id}-75`,  hex: row.tint75.hex },
              { id: `${row.id}-50`,  hex: row.tint50.hex },
              { id: `${row.id}-25`,  hex: row.tint25.hex },
            ].map((s) => (
              <div
                key={s.id}
                onClick={() => copy(s.id, s.hex)}
                role="button"
                tabIndex={0}
                aria-label={`Copy ${s.hex}`}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") copy(s.id, s.hex); }}
                style={{ flex: 1, backgroundColor: s.hex, cursor: "pointer" }}
              />
            ))}
          </div>
        ))}
      </section>
    );
  }

  /* ── Desktop — 3-column layout matching Figma 167:996 ── */
  return (
    <section style={{ width: "100%", backgroundColor: "#FFFFFF" }}>
      {ROWS.map((row) => {
        const darkId  = `${row.id}-100`;
        const tint75Id = `${row.id}-75`;
        const tint50Id = `${row.id}-50`;
        const tint25Id = `${row.id}-25`;
        const darkCopied  = copiedId === darkId;
        const tint75Copied = copiedId === tint75Id;

        return (
          <div key={row.id} style={{ display: "flex", width: "100%", height: "200px" }}>

            {/* ── Col 1 (450px): 100% dark swatch with colour specs ── */}
            <div
              onClick={() => copy(darkId, row.dark.hex)}
              role="button"
              tabIndex={0}
              aria-label={`Copy ${row.dark.hex}`}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") copy(darkId, row.dark.hex); }}
              style={{
                position: "relative",
                width: "450px",
                flexShrink: 0,
                backgroundColor: row.dark.hex,
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "24px",
                  left: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  pointerEvents: "none",
                }}
              >
                {darkCopied ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Check color="#FFFFFF" />
                    <span style={{ fontFamily: "'Public Sans', system-ui, sans-serif", fontWeight: 500, fontSize: "18px", color: "#FFFFFF" }}>
                      Copied!
                    </span>
                  </div>
                ) : (
                  row.dark.specs.map((line, i) => (
                    <span
                      key={i}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "18px",
                        color: "#FFFFFF",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {line}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* ── Col 2 (450px): 75% tint with colour name ── */}
            <div
              onClick={() => copy(tint75Id, row.tint75.hex)}
              role="button"
              tabIndex={0}
              aria-label={`Copy ${row.tint75.name} ${row.tint75.hex}`}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") copy(tint75Id, row.tint75.hex); }}
              style={{
                position: "relative",
                width: "450px",
                flexShrink: 0,
                backgroundColor: row.tint75.hex,
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  pointerEvents: "none",
                }}
              >
                {tint75Copied && <Check color={row.dark.hex} />}
                <span
                  style={{
                    fontFamily: "'Public Sans', system-ui, sans-serif",
                    fontWeight: 500,
                    fontSize: "24px",
                    lineHeight: "33px",
                    color: row.dark.hex,
                  }}
                >
                  {tint75Copied ? "Copied!" : row.tint75.name}
                </span>
              </div>
            </div>

            {/* ── Col 3 (flex-1 = 612px): 50% tint top + 25% tint bottom ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div
                onClick={() => copy(tint50Id, row.tint50.hex)}
                role="button"
                tabIndex={0}
                aria-label={`Copy ${row.tint50.hex}`}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") copy(tint50Id, row.tint50.hex); }}
                style={{ flex: 1, backgroundColor: row.tint50.hex, cursor: "pointer", position: "relative" }}
              >
                {copiedId === tint50Id && (
                  <div style={{ position: "absolute", bottom: "12px", left: "24px", display: "flex", alignItems: "center", gap: "8px", pointerEvents: "none" }}>
                    <Check color="#242424" />
                    <span style={{ fontFamily: "'Public Sans', system-ui, sans-serif", fontWeight: 500, fontSize: "14px", color: "#242424" }}>Copied!</span>
                  </div>
                )}
              </div>
              <div
                onClick={() => copy(tint25Id, row.tint25.hex)}
                role="button"
                tabIndex={0}
                aria-label={`Copy ${row.tint25.hex}`}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") copy(tint25Id, row.tint25.hex); }}
                style={{ flex: 1, backgroundColor: row.tint25.hex, cursor: "pointer", position: "relative" }}
              >
                {copiedId === tint25Id && (
                  <div style={{ position: "absolute", bottom: "12px", left: "24px", display: "flex", alignItems: "center", gap: "8px", pointerEvents: "none" }}>
                    <Check color="#242424" />
                    <span style={{ fontFamily: "'Public Sans', system-ui, sans-serif", fontWeight: 500, fontSize: "14px", color: "#242424" }}>Copied!</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        );
      })}
    </section>
  );
}

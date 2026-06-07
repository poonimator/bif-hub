'use client'
import React, { useState, useCallback } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPColourMosaic — BIF 27 colour system, mosaic layout.
 *
 * Source: Figma node 74:226 (BIF-27, "BIF — Colour System (Mosaic)").
 * 6-column × 4-row mosaic interleaving named colour swatches with Bhutan
 * photography (dzong, prayer flags, river, monk, peaks). Replaces the old
 * SIT colour guide + secondary palette sections.
 */

type Cell =
  | { kind: "colour"; name: string; hex: string; onDark: boolean; col: string; row: string }
  | { kind: "image"; name: string; src: string; col: string; row: string; zoom?: number };

const CELLS: Cell[] = [
  { kind: "colour", name: "Ember",    hex: "#BB3308", onDark: true,  col: "1",        row: "1" },
  { kind: "image",  name: "Dzong",    src: "/images/bif-colours/dzong.webp", col: "2", row: "1 / span 2" },
  { kind: "colour", name: "Sand",     hex: "#E1D9B5", onDark: false, col: "3",        row: "1" },
  { kind: "colour", name: "Marigold", hex: "#E5C64C", onDark: false, col: "4",        row: "1" },
  { kind: "image",  name: "Prayer Flags", src: "/images/bif-colours/flags.webp", col: "5 / span 2", row: "1" },
  { kind: "colour", name: "Sage",     hex: "#17FF3E", onDark: false, col: "1",        row: "2" },
  { kind: "colour", name: "Azure",    hex: "#51C8FF", onDark: false, col: "3",        row: "2" },
  { kind: "image",  name: "Confluence", src: "/images/bif-colours/river.webp", col: "4", row: "2" },
  { kind: "colour", name: "Coral",    hex: "#F99676", onDark: false, col: "5",        row: "2" },
  { kind: "colour", name: "Mist",     hex: "#A0B1BF", onDark: false, col: "6",        row: "2" },
  { kind: "colour", name: "Wonder",   hex: "#14122B", onDark: true,  col: "1 / span 2", row: "3" },
  { kind: "image",  name: "Lineage",  src: "/images/bif-colours/monk.webp", col: "3", row: "3 / span 2" },
  { kind: "colour", name: "Amethyst", hex: "#B23FFF", onDark: true,  col: "4",        row: "3" },
  { kind: "colour", name: "Stone",    hex: "#8A8473", onDark: true,  col: "5",        row: "3" },
  { kind: "image",  name: "Himalaya", src: "/images/bif-colours/peaks.webp", col: "6", row: "3 / span 2", zoom: 1.05 },
  { kind: "colour", name: "Nightfall", hex: "#16150F", onDark: true, col: "1",        row: "4" },
  { kind: "colour", name: "Ink",      hex: "#1A1813", onDark: true,  col: "2",        row: "4" },
  { kind: "colour", name: "Cloud",    hex: "#FFFFFF", onDark: false, col: "4",        row: "4" },
  { kind: "colour", name: "Paper",    hex: "#F4EFE6", onDark: false, col: "5",        row: "4" },
];

const NAME_STYLE = (onDark: boolean): React.CSSProperties => ({
  fontFamily: "'Brasil', Georgia, serif",
  fontWeight: 500,
  fontSize: 22,
  lineHeight: "normal",
  color: onDark ? "#ffffff" : "#1a1813",
});
const HEX_STYLE = (onDark: boolean): React.CSSProperties => ({
  fontFamily: "'Space Mono', monospace",
  fontSize: 12,
  letterSpacing: "0.02em",
  color: onDark ? "rgba(255,255,255,0.7)" : "rgba(26,24,19,0.7)",
  marginTop: 8,
});
const IMG_LABEL: React.CSSProperties = {
  fontFamily: "'Brasil', Georgia, serif",
  fontWeight: 500,
  fontSize: 22,
  color: "#ffffff",
  textShadow: "0px 1px 5px rgba(0,0,0,0.55)",
};

function ColourCell({ cell, mobile, copied, onCopy }: { cell: Extract<Cell, { kind: "colour" }>; mobile?: boolean; copied: boolean; onCopy: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Copy ${cell.name} HEX colour ${cell.hex}`}
      onClick={onCopy}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCopy(); } }}
      style={{
        gridColumn: mobile ? undefined : cell.col,
        gridRow: mobile ? undefined : cell.row,
        background: cell.hex,
        position: "relative",
        padding: 24,
        cursor: "pointer",
        ...(mobile ? { aspectRatio: "1 / 1" } : {}),
      }}
    >
      <p style={NAME_STYLE(cell.onDark)}>{copied ? "Copied!" : cell.name}</p>
      <p style={HEX_STYLE(cell.onDark)}>{cell.hex}</p>
    </div>
  );
}

function ImageCell({ cell, mobile }: { cell: Extract<Cell, { kind: "image" }>; mobile?: boolean }) {
  return (
    <div
      style={{
        gridColumn: mobile ? "1 / span 2" : cell.col,
        gridRow: mobile ? undefined : cell.row,
        position: "relative",
        overflow: "hidden",
        ...(mobile ? { aspectRatio: "16 / 9" } : {}),
      }}
    >
      <img
        src={cell.src}
        alt={cell.name}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          transform: cell.zoom ? `scale(${cell.zoom})` : undefined,
        }}
      />
      <p style={{ ...IMG_LABEL, position: "absolute", top: 22, left: 24 }}>{cell.name}</p>
    </div>
  );
}

export default function BPColourMosaic() {
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback((name: string, hex: string) => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const renderCell = (cell: Cell, i: number, mobile?: boolean) =>
    cell.kind === "colour"
      ? <ColourCell key={i} cell={cell} mobile={mobile} copied={copied === cell.name} onCopy={() => copy(cell.name, cell.hex)} />
      : <ImageCell key={i} cell={cell} mobile={mobile} />;

  if (isMobile) {
    return (
      <section style={{ background: "#0e0e0a", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        {CELLS.map((cell, i) => renderCell(cell, i, true))}
      </section>
    );
  }

  return (
    <section style={{ background: "#0e0e0a" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          width: "100%",
          aspectRatio: "1920 / 1080",
        }}
      >
        {CELLS.map((cell, i) => renderCell(cell, i))}
      </div>
    </section>
  );
}

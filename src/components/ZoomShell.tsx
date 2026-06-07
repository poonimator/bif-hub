'use client';

import { useEffect, useRef, useState } from 'react';
import MinimizeButton from './MinimizeButton';
import type { SectionId } from './SectionCard';

/** Relative luminance of a CSS colour string, or null if transparent/unparseable. */
function bgLuminance(c: string): number | null {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(',').map((s) => parseFloat(s));
  const [r, g, b, a = 1] = parts;
  if (!a) return null; // fully transparent → not a real background
  const lin = (v: number) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

interface ZoomShellProps {
  sectionId: SectionId;
  onClose: () => void;
  onScrolled?: (fullscreen: boolean) => void;
  sectionBg?: string;
  children: React.ReactNode;
  minimizeVariant?: 'dark' | 'light';
}

const FULLSCREEN_THRESHOLD = 24;
const BTN_SCROLL_RANGE = 120; // px of scroll over which button animates
const CARD_PADDING = 32;      // viewport inset of the zoomed card
const CARD_RADIUS = 22;       // corner radius of the zoomed card
const BTN_START = 44;         // initial distance from edge (32px card padding + 12px inset)
const BTN_END = 16;           // final distance from edge (corner)
// concentric corners: button radius = card radius − button's inset from the card edge
const BTN_RADIUS = CARD_RADIUS - (BTN_START - CARD_PADDING); // 22 − 12 = 10
// extra scroll the full hero holds after going fullscreen, before the section
// content starts covering it (the spacer is taller than the viewport by this)
const HERO_HOLD = 500;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export default function ZoomShell({
  onClose,
  onScrolled,
  sectionBg = '#16150F',
  children,
  minimizeVariant = 'dark',
}: ZoomShellProps) {
  const lastFullscreen = useRef(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [variant, setVariant] = useState<'dark' | 'light'>(minimizeVariant);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const st = e.currentTarget.scrollTop;
    setScrollTop(st);

    const scrolled = st > FULLSCREEN_THRESHOLD;
    if (scrolled !== lastFullscreen.current) {
      lastFullscreen.current = scrolled;
      onScrolled?.(scrolled);
    }
  }

  const t = scrollTop / BTN_SCROLL_RANGE;
  const btnOffset = lerp(BTN_START, BTN_END, t);
  const btnScale  = lerp(1, 0.8, t);

  // Back button auto-contrast: sample the background directly behind the button
  // and pick a dark icon on light backgrounds, a light icon on dark ones. Runs
  // whenever the scroll position changes (and once on mount, after the open
  // animation settles).
  useEffect(() => {
    let raf = 0;
    const sample = () => {
      raf = 0;
      if (typeof document === 'undefined') return;
      const cx = btnOffset + 22 * btnScale;
      const cy = btnOffset + 22 * btnScale;
      const els = document.elementsFromPoint(cx, cy);
      for (const el of els) {
        const he = el as HTMLElement;
        if (he.closest?.('[data-minimize]')) continue;     // the button + its icon
        if (he.hasAttribute?.('data-flying-bg')) continue;  // flying-screen bg layer
        const lum = bgLuminance(getComputedStyle(el).backgroundColor);
        if (lum != null) {
          setVariant(lum > 0.55 ? 'light' : 'dark');
          return;
        }
      }
      setVariant('dark'); // hero imagery / nothing solid → white icon
    };
    raf = requestAnimationFrame(sample);
    const settle = setTimeout(sample, 650); // re-check after the open animation
    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, [scrollTop, btnOffset, btnScale]);

  return (
    <>
      <MinimizeButton
        onClose={onClose}
        variant={variant}
        style={{
          top: btnOffset,
          left: btnOffset,
          borderRadius: BTN_RADIUS,
          transform: `scale(${btnScale})`,
          transformOrigin: 'top left',
        }}
      />

      <div
        id="zoomedContent"
        className="absolute inset-0 overflow-y-auto flex flex-col"
        style={{ zIndex: 3 }}
        onScroll={handleScroll}
      >
        {/* Hero spacer — transparent; taller than the viewport so the full hero
            holds for HERO_HOLD px of scroll after going fullscreen before the
            section content starts covering it */}
        <div style={{ flexShrink: 0, height: `calc(100vh + ${HERO_HOLD}px)`, position: 'relative' }} />

        {/* Section content — solid edge against the hero, no gradient fade */}
        <div style={{ background: sectionBg, position: 'relative', zIndex: 1, flexGrow: 1 }}>
          {children}
        </div>
      </div>
    </>
  );
}

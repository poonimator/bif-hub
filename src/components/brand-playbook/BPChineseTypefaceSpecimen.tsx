'use client'
import React, { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPChineseTypefaceSpecimen — Giant Public Sans specimen with infinite slot-machine cycling
 *
 * Four alphanumeric glyphs spread across the full width of the screen.
 * Each slot is a clipped 2-item column that scrolls up (translateY) on each step,
 * then snaps back — seamless infinite loop. Staggered left-to-right: A → a → 0 → 1.
 * Animation restarts every time the section re-enters the viewport.
 */

// Narrow-ish glyphs only (no M/m/W/w) so the font can run larger while each
// glyph still fits inside its fixed quarter-column without clipping.
const SEQUENCES = [
  ["A", "B", "E"],   // slot 0 (red)
  ["a", "e", "s"],   // slot 1 (white)
  ["0", "8", "6"],   // slot 2 (red)
  ["1", "7", "4"],   // slot 3 (white)
];

const STAGGER    = 200;
const CYCLE      = 2200;
const TRANSITION = 800;
const PAUSE_TOP  = 450;

type SlotState = {
  current: string;
  next:    string;
  step:    number;
  moving:  boolean;
};

const makeInitial = (): SlotState[] =>
  SEQUENCES.map(seq => ({
    current: seq[0],
    next:    seq[1 % seq.length],
    step:    0,
    moving:  false,
  }));

export default function BPChineseTypefaceSpecimen() {
  const isMobile   = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: false, amount: 0.3 });
  const timers     = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals  = useRef<ReturnType<typeof setInterval>[]>([]);

  const [slots, setSlots] = useState<SlotState[]>(makeInitial);

  const stopAll = () => {
    timers.current.forEach(clearTimeout);
    intervals.current.forEach(clearInterval);
    timers.current    = [];
    intervals.current = [];
  };

  useEffect(() => {
    if (!inView) {
      stopAll();
      return;
    }

    setSlots(makeInitial());
    stopAll();

    SEQUENCES.forEach((seq, i) => {
      const tick = () => {
        setSlots(prev => {
          const n = [...prev];
          n[i] = { ...n[i], moving: true };
          return n;
        });

        const reset = setTimeout(() => {
          setSlots(prev => {
            const n    = [...prev];
            const next = (n[i].step + 1) % seq.length;
            const peek = (next + 1) % seq.length;
            n[i] = {
              current: seq[next],
              next:    seq[peek],
              step:    next,
              moving:  false,
            };
            return n;
          });
        }, TRANSITION + PAUSE_TOP);

        timers.current.push(reset);
      };

      const delay = setTimeout(() => {
        tick();
        const id = setInterval(tick, CYCLE);
        intervals.current.push(id);
      }, i * STAGGER);

      timers.current.push(delay);
    });

    return stopAll;
  }, [inView]);

  // As large as fits the viewport (the four glyphs total ≈ 2.5·fs), capped at
  // the 686px Brasil size on wide screens — so it never clips off-screen.
  const FS_DESKTOP = "min(686px, calc((100vw - 32px) / 2.5))";
  const FS_MOBILE  = "min(200px, calc((100vw - 16px) / 2.5))";

  const chars = (fsExpr: string, slotHeight: number) => {
    const renderSlot = (
      i:          number,
      color:      string,
      fontFamily: string,
      tabular:    boolean,   // equal-width figures so digits don't change width as they cycle
    ) => {
      const { current, next, moving } = slots[i];
      return (
        <span
          key={i}
          style={{
            display:       "inline-block",
            overflow:      "hidden",
            height:        `${slotHeight}px`,
            verticalAlign: "bottom",
          }}
        >
          <span
            style={{
              display:    "block",
              willChange: "transform",
              transform:  moving ? `translateY(-${slotHeight}px)` : "translateY(0)",
              transition: moving
                ? `transform ${TRANSITION}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : "none",
            }}
          >
            {[current, next].map((char, j) => (
              <span
                key={j}
                style={{
                  display:            "block",
                  height:             `${slotHeight}px`,
                  lineHeight:         `${slotHeight}px`,
                  fontSize:           "var(--fs)",
                  fontFamily,
                  fontWeight:         400,
                  color,
                  letterSpacing:      "-0.03em",
                  whiteSpace:         "nowrap",
                  fontVariantNumeric: tabular ? "tabular-nums" : "normal",
                }}
              >
                {char}
              </span>
            ))}
          </span>
        </span>
      );
    };

    const SPACE = "var(--loaded-space-grotesk), system-ui, sans-serif";
    const DM = "var(--loaded-dm-mono), ui-monospace, monospace";
    return (
      <span style={{ whiteSpace: "nowrap", flexShrink: 0, ["--fs" as string]: fsExpr } as React.CSSProperties}>
        {renderSlot(0, "#51C8FF", SPACE, false)}
        {renderSlot(1, "#51C8FF", SPACE, false)}
        {renderSlot(2, "#BB3308", DM, true)}
        {renderSlot(3, "#BB3308", DM, true)}
      </span>
    );
  };

  /* ── Mobile ── */
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        style={{
          backgroundColor: "#000000",
          width:           "100%",
          height:          "260px",
          overflow:        "hidden",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          paddingBottom:   "40px",
          boxSizing:       "border-box",
        }}
      >
        {chars(FS_MOBILE, 240)}
      </section>
    );
  }

  /* ── Desktop ── */
  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: "#000000",
        width:           "100%",
        height:          "821px",
        overflow:        "hidden",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        paddingBottom:   "40px",
        boxSizing:       "border-box",
      }}
    >
      {chars(FS_DESKTOP, 823)}
    </section>
  );
}

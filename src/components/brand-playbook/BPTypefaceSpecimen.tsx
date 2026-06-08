'use client'
import React, { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPTypefaceSpecimen — Giant typeface showcase with infinite slot-machine cycling
 *
 * Source: Figma node 160:565 (Magic file)
 * Size: 1512×821px
 *
 * Each slot is a clipped 2-item column that scrolls up (translateY) on each step,
 * then snaps back to position 0 with the next character loaded — creating a
 * seamless infinite loop. Staggered left-to-right: A → a → 0 → 1.
 * Animation restarts every time the section re-enters the viewport.
 *
 * Sequences (loop continuously):
 *   Slot 0 uppercase red:   A → B → C → D → E → A …
 *   Slot 1 lowercase white: a → b → c → d → e → a …
 *   Slot 2 digit red:       0 → 2 → 4 → 6 → 0 …
 *   Slot 3 digit white:     1 → 3 → 5 → 7 → 1 …
 */

const SEQUENCES = [
  ["A", "B", "C", "D", "E"],
  ["a", "b", "c", "d", "e"],
  ["0", "2", "4", "6"],
  ["1", "3", "5", "7"],
];

const STAGGER    = 200;   // ms between each slot's start (A, then a, then 0, then 1)
const CYCLE      = 2200;  // ms between each step trigger — slow overall pace
const TRANSITION = 800;   // ms for the upward float animation
const PAUSE_TOP  = 450;   // ms to pause after reaching top before snapping back

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

export default function BPTypefaceSpecimen() {
  const isMobile    = useIsMobile();
  const sectionRef  = useRef<HTMLElement>(null);
  const inView      = useInView(sectionRef, { once: false, amount: 0.3 });
  const timers      = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals   = useRef<ReturnType<typeof setInterval>[]>([]);

  const [slots, setSlots] = useState<SlotState[]>(makeInitial);

  const stopAll = () => {
    timers.current.forEach(clearTimeout);
    intervals.current.forEach(clearInterval);
    timers.current   = [];
    intervals.current = [];
  };

  useEffect(() => {
    if (!inView) {
      stopAll();
      return;
    }

    // Reset to first character and restart
    setSlots(makeInitial());
    stopAll();

    SEQUENCES.forEach((seq, i) => {
      const tick = () => {
        // Begin scroll upward
        setSlots(prev => {
          const n = [...prev];
          n[i] = { ...n[i], moving: true };
          return n;
        });

        // After transition: snap back, advance to next character
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

      // First tick is staggered (A before a, 0 before 1)
      const delay = setTimeout(() => {
        tick();
        const id = setInterval(tick, CYCLE);
        intervals.current.push(id);
      }, i * STAGGER);

      timers.current.push(delay);
    });

    return stopAll;
  }, [inView]);

  const specimen = (fontSize: string, slotHeight: number) => {
    const renderSlot = (
      i:          number,
      color:      string,
      fontFamily: string,
      fontWeight: number,
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
                  display:       "block",
                  height:        `${slotHeight}px`,
                  lineHeight:    `${slotHeight}px`,
                  fontSize,
                  fontFamily,
                  fontWeight,
                  color,
                  letterSpacing: "-0.03em",
                  whiteSpace:    "nowrap",
                }}
              >
                {char}
              </span>
            ))}
          </span>
        </span>
      );
    };

    return (
      <span style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
        {renderSlot(0, "#17FF3E", "'Brasil', Georgia, serif", 500)}
        {renderSlot(1, "#FFFFFF", "'Brasil', Georgia, serif", 500)}
        {renderSlot(2, "#17FF3E", "'Brasil', Georgia, serif", 500)}
        {renderSlot(3, "#FFFFFF", "'Brasil', Georgia, serif", 500)}
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
        {specimen("200px", 240)}
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
      {specimen("686px", 823)}
    </section>
  );
}

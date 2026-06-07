'use client'
import React, { useEffect, useRef, useState } from "react";

/**
 * BPInsitu — square in-situ mockup that fills the full width (the section is
 * square to match the image, so no letterboxing). Not pinned: it scrolls
 * normally and crossfades day → night as it passes through the viewport, and
 * stays on night once scrolled past.
 *
 * NOTE: this is driven by a manual scroll handler (capture-phase on window)
 * rather than framer-motion's useScroll, because in the zoomed homepage view
 * the scroll happens inside an inner container (#zoomedContent), not the
 * window — useScroll(window) never fires there. getBoundingClientRect is
 * container-agnostic, so this works in both the route view and the zoom view.
 */
export default function BPInsitu() {
  const ref = useRef<HTMLElement>(null);
  const [night, setNight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // progress 0 → 1 as the section travels from entering the bottom of the
      // viewport (top at vh) to leaving the top (bottom at 0).
      const total = r.height + vh;
      const travelled = vh - r.top;
      const p = Math.max(0, Math.min(1, travelled / total));
      // map the middle third of the travel to the crossfade, then clamp.
      const o = Math.max(0, Math.min(1, (p - 0.35) / 0.3));
      setNight(o);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    // capture:true catches scroll events from inner scroll containers too.
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={ref} style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", overflow: "hidden", backgroundColor: "#0e0e0a" }}>
      <img
        src="/images/insitu1-day.webp"
        alt="BIF billboard in situ"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
      />
      <img
        src="/images/insitu1-night.webp"
        alt=""
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: night }}
      />
    </section>
  );
}

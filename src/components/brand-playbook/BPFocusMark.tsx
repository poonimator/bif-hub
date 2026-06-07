'use client'
import React, { useRef, useState, useEffect } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPFocusMark — "Focus Mark" editorial hero section
 *
 * Scroll-driven entrance/exit animation. Listens to #zoomedContent scroll
 * (not window) since this component lives inside the zoomed brand overlay.
 *
 * progress 0 = section center hits container bottom (entering)
 * progress 1 = section end hits container top (fully past)
 */

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return outMin + (outMax - outMin) * clamp((v - inMin) / (inMax - inMin));
}

export default function BPFocusMark() {
  const isMobile   = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = document.getElementById("zoomedContent");
    if (!container) return;

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const cRect = container.getBoundingClientRect();
      const sRect = section.getBoundingClientRect();

      // p=0 when section center is at container bottom (entering from below)
      const startTop = cRect.bottom - sRect.height / 2;
      // p=1 when section bottom is at container top (fully scrolled past)
      const endTop   = cRect.top - sRect.height;

      setProgress(clamp((sRect.top - startTop) / (endTop - startTop)));
    };

    container.addEventListener("scroll", update, { passive: true });
    update();
    return () => container.removeEventListener("scroll", update);
  }, []);

  const bandY       = progress < 0.30 ? mapRange(progress, 0, 0.30, 120, 0)
                    : progress > 0.70 ? mapRange(progress, 0.70, 0.90, 0, -120) : 0;
  const bandOpacity = progress < 0.30 ? mapRange(progress, 0, 0.30, 0, 1)
                    : progress > 0.70 ? mapRange(progress, 0.70, 0.90, 1, 0) : 1;

  const textY       = progress < 0.35 ? mapRange(progress, 0.08, 0.35, 24, 0)
                    : progress > 0.75 ? mapRange(progress, 0.75, 0.92, 0, -24) : 0;
  const textOpacity = progress < 0.35 ? mapRange(progress, 0.08, 0.35, 0, 1)
                    : progress > 0.75 ? mapRange(progress, 0.75, 0.92, 1, 0) : 1;

  const sectionStyle: React.CSSProperties = {
    width:           "100%",
    backgroundColor: "#F4F3EF",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    overflow:        "hidden",
    boxSizing:       "border-box",
  };

  if (isMobile) {
    return (
      <section ref={sectionRef} style={{ ...sectionStyle, height: "300px" }}>
        <div style={{
          transform:       `translateY(${bandY}px) rotate(-1deg)`,
          opacity:         bandOpacity,
          backgroundColor: "#BB3308",
          padding:         "4px 20px",
          display:         "inline-block",
        }}>
          <span style={{
            transform:     `translateY(${textY}px)`,
            opacity:       textOpacity,
            fontFamily:    "'Brasil', Georgia, serif",
            fontWeight:    500,
            fontSize:      "clamp(56px, 14vw, 90px)",
            lineHeight:    "1",
            letterSpacing: "-0.03em",
            color:         "#FFFFFF",
            display:       "block",
            whiteSpace:    "nowrap",
          }}>
            Focus Mark
          </span>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} style={{ ...sectionStyle, height: "700px" }}>
      <div style={{
        transform:       `translateY(${bandY}px) rotate(-1deg)`,
        opacity:         bandOpacity,
        backgroundColor: "#BB3308",
        padding:         "5px 40px",
        display:         "inline-block",
      }}>
        <span style={{
          transform:     `translateY(${textY}px)`,
          opacity:       textOpacity,
          fontFamily:    "'Brasil', Georgia, serif",
          fontWeight:    500,
          fontSize:      "200px",
          lineHeight:    "200px",
          letterSpacing: "-6px",
          color:         "#FFFFFF",
          display:       "block",
          whiteSpace:    "nowrap",
        }}>
          Focus Mark
        </span>
      </div>
    </section>
  );
}

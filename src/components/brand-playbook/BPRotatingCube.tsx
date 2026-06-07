'use client'
import React, { useState, useRef, useCallback } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useScrollWhenVisible } from "../../hooks/useScrollWhenVisible";

/**
 * BPRotatingCube — Title intro + scroll-driven cube
 *
 * Phase 1 (0 → 2 × vh of scroll): title dwells — 3 stacked lines:
 *   "Introducing"  /  "our communication"  /  "pillar."
 *   Fades in on section entry, holds for ~2 full viewports of scroll,
 *   then crossfades out as Phase 2 begins.
 *
 * Phase 2 (2 × vh → end): cube fades in and rotates face-by-face with hard stops.
 *
 * Total section height: 930 vh
 *   200 vh = title dwell + crossfade window
 *   630 vh = cube scroll (6 faces × 110 vh each: 80 vh dwell + 30 vh snap)
 *
 * SNAP RHYTHM per face:
 *   0 → 40 vh   dwell — cube is fully locked on this face
 *   40 → 110 vh transition — slow smooth ease-in-out rotation to next face
 *   (repeat for each of the 5 transitions)
 *
 * CUBE SNAP PATH (6 states):
 *   0 Bottom  rotateX(-90) rotateY(  0)
 *   1 Front   rotateX(  0) rotateY(  0)
 *   2 Right   rotateX(  0) rotateY( -90)
 *   3 Back    rotateX(  0) rotateY(-180)
 *   4 Left    rotateX(  0) rotateY(-270)
 *   5 Top     rotateX( 90) rotateY(-360)
 */

const FACES_CONTENT = [
  "We provide clear pathways to industry success.",
  "We groom learners to be leaders by showing how soft skills are applied with technical proficiency.",
  "We help industry solve for tomorrow while preparing learners for it.",
  "We help industry build the skills it needs, at scale.",
  "We continually drive change in industry and society.",
  "We show how education and innovation can lead to more sustainable outcomes.",
];

const SNAP_STATES = [
  { x:  -90, y:    0 },
  { x:    0, y:    0 },
  { x:    0, y:  -90 },
  { x:    0, y: -180 },
  { x:    0, y: -270 },
  { x:   90, y: -360 },
];

function smoothStep(t: number): number {
  return t * t * (3 - 2 * t);
}

interface CubeFaceProps {
  text:      string;
  size:      number;
  transform: string;
}

function CubeFace({ text, size, transform }: CubeFaceProps) {
  return (
    <div
      style={{
        position:           "absolute",
        width:              `${size}px`,
        height:             `${size}px`,
        transform,
        backfaceVisibility: "hidden",
        backgroundColor:    "#BB3308",
        padding:            "40px 24px 0 24px",
        boxSizing:          "border-box",
        display:            "flex",
        alignItems:         "flex-start",
      }}
    >
      <p
        style={{
          fontFamily:    "'Brasil', Georgia, serif",
          fontWeight:    500,
          fontSize:      "48px",
          lineHeight:    "52px",
          letterSpacing: "-0.03em",
          color:         "#FFFFFF",
          margin:        0,
        }}
      >
        {text}
      </p>
    </div>
  );
}

export default function BPRotatingCube() {
  const isMobile   = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);

  const [xRot,          setXRot]          = useState(SNAP_STATES[0].x);
  const [yRot,          setYRot]          = useState(SNAP_STATES[0].y);
  const [titleOpacity,  setTitleOpacity]  = useState(1);
  const [cubeOpacity,   setCubeOpacity]   = useState(0);
  const [revealedLines, setRevealedLines] = useState(0);

  /* Scroll driver — title opacity, cube opacity, cube rotation */
  const onScroll = React.useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect      = section.getBoundingClientRect();
    const scrolled  = Math.max(0, -rect.top);
    const maxScroll = section.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const vh = window.innerHeight;

    const LINE_THRESHOLDS = [0.12, 0.38, 0.62];
    setRevealedLines(LINE_THRESHOLDS.filter(f => scrolled >= f * vh).length);

    const tFade = Math.max(0, Math.min(1, (scrolled - vh * 1.5) / (vh * 0.5)));
    setTitleOpacity(1 - tFade);
    setCubeOpacity(tFade);

    const cubeScrolled = Math.max(0, scrolled - vh * 2);
    const DWELL = vh * 0.4;
    const TRANS = vh * 0.7;
    const PERIOD = DWELL + TRANS;
    const totalSteps = SNAP_STATES.length - 1;

    let newX: number, newY: number;
    if (cubeScrolled >= totalSteps * PERIOD) {
      newX = SNAP_STATES[totalSteps].x;
      newY = SNAP_STATES[totalSteps].y;
    } else {
      const faceIdx  = Math.floor(cubeScrolled / PERIOD);
      const inPeriod = cubeScrolled - faceIdx * PERIOD;
      if (inPeriod <= DWELL) {
        newX = SNAP_STATES[faceIdx].x;
        newY = SNAP_STATES[faceIdx].y;
      } else {
        const ease = smoothStep(Math.min(1, (inPeriod - DWELL) / TRANS));
        newX = SNAP_STATES[faceIdx].x + (SNAP_STATES[faceIdx + 1].x - SNAP_STATES[faceIdx].x) * ease;
        newY = SNAP_STATES[faceIdx].y + (SNAP_STATES[faceIdx + 1].y - SNAP_STATES[faceIdx].y) * ease;
      }
    }
    setXRot(newX);
    setYRot(newY);
  }, []);

  const zoomed = typeof document !== 'undefined' ? document.getElementById('zoomedContent') : null;
  useScrollWhenVisible(sectionRef, onScroll, zoomed ?? undefined);

  /* ── Mobile — vertical card stack with title header ── */
  if (isMobile) {
    return (
      <section style={{ backgroundColor: "#000000", padding: "64px 24px", boxSizing: "border-box" }}>
        <p
          style={{
            fontFamily:    "'Brasil', Georgia, serif",
            fontWeight:    500,
            fontSize:      "26px",
            lineHeight:    "36px",
            letterSpacing: "-0.03em",
            color:         "#FFFFFF",
            margin:        "0 0 40px 0",
            textAlign:     "center",
          }}
        >
          Introducing our<br />communication pillars.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {FACES_CONTENT.map((text, i) => (
            <div key={i} style={{ backgroundColor: "#BB3308", padding: "32px 24px" }}>
              <p
                style={{
                  fontFamily:    "'Brasil', Georgia, serif",
                  fontWeight:    500,
                  fontSize:      "28px",
                  lineHeight:    "36px",
                  letterSpacing: "-0.03em",
                  color:         "#FFFFFF",
                  margin:        0,
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ── Desktop ── */
  const size = 512;
  const half = size / 2;

  const faceTransforms = [
    `rotateX(90deg) translateZ(${half}px)`,
    `translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];

  return (
    <section
      ref={sectionRef}
      style={{ height: "930vh" }}
    >
      <div
        style={{
          position:        "sticky",
          top:             0,
          height:          "100vh",
          backgroundColor: "#000000",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          overflow:        "hidden",
        }}
      >
        {/* ── Phase 1: Title ── */}
        <div
          style={{
            position:       "absolute",
            inset:          0,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            padding:        "0 128px",
            boxSizing:      "border-box",
            opacity:        titleOpacity,
            pointerEvents:  "none",
          }}
        >
          <p
            style={{
              fontFamily:    "'Brasil', Georgia, serif",
              fontWeight:    500,
              fontSize:      "72px",
              lineHeight:    "72px",
              letterSpacing: "-0.03em",
              color:         "#FFFFFF",
              margin:        0,
              textAlign:     "center",
            }}
          >
            {["Introducing our", "communication pillars."].map((line, i) => (
              <span
                key={i}
                style={{
                  display:    "block",
                  opacity:    revealedLines > i ? 1 : 0,
                  transform:  `translateY(${revealedLines > i ? 0 : 28}px)`,
                  transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {line}
              </span>
            ))}
          </p>
        </div>

        {/* ── Phase 2: Cube ── */}
        <div
          style={{
            opacity:    cubeOpacity,
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            style={{
              perspective:       "1536px",
              perspectiveOrigin: "50% 50%",
              width:             `${size}px`,
              height:            `${size}px`,
            }}
          >
            <div
              style={{
                width:          `${size}px`,
                height:         `${size}px`,
                position:       "relative",
                transformStyle: "preserve-3d",
                transform:      `rotateX(${xRot}deg) rotateY(${yRot}deg)`,
                transition:     "transform 0.25s ease-out",
              }}
            >
              {FACES_CONTENT.map((text, i) => (
                <CubeFace
                  key={i}
                  text={text}
                  size={size}
                  transform={faceTransforms[i]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

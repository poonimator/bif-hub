'use client'
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import LoopingVideo from "../LoopingVideo";

/**
 * BPHumanAbundanceHero — full-bleed mountains cinemagraph hero with the centred
 * "Human Abundance" script mark. The video loops via a long crossfade dissolve.
 *
 * Source: Figma node 105:7 (BIF-27, "Human Abundance"), frame 1440×794.
 */
export default function BPHumanAbundanceHero() {
  const isMobile = useIsMobile();

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1920 / 1038", // matches the video exactly so nothing clips
        overflow: "hidden",
        backgroundColor: "#0e0e0a",
      }}
    >
      {/* Mountains cinemagraph — crossfade loop (long, gentle dissolve) over the
          high-res still as poster/fallback */}
      <LoopingVideo
        src="/videos/human-abundance.mp4?v=3"
        poster="/images/human-abundance-bg.webp?v=3"
        playbackRate={0.5}
        crossfadeSeconds={3}
        style={{ objectPosition: "center", zIndex: 1 }}
      />

      {/* Centred "Human Abundance" script mark */}
      <img
        src="/images/human-abundance-logo.webp?v=2"
        alt="Human Abundance"
        style={{
          position: "absolute",
          left: "50%",
          top: isMobile ? "20%" : "23%",
          transform: "translateX(-50%)",
          width: isMobile ? "56%" : "21.5%",
          height: "auto",
          zIndex: 2,
        }}
      />
    </section>
  );
}

'use client'
import React from "react";
import BPHero from "./BPHero";
import BPHumanAbundanceHero from "./BPHumanAbundanceHero";
import BPWhatWeStandFor from "./BPWhatWeStandFor";
import BPTypefaceHeader from "./BPTypefaceHeader";
import BPTypefaceSpecimen from "./BPTypefaceSpecimen";
import BPTypefaceCarousel from "./BPTypefaceCarousel";
import BPImpactHero from "./BPImpactHero";
import BPColourMosaic from "./BPColourMosaic";
import BPChineseTypefaceHeader from "./BPChineseTypefaceHeader";
import BPChineseTypefaceSpecimen from "./BPChineseTypefaceSpecimen";
import BPInsitu from "./BPInsitu";
import PageReveal from "../PageReveal";

/**
 * BrandPlaybookClient — the brand playbook page (hero, typeface showcase,
 * colour system, in-situ mockups). The interactive type tester lives in
 * BPTypefaceCarousel.
 */
export default function BrandPlaybookClient() {
  return (
    <main
      style={{
        fontFamily: "'Public Sans', system-ui, sans-serif",
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: "hidden",
      }}
    >
      <PageReveal current="brand">
      {/* ── Section 1: Hero ── */}
      <BPHero />

      {/* ── Section 2: Human Abundance hero — mountains + script mark ── */}
      <BPHumanAbundanceHero />

      {/* ── Section 3: What We Stand For ── */}
      <BPWhatWeStandFor />

      {/* ── Section 4: Typeface Header ── */}
      <BPTypefaceHeader />

      {/* ── Section 5: Typeface Specimen — giant "Aa01" ── */}
      <BPTypefaceSpecimen />

      {/* ── Section 6: Public Sans Typeface Header ── */}
      <BPChineseTypefaceHeader />

      {/* ── Section 7: Public Sans Specimen — four alphanumerics, full width ── */}
      <BPChineseTypefaceSpecimen />

      {/* ── Type tester — toggle Brasil / Space Grotesk / DM Mono, weight + download ── */}
      <BPTypefaceCarousel />

      {/* ── Section 10: Impact Hero — "Built by industry, made for impact" ── */}
      <BPImpactHero />

      {/* ── Colour System — BIF mosaic (swatches + Bhutan imagery) ── */}
      <BPColourMosaic />

      {/* ── In-situ mockup — day → night on scroll ── */}
      <BPInsitu />
      </PageReveal>
    </main>
  );
}

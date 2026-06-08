'use client'
import React, { useState } from "react";
import BPHero from "./BPHero";
import BPHumanAbundanceHero from "./BPHumanAbundanceHero";
import BPWhatWeStandFor from "./BPWhatWeStandFor";
import BPTypefaceHeader from "./BPTypefaceHeader";
import BPTypefaceSpecimen from "./BPTypefaceSpecimen";
import BPFontWeightBar from "./BPFontWeightBar";
import BPTypefaceCarousel from "./BPTypefaceCarousel";
import BPImpactHero from "./BPImpactHero";
import BPColourMosaic from "./BPColourMosaic";
import BPChineseTypefaceHeader from "./BPChineseTypefaceHeader";
import BPChineseTypefaceSpecimen from "./BPChineseTypefaceSpecimen";
import BPInsitu from "./BPInsitu";
import PageReveal from "../PageReveal";

/**
 * BrandPlaybookClient — wrapper that owns lifted state for the brand playbook page.
 *
 * sansFontWeight, monoFontWeight, and activeTypeface are lifted here so that
 * BPFontWeightBar (the slider) and BPTypefaceCarousel share a single source of truth.
 *
 * Used with client:load in brand.astro.
 */
export default function BrandPlaybookClient() {
  /* Default 500 (Medium) matches the Figma character set specimen weight */
  const [sansFontWeight, setSansFontWeight] = useState(500);
  const [monoFontWeight, setMonoFontWeight] = useState(400);
  const [publicFontWeight, setPublicFontWeight] = useState(400);
  const [activeTypeface, setActiveTypeface] = useState<"sans" | "mono" | "public">("sans");

  return (
    <main
      style={{
        fontFamily: "'Public Sans', system-ui, sans-serif",
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
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

      {/* ── Section 8: Font Weight Slider + Download Button ── */}
      <BPFontWeightBar
        weight={sansFontWeight}
        onWeightChange={setSansFontWeight}
        monoWeight={monoFontWeight}
        onMonoWeightChange={setMonoFontWeight}
        publicWeight={publicFontWeight}
        onPublicWeightChange={setPublicFontWeight}
        activeTypeface={activeTypeface}
      />

      {/* ── Section 9: Typeface Carousel — Brasil / Space Mono / Public Sans ── */}
      <BPTypefaceCarousel
        fontWeight={sansFontWeight}
        monoFontWeight={monoFontWeight}
        publicFontWeight={publicFontWeight}
        activeTypeface={activeTypeface}
        onTypefaceChange={setActiveTypeface}
      />

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

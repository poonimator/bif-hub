'use client'
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * BPPhoneMockup — Full-width phone mockup section
 *
 * Source: Figma node 167:976 (Magic file, Brand page)
 * Size: 1512×885px
 *
 * Background: AI-generated image of a hand holding a phone displaying
 * an Instagram story ("Your direct line to industry.") on a light grey bg.
 *
 * Overlay: SIT logo mark (18×17px) with cream ellipse backing (30×37px)
 * at absolute position x=606, y=161 within the 1512×885 section.
 */

export default function BPPhoneMockup() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <section style={{ width: "100%", position: "relative", height: 480, overflow: "hidden" }}>
        <img
          src="/images/brand-playbook/bp-phone-mockup.jpg"
          alt="SIT Instagram story — Your direct line to industry"
          style={{
            position:   "absolute",
            inset:      0,
            width:      "100%",
            height:     "100%",
            objectFit:  "cover",
            objectPosition: "center center",
          }}
        />
      </section>
    );
  }

  return (
    <section
      style={{
        width:    "100%",
        height:   "885px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background — phone mockup on light grey */}
      <img
        src="/images/brand-playbook/bp-phone-mockup.jpg"
        alt="SIT Instagram story — Your direct line to industry"
        style={{
          position:       "absolute",
          inset:          0,
          width:          "100%",
          height:         "100%",
          objectFit:      "cover",
          objectPosition: "center center",
        }}
      />

      {/* SIT logo mark overlay */}
      {/* Cream ellipse backing: x=606, y=161, 30×37px */}
      <div
        style={{
          position:     "absolute",
          left:         "606px",
          top:          "161px",
          width:        "30px",
          height:       "37px",
          borderRadius: "50%",
          backgroundColor: "#F8F3F2",
          pointerEvents: "none",
        }}
      />

      {/* SIT logo mark: x=609, y=172, 18×17px */}
      <img
        src="/images/brand-playbook/bp-sit-mark.png"
        alt=""
        style={{
          position:     "absolute",
          left:         "609px",
          top:          "172px",
          width:        "18px",
          height:       "17px",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}

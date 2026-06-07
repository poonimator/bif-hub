'use client'
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

export default function BPInstagramShowcase() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <section style={{ width: "100%" }}>
        <img
          src="/images/brand-playbook/ig_black.png"
          alt="Instagram post — dark"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <img
          src="/images/brand-playbook/ig_red.png"
          alt="Instagram post — red"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </section>
    );
  }

  return (
    <section
      style={{
        width:   "100%",
        display: "flex",
      }}
    >
      <img
        src="/images/brand-playbook/ig_black.png"
        alt="Instagram post — dark"
        style={{ width: "756px", height: "865px", display: "block", flexShrink: 0 }}
      />
      <img
        src="/images/brand-playbook/ig_red.png"
        alt="Instagram post — red"
        style={{ width: "756px", height: "865px", display: "block", flexShrink: 0 }}
      />
    </section>
  );
}

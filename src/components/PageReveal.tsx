'use client'
import React from "react";
import Footer, { type FooterSection } from "./Footer";

/**
 * PageReveal — wraps page content above a sticky footer. The content sits on a
 * higher layer and scrolls up over the footer (which is pinned to the bottom),
 * uncovering it. The last content section should carry rounded bottom corners
 * (so it reads as a card lifting off the footer).
 */
export default function PageReveal({ current, children }: { current: FooterSection; children: React.ReactNode }) {
  return (
    <>
      {/* Dark backing (#16150F) so the rounded bottom corners of the last
          section reveal the footer colour, not the white page behind it. Every
          section sets its own opaque background, so this only shows at the
          corner notches. */}
      <div style={{ position: "relative", zIndex: 2, backgroundColor: "#16150F" }}>{children}</div>
      <Footer current={current} />
    </>
  )
}

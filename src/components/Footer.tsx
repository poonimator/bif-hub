'use client'
import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import LoopingVideo from "./LoopingVideo";
import ZoomShell from "./ZoomShell";
import { useIsMobile } from "../hooks/useIsMobile";
import { WEBSITE_URL } from "@/lib/links";

export type FooterSection = "website" | "vision" | "brand" | "tools";

// Loaded on demand (and breaks the PageReveal → Footer → Section import cycle).
const VisionSection = dynamic(() => import("./sections/VisionSection"));
const BrandSection = dynamic(() => import("./sections/BrandSection"));
const ToolsSection = dynamic(() => import("./sections/ToolsSection"));

const SECTION_CONTENT: Partial<Record<FooterSection, React.ReactNode>> = {
  vision: <VisionSection />,
  brand: <BrandSection />,
  tools: <ToolsSection />,
};

// Top background of each section — match it so the slide has no colour flash.
const SECTION_BG: Record<FooterSection, string> = {
  website: "#16150F",
  vision: "#0e0e0a",
  brand: "#FFFFFF",
  tools: "#16150F",
};

const SECTIONS: Record<FooterSection, { label: string; poster: string; video?: string; objectPosition?: string }> = {
  website: { label: "Website", poster: "/website.webp", video: "/website-card.mp4" },
  vision: { label: "Vision", poster: "/vision.webp", video: "/vision-card.mp4" },
  brand: { label: "Brand", poster: "/brand.webp", video: "/brand-card.mp4" },
  tools: { label: "LOOM", poster: "/loom.jpg", objectPosition: "center 30%" },
}

const ORDER: FooterSection[] = ["website", "vision", "brand", "tools"]
const BLURB =
  "Bhutan Innovation Festival convenes the world's builders for three days in the Himalayas — defining the societal operating system for an intelligent age, where mindful societies, intelligent economies and regenerative systems create human abundance."
const MONO = "'Space Mono', 'Courier New', monospace"
const EASE = [0.16, 1, 0.3, 1] as const

export default function Footer({ current }: { current: FooterSection }) {
  const isMobile = useIsMobile()
  const others = ORDER.filter((s) => s !== current)

  // Open a section as a full-screen layer that SLIDES UP from below; closing
  // SLIDES it back DOWN, uncovering the page beneath. (framer-motion drives
  // this on the main thread, so it stays reliable everywhere the footer lives —
  // routes and in-place ZoomShell overlays alike.)
  const [activeSection, setActiveSection] = useState<FooterSection | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const openCard = useCallback((section: FooterSection) => {
    // Website opens the standalone marketing site in a new tab — same as the hub.
    if (section === "website") {
      window.open(WEBSITE_URL, "_blank", "noopener,noreferrer")
      return
    }
    setIsFullscreen(false)
    setActiveSection(section)
  }, [])

  const closeSection = useCallback(() => {
    setActiveSection(null)
    setIsFullscreen(false)
  }, [])

  const card = activeSection ? SECTIONS[activeSection] : null
  const labelEdge = isFullscreen ? 0 : 32

  return (
    <footer style={{ backgroundColor: "#16150F", color: "#FFFFFF", width: "100%", position: "sticky", bottom: 0, zIndex: 0 }}>
      {/* Footer content — fades out while a section is open */}
      <div
        style={{
          maxWidth: 1512,
          margin: "0 auto",
          boxSizing: "border-box",
          padding: isMobile ? "64px 24px 88px" : "96px 64px 112px",
          opacity: activeSection ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "flex-start",
            gap: isMobile ? 40 : 80,
          }}
        >
          <p style={{ margin: 0, fontFamily: MONO, fontSize: isMobile ? 12 : 14, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", maxWidth: isMobile ? "100%" : 520 }}>
            {BLURB}
          </p>

          <div style={{ display: "flex", flexDirection: "row", gap: 12, flexShrink: 0 }}>
            {others.map((s) => (
              <div
                key={s}
                role="button"
                tabIndex={0}
                aria-label={`Open ${SECTIONS[s].label}`}
                onClick={() => openCard(s)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCard(s) } }}
                style={{
                  position: "relative",
                  width: isMobile ? "calc((100vw - 48px - 24px) / 3)" : 200,
                  aspectRatio: "260 / 180",
                  borderRadius: 6,
                  overflow: "hidden",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                className="bif-footer-card"
              >
                <img src={SECTIONS[s].poster} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: SECTIONS[s].objectPosition ?? "top", zIndex: 0 }} />
                {SECTIONS[s].video && <LoopingVideo src={SECTIONS[s].video!} playing={!activeSection} style={{ zIndex: 1 }} />}
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)" }} />
                <span style={{ position: "absolute", bottom: 10, left: 12, zIndex: 3, fontFamily: "'Brasil', Georgia, serif", fontWeight: 500, fontSize: 15, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                  {SECTIONS[s].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section layer — slides up on open, down on close */}
      <AnimatePresence>
        {activeSection && card && (
          <motion.div
            key={activeSection}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 101,
              overflow: "hidden",
              isolation: "isolate",
              background: SECTION_BG[activeSection],
              willChange: "transform",
            }}
          >
            {/* Hero — section poster/video fills the top of the layer */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
              {card.poster && (
                <img src={card.poster} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: card.objectPosition ?? "top", zIndex: 0 }} />
              )}
              {card.video && (
                <LoopingVideo src={card.video} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
              )}
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)" }} />
              <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom: labelEdge, zIndex: 3, transition: "bottom 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                <span className="absolute bottom-0 left-0 font-display font-medium leading-none" style={{ color: "#FFFFFF", padding: 14, fontSize: 18, textTransform: "uppercase" }}>
                  {card.label}
                </span>
              </div>
            </div>

            <ZoomShell
              sectionId={activeSection}
              onClose={closeSection}
              onScrolled={setIsFullscreen}
              sectionBg={SECTION_BG[activeSection]}
            >
              {SECTION_CONTENT[activeSection]}
            </ZoomShell>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}

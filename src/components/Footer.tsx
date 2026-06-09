'use client'
import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
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

// Top background of each section — match it so the zoom has no colour flash.
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

interface FlyingRect { top: number; left: number; width: number; height: number; vw: number; vh: number }

export default function Footer({ current }: { current: FooterSection }) {
  const isMobile = useIsMobile()
  const others = ORDER.filter((s) => s !== current)

  // Hub-style open: fly the card to fullscreen and reveal the section in a
  // ZoomShell overlay — identical interaction to the main hub home grid.
  const [activeSection, setActiveSection] = useState<FooterSection | null>(null)
  const [flyingRect, setFlyingRect] = useState<FlyingRect | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const openCard = useCallback((section: FooterSection, el: HTMLElement) => {
    // Website opens the standalone marketing site in a new tab — same as the hub.
    if (section === "website") {
      window.open(WEBSITE_URL, "_blank", "noopener,noreferrer")
      return
    }
    const r = el.getBoundingClientRect()
    setFlyingRect({ top: r.top, left: r.left, width: r.width, height: r.height, vw: window.innerWidth, vh: window.innerHeight })
    setActiveSection(section)
    requestAnimationFrame(() => requestAnimationFrame(() => setIsZoomed(true)))
  }, [])

  const closeSection = useCallback(() => {
    setIsClosing(true)
    setIsZoomed(false)
    setIsFullscreen(false)
    setTimeout(() => {
      setActiveSection(null)
      setFlyingRect(null)
      setIsClosing(false)
    }, 650)
  }, [])

  const card = activeSection ? SECTIONS[activeSection] : null
  const heroScale = flyingRect ? Math.max(flyingRect.width / flyingRect.vw, flyingRect.height / flyingRect.vh) : 1
  const inv = 1 / heroScale
  const cardCx = flyingRect ? flyingRect.left + flyingRect.width / 2 : 0
  const cardCy = flyingRect ? flyingRect.top + flyingRect.height / 2 : 0
  const labelEdge = isFullscreen ? 0 : 32

  const clip = flyingRect
    ? isClosing
      ? "inset(0px round 0px)"
      : !isZoomed
        ? `inset(${flyingRect.top}px ${flyingRect.vw - flyingRect.left - flyingRect.width}px ${flyingRect.vh - flyingRect.top - flyingRect.height}px ${flyingRect.left}px round 4px)`
        : isFullscreen
          ? "inset(0px round 0px)"
          : "inset(32px round 22px)"
    : "none"

  const flyingStyle: React.CSSProperties = flyingRect
    ? {
        position: "fixed", zIndex: 101, overflow: "hidden", isolation: "isolate",
        top: 0, left: 0, width: "100vw", height: "100vh",
        background: activeSection ? SECTION_BG[activeSection] : "transparent",
        clipPath: clip, WebkitClipPath: clip,
        transform: isClosing ? "translateY(100vh)" : "none",
        transition: isClosing
          ? "transform 0.5s cubic-bezier(0.4,0,1,1)"
          : "clip-path 0.6s cubic-bezier(0.16,1,0.3,1), -webkit-clip-path 0.6s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: isZoomed ? "all" : "none",
      }
    : {}

  const heroWrapStyle: React.CSSProperties = {
    position: "absolute", inset: 0, zIndex: 0,
    transform: `scale(${(isZoomed || isClosing) ? 1 : heroScale})`,
    transformOrigin: `${cardCx}px ${cardCy}px`,
    transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
    willChange: "transform",
  }

  return (
    <footer style={{ backgroundColor: "#16150F", color: "#FFFFFF", width: "100%", position: "sticky", bottom: 0, zIndex: 0 }}>
      {/* Footer content — fades out when a card is expanding */}
      <div
        style={{
          maxWidth: 1512,
          margin: "0 auto",
          boxSizing: "border-box",
          padding: isMobile ? "64px 24px 88px" : "96px 64px 112px",
          opacity: (activeSection && !isClosing) ? 0 : 1,
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
                onClick={(e) => openCard(s, e.currentTarget)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCard(s, e.currentTarget) } }}
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

      {/* Dark overlay behind the zoom (hides the page outside the clip window) */}
      {flyingRect && (
        <div
          aria-hidden="true"
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "#16150F", pointerEvents: "none", opacity: isZoomed ? 1 : 0, transition: "opacity 0.5s ease" }}
        />
      )}

      {/* Flying screen — card grows to full viewport, then the section reveals */}
      {flyingRect && activeSection && (
        <div style={flyingStyle}>
          <div style={heroWrapStyle}>
            {card?.poster && (
              <img src={card.poster} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: card.objectPosition ?? "top", zIndex: 0 }} />
            )}
            {card?.video && (
              <LoopingVideo src={card.video} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} />
            )}
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)" }} />
            <div className="absolute left-0 right-0 pointer-events-none" style={{ bottom: labelEdge, zIndex: 3, transition: "bottom 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
              {card?.label && (
                <span className="absolute bottom-0 left-0 font-display font-medium leading-none" style={{ color: "#FFFFFF", padding: 14 * inv, fontSize: 18 * inv, textTransform: "uppercase" }}>
                  {card.label}
                </span>
              )}
            </div>
          </div>

          {isZoomed && (
            <ZoomShell
              sectionId={activeSection}
              onClose={closeSection}
              onScrolled={setIsFullscreen}
              sectionBg={SECTION_BG[activeSection]}
            >
              {SECTION_CONTENT[activeSection]}
            </ZoomShell>
          )}
        </div>
      )}
    </footer>
  )
}

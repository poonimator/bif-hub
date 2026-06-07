'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoopingVideo from "./LoopingVideo";
import { useIsMobile } from "../hooks/useIsMobile";
import { WEBSITE_URL } from "@/lib/links";

export type FooterSection = "website" | "vision" | "brand" | "tools";

const SECTIONS: Record<FooterSection, { label: string; href: string; poster: string; video: string }> = {
  website: { label: "Website", href: "/website", poster: "/website.webp", video: "/website-card.mp4" },
  vision: { label: "Vision", href: "/vision", poster: "/vision.webp", video: "/vision-card.mp4" },
  brand: { label: "Brand", href: "/brand", poster: "/brand.webp", video: "/brand-card.mp4" },
  tools: { label: "Tools", href: "/tools", poster: "/tools.webp", video: "/tools-card.mp4" },
}

const ORDER: FooterSection[] = ["website", "vision", "brand", "tools"]
const BLURB =
  "Bhutan Innovation Festival convenes the world's builders for three days in the Himalayas — defining the societal operating system for an intelligent age, where mindful societies, intelligent economies and regenerative systems create human abundance."
const MONO = "'Space Mono', 'Courier New', monospace"

interface Flying { section: FooterSection; rect: { top: number; left: number; width: number; height: number } }

export default function Footer({ current }: { current: FooterSection }) {
  const isMobile = useIsMobile()
  const router = useRouter()
  const others = ORDER.filter((s) => s !== current)
  const [flying, setFlying] = useState<Flying | null>(null)
  const [expanded, setExpanded] = useState(false)

  function openCard(section: FooterSection, el: HTMLElement) {
    // The Website card opens the standalone marketing site in a new tab, just
    // like the homepage — no internal route, no flying animation.
    if (section === "website") {
      window.open(WEBSITE_URL, "_blank", "noopener,noreferrer")
      return
    }
    const r = el.getBoundingClientRect()
    setFlying({ section, rect: { top: r.top, left: r.left, width: r.width, height: r.height } })
    requestAnimationFrame(() => requestAnimationFrame(() => setExpanded(true)))
    // navigate once the grow has played
    setTimeout(() => router.push(SECTIONS[section].href), 700)
  }

  return (
    <footer style={{ backgroundColor: "#16150F", color: "#FFFFFF", width: "100%", position: "sticky", bottom: 0, zIndex: 0 }}>
      {/* Footer content — fades out when a card is expanding */}
      <div
        style={{
          maxWidth: 1512,
          margin: "0 auto",
          boxSizing: "border-box",
          padding: isMobile ? "64px 24px 32px" : "96px 64px 32px",
          opacity: flying ? 0 : 1,
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
                <img src={SECTIONS[s].poster} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", zIndex: 0 }} />
                <LoopingVideo src={SECTIONS[s].video} style={{ zIndex: 1 }} />
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)" }} />
                <span style={{ position: "absolute", bottom: 10, left: 12, zIndex: 3, fontFamily: "'Brasil', Georgia, serif", fontWeight: 500, fontSize: 15, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                  {SECTIONS[s].label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.12)", margin: isMobile ? "40px 0 24px" : "56px 0 24px" }} />

        {/* Credit — centred and sat on the same baseline (44px tall, 32px from
            the bottom) as the fixed Ask Rigpai / Agent Mode buttons. */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 44 }}>
          <a
            href="https://www.aleph-labs.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s", textAlign: "center" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
          >
            Designed &amp; Engineered by Aleph Labs
          </a>
        </div>
      </div>

      {/* Flying card — grows from its footer position to fullscreen, then navigates */}
      {flying && (
        <div
          style={{
            position: "fixed",
            zIndex: 400,
            overflow: "hidden",
            top: expanded ? 0 : flying.rect.top,
            left: expanded ? 0 : flying.rect.left,
            width: expanded ? "100vw" : flying.rect.width,
            height: expanded ? "100vh" : flying.rect.height,
            borderRadius: expanded ? 0 : 6,
            background: "#1a1813",
            transition: "top 0.65s cubic-bezier(0.16,1,0.3,1), left 0.65s cubic-bezier(0.16,1,0.3,1), width 0.65s cubic-bezier(0.16,1,0.3,1), height 0.65s cubic-bezier(0.16,1,0.3,1), border-radius 0.65s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <img src={SECTIONS[flying.section].poster} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", zIndex: 0 }} />
          <LoopingVideo src={SECTIONS[flying.section].video} style={{ zIndex: 1 }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)" }} />
        </div>
      )}
    </footer>
  )
}

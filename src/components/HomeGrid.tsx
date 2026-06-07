'use client';

import { useState, useCallback, useEffect } from 'react';
import SectionCard, { type SectionId } from './SectionCard';
import ZoomShell from './ZoomShell';
import LoopingVideo from './LoopingVideo';
import SectionAgentOverlay from './SectionAgentOverlay';
import { SECTION_FOLDER } from '@/lib/kb';
import { AnimatePresence } from 'framer-motion';
import WebsiteSection from './sections/WebsiteSection';
import VisionSection from './sections/VisionSection';
import BrandSection from './sections/BrandSection';
import ToolsSection from './sections/ToolsSection';
import { WEBSITE_URL } from '@/lib/links';

interface CardConfig {
  id: SectionId;
  label: string;
  bg: string;
  textColor: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  icon?: string;
  iconSize?: number;
  centerLabel?: boolean;
  labelPosition?: 'left' | 'right';
  labelLeft?: string;
  labelRight?: string;
  comingSoon?: boolean;
  href?: string;
}

const CARDS: CardConfig[] = [
  { id: 'website', label: '', bg: '#1a1813', textColor: '#ffffff', backgroundImage: '/website.webp', backgroundVideo: '/website-card.mp4', icon: '/websitelogo.svg', iconSize: 48, href: WEBSITE_URL },
  { id: 'vision',  label: '', bg: '#1a1813', textColor: '#ffffff', backgroundImage: '/vision.webp', backgroundVideo: '/vision-card.mp4', labelLeft: 'Human', labelRight: 'Abundance' },
  { id: 'brand',   label: 'Brand', bg: '#1a1813', textColor: '#ffffff', backgroundImage: '/brand.webp',   backgroundVideo: '/brand-card.mp4',   centerLabel: true },
  { id: 'tools',   label: 'Tools', bg: '#1a1813', textColor: '#ffffff', backgroundImage: '/tools.webp',   backgroundVideo: '/tools-card.mp4',   centerLabel: true },
];

const SECTION_CONTENT: Record<SectionId, React.ReactNode> = {
  website: <WebsiteSection />,
  vision:  <VisionSection />,
  brand:   <BrandSection />,
  tools:   <ToolsSection />,
};

// Flying-card background shown during the zoom, before section content covers
// it. Match each section's own top background to avoid a colour flash.
const SECTION_BG: Record<SectionId, string> = {
  website: '#16150F', // links out; never actually zooms
  vision:  '#FFFFFF', // placeholder content is light
  brand:   '#FFFFFF', // brand playbook is light
  tools:   '#16150F', // tools content is dark (nightfall)
};

interface FlyingRect {
  top: number;
  left: number;
  width: number;
  height: number;
  vw: number;
  vh: number;
}

interface HomeGridProps {
  isAgent?: boolean;
  onSectionChange?: (section: SectionId | null) => void;
}

export default function HomeGrid({ isAgent = false, onSectionChange }: HomeGridProps) {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [activeCard, setActiveCard] = useState<CardConfig | null>(null);
  const [flyingRect, setFlyingRect] = useState<FlyingRect | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Tell the parent which section is open so it can keep rendering this view
  // (with the agent overlay) and feed the active section to the chat.
  useEffect(() => {
    onSectionChange?.(activeSection);
  }, [activeSection, onSectionChange]);

  const openSection = useCallback((id: SectionId, rect: DOMRect) => {
    const card = CARDS.find((c) => c.id === id) ?? null;
    setFlyingRect({
      top: rect.top, left: rect.left, width: rect.width, height: rect.height,
      vw: window.innerWidth, vh: window.innerHeight,
    });
    setActiveSection(id);
    setActiveCard(card);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsZoomed(true));
    });
  }, []);

  const closeSection = useCallback(() => {
    setIsClosing(true);
    setIsZoomed(false);
    setIsFullscreen(false);
    setTimeout(() => {
      setActiveSection(null);
      setActiveCard(null);
      setFlyingRect(null);
      setIsClosing(false);
    }, 650);
  }, []);

  // Two-stage motion:
  //  • OPEN (grid → padded): the hero ZOOMS up from card size via a transform
  //    scale, while the clip window opens from the card's rect to the padded card.
  //  • SCROLL (padded → fullscreen): the hero is already at full scale and stays
  //    put; only the clip window opens edge-to-edge, REVEALING more of the hero.
  const heroScale = flyingRect
    ? Math.max(flyingRect.width / flyingRect.vw, flyingRect.height / flyingRect.vh)
    : 1;
  // Labels live INSIDE heroWrap so they ride the same transform as the hero
  // (glued, no drift). Sized at homepageSize / heroScale so the transform
  // scales them down to the exact homepage size at the card. They anchor to
  // the card EDGE (bottom: 32 padded → 0 fullscreen) so they stay inside the
  // clipped window rather than the full-bleed hero bottom.
  const inv = 1 / heroScale;
  const labelEdge = isFullscreen ? 0 : 32;
  const cardCx = flyingRect ? flyingRect.left + flyingRect.width / 2 : 0;
  const cardCy = flyingRect ? flyingRect.top + flyingRect.height / 2 : 0;

  // Clip window: card rect (initial/closing) → padded card → fullscreen.
  const clip = flyingRect
    ? !isZoomed
      ? `inset(${flyingRect.top}px ${flyingRect.vw - flyingRect.left - flyingRect.width}px ${flyingRect.vh - flyingRect.top - flyingRect.height}px ${flyingRect.left}px round 4px)`
      : isFullscreen
        ? 'inset(0px round 0px)'
        : 'inset(32px round 22px)'
    : 'none';

  const flyingStyle: React.CSSProperties = flyingRect
    ? {
        position: 'fixed',
        zIndex: 101,
        overflow: 'hidden',
        isolation: 'isolate',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: activeSection ? SECTION_BG[activeSection] : 'transparent',
        clipPath: clip,
        WebkitClipPath: clip,
        transition: 'clip-path 0.6s cubic-bezier(0.16,1,0.3,1), -webkit-clip-path 0.6s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: isZoomed ? 'all' : 'none',
      }
    : {};

  // Hero wrapper: fullscreen, scales up from card size on open, static after.
  const heroWrapStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    transform: `scale(${isZoomed ? 1 : heroScale})`,
    transformOrigin: `${cardCx}px ${cardCy}px`,
    transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
    willChange: 'transform',
  };

  return (
    <>
      {/* ── Dark overlay ── */}
      <div
        className="fixed inset-0 z-50 bg-[#16150F] transition-opacity duration-500 pointer-events-none"
        style={{ opacity: isZoomed ? 1 : 0 }}
      />

      {/* ── Index view ── */}
      <div
        className="min-h-screen flex flex-col items-center justify-start px-10 transition-opacity duration-400"
        style={{ opacity: (activeSection && !isClosing) ? 0 : 1, paddingTop: '256px' }}
      >
        <div className="flex flex-wrap gap-5 w-full max-w-[1200px] justify-center">
          {CARDS.map((card) => (
            <SectionCard
              key={card.id}
              id={card.id}
              label={card.label}
              bg={card.bg}
              textColor={card.textColor}
              onOpen={openSection}
              backgroundImage={card.backgroundImage}
              backgroundVideo={card.backgroundVideo}
              icon={card.icon}
              iconSize={card.iconSize}
              centerLabel={card.centerLabel}
              labelPosition={card.labelPosition}
              labelLeft={card.labelLeft}
              labelRight={card.labelRight}
              comingSoon={card.comingSoon}
              href={card.href}
            />
          ))}
        </div>
      </div>

      {/* ── Flying screen (animates card → full viewport) ── */}
      {flyingRect && activeSection && (
        <div style={flyingStyle} data-flying-bg="">{/* data-flying-bg: excluded from back-button bg sampling */}
          {/* Hero — full-size; zooms up from card size on open, static on scroll */}
          <div style={heroWrapStyle}>
            {activeCard?.backgroundImage && (
              <img
                src={activeCard.backgroundImage}
                alt=""
                aria-hidden="true"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', zIndex: 0 }}
              />
            )}
            {activeCard?.backgroundVideo && (
              <LoopingVideo
                src={activeCard.backgroundVideo}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
              />
            )}
            {/* Bottom vignette on hero */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 50%)',
              }}
            />

            {/* Logo / labels — glued to the hero transform, anchored to the
                card edge, sized to keep the homepage proportion */}
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{ bottom: labelEdge, zIndex: 3, transition: 'bottom 0.6s cubic-bezier(0.16,1,0.3,1)' }}
            >
              {activeCard?.icon && (
                <div className="absolute bottom-0 left-0" style={{ padding: 14 * inv }}>
                  <img src={activeCard.icon} alt="" aria-hidden="true" style={{ width: (activeCard.iconSize ?? 48) * inv, height: 'auto', mixBlendMode: 'lighten' }} />
                </div>
              )}
              {activeCard?.label && !activeCard.labelLeft && (
                <span
                  className={`absolute bottom-0 ${activeCard.labelPosition === 'right' ? 'right-0 text-right' : 'left-0'} font-display font-medium leading-none`}
                  style={{ color: activeCard.textColor, padding: 14 * inv, fontSize: 18 * inv, textTransform: 'uppercase' }}
                >
                  {activeCard.label}
                </span>
              )}
              {activeCard?.labelLeft && (
                <span
                  className="absolute bottom-0 left-0 font-display font-medium leading-none"
                  style={{ color: activeCard.textColor, padding: 14 * inv, fontSize: 18 * inv, textTransform: 'uppercase' }}
                >
                  {activeCard.labelLeft}
                </span>
              )}
              {activeCard?.labelRight && (
                <span
                  className="absolute bottom-0 right-0 font-display font-medium leading-none"
                  style={{ color: activeCard.textColor, padding: 14 * inv, fontSize: 18 * inv, textTransform: 'uppercase' }}
                >
                  {activeCard.labelRight}
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

      {/* Agent mode while a section is open: blur the page, show only that
          section's md files */}
      <AnimatePresence>
        {isAgent && activeSection && (
          <SectionAgentOverlay
            key="section-agent"
            folder={SECTION_FOLDER[activeSection]}
            title={activeSection}
          />
        )}
      </AnimatePresence>
    </>
  );
}

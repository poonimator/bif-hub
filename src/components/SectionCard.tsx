'use client';

import { useRef } from 'react';
import LoopingVideo from './LoopingVideo';

export type SectionId = 'website' | 'vision' | 'brand' | 'tools';

interface SectionCardProps {
  id: SectionId;
  label: string;
  bg: string;
  textColor: string;
  onOpen: (id: SectionId, rect: DOMRect) => void;
  cardRef?: React.RefObject<HTMLButtonElement | null>;
  backgroundImage?: string;
  backgroundVideo?: string;
  icon?: string;
  iconSize?: number;
  centerLabel?: boolean;
  labelPosition?: 'left' | 'right';
  labelLeft?: string;
  labelRight?: string;
  comingSoon?: boolean;
  /** If set, the card navigates to this URL instead of zooming into a section. */
  href?: string;
}

export default function SectionCard({
  id,
  label,
  bg,
  textColor,
  onOpen,
  cardRef,
  backgroundImage,
  backgroundVideo,
  icon,
  iconSize = 48,
  centerLabel = false,
  labelPosition = 'left',
  labelLeft,
  labelRight,
  comingSoon = false,
  href,
}: SectionCardProps) {
  const internalRef = useRef<HTMLButtonElement>(null);
  const ref = cardRef ?? internalRef;

  function handleClick() {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    const el = ref.current;
    if (!el) return;
    onOpen(id, el.getBoundingClientRect());
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      style={{ background: bg, color: textColor }}
      className="section-card group relative flex items-end justify-start overflow-hidden rounded-sm cursor-pointer transition-transform duration-300 hover:scale-[1.03] border-0 p-0"
      aria-label={href ? 'Enter the Bhutan Innovation Festival website' : `Open ${label || id} section`}
    >
      {/* Static image — always present as the base layer / poster */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none"
          style={{ zIndex: 0 }}
        />
      )}

      {/* Animated video — crossfades seamlessly at loop point */}
      {backgroundVideo && (
        <LoopingVideo src={backgroundVideo} style={{ zIndex: 1 }} />
      )}

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)',
        }}
      />

      {/* Icon — bottom left */}
      {icon && (
        <div className="absolute bottom-0 left-0 pointer-events-none" style={{ zIndex: 3, padding: 14}}>
          <img src={icon} alt="" aria-hidden="true" style={{ width: iconSize, height: 'auto', mixBlendMode: 'lighten' }} />
        </div>
      )}

      {/* Label — bottom left or right */}
      {label && (
        <span
          className={`absolute bottom-0 ${labelPosition === 'right' ? 'right-0 text-right' : 'left-0'} font-display font-medium text-lg leading-none pointer-events-none`}
          style={{ color: textColor, zIndex: 4, padding: 14, textTransform: 'uppercase' }}
        >
          {label}
        </span>
      )}

      {/* Split labels — one per corner */}
      {labelLeft && (
        <span
          className="absolute bottom-0 left-0 font-display font-medium text-lg leading-none pointer-events-none"
          style={{ color: textColor, zIndex: 4, padding: 14, textTransform: 'uppercase' }}
        >
          {labelLeft}
        </span>
      )}
      {labelRight && (
        <span
          className="absolute bottom-0 right-0 font-display font-medium text-lg leading-none pointer-events-none"
          style={{ color: textColor, zIndex: 4, padding: 14, textTransform: 'uppercase' }}
        >
          {labelRight}
        </span>
      )}

      {/* Coming soon — dark blur overlay on hover */}
      {comingSoon && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            zIndex: 5,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          <span className="t-label" style={{ color: '#FFFFFF' }}>Coming Soon</span>
        </div>
      )}

      {/* External link — subtle "enter site" affordance on hover */}
      {href && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            zIndex: 5,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        >
          <span className="t-ui" style={{ color: '#FFFFFF' }}>Enter site&nbsp;↗</span>
        </div>
      )}
    </button>
  );
}

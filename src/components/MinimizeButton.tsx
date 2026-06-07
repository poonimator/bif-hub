'use client';

import { ArrowLeft } from '@phosphor-icons/react';

interface MinimizeButtonProps {
  onClose: () => void;
  variant?: 'dark' | 'light';
  style?: React.CSSProperties;
}

export default function MinimizeButton({ onClose, variant = 'dark', style }: MinimizeButtonProps) {
  const bg = variant === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const stroke = variant === 'dark' ? '#ffffff' : '#000000';

  return (
    <button
      onClick={onClose}
      data-minimize=""
      className="w-11 h-11 flex items-center justify-center cursor-pointer border-0 hover:scale-110"
      style={{
        background: bg,
        position: 'fixed',
        zIndex: 200,
        transition: 'top 0.3s ease, left 0.3s ease, transform 0.3s ease',
        ...style,
      }}
      aria-label="Close section"
    >
      <ArrowLeft size={16} color={stroke} />
    </button>
  );
}

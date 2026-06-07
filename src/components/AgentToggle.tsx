'use client';

import { motion } from 'framer-motion';
import { Robot, User } from '@phosphor-icons/react';

const spring = { type: 'spring' as const, stiffness: 320, damping: 24, mass: 0.6 };

interface AgentToggleProps {
  isAgent: boolean;
  onToggle: () => void;
}

export default function AgentToggle({ isAgent, onToggle }: AgentToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      transition={spring}
      className="flex items-center cursor-pointer border-0 rounded-full font-mono text-[12px] tracking-[0.08em] whitespace-nowrap"
      style={{
        background: isAgent ? '#242017' : '#1A1813',
        color: isAgent ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
        padding: '14px 20px',
        height: 44,
        gap: 10,
      }}
      aria-label={isAgent ? 'Switch to human view' : 'Switch to agent view'}
    >
      {isAgent
        ? <User size={16} weight="regular" style={{ opacity: 0.8 }} />
        : <Robot size={16} weight="regular" style={{ opacity: 0.8 }} />}
      {isAgent ? 'Human Mode' : 'Agent Mode'}
    </motion.button>
  );
}

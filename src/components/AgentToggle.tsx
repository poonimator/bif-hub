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
      className="t-ui flex items-center cursor-pointer border-0 bg-transparent whitespace-nowrap"
      style={{
        color: isAgent ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)',
        padding: 0,
        height: 44,
        gap: 8,
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

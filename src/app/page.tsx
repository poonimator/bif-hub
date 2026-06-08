'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomeGrid from '@/components/HomeGrid';
import type { SectionId } from '@/components/SectionCard';
import AgentToggle from '@/components/AgentToggle';
import ChatBar, { type ChatMode } from '@/components/ChatBar';
import KBBrowser from '@/components/KBBrowser';

export default function Home() {
  const [chatMode, setChatMode] = useState<ChatMode>('idle');
  const [isAgent, setIsAgent] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  function toggleAgent() {
    const next = !isAgent;
    setIsAgent(next);
    document.documentElement.setAttribute('data-view-mode', next ? 'agent' : 'human');
  }

  // When a section is open, agent mode shows an in-section overlay (handled by
  // HomeGrid) rather than swapping to the full KB browser.
  const showKBBrowser = isAgent && !activeSection;

  return (
    <>
      {/* Small dragon mark — top left */}
      <a href="/" aria-label="Bhutan Innovation Festival Hub" className="fixed z-[300]" style={{ top: 28, left: 32, lineHeight: 0 }}>
        <img src="/bif-logo.svg" alt="" aria-hidden="true" style={{ width: 34, height: 34 }} />
      </a>

      <p
        className="t-label fixed pointer-events-none"
        style={{ color: 'rgba(255,255,255,0.4)', top: 192, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', zIndex: 10 }}
      >
        Bhutan Innovation Festival Hub
      </p>

      <AnimatePresence mode="wait">
        {showKBBrowser ? (
          <motion.div
            key="agent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <KBBrowser />
          </motion.div>
        ) : (
          <motion.div
            key="human"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <HomeGrid isAgent={isAgent} onSectionChange={setActiveSection} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ask Rigpai — bottom centre */}
      <div className="fixed z-[300]" style={{ bottom: 32, left: '50%', transform: 'translateX(-50%)' }}>
        <ChatBar mode={chatMode} setMode={setChatMode} section={activeSection} />
      </div>
      {/* Agent toggle — top right, plain symbol + text */}
      <div className="fixed z-[300]" style={{ top: 28, right: 32 }}>
        <AgentToggle isAgent={isAgent} onToggle={toggleAgent} />
      </div>
    </>
  );
}

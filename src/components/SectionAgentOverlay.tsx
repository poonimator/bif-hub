'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import KBWindow from './KBWindow';
import { SECTION_LEAD } from '@/lib/kb';
import { useKBDocuments } from '@/hooks/useKBDocuments';

interface OpenDoc { folder: string; slug: string }

interface SectionAgentOverlayProps {
  folder: string | null;
  title: string;
}

export default function SectionAgentOverlay({ folder, title }: SectionAgentOverlayProps) {
  const { byFolder, loaded } = useKBDocuments();
  const [openDocs, setOpenDocs] = useState<OpenDoc[]>([]);
  const openKeys = new Set(openDocs.map((d) => `${d.folder}/${d.slug}`));

  // Docs for this section's folder, with the canonical lead doc first.
  const lead = folder ? SECTION_LEAD[folder] : undefined;
  const docs = (folder ? byFolder[folder] ?? [] : []).slice().sort((a, b) => {
    if (lead) {
      if (a.slug === lead) return -1;
      if (b.slug === lead) return 1;
    }
    return 0;
  });

  function open(slug: string) {
    if (!folder) return;
    const key = `${folder}/${slug}`;
    setOpenDocs((prev) => (prev.some((d) => `${d.folder}/${d.slug}` === key) ? prev : [...prev, { folder, slug }]));
  }

  function close(key: string) {
    setOpenDocs((prev) => prev.filter((d) => `${d.folder}/${d.slug}` !== key));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 150,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        background: 'rgba(8, 7, 5, 0.55)',
      }}
    >
      <p className="font-mono text-[12px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>
        {folder ? `${folder}/` : title}
      </p>

      {docs.length === 0 ? (
        <p className="font-mono text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {loaded ? 'No documents yet for this section.' : 'Loading…'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          {docs.map((doc) => {
            const isOpen = openKeys.has(`${folder}/${doc.slug}`);
            return (
              <button
                key={doc.slug}
                onClick={() => open(doc.slug)}
                title={doc.description || doc.title}
                className="font-mono text-[13px] border-0 bg-transparent p-0 cursor-pointer"
                style={{
                  color: isOpen ? '#BB3308' : 'rgba(255,255,255,0.65)',
                  fontFamily: "'Space Mono', 'Courier New', monospace",
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = isOpen ? '#BB3308' : 'rgba(255,255,255,0.65)'; }}
              >
                {doc.slug}.md
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {openDocs.map((doc) => (
          <KBWindow
            key={`${doc.folder}/${doc.slug}`}
            folder={doc.folder}
            slug={doc.slug}
            onClose={() => close(`${doc.folder}/${doc.slug}`)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

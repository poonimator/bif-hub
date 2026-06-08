'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import KBWindow from './KBWindow';
import AssetGallery from './AssetGallery';
import { KB_BASE } from '@/lib/kb';
import { useKBDocuments } from '@/hooks/useKBDocuments';

interface OpenDoc { folder: string; slug: string; directUrl?: string }

function docKey(doc: OpenDoc) {
  return `${doc.folder}/${doc.slug}`;
}

export default function KBBrowser() {
  const { byFolder, folders } = useKBDocuments();
  const [openDocs, setOpenDocs] = useState<OpenDoc[]>([]);

  function open(folder: string, slug: string, directUrl?: string) {
    const key = `${folder}/${slug}`;
    setOpenDocs((prev) =>
      prev.some((d) => docKey(d) === key) ? prev : [...prev, { folder, slug, directUrl }]
    );
  }

  function close(key: string) {
    setOpenDocs((prev) => prev.filter((d) => docKey(d) !== key));
  }

  const openKeys = new Set(openDocs.map(docKey));
  const llmsOpen = openKeys.has('/llms.txt');

  return (
    <div className="min-h-screen flex flex-col items-center justify-start" style={{ paddingTop: 256, paddingBottom: 120 }}>
      <button
        onClick={() => open('', 'llms.txt', `${KB_BASE}/llms.txt`)}
        className="border-0 bg-transparent p-0 cursor-pointer"
        style={{
          color: llmsOpen ? '#BB3308' : 'rgba(255,255,255,0.35)',
          marginBottom: 40,
          fontFamily: "'Space Mono', 'Courier New', monospace",
          fontSize: 11,
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => { if (!llmsOpen) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = llmsOpen ? '#BB3308' : 'rgba(255,255,255,0.35)'; }}
      >
        llms.txt
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', columnGap: 120, rowGap: 20, marginLeft: 120 }}>
        {folders.map((folder) => (
          <div key={folder}>
            <p className="font-mono text-[12px] tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
              {folder}/
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 16 }}>
              {byFolder[folder].map((doc) => {
                const key = `${doc.folder}/${doc.slug}`;
                const isOpen = openKeys.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => open(doc.folder, doc.slug)}
                    title={doc.description || doc.title}
                    className="text-left border-0 bg-transparent p-0 cursor-pointer"
                    style={{
                      color: isOpen ? '#BB3308' : 'rgba(255,255,255,0.35)',
                      fontFamily: "'Space Mono', 'Courier New', monospace",
                      fontSize: 11,
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = isOpen ? '#BB3308' : 'rgba(255,255,255,0.35)'; }}
                  >
                    {doc.slug}.md
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Asset gallery — logos, fonts, vibe imagery from the KB asset channel ── */}
      <div style={{ width: '100%', maxWidth: 920, marginTop: 80, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p className="font-mono text-[12px] tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 28, textAlign: 'center' }}>
          assets/
        </p>
        <AssetGallery />
      </div>

      <AnimatePresence>
        {openDocs.map((doc) => (
          <KBWindow
            key={docKey(doc)}
            folder={doc.folder}
            slug={doc.slug}
            directUrl={doc.directUrl}
            onClose={() => close(docKey(doc))}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

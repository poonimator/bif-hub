'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import KBWindow from './KBWindow';
import { KB } from '@/lib/kb';

interface OpenDoc { folder: string; slug: string; directUrl?: string }

function docKey(doc: OpenDoc) {
  return `${doc.folder}/${doc.slug}`;
}

export default function KBBrowser() {
  const [openDocs, setOpenDocs] = useState<OpenDoc[]>([]);

  function open(folder: string, file: string, directUrl?: string) {
    const slug = file.replace('.md', '');
    const key = `${folder}/${slug}`;
    setOpenDocs((prev) =>
      prev.some((d) => docKey(d) === key) ? prev : [...prev, { folder, slug, directUrl }]
    );
  }

  function close(key: string) {
    setOpenDocs((prev) => prev.filter((d) => docKey(d) !== key));
  }

  const openKeys = new Set(openDocs.map(docKey));

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start"
      style={{ paddingTop: 256 }}
    >


      <button
        onClick={() => open('', 'llms.txt', 'https://bif27-kb-mcp.ethan-choo.workers.dev/llms.txt')}
        className="font-mono text-[11px] border-0 bg-transparent p-0 cursor-pointer"
        style={{
          color: openKeys.has('/llms.txt') ? '#BB3308' : 'rgba(255,255,255,0.35)',
          marginBottom: 40,
          fontFamily: "'Space Mono', 'Courier New', monospace",
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => { if (!openKeys.has('/llms.txt')) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = openKeys.has('/llms.txt') ? '#BB3308' : 'rgba(255,255,255,0.35)'; }}
      >
        llms.txt
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 200px)',
          columnGap: 120,
          rowGap: 20,
          marginLeft: 120,
        }}
      >
        {KB.map(({ folder, files }) => (
          <div key={folder}>
            <p
              className="font-mono text-[12px] tracking-[0.12em]"
              style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}
            >
              {folder}/
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 16 }}>
              {files.map((file) => {
                const slug = file.replace('.md', '');
                const key = `${folder}/${slug}`;
                const isOpen = openKeys.has(key);
                return (
                  <button
                    key={file}
                    onClick={() => open(folder, file)}
                    className="font-mono text-[11px] text-left border-0 bg-transparent p-0 cursor-pointer"
                    style={{
                      color: isOpen ? '#BB3308' : 'rgba(255,255,255,0.35)',
                      fontFamily: "'Space Mono', 'Courier New', monospace",
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = isOpen ? '#BB3308' : 'rgba(255,255,255,0.35)'; }}
                  >
                    {file}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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

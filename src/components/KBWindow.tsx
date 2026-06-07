'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface KBWindowProps {
  folder: string;
  slug: string;
  onClose: () => void;
  directUrl?: string;
}

export default function KBWindow({ folder, slug, onClose, directUrl }: KBWindowProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const constraintsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setContent(null);
    if (directUrl) {
      fetch(directUrl)
        .then((r) => r.text())
        .then(setContent)
        .catch(() => setContent('Failed to load.'))
        .finally(() => setLoading(false));
    } else {
      fetch('https://bif27-kb-mcp.ethan-choo.workers.dev/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: { name: 'get_document', arguments: { folder, slug } },
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          const text = data?.result?.content?.[0]?.text ?? 'No content found.';
          setContent(text);
        })
        .catch(() => setContent('Failed to load document.'))
        .finally(() => setLoading(false));
    }
  }, [folder, slug, directUrl]);

  return (
    <div ref={constraintsRef} className="fixed inset-0 z-[500] pointer-events-none">
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          x: '-50%',
          width: 680,
          maxHeight: '72vh',
          background: '#1e1c14',
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
          pointerEvents: 'all',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
            cursor: 'grab',
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: 12, height: 12, borderRadius: '50%',
              background: '#ff5f57', border: 'none', cursor: 'pointer', padding: 0,
            }}
          />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />

          <p
            className="font-mono text-[11px]"
            style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}
          >
            {directUrl ? slug : `${folder}/${slug}.md`}
          </p>
        </div>

        {/* Content */}
        <div
          style={{
            overflowY: 'auto',
            padding: '28px 32px 36px',
            flex: 1,
          }}
        >
          {loading ? (
            <p className="font-mono text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Loading…
            </p>
          ) : (
            <div className="kb-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content ?? ''}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { kbTool } from '@/lib/kb';

interface Asset {
  id: string;
  category: 'logo' | 'font' | 'vibe';
  name: string;
  description: string;
  url: string;
  content_type: string;
  width?: number;
  height?: number;
  tags: string[];
}

const MONO = "'Space Mono', 'Courier New', monospace";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: '0 0 16px' }}>
      {children}
    </p>
  );
}

export default function AssetGallery() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    kbTool<Asset[]>('list_assets')
      .then((a) => { if (alive) setAssets(Array.isArray(a) ? a : []); })
      .catch(() => { if (alive) setAssets([]); });
    return () => { alive = false; };
  }, []);

  const by = (c: Asset['category']) => assets.filter((a) => a.category === c);

  function copy(url: string, id: string) {
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1200);
  }

  const tip = (id: string, fallback: string) => (copied === id ? 'Copied URL' : fallback);

  if (assets.length === 0) return null;

  const btnReset: React.CSSProperties = { border: 0, background: 'transparent', padding: 0, cursor: 'pointer', textAlign: 'left' };
  const caption: React.CSSProperties = { fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 8, display: 'block' };

  return (
    <div style={{ width: '100%', maxWidth: 920, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>
      <style>{`
        .ag-vibes { column-count: 4; column-gap: 12px; }
        .ag-vibes > * { break-inside: avoid; margin-bottom: 12px; width: 100%; }
        @media (max-width: 720px) { .ag-vibes { column-count: 3; } }
        @media (max-width: 480px) { .ag-vibes { column-count: 2; } }
      `}</style>
      {/* Logos — dark + light swatches */}
      {by('logo').length > 0 && (
        <section>
          <Label>Logos</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {by('logo').map((a) => (
              <button key={a.id} title={tip(a.id, a.name)} onClick={() => copy(a.url, a.id)} style={btnReset}>
                <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ background: '#16150F', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={a.url} alt={a.name} style={{ height: 40, width: 'auto', display: 'block' }} />
                  </div>
                  <div style={{ background: '#F4EFE6', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={a.url} alt="" aria-hidden="true" style={{ height: 40, width: 'auto', display: 'block' }} />
                  </div>
                </div>
                <span style={caption}>{a.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Fonts */}
      {by('font').length > 0 && (
        <section>
          <Label>Fonts</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {by('font').map((a) => (
              <button key={a.id} title={tip(a.id, a.name)} onClick={() => copy(a.url, a.id)} style={{ ...btnReset, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '18px 22px', minWidth: 220 }}>
                <span style={{ fontFamily: "'Brasil', Georgia, serif", fontWeight: 500, fontSize: 34, lineHeight: 1, color: '#fff', display: 'block' }}>Aa</span>
                <span style={caption}>{a.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Vibes — lazy thumbnail grid */}
      {by('vibe').length > 0 && (
        <section>
          <Label>Vibes</Label>
          <div className="ag-vibes">
            {by('vibe').map((a) => (
              <button key={a.id} title={tip(a.id, `${a.name} — ${a.tags.join(', ')}`)} onClick={() => copy(a.url, a.id)} style={{ ...btnReset, display: 'block', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <img
                  src={a.url}
                  alt={a.name}
                  width={a.width}
                  height={a.height}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: 'auto', display: 'block', background: '#1a1813' }}
                />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

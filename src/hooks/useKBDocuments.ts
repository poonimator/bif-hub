'use client';

import { useEffect, useState } from 'react';
import { kbTool, type KBDoc } from '@/lib/kb';

// Worldview-first ordering (matches llms.txt); unknown folders fall to the end.
const FOLDER_ORDER = ['vision', 'bif27', 'bif24', 'brand', 'craft', 'gmc', 'skills'];

/**
 * Live KB document index. Fetches list_documents once on mount and groups by
 * folder so the browser always mirrors the KB — no hardcoded list to drift.
 */
export function useKBDocuments() {
  const [docs, setDocs] = useState<KBDoc[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    kbTool<KBDoc[]>('list_documents')
      .then((d) => { if (alive) setDocs(Array.isArray(d) ? d : []); })
      .catch(() => { if (alive) setDocs([]); })
      .finally(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const byFolder = docs.reduce<Record<string, KBDoc[]>>((acc, d) => {
    (acc[d.folder] ??= []).push(d);
    return acc;
  }, {});

  const folders = Object.keys(byFolder).sort((a, b) => {
    const ia = FOLDER_ORDER.indexOf(a);
    const ib = FOLDER_ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return { docs, byFolder, folders, loaded };
}

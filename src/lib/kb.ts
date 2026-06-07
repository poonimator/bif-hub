import type { SectionId } from '@/components/SectionCard';

export interface KBFolder {
  folder: string;
  files: string[];
}

export const KB: KBFolder[] = [
  { folder: 'bif24', files: ['overview.md', 'speakers.md'] },
  { folder: 'bif27', files: ['overview.md', 'speakers.md'] },
  { folder: 'brand', files: ['colours.md', 'messaging.md', 'strategy.md', 'typography-spacing.md'] },
  { folder: 'craft', files: ['bif27-track.md', 'creative-economy.md', 'global-recognition.md', 'textiles.md'] },
  { folder: 'gmc', files: ['companies.md', 'leadership.md', 'overview.md', 'roadmap.md', 'setup-guide.md'] },
  { folder: 'skills', files: ['creative-direction.md', 'cross-connections.md', 'day-summary.md', 'delegate-faq.md', 'gmc-explainer.md', 'session-copy.md', 'speaker-briefing.md', 'system-prompt.md', 'textile-track-pitch.md'] },
];

// Which KB folder backs each section's "agent mode" view.
// website has no folder yet; vision is not yet mapped.
export const SECTION_FOLDER: Record<SectionId, string | null> = {
  website: null,
  vision: null,
  brand: 'brand',
  tools: 'skills',
};

export function filesForFolder(folder: string | null): string[] {
  if (!folder) return [];
  return KB.find((k) => k.folder === folder)?.files ?? [];
}

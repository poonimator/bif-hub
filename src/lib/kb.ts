import type { SectionId } from '@/components/SectionCard';

export const KB_BASE = 'https://bif27-kb-mcp.ethan-choo.workers.dev';

export interface KBDoc {
  folder: string;
  slug: string;
  title: string;
  description: string;
}

/**
 * Call a KB MCP tool. Tool results arrive as a JSON string inside
 * content[0].text. Open CORS — safe to call directly from the browser.
 */
export async function kbTool<T = unknown>(name: string, args: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`${KB_BASE}/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
  });
  const data = await res.json();
  return JSON.parse(data.result.content[0].text) as T;
}

// Which KB folder backs each section's "agent mode" view.
export const SECTION_FOLDER: Record<SectionId, string | null> = {
  website: null,
  vision: 'vision',
  brand: 'brand',
  tools: 'skills',
};

// The canonical lead document per section folder (opened/sorted first).
export const SECTION_LEAD: Record<string, string> = {
  vision: 'human-abundance',
};

# BIF Frontend ⇄ KB Handoff

A self-contained brief for the BIF frontend developer. Everything you need to keep **Agent Mode** (the KB browser) and **Ask Rigpai** in sync with the BIF27 Knowledge Base is in this document — no other context required.

- **KB base URL:** `https://bif27-kb-mcp.ethan-choo.workers.dev`
- **CORS:** open (`*`). Every call here works directly from the browser on any host (Vercel included). No proxy, no key.
- **Revision:** 2026-06-08b — added the **`vision/` folder** (the Human Abundance worldview, 9 docs — the foundation everything derives from), `bif27/three-conditions-map`, and a worldview-first `llms.txt`. (2026-06-08a added the **asset channel** — `list_assets` / `get_asset` at `/assets/...` — and `brand/motion-recipes`.)

This brief asks for **two changes** (§3, §4). Ask Rigpai needs **none** (§5).

---

## 0. How this works — the model

**The frontend never stores the KB markdown.** The KB browser holds only a *list* of `folder/slug` entries. When a file is clicked, the doc window fetches its content **live** from the KB worker via `get_document(folder, slug)`. `llms.txt` is fetched live from its URL.

Consequences (important):

- **No `.md` files are part of this handoff.** Content lives only in the KB and is always current. The frontend only needs to know *which* documents exist.
- The list of documents is fetched **dynamically** from the KB (§3), so it can never drift — new / renamed / removed docs appear automatically with no code change and no future handoff.
- Future handoffs are therefore **capability-only**: required when the KB gains a new *kind* of thing the UI must render (like the asset gallery in §4), never for content or document changes.

---

## 1. The KB surface (the contract)

One Cloudflare Worker. Three entry points:

| Path | Method | What |
|------|--------|------|
| `/mcp` | POST | MCP JSON-RPC endpoint (all tools) |
| `/llms.txt` | GET | Live-generated index of every document + tool |
| `/assets/<key>` | GET | Brand assets & vibe imagery (correct content-type, long cache, immutable) |

**Tools** (call via `POST /mcp`):

| Tool | Args | Returns |
|------|------|---------|
| `list_documents` | `folder?` | `[{folder, slug, title, description, modified}]` |
| `get_document` | `folder, slug` | full markdown `content` (string) |
| `search_documents` | `query` | top matches with `excerpt` |
| `list_assets` | `category?` (`logo`\|`font`\|`vibe`) | `[asset summary]` (see §4) |
| `get_asset` | `id` | asset summary + `url`; logos add `inline` (SVG), fonts add `data_url` (base64) |

**Call helper** — tool results arrive as a JSON string inside `content[0].text`:

```ts
const KB_BASE = "https://bif27-kb-mcp.ethan-choo.workers.dev";

export async function kbTool<T = unknown>(name: string, args: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`${KB_BASE}/mcp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
  });
  const data = await res.json();
  return JSON.parse(data.result.content[0].text) as T;
}
```

---

## 2. Change 1 — make the document list dynamic

The KB browser currently renders from a hardcoded array (`src/lib/kb.ts`). Replace that with a live fetch so the browser always mirrors the KB. Document **content** already loads live on click — leave that as is.

**Add a hook:**

```ts
// useKBDocuments.ts
import { useEffect, useState } from "react";
import { kbTool } from "./kb"; // wherever you keep the helper above

export interface KBDoc { folder: string; slug: string; title: string; description: string }

export function useKBDocuments() {
  const [docs, setDocs] = useState<KBDoc[]>([]);
  useEffect(() => { kbTool<KBDoc[]>("list_documents").then(setDocs).catch(() => setDocs([])); }, []);
  // group into { folder: KBDoc[] } for rendering columns
  const byFolder = docs.reduce<Record<string, KBDoc[]>>((acc, d) => {
    (acc[d.folder] ??= []).push(d); return acc;
  }, {});
  return { docs, byFolder };
}
```

**In the KB browser**, render `byFolder` instead of the hardcoded list. Each entry opens the existing doc window with `{ folder, slug }` (which already calls `get_document` live). Keep the `llms.txt` button pointed at `${KB_BASE}/llms.txt`.

After this, deleting the hardcoded `KB` array is safe, and you never touch the document list again.

**Section → folder mapping.** The KB now has a `vision/` folder (the Human Abundance worldview — 9 docs, the foundation everything derives from). Point the **Vision** section's agent view at it, and lead with the manifesto:

```ts
// section → KB folder (was: vision = null)
const SECTION_FOLDER = { website: null, vision: "vision", brand: "brand", tools: "skills" };
// In the Vision section, open vision/human-abundance first — it's the canonical worldview.
```

`llms.txt` now opens with a **"Start here"** pointer to `vision/human-abundance` and groups documents by folder (vision first), so anything reading the index gets the worldview-first structure for free.

---

## 3. Change 2 — add the asset gallery

Assets (logos, fonts, vibe imagery) are a **separate channel** from documents — they will not appear anywhere until rendered. Add an asset gallery to Agent Mode (a new section/tab in the KB browser, or a dedicated panel).

### Data shapes

`list_assets` (or `list_assets('logo'|'font'|'vibe')`) returns an array of:

```jsonc
{
  "id": "vibe-monastery",
  "category": "vibe",                 // logo | font | vibe
  "name": "Himalayan monastery",
  "description": "Atmospheric Himalayan monastery — the 'monastery for the intelligent age' motif…",
  "url": "https://bif27-kb-mcp.ethan-choo.workers.dev/assets/vibes/monastery.webp",
  "content_type": "image/webp",
  "width": 2400,
  "height": 1350,
  "tags": ["monastery","himalaya","atmosphere","cinemagraph","hero"]
}
```

`get_asset(id)` returns the same fields plus, by category:
- **logo** → `inline`: raw `<svg>…</svg>` (embed directly; recolour via `fill` / `currentColor`)
- **font** → `data_url`: `data:font/otf;base64,…` (drop into an `@font-face`)
- **vibe** → URL only

### Render rules

- Group by category: **logo** (8), **font** (2), **vibe** (13).
- **Logos:** SVGs load fine via `<img src={url}>`. Show each on **both** a dark (`#16150F`) and a light (`#F4EFE6`) swatch — some marks are white, some black/ember. Click → copy `url`.
- **Fonts:** show the name + a "Brasil" specimen line. Click → copy `url` (or `get_asset` → `data_url`).
- **Vibes:** lazy-loaded thumbnail grid from `url`, using `width`/`height` for aspect ratio; show `tags` on hover; click → open full + copy `url`.

### Paste-ready gallery

```tsx
import { useEffect, useState } from "react";
import { kbTool } from "./kb";

interface Asset { id: string; category: "logo"|"font"|"vibe"; name: string; description: string;
  url: string; content_type: string; width?: number; height?: number; tags: string[] }

export default function AssetGallery() {
  const [assets, setAssets] = useState<Asset[]>([]);
  useEffect(() => { kbTool<Asset[]>("list_assets").then(setAssets).catch(() => setAssets([])); }, []);
  const by = (c: Asset["category"]) => assets.filter(a => a.category === c);

  return (
    <div>
      {/* Logos */}
      <section>
        <h3>Logos</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {by("logo").map(a => (
            <button key={a.id} title={a.name} onClick={() => navigator.clipboard.writeText(a.url)}>
              <div style={{ background: "#16150F", padding: 20 }}><img src={a.url} alt={a.name} style={{ height: 48 }} /></div>
              <div style={{ background: "#F4EFE6", padding: 20 }}><img src={a.url} alt="" style={{ height: 48 }} /></div>
              <span>{a.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Vibes */}
      <section>
        <h3>Vibes</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {by("vibe").map(a => (
            <button key={a.id} title={`${a.name} — ${a.tags.join(", ")}`} onClick={() => navigator.clipboard.writeText(a.url)}>
              <img src={a.url} alt={a.name} width={a.width} height={a.height} loading="lazy" style={{ width: "100%", height: "auto" }} />
              <span>{a.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Fonts: list by("font") — name + url; fetch get_asset(id).data_url if you want an inline specimen */}
    </div>
  );
}
```

Asset URLs are immutable and long-cached — safe to `<img>` directly. New vibes appear automatically on the next `list_assets` fetch; no code change.

---

## 4. Ask Rigpai — no changes required

Rigpai pulls `/llms.txt` into its context, and `/llms.txt` already announces the asset tools and the `brand/motion-recipes` doc. So Rigpai already knows assets exist and can talk about them. **Leave it as is.**

> (Footnote, not part of this handoff.) If you ever want Rigpai to actively return specific asset URLs, add one line to its retrieval — `const assets = await kbTool("list_assets")` — and append `id · name · url` lines to the context string. Not needed for this handoff.

---

## 5. Making new visuals (for any "create" feature)

Users can reuse a vibe (`list_assets('vibe')`) or generate new images/videos. The recipe is in the KB: `get_document('brand', 'motion-recipes')` — Higgsfield workflow (model `kling3_0`, 4k, start-image), motion prompts, looping, lessons. Videos are not stored; generate per the recipe. Logos return embeddable `inline` SVG and fonts return `data_url` specifically so a generated artifact (e.g. a flyer) can be fully self-contained.

---

## 6. Reference snapshot (2026-06-08)

The browser fetches these live via `list_documents` / `list_assets`; shown here so this brief is complete on its own.

**Documents**
```
vision/  human-abundance, the-intelligent-age, the-great-inversion, natural-intelligence,
         mindful-societies, intelligent-economies, regenerative-systems, why-bhutan, the-forum
bif24/   overview, speakers
bif27/   overview, speakers, three-conditions-map
brand/   colours, messaging, motion-recipes, strategy, typography-spacing
craft/   bif27-track, creative-economy, global-recognition, textiles
gmc/     companies, leadership, overview, roadmap, setup-guide
skills/  creative-direction, cross-connections, day-summary, delegate-faq,
         gmc-explainer, session-copy, speaker-briefing, system-prompt, textile-track-pitch
```

**Assets**
```
logo  (8): logo-druk-white, logo-druk-black, logo-druk-ember,
           logo-lockup-white, logo-lockup-white-ember, logo-lockup-black,
           logo-lockup-black-ember, logo-human-abundance
font  (2): font-brasil-light, font-brasil-medium
vibe (13): vibe-dzong, vibe-flags, vibe-monk, vibe-peaks, vibe-river,
           vibe-mountains, vibe-billboard-day, vibe-billboard-night, vibe-monastery,
           vibe-card-website, vibe-card-vision, vibe-card-brand, vibe-card-tools
```

---

## 7. Done when

- [ ] KB browser renders its document list from `list_documents` (hardcoded array removed). New docs like `brand/motion-recipes` appear automatically.
- [ ] Asset gallery added to Agent Mode (logos on dark+light swatches, fonts, vibe grid), data from `list_assets`.
- [ ] Verified from the deployed frontend.
- [ ] Ask Rigpai: unchanged.

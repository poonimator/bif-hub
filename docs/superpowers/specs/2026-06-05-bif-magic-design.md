# BIF Magic — Website Design Spec

**Date:** 2026-06-05  
**Status:** Approved  
**Scope:** Frontend only. MCP server and knowledge base deferred.

---

## Overview

BIF Magic is the web companion for the Bhutan Innovation Festival brand intelligence system — mirroring the SIT Magic architecture but built in Next.js + React instead of Astro. Four section cards on a dark homepage, each zooming into a full-screen section. Branding adapts the BIF design system from Figma (node 72:37 for type/spacing, node 74:226 for colour).

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 |
| Styling | Tailwind v4 |
| Language | TypeScript |
| Deployment | Cloudflare Pages via `@opennextjs/cloudflare` |
| Package manager | npm |

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Homepage — 4-card landing grid with zoom interaction |
| `/website` | Website section (placeholder content) |
| `/vision` | Vision section (placeholder content) |
| `/brand` | Brand section (placeholder content) |
| `/tools` | Tools landing |
| `/tools/mcp` | MCP connection info (stubbed) |
| `/tools/sandbox` | Persona sandbox (stubbed) |
| `/tools/connect` | Connect instructions (stubbed) |

All section pages (`/website`, `/vision`, `/brand`) are scrollable placeholders. Content is filled in later.

---

## Homepage Layout

4 cards in a grid, identical interaction model to SIT Magic:

1. **Website** — card 1
2. **Vision** — card 2
3. **Brand** — card 3
4. **Tools** — card 4

On click: card animates to fill the viewport, section content scrolls inside. Back button returns to the grid. Agent mode toggle (same as SIT Magic) switches to plain-text view showing linked docs.

---

## Design Tokens

### Colour System (from Figma node 74:226)

**Site background:** `#0e0e0a`

| Token | Name | Hex | On dark text |
|---|---|---|---|
| `--color-ember` | Ember | `#BB3308` | white |
| `--color-azure` | Azure | `#51C8FF` | dark |
| `--color-amethyst` | Amethyst | `#B23FFF` | white |
| `--color-sage` | Sage | `#17FF3E` | dark |
| `--color-marigold` | Marigold | `#E5C64C` | dark |
| `--color-sand` | Sand | `#E1D9B5` | dark |
| `--color-coral` | Coral | `#F99676` | dark |
| `--color-mist` | Mist | `#A0B1BF` | dark |
| `--color-nightfall` | Nightfall | `#16150F` | — |
| `--color-ink` | Ink | `#1A1813` | — |
| `--color-wonder` | Wonder | `#14122B` | — |
| `--color-stone` | Stone | `#8A8473` | — |
| `--color-paper` | Paper | `#F4EFE6` | — |
| `--color-cloud` | Cloud | `#FFFFFF` | — |

**Semantic aliases:**
```css
--bg-site: #0e0e0a;
--bg-brand: var(--color-ember);
--text-brand: var(--color-ember);
--text-default: #ffffff;
--text-subtle: var(--color-stone);
```

### Typography (from Figma node 72:37)

| Role | Family | Weight | Size | Line height |
|---|---|---|---|---|
| H1 display | Brasil | Light | 120px | 90% |
| H2 display | Brasil | Light | 60px | normal |
| Title | Brasil | Medium | 24px | 110% |
| Label | Space Mono | Regular | 12px | 1.89 (uppercase) |
| Body | Public Sans | Regular | 16px | 1.89 |
| Caption | Public Sans | Regular | 14px | 1.5 |

**Font stacks:**
- `font-brasil`: `'Brasil', serif` — display headings (Brasil DEMO in Figma; production uses licensed Brasil)
- `font-mono`: `'Space Mono', monospace` — labels, metadata, agent mode
- `font-sans`: `'Public Sans', sans-serif` — body copy

Load via Google Fonts: Public Sans + Space Mono. Brasil requires a separate font file (license TBD — use Brasil DEMO for now via local file or @font-face).

### Grid & Layout

- Max width: 1440px
- Outer margin: 80px (desktop)
- Gutter: 24px
- Columns: 12

### Spacing Scale (8pt)

`4 · 8 · 16 · 24 · 32 · 48 · 64 · 96`

---

## Component Architecture

```
src/
  app/
    page.tsx              ← homepage (card grid + zoom interaction)
    website/page.tsx      ← Website section placeholder
    vision/page.tsx       ← Vision section placeholder
    brand/page.tsx        ← Brand section placeholder
    tools/
      page.tsx            ← Tools landing
      mcp/page.tsx
      sandbox/page.tsx
      connect/page.tsx
    layout.tsx            ← root layout (fonts, global CSS)
    globals.css           ← Tailwind @theme, BIF tokens
  components/
    HomeGrid.tsx          ← 4-card grid with zoom logic
    SectionCard.tsx       ← individual card (label + background)
    ZoomShell.tsx         ← zoom overlay + animate-in shell
    MinimizeButton.tsx    ← back-to-grid button
    AgentToggle.tsx       ← human/agent mode toggle
    sections/
      WebsiteSection.tsx  ← placeholder scroll content
      VisionSection.tsx
      BrandSection.tsx
      ToolsSection.tsx
```

### HomeGrid

- Renders 4 `SectionCard` components in a flex/grid layout
- Tracks `activeSection: string | null` in state
- On card click: sets active section, triggers zoom animation
- Zoom: card expands from its bounding rect to fill viewport (CSS transition, same pattern as SIT Magic index.astro)

### ZoomShell

- Wraps each section's content
- Dark overlay fades in behind the expanding card
- `overflow-y: auto` scroll container inside
- `MinimizeButton` positioned top-left to return to grid

### Agent mode

- `data-view-mode="human|agent"` on `<html>`
- CSS shows/hides human content vs plain text links to docs
- `AgentToggle` button in zoomed sections

---

## Card Colour Assignments (initial)

| Card | Background | Label colour |
|---|---|---|
| Website | `#1A1813` (Ink) | white |
| Vision | `#BB3308` (Ember) | white |
| Brand | `#14122B` (Wonder) | white |
| Tools | `#0e0e0a` with border | `#51C8FF` (Azure) |

These are starting points — adjusted as content fills in.

---

## Cloudflare Deployment

- Adapter: `@opennextjs/cloudflare`
- Static pages: all section placeholders use `export const runtime = 'edge'` or static export where possible
- Env vars: same pattern as SIT Magic (`process.env` in production, `import.meta.env` in dev)
- `wrangler.jsonc` config with `nodejs_compat` flag

---

## Out of Scope (this spec)

- MCP server
- Knowledge docs (bif-vision, bif-experience, bif-brand, etc.)
- Personas (9 JSON objects)
- Skills (5 skill files)
- Asset channel / logo registration
- Real content for Website, Vision, Brand sections
- Brasil font licensing / final font files

# BIF Hub

The main hub for the **Bhutan Innovation Festival 2027** — a dark, cinematic landing
with four zooming section cards (Website · Human Abundance · Brand · Tools), the
**Rigpai** AI assistant grounded in the BIF knowledge base, and an Agent mode that
exposes the raw KB.

Built with Next.js 16 (App Router), React 19, Tailwind v4, Framer Motion, and TypeScript.
The look-and-feel is shared with the standalone BIF marketing site (the "Website" card links to it).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values you need
npm run dev                  # http://localhost:3000 (or next free port)
```

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_WEBSITE_URL` | no | URL the "Website" card opens (the marketing site). Defaults to `http://localhost:3000`. |
| `OPENAI_API_KEY` | no | Enables full Rigpai chat. Without it, chat returns grounded knowledge-base summaries. Server-only. |

The knowledge base is a public, read-only MCP server
(`https://bif27-kb-mcp.ethan-choo.workers.dev`) — no key required.

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm test` | Jest + React Testing Library |
| `npm run lint` | ESLint |

## Deploy

Deployed on **Vercel** (auto-detected Next.js). Set `NEXT_PUBLIC_WEBSITE_URL` and
`OPENAI_API_KEY` in the Vercel project's Environment Variables. Every push to `main`
deploys to production; pull requests get preview deployments.

## Project structure

```
src/
  app/            routes: / (hub), /brand, /vision, /tools, /api/chat
  components/     HomeGrid, SectionCard, ZoomShell, ChatBar, Footer, KB*, …
  components/sections/         section content (Brand playbook, Tools, …)
  lib/            kb.ts (KB structure), links.ts (shared URLs)
public/           card videos/images, fonts (Brasil), brand assets
```

## Contributing

1. Create a branch off `main` (`git checkout -b your-feature`).
2. Commit, push, and open a Pull Request — Vercel will attach a preview URL.
3. Keep type styles on the shared `.t-*` utility classes in `globals.css`; reuse
   the design tokens rather than hard-coding sizes/colours.
4. `npm run build` and `npm run lint` should pass before requesting review.

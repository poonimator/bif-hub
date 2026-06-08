'use client'
import React, { useState } from 'react'
import PageReveal from '../PageReveal'

const ENDPOINT = 'https://bif27-kb-mcp.ethan-choo.workers.dev/mcp'
const MONO = "'Space Mono', 'Courier New', monospace"
const SERIF = "'Brasil', Georgia, serif"
const EMBER = '#BB3308'

/* ── Copyable code block ── */
function Code({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  return (
    <div style={{ position: 'relative', background: '#16150F', borderRadius: 10, padding: '18px 20px', margin: '14px 0' }}>
      <button
        onClick={copy}
        style={{
          position: 'absolute', top: 12, right: 12, border: 0, cursor: 'pointer',
          background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
          fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '5px 10px', borderRadius: 6,
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre style={{ margin: 0, overflowX: 'auto', fontFamily: MONO, fontSize: 13, lineHeight: 1.6, color: '#E1D9B5', whiteSpace: 'pre' }}>
        {code}
      </pre>
    </div>
  )
}

interface Tab {
  id: string
  label: string
  body: React.ReactNode
}

const TABS: Tab[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    body: (
      <>
        <p>Run one command — all flags go before the server name:</p>
        <Code code={`claude mcp add --transport http bif-kb ${ENDPOINT}`} />
        <p>Add <code>--scope user</code> to make it available across all projects. Verify with <code>claude mcp list</code>. Prefer hand-editing <code>.mcp.json</code>? The <code>&quot;type&quot;: &quot;http&quot;</code> field is required for remote servers:</p>
        <Code code={`{
  "mcpServers": {
    "bif-kb": { "type": "http", "url": "${ENDPOINT}" }
  }
}`} />
        <a href="https://code.claude.com/docs/en/mcp" target="_blank" rel="noopener noreferrer">Claude Code MCP docs →</a>
      </>
    ),
  },
  {
    id: 'claude-desktop',
    label: 'Claude Desktop',
    body: (
      <>
        <p><strong>Recommended — native connector:</strong> Settings → Connectors → <em>Add custom connector</em>, paste the URL below, save, and restart if prompted.</p>
        <Code code={ENDPOINT} />
        <p><strong>Fallback (older builds)</strong> — bridge the remote server with <code>mcp-remote</code> in <code>claude_desktop_config.json</code>:</p>
        <Code code={`{
  "mcpServers": {
    "bif-kb": {
      "command": "npx",
      "args": ["mcp-remote", "${ENDPOINT}"]
    }
  }
}`} />
        <a href="https://modelcontextprotocol.io/docs/develop/connect-local-servers" target="_blank" rel="noopener noreferrer">Connect servers docs →</a>
      </>
    ),
  },
  {
    id: 'codex',
    label: 'Codex',
    body: (
      <>
        <p>Codex&apos;s <code>mcp add</code> command is stdio-only, so add the remote server by editing <code>~/.codex/config.toml</code>:</p>
        <Code code={`[mcp_servers.bif_kb]
url = "${ENDPOINT}"`} />
        <p>No token or headers are needed — it&apos;s a public read-only server.</p>
        <a href="https://developers.openai.com/codex/mcp" target="_blank" rel="noopener noreferrer">Codex MCP docs →</a>
      </>
    ),
  },
  {
    id: 'cursor',
    label: 'Cursor',
    body: (
      <>
        <p>Add to <code>.cursor/mcp.json</code> (project) or <code>~/.cursor/mcp.json</code> (global). Remote servers use a <code>url</code> field:</p>
        <Code code={`{
  "mcpServers": {
    "bif-kb": { "url": "${ENDPOINT}" }
  }
}`} />
        <p>Cursor auto-detects the change — confirm under Settings → MCP.</p>
        <a href="https://cursor.com/docs/mcp" target="_blank" rel="noopener noreferrer">Cursor MCP docs →</a>
      </>
    ),
  },
  {
    id: 'other',
    label: 'Other',
    body: (
      <>
        <p>Most MCP-capable clients (Windsurf, Cline, VS Code…) use the same JSON pattern — give it a name and the <code>url</code>:</p>
        <Code code={`{
  "mcpServers": {
    "bif-kb": { "url": "${ENDPOINT}" }
  }
}`} />
        <p>Some clients want a transport hint like <code>&quot;type&quot;: &quot;http&quot;</code> alongside the URL — check that client&apos;s docs.</p>
        <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">Model Context Protocol →</a>
      </>
    ),
  },
]

const SKILLS: { name: string; desc: string; prompt: string }[] = [
  { name: 'Creative Direction', desc: 'Generates on-brand BIF27 visuals (speaker portraits, hero banners, patterns) in the MMBP thangka-influenced visual language.', prompt: 'Using the BIF creative-direction skill, generate a speaker portrait for Fei-Fei Li in the MMBP thangka style with the right BIF palette.' },
  { name: 'Cross-Connections', desc: 'Finds the thematic bridge and productive tension between two or more BIF27 speakers or sessions — for moderators and panel prep.', prompt: 'Use cross-connections to find the bridge and tension between Kate Raworth and Fei-Fei Li, plus one moderator question.' },
  { name: 'Day Summary', desc: 'Writes a 300–400 word preview or recap of a BIF27 programme day in BIF&apos;s grounded voice.', prompt: 'Write a Day 2 (New Futures) preview using the day-summary skill — ~350 words, naming specific sessions and speakers.' },
  { name: 'Delegate FAQ', desc: 'Answers attendee questions from the KB and redirects logistics it can&apos;t confirm to the DHI organising team.', prompt: 'Using the delegate-FAQ skill: what should I wear to BIF27, and do I need a visa?' },
  { name: 'GMC Explainer', desc: 'Explains Gelephu Mindfulness City to a specific audience — investor, journalist, delegate or government — in the right register.', prompt: 'Use the GMC-explainer skill to explain Gelephu Mindfulness City to an institutional investor in ~200 words.' },
  { name: 'Session Copy', desc: 'Writes a 100–150 word session description in BIF&apos;s voice — central tension first, never opening with the speaker&apos;s name.', prompt: 'Use the session-copy skill to write the description for Dasho Karma Ura&apos;s fireside on Gross National Happiness.' },
  { name: 'Speaker Briefing', desc: 'Produces a full speaker briefing pack — their session, the arc of their day, neighbours and practical details — as a warm letter.', prompt: 'Generate a speaker briefing for Thomas Heatherwick using the speaker-briefing skill.' },
  { name: 'System Prompt', desc: 'The standing system prompt for a BIF27 assistant — KB-usage rules, tone of voice, fast facts and sensitive distinctions.', prompt: 'Paste this document into your assistant&apos;s system prompt to ground every BIF27 conversation in the correct facts and voice.' },
  { name: 'Textile Track Pitch', desc: 'Helps draft the case for a Textiles, Craft & Creative Economy track at BIF27 — argument, evidence and speaker connections.', prompt: 'Use the textile-track-pitch skill to draft a one-page case for a craft track, with the connection to Kate Raworth and Vandana Shiva.' },
]

export default function ToolsSection() {
  const [tab, setTab] = useState(TABS[0].id)
  const active = TABS.find((t) => t.id === tab) ?? TABS[0]

  return (
    <PageReveal current="tools">
    <div style={{ background: '#FFFFFF', color: '#16150F', fontFamily: "'Public Sans', system-ui, sans-serif", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' }}>
      <style>{`
        .tools-prose p { font-size: 16px; line-height: 1.7; color: #3a362c; margin: 12px 0; }
        .tools-prose code { font-family: ${MONO}; font-size: 13px; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; color: #16150F; }
        .tools-prose a { color: ${EMBER}; text-decoration: none; font-weight: 500; }
        .tools-prose a:hover { text-decoration: underline; }
        .tools-prose strong { color: #16150F; }
      `}</style>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '120px 32px 80px', boxSizing: 'border-box' }}>
        {/* Intro */}
        <p style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8A8473', margin: 0 }}>LOOM</p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(40px, 7vw, 88px)', lineHeight: '95%', letterSpacing: '-0.03em', margin: '16px 0 28px', color: '#16150F' }}>
          Bring the knowledge base into your AI.
        </h1>
        <div className="tools-prose">
          <p>A <strong>Model Context Protocol (MCP) server</strong> plugs an external knowledge source straight into your AI assistant — instead of pasting context into the chat, your assistant fetches it on demand. <strong>LOOM</strong> is a read-only knowledge base for the Bhutan Innovation Forum: connect it once and your assistant can search and retrieve the forum&apos;s curated documents — BIF24/BIF27 events and speakers, Gelephu Mindfulness City, brand guidelines, Bhutanese craft, and a library of writing &amp; creative skills — without you hunting them down.</p>
          <p>Use it whenever you want <strong>grounded, current, accurate BIF answers</strong>: session copy, speaker briefings, GMC explainers, delegate FAQs — drawn straight from the source. It&apos;s public and read-only, so no API keys or tokens are needed.</p>
        </div>
        <div style={{ background: '#16150F', borderRadius: 10, padding: '16px 20px', marginTop: 20 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>Endpoint</span>
          <div style={{ fontFamily: MONO, fontSize: 14, color: '#E1D9B5', marginTop: 6, wordBreak: 'break-all' }}>{ENDPOINT}</div>
        </div>

        {/* Install */}
        <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em', margin: '72px 0 24px', color: '#16150F' }}>Install</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 14, marginBottom: 8 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                border: 0, cursor: 'pointer', padding: '8px 16px', borderRadius: 999,
                fontFamily: MONO, fontSize: 12, letterSpacing: '0.04em',
                background: tab === t.id ? EMBER : 'rgba(0,0,0,0.05)',
                color: tab === t.id ? '#FFFFFF' : '#3a362c',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="tools-prose" key={active.id}>{active.body}</div>

        {/* Skills */}
        <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em', margin: '72px 0 12px', color: '#16150F' }}>Skills</h2>
        <p className="tools-prose" style={{ marginBottom: 28 }}>Nine instruction sets your AI can follow once LOOM is connected. Each pulls the relevant facts from the knowledge base, then writes in BIF&apos;s voice.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SKILLS.map((s) => (
            <div key={s.name} style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '22px 24px' }}>
              <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 22, margin: 0, color: '#16150F' }}>{s.name}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#3a362c', margin: '8px 0 14px' }}>{s.desc}</p>
              <div style={{ background: '#F4EFE6', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 10 }}>
                <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: EMBER, flexShrink: 0, paddingTop: 2 }}>Try</span>
                <span style={{ fontFamily: MONO, fontSize: 12.5, lineHeight: 1.55, color: '#16150F' }}>{s.prompt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </PageReveal>
  )
}

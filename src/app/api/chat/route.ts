import { NextRequest, NextResponse } from 'next/server'

/**
 * Rigpai chat endpoint — answers questions grounded in the BIF knowledge base.
 *
 * Retrieval: the KB index (llms.txt) for breadth + the top search hits' full
 * documents for depth, via the bif27-kb-mcp server.
 * Generation: OpenAI (set OPENAI_API_KEY). If no key is configured, it falls
 * back to returning the most relevant KB document summary so the bot stays
 * grounded and useful even without an LLM.
 */

const KB_BASE = 'https://bif27-kb-mcp.ethan-choo.workers.dev'

async function mcpCall(name: string, args: Record<string, unknown>): Promise<string> {
  const res = await fetch(`${KB_BASE}/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
  })
  const data = await res.json()
  return data?.result?.content?.[0]?.text ?? ''
}

interface SearchHit { folder: string; slug: string; title?: string; description?: string }

async function searchKB(query: string): Promise<SearchHit[]> {
  try {
    const raw = await mcpCall('search_documents', { query })
    const hits = JSON.parse(raw)
    return Array.isArray(hits) ? hits : []
  } catch {
    return []
  }
}

async function buildContext(query: string): Promise<string> {
  const parts: string[] = []
  try {
    const llms = await fetch(`${KB_BASE}/llms.txt`).then((r) => r.text())
    parts.push('# Knowledge base index\n' + llms.slice(0, 6000))
  } catch {
    /* index optional */
  }
  const hits = await searchKB(query)
  for (const h of hits.slice(0, 2)) {
    try {
      const doc = await mcpCall('get_document', { folder: h.folder, slug: h.slug })
      if (doc) parts.push(`# ${h.folder}/${h.slug}\n` + String(doc).slice(0, 6000))
    } catch {
      /* skip doc */
    }
  }
  return parts.join('\n\n---\n\n')
}

export async function POST(req: NextRequest) {
  let message = ''
  let history: { role: string; text: string }[] = []
  let clientContext = ''
  try {
    const body = await req.json()
    message = String(body?.message ?? '').slice(0, 2000).trim()
    history = Array.isArray(body?.history) ? body.history.slice(-6) : []
    clientContext = typeof body?.context === 'string' ? body.context.slice(0, 18000) : ''
  } catch {
    /* empty body */
  }
  if (!message) {
    return NextResponse.json({ reply: 'Ask me anything about BIF, Gelephu Mindfulness City, or the brand.' })
  }

  // Workers can't fetch the KB worker directly (Cloudflare error 1042), so the
  // browser retrieves context and sends it here. Fall back to a server fetch
  // only when no client context was provided (e.g. non-browser callers).
  const context = clientContext || (await buildContext(message))

  const system =
    `You are Rigpai, the assistant for the Bhutan Innovation Forum (BIF) knowledge base. ` +
    `Answer the user's question using ONLY the context below. Be concise (2–4 sentences), warm and specific. ` +
    `If the answer isn't in the context, say it isn't in the knowledge base yet and point to what is covered. ` +
    `Never invent facts.\n\nCONTEXT:\n${context}`

  const messages = [
    { role: 'system', content: system },
    ...history.map((h) => ({ role: h.role === 'you' ? 'user' : 'assistant', content: String(h.text) })),
    { role: 'user', content: message },
  ]

  // Primary: OpenAI (set OPENAI_API_KEY in the environment)
  const openaiKey = process.env.OPENAI_API_KEY
  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({ model: 'gpt-4o-mini', messages, temperature: 0.3, max_tokens: 400 }),
      })
      if (res.ok) {
        const data = await res.json()
        const reply = (data?.choices?.[0]?.message?.content ?? '').trim()
        if (reply) return NextResponse.json({ reply })
      }
    } catch {
      /* fall through to KB-only answer */
    }
  }

  // Fallback: grounded KB summary (works with no LLM configured)
  const hits = await searchKB(message)
  if (hits[0]?.description) {
    return NextResponse.json({ reply: `From the knowledge base — ${hits[0].title ?? hits[0].folder}: ${hits[0].description}` })
  }
  return NextResponse.json({ reply: "I couldn't find that in the BIF knowledge base yet." })
}

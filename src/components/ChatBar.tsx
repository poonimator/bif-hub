'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, CaretLeft, ArrowUp } from '@phosphor-icons/react'
import BifLogo from './icons/BifLogo'

export type ChatMode = 'idle' | 'collapsed' | 'input' | 'panel' | 'chat'

const PANEL_WIDTH = 560
const CHAT_MAX_HEIGHT = 540

type ChatContext = { intro: string; suggestions: string[] }

const DEFAULT_CHAT: ChatContext = {
  intro: "Hey — I'm Rigpai. Ask me anything about the Bhutan Innovation Festival.",
  suggestions: ['What is BIF?', 'When is BIF27?', 'What is Gelephu Mindfulness City?'],
}

const SECTION_CHAT: Record<string, ChatContext> = {
  brand: {
    intro: "Hey — I'm Rigpai. Ask me anything about the Bhutan Innovation Festival Brand.",
    suggestions: ['What are the brand colours?', 'What typefaces does BIF use?', "What is BIF's brand strategy?"],
  },
  vision: {
    intro: "Hey — I'm Rigpai. Ask me anything about the Bhutan Innovation Festival vision.",
    suggestions: ['What is Human Abundance?', 'What is Gross National Happiness?', 'What is Gelephu Mindfulness City?'],
  },
  website: {
    intro: "Hey — I'm Rigpai. Ask me anything about the Bhutan Innovation Festival.",
    suggestions: ['What is BIF?', 'When and where is BIF27?', 'Who is speaking at BIF?'],
  },
  tools: {
    intro: "Hey — I'm Rigpai. Ask me anything about LOOM, the BIF knowledge base.",
    suggestions: ['What is LOOM?', 'How do I install it?', 'What skills are available?'],
  },
}

type Message = { role: 'you' | 'rigpai'; text: string | string[]; time: string }

const KB_BASE = 'https://bif27-kb-mcp.ethan-choo.workers.dev'

// Retrieve grounding context from the KB in the browser (the worker itself
// can't fetch another worker — Cloudflare error 1042), then hand it to /api/chat.
async function retrieveContext(message: string, sectionHint?: string | null): Promise<string> {
  const parts: string[] = []
  const query = sectionHint ? `${sectionHint} ${message}` : message
  try {
    const llms = await fetch(`${KB_BASE}/llms.txt`).then((r) => r.text())
    parts.push('# Knowledge base index\n' + llms.slice(0, 6000))
  } catch { /* index optional */ }
  try {
    const res = await fetch(`${KB_BASE}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'search_documents', arguments: { query } } }),
    })
    const data = await res.json()
    const text = data?.result?.content?.[0]?.text
    if (text) parts.push('# Most relevant documents\n' + String(text).slice(0, 8000))
  } catch { /* search optional */ }
  return parts.join('\n\n')
}

// Ask the KB-backed endpoint for an answer; degrade gracefully on any failure.
async function fetchReply(message: string, history: Message[], sectionHint?: string | null): Promise<string> {
  try {
    const context = await retrieveContext(message, sectionHint)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        context,
        history: history
          .filter((m) => typeof m.text === 'string')
          .map((m) => ({ role: m.role, text: m.text as string })),
      }),
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    return (data?.reply as string) || "I couldn't find that in the BIF knowledge base yet."
  } catch {
    return "I'm having trouble reaching the knowledge base right now — please try again in a moment."
  }
}

function formatTime(d = new Date()) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// Animated three-dot typing indicator — Rigpai's "thinking" state, shown inline
// in the conversation where the reply will land.
function TypingDots({ reduced }: { reduced: boolean | null }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 20 }} aria-label="Rigpai is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{ width: 6, height: 6, borderRadius: 9999, background: 'currentColor' }}
          animate={reduced ? { opacity: 0.6 } : { opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={reduced ? undefined : { duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.16 }}
        />
      ))}
    </span>
  )
}

export default function ChatBar({ mode, setMode, section }: { mode: ChatMode; setMode: (m: ChatMode) => void; section?: string | null }) {
  const chat = (section && SECTION_CHAT[section]) || DEFAULT_CHAT
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [thinking, setThinking] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // Focus the input as soon as the panel exists
  useEffect(() => {
    if (mode !== 'panel' && mode !== 'chat') return
    const t = setTimeout(() => inputRef.current?.focus(), 180)
    return () => clearTimeout(t)
  }, [mode])

  // Click-outside returns to idle (smooth reverse morph)
  useEffect(() => {
    if (mode === 'idle') return
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMode('idle')
        setValue('')
        setMessages([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mode])

  const isIdle = mode === 'idle'
  const isPanel = mode === 'panel'
  const isChat = mode === 'chat'

  // Auto-scroll the chat body to the bottom when messages change
  useEffect(() => {
    if (!isChat) return
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking, isChat])

  async function sendUserMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || thinking) return
    const history = messages
    setMessages(prev => [...prev, { role: 'you', text: trimmed, time: formatTime() }])
    setValue('')
    setThinking(true)
    const reply = await fetchReply(trimmed, history, section)
    setMessages(prev => [...prev, { role: 'rigpai', text: reply, time: formatTime() }])
    setThinking(false)
  }

  async function pickSuggestion(text: string) {
    const trimmed = text.trim()
    if (!trimmed || thinking) return
    setMessages([{ role: 'you', text: trimmed, time: formatTime() }])
    setMode('chat')
    setValue('')
    setThinking(true)
    const reply = await fetchReply(trimmed, [], section)
    setMessages(prev => [...prev, { role: 'rigpai', text: reply, time: formatTime() }])
    setThinking(false)
  }

  function backToPanel() {
    setMessages([])
    setThinking(false)
    setMode('panel')
    setValue('')
  }

  function close() {
    setMode('idle')
    setMessages([])
    setThinking(false)
    setValue('')
  }

  // Vertical slide-swap between the resting pill and the open panel.
  const slideY = reduced ? 0 : 40
  const slideT = { duration: reduced ? 0.2 : 0.28, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div className="relative flex items-end justify-center">
      <style>{`
        @property --rg-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        .rigpai-ring::before {
          content: ''; position: absolute; inset: -1.5px; border-radius: inherit; z-index: -1;
          background: conic-gradient(from var(--rg-angle), #51C8FF, #E5C64C, #BB3308, #51C8FF);
          animation: rigpaiSpin 4.5s linear infinite; opacity: 0.3; transition: opacity 0.4s ease;
        }
        .rigpai-ring:hover::before { opacity: 1; }
        @keyframes rigpaiSpin { to { --rg-angle: 360deg; } }
        @media (prefers-reduced-motion: reduce) { .rigpai-ring::before { animation: none; } }
      `}</style>

      <AnimatePresence mode="wait" initial={false}>
        {isIdle ? (
          /* ── Resting pill ── */
          <motion.div
            key="pill"
            ref={containerRef}
            onClick={() => setMode('panel')}
            whileTap={{ scale: 0.97 }}
            initial={{ y: slideY, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: slideY, opacity: 0 }}
            transition={slideT}
            role="button"
            tabIndex={0}
            className="rigpai-ring relative flex items-center cursor-pointer rounded-full bg-[#1A1813] text-white hover:bg-[#242017] transition-colors duration-150 whitespace-nowrap"
            style={{ gap: 12, padding: '14px 20px', height: 44, borderRadius: 9999 }}
          >
            <BifLogo size={18} />
            <span className="text-[11px] leading-snug text-white font-mono tracking-[0.1em]">Ask Rigpai</span>
          </motion.div>
        ) : (
          /* ── Open panel / chat ── */
          <motion.div
            key="panel"
            ref={containerRef}
            initial={{ y: slideY, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: slideY, opacity: 0 }}
            transition={slideT}
            className="relative flex flex-col overflow-hidden bg-[#1A1813] text-white rounded-3xl"
            style={{ width: PANEL_WIDTH, maxHeight: isChat ? CHAT_MAX_HEIGHT : undefined, padding: '18px 26px' }}
          >
            {/* Header — Chat label / back, plus close */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36, flexShrink: 0, marginBottom: 16 }}>
              {isChat ? (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); backToPanel() }}
                  aria-label="Back"
                  style={{ outline: 'none', width: 36, height: 36, flexShrink: 0 }}
                  className="rounded-full bg-white/8 hover:bg-white/14 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <CaretLeft size={16} weight="bold" />
                </button>
              ) : (
                <span className="text-[11px] font-mono tracking-[0.12em] uppercase text-white/60">Chat</span>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); close() }}
                aria-label="Close chat"
                style={{ outline: 'none', width: 36, height: 36, flexShrink: 0 }}
                className="rounded-full bg-white/8 hover:bg-white/14 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            {/* Body */}
            {isPanel ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <p className="text-[11px] font-mono tracking-[0.12em] uppercase text-white/45">Rigpai</p>
                  <h2 className="text-[15px] leading-snug font-sans font-medium text-white tracking-tight">{chat.intro}</h2>
                </div>
                <div className="flex flex-wrap" style={{ gap: 8 }}>
                  {chat.suggestions.map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); pickSuggestion(s) }}
                      style={{ outline: 'none', padding: '10px 18px' }}
                      className={`text-[13px] font-sans rounded-full transition-colors ${
                        i === 0 ? 'bg-white text-[#1A1813] hover:bg-white/90' : 'bg-white/8 text-white/80 hover:bg-white/14 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                className="overflow-y-auto no-scrollbar"
                style={{ flex: 1, minHeight: 0, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 20, scrollbarWidth: 'none' }}
              >
                {messages.map((m, i) => {
                  const paragraphs = Array.isArray(m.text) ? m.text : [m.text]
                  const isReply = m.role === 'rigpai'
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: isReply ? 0.04 : 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                    >
                      <p className="text-[11px] font-mono tracking-[0.08em]">
                        <span className="text-white/70">{m.role === 'you' ? 'You' : 'Rigpai'}</span>{' '}
                        <span className="text-white/30">{m.time}</span>
                      </p>
                      {paragraphs.map((p, j) => (
                        <p key={j} className={`text-[15px] leading-snug font-sans font-normal ${m.role === 'you' ? 'text-white/55' : 'text-white'}`}>{p}</p>
                      ))}
                    </motion.div>
                  )
                })}

                {thinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    <p className="text-[11px] font-mono tracking-[0.08em]"><span className="text-white/70">Rigpai</span></p>
                    <span className="text-white/60"><TypingDots reduced={reduced} /></span>
                  </motion.div>
                )}
              </div>
            )}

            {/* Input row */}
            <div className="flex items-center flex-shrink-0" style={{ gap: 12 }}>
              <BifLogo size={18} />
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (isChat) sendUserMessage(value)
                    else pickSuggestion(value)
                  }
                }}
                aria-label="Ask Rigpai"
                placeholder={thinking ? 'Rigpai is thinking…' : 'Ask Rigpai'}
                style={{ outline: 'none', boxShadow: 'none', flex: 1, minWidth: 0 }}
                className="bg-transparent text-[13px] leading-snug text-white font-sans placeholder:text-white/40 caret-white"
              />
              <AnimatePresence initial={false}>
                {value.trim().length > 0 && !thinking && (
                  <motion.button
                    key="send"
                    type="button"
                    onClick={(e) => { e.stopPropagation(); if (isChat) sendUserMessage(value); else pickSuggestion(value) }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    aria-label="Send message"
                    className="flex-shrink-0 rounded-full bg-white text-[#1A1813] flex items-center justify-center hover:bg-white/90 active:scale-90 transition-transform"
                    style={{ width: 28, height: 28, outline: 'none' }}
                  >
                    <ArrowUp size={15} weight="bold" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, CaretLeft, ArrowUp } from '@phosphor-icons/react'
import BifLogo from './icons/BifLogo'

const spring = { type: 'spring' as const, stiffness: 320, damping: 24, mass: 0.6 }
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
  const [entering, setEntering] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const instantCloseRef = useRef(false)
  const reduced = useReducedMotion()

  // Entrance sequence: spend ~450ms as a small circle with a fast-spinning star,
  // then expand horizontally into the AMA pill.
  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 450)
    return () => clearTimeout(t)
  }, [])

  // idle → collapsed → input → panel
  useEffect(() => {
    if (mode === 'collapsed') {
      const t = setTimeout(() => setMode('input'), 180)
      return () => clearTimeout(t)
    }
    if (mode === 'input') {
      const t = setTimeout(() => setMode('panel'), 520)
      return () => clearTimeout(t)
    }
  }, [mode])

  // Focus the input as soon as it exists
  useEffect(() => {
    if (mode !== 'input' && mode !== 'panel' && mode !== 'chat') return
    const t = setTimeout(() => inputRef.current?.focus(), 220)
    return () => clearTimeout(t)
  }, [mode])

  // Reset instant-close flag once we're back at idle
  useEffect(() => {
    if (mode === 'idle') instantCloseRef.current = false
  }, [mode])

  // Click-outside returns to idle (no animation)
  useEffect(() => {
    if (mode === 'idle') return
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        instantCloseRef.current = true
        setMode('idle')
        setValue('')
        setMessages([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mode])

  const isIdle = mode === 'idle'
  const isCollapsed = mode === 'collapsed'
  const isInput = mode === 'input'
  const isPanel = mode === 'panel'
  const isChat = mode === 'chat'
  const hasInput = isInput || isPanel || isChat

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
    instantCloseRef.current = true
    setMode('idle')
    setMessages([])
    setThinking(false)
    setValue('')
  }

  // Slim multi-colour gradient ring that circles the pill (Gemini-style).
  const ringRadius = (isPanel || isChat) ? 24 : 9999

  return (
    <div className="relative flex items-end justify-center">
      <style>{`
        @property --rg-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .rigpai-ring { position: relative; border-radius: inherit; transition: border-radius 0.2s ease; }
        .rigpai-ring::before {
          content: '';
          position: absolute;
          inset: -1.5px;
          border-radius: inherit;
          z-index: -1;
          background: conic-gradient(from var(--rg-angle),
            #51C8FF, #E5C64C, #BB3308, #51C8FF);
          animation: rigpaiSpin 4.5s linear infinite;
          opacity: 0.3;
          transition: opacity 0.4s ease;
        }
        .rigpai-ring:hover::before { opacity: 1; }
        @keyframes rigpaiSpin { to { --rg-angle: 360deg; } }
        @media (prefers-reduced-motion: reduce) {
          .rigpai-ring::before { animation: none; }
        }
      `}</style>
      <div className={isIdle ? 'rigpai-ring' : ''} style={{ borderRadius: ringRadius }}>
      <motion.div
        ref={containerRef}
        layout
        onClick={() => { if (isIdle && !entering) setMode('collapsed') }}
        animate={
          entering
            ? { paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 14, height: 44 }
            : isCollapsed
              ? { paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 14, height: 44 }
              : isPanel
                ? { paddingLeft: 26, paddingRight: 26, paddingTop: 18, paddingBottom: 18, height: 'auto' as unknown as number }
                : isChat
                  ? { paddingLeft: 26, paddingRight: 26, paddingTop: 18, paddingBottom: 18, height: 'auto' as unknown as number }
                  : isInput
                    ? { paddingLeft: 20, paddingRight: 20, paddingTop: 14, paddingBottom: 14, height: 44 }
                    : { paddingLeft: 20, paddingRight: 20, paddingTop: 14, paddingBottom: 14, height: 44 }
        }
        whileTap={isIdle && !entering ? { scale: 0.97 } : undefined}
        transition={instantCloseRef.current ? { duration: 0 } : spring}
        role={isIdle ? 'button' : undefined}
        tabIndex={isIdle ? 0 : undefined}
        style={{ width: entering ? 44 : ((isPanel || isChat) ? PANEL_WIDTH : 'auto'), maxHeight: isChat ? CHAT_MAX_HEIGHT : undefined, padding: (isPanel || isChat) ? '18px 26px' : '14px 20px', height: (isPanel || isChat) ? undefined : 44 }}
        className={`relative flex flex-col overflow-hidden bg-[#1A1813] text-white transition-colors duration-150 ${(isPanel || isChat) ? 'rounded-3xl' : 'rounded-full'} ${isIdle ? 'cursor-pointer hover:bg-[#242017]' : 'cursor-text'} ${(isPanel || isChat) ? '' : 'whitespace-nowrap'}`}
      >
        {/* Panel header — Chat label + close (and back when chatting) */}
        {(isPanel || isChat) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36, flexShrink: 0, marginBottom: 16 }}>
            <AnimatePresence mode="wait" initial={false}>
              {isChat ? (
                <motion.button
                  key="back"
                  type="button"
                  onClick={(e) => { e.stopPropagation(); backToPanel() }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  aria-label="Back"
                  style={{ outline: 'none', width: 36, height: 36, flexShrink: 0 }}
                  className="rounded-full bg-white/8 hover:bg-white/14 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <CaretLeft size={16} weight="bold" />
                </motion.button>
              ) : (
                <motion.span
                  key="panel-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                  className="text-[11px] font-mono tracking-[0.12em] uppercase text-white/60"
                >
                  Chat
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              type="button"
              onClick={(e) => { e.stopPropagation(); close() }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              aria-label="Close chat"
              style={{ outline: 'none', width: 36, height: 36, flexShrink: 0 }}
              className="rounded-full bg-white/8 hover:bg-white/14 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X size={16} weight="bold" />
            </motion.button>
          </div>
        )}

        {/* Panel body */}
        <AnimatePresence mode="wait">
          {isPanel && (
            <motion.div
              key="panel-body"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 24 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p className="text-[11px] font-mono tracking-[0.12em] uppercase text-white/45">Rigpai</p>
                <h2 className="text-[15px] leading-snug font-sans font-medium text-white tracking-tight">
                  {chat.intro}
                </h2>
              </div>

              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {chat.suggestions.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); pickSuggestion(s) }}
                    style={{ outline: 'none', padding: '10px 18px' }}
                    className={`text-[13px] font-sans rounded-full transition-colors ${
                      i === 0
                        ? 'bg-white text-[#1A1813] hover:bg-white/90'
                        : 'bg-white/8 text-white/80 hover:bg-white/14 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {isChat && (
            <motion.div
              key="chat-body"
              ref={scrollRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              className="overflow-y-auto no-scrollbar"
              style={{
                paddingBottom: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                scrollbarWidth: 'none',
              }}
            >
              {messages.map((m, i) => {
                const paragraphs = Array.isArray(m.text) ? m.text : [m.text]
                const isReply = m.role === 'rigpai'
                return (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: isReply ? 0.04 : 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                  >
                    <p className="text-[11px] font-mono tracking-[0.08em]">
                      <span className="text-white/70">
                        {m.role === 'you' ? 'You' : 'Rigpai'}
                      </span>{' '}
                      <span className="text-white/30">{m.time}</span>
                    </p>
                    {paragraphs.map((p, j) => (
                      <p key={j} className={`text-[15px] leading-snug font-sans font-normal ${m.role === 'you' ? 'text-white/55' : 'text-white'}`}>
                        {p}
                      </p>
                    ))}
                  </motion.div>
                )
              })}

              {thinking && (
                <motion.div
                  layout
                  key="typing"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <p className="text-[11px] font-mono tracking-[0.08em]">
                    <span className="text-white/70">Rigpai</span>
                  </p>
                  <span className="text-white/60"><TypingDots reduced={reduced} /></span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logo + label/input row — always at the bottom */}
        <div className="flex items-center flex-shrink-0" style={{ gap: 12 }}>
          <motion.span
            className="flex-shrink-0"
            animate={reduced ? undefined : { scale: [1, 1.07, 1] }}
            transition={reduced ? undefined : { duration: 3.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
          >
            <BifLogo size={18} />
          </motion.span>

          <AnimatePresence initial={false} mode="wait">
            {isIdle && !entering && (
              <motion.span
                key="label"
                layout
                initial={{ width: 0, opacity: 0, marginLeft: -12 }}
                animate={{ width: 'auto', opacity: 1, marginLeft: 0 }}
                exit={{ width: 0, opacity: 0, marginLeft: -12 }}
                transition={spring}
                className="text-[11px] leading-snug text-white font-mono tracking-[0.1em] overflow-hidden whitespace-nowrap"
              >
                Ask Rigpai
              </motion.span>
            )}
            {hasInput && (
              <motion.div
                key="input"
                layout
                initial={{ width: 0, opacity: 0, marginLeft: -12 }}
                animate={{ width: (isPanel || isChat) ? PANEL_WIDTH - 80 : 360, opacity: 1, marginLeft: 0 }}
                exit={{ width: 0, opacity: 0, marginLeft: -12 }}
                transition={spring}
                className="overflow-hidden"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
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
                  style={{ outline: 'none', outlineOffset: 0, boxShadow: 'none', flex: 1, minWidth: 0 }}
                  className="bg-transparent text-[13px] leading-snug text-white font-sans placeholder:text-white/40 caret-white"
                />
                <AnimatePresence initial={false}>
                  {value.trim().length > 0 && !thinking && (
                    <motion.button
                      key="send"
                      type="button"
                      onClick={(e) => { e.stopPropagation(); if (isChat) sendUserMessage(value); else pickSuggestion(value) }}
                      initial={{ opacity: 0, scale: 0.5, width: 0, marginLeft: -8 }}
                      animate={{ opacity: 1, scale: 1, width: 28, marginLeft: 0 }}
                      exit={{ opacity: 0, scale: 0.5, width: 0, marginLeft: -8 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      aria-label="Send message"
                      className="flex-shrink-0 rounded-full bg-white text-[#1A1813] flex items-center justify-center hover:bg-white/90 active:scale-90 transition-transform"
                      style={{ height: 28, outline: 'none' }}
                    >
                      <ArrowUp size={15} weight="bold" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      </div>
    </div>
  )
}

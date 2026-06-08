'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import PageReveal from '../PageReveal';
import BPHumanAbundanceHero from '../brand-playbook/BPHumanAbundanceHero';

/* eslint-disable @next/next/no-img-element */

const ease = [0.16, 1, 0.3, 1] as const;
const SERIF = "'Brasil', Georgia, serif";
const BODY = "'Public Sans', system-ui, sans-serif";

const DARK = '#0e0e0a';
const PAPER = '#F4EFE6';
const EMBER = '#BB3308';
const INK = '#232323';
// Ember reads on both the dark and cream blocks, so one accent serves all.

const IMG = (n: number) => `/humanabundance/ha-${String(n).padStart(2, '0')}.jpg`;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z]/g, '');

/** Justified, uppercase Brasil headline with word-by-word rise; key words accent in ember. */
function JustifiedReveal({ text, color, accent = EMBER, highlight = [] }: { text: string; color: string; accent?: string; highlight?: string[] }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const set = new Set(highlight.map(norm));
  const words = text.split(' ');
  return (
    <h2 ref={ref} style={{ margin: 0, fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(40px, 8.2vw, 150px)', lineHeight: 'normal', letterSpacing: '-0.03em', textAlign: 'justify', textTransform: 'uppercase', color }}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.15em', marginBottom: '-0.15em' }}>
            <motion.span
              style={{ display: 'inline-block', color: set.has(norm(w)) ? accent : color }}
              initial={{ y: '115%' }} animate={inView ? { y: '0%' } : { y: '115%' }}
              transition={{ duration: 0.9, delay: 0.05 + i * 0.05, ease }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </h2>
  );
}

/** A statement section — one or two justified lines on a full-bleed background. */
function Block({ bg, color, accent, lines }: { bg: string; color: string; accent: string; lines: { text: string; highlight?: string[] }[] }) {
  return (
    <section style={{ background: bg, padding: 'clamp(80px, 11vw, 168px) clamp(24px, 4vw, 56px)' }}>
      <div style={{ maxWidth: 1512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 3vw, 48px)' }}>
        {lines.map((l, i) => <JustifiedReveal key={i} text={l.text} color={color} accent={accent} highlight={l.highlight} />)}
      </div>
    </section>
  );
}

const PILLARS = [
  { name: 'Mindful Societies', bg: INK, color: PAPER, body: 'As information becomes infinite, attention becomes precious. Mindful Societies explores how individuals, communities and institutions cultivate presence, meaning and belonging in an age of constant stimulation — keeping human wellbeing in step with technological change.' },
  { name: 'Intelligent Economies', bg: EMBER, color: PAPER, body: 'As capability expands through AI, automation and digital infrastructure, the question is no longer what technology can do, but who it empowers. Intelligent Economies explores how innovation, ownership and opportunity create broader participation, agency and prosperity.' },
  { name: 'Regenerative Systems', bg: PAPER, color: INK, body: 'The future cannot be built on extraction alone. Regenerative Systems explores how economies, cities and infrastructures can generate growth while renewing the ecological and social systems they depend upon.' },
];

type Tile = { type: 'img'; n: number } | { type: 'text'; idx: number };

/** A flowing 4-column masonry — original aspect ratios, no cropping. */
function Masonry({ tiles, bg = DARK }: { tiles: Tile[]; bg?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.9, ease }}
      style={{ background: bg, padding: 'clamp(40px, 6vw, 88px) clamp(12px, 2vw, 24px)' }}
    >
      <div className="va-masonry">
        {tiles.map((t, i) =>
          t.type === 'img' ? (
            <img key={`i${i}`} src={IMG(t.n)} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          ) : (
            <div key={`t${i}`} className="va-tile" style={{ background: PILLARS[t.idx].bg, color: PILLARS[t.idx].color }}>
              <h3>{PILLARS[t.idx].name}</h3>
              <p style={{ opacity: 0.82 }}>{PILLARS[t.idx].body}</p>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}

const imgs = (from: number, to: number): Tile[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({ type: 'img', n: from + i }));

// Block A (middle) — first half, images only.
const TILES_A: Tile[] = imgs(1, 21);

// Block B (end) — second half with the three pillar tiles woven through.
const TILES_B: Tile[] = (() => {
  const out: Tile[] = [];
  const at = [27, 33, 39]; let p = 0;
  for (let n = 22; n <= 42; n++) {
    if (n === 29) continue; // removed
    out.push({ type: 'img', n });
    if (at.includes(n) && p < PILLARS.length) { out.push({ type: 'text', idx: p }); p++; }
  }
  return out;
})();

export default function VisionSection() {
  return (
    <PageReveal current="vision">
      <div style={{ background: DARK, color: PAPER, overflow: 'hidden', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <style>{`
          .va-masonry { column-count: 4; column-gap: 14px; }
          .va-masonry > * { break-inside: avoid; margin-bottom: 14px; }
          .va-masonry img { width: 100%; height: auto; display: block; border-radius: 6px; }
          .va-tile { border-radius: 6px; padding: clamp(20px, 1.6vw, 28px); border: 1px solid rgba(0,0,0,0.1); }
          .va-tile h3 { font-family: ${SERIF}; font-weight: 500; font-size: clamp(20px, 1.5vw, 26px); letter-spacing: -0.01em; margin: 0 0 12px; }
          .va-tile p { font-family: ${BODY}; font-size: 14px; line-height: 1.6; margin: 0; }
          @media (max-width: 1100px) { .va-masonry { column-count: 3; } }
          @media (max-width: 600px) { .va-masonry { column-count: 2; } }
        `}</style>

        {/* Opener */}
        <BPHumanAbundanceHero />

        {/* 1 */}
        <Block bg={PAPER} color={INK} accent={EMBER} lines={[{ text: 'Humanity has spent centuries solving scarcity. Today, we face a different challenge.', highlight: ['scarcity', 'challenge'] }]} />

        {/* 2 — merged: question + limitation */}
        <Block bg={DARK} color={PAPER} accent={EMBER} lines={[
          { text: 'What happens when intelligence becomes abundant?', highlight: ['intelligence', 'abundant'] },
          { text: 'But intelligence alone does not create meaning. Capability alone does not create purpose.', highlight: ['meaning', 'purpose'] },
        ]} />

        {/* Masonry A — middle of the page */}
        <Masonry tiles={TILES_A} />

        {/* 3 — the scarce, human things: centered paragraph */}
        <section style={{ background: DARK, color: PAPER, padding: 'clamp(80px, 12vw, 180px) clamp(24px, 5vw, 80px)' }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.8, ease }}
            style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(20px, 2.4vw, 32px)', lineHeight: 1.4, letterSpacing: '-0.01em' }}
          >
            As we advance, humanity searches for what remains scarce — <span style={{ color: EMBER }}>presence, belonging, trust, purpose, connection</span>. The things that remain human.
          </motion.p>
        </section>

        {/* 4 — merged: thesis + conclusion */}
        <Block bg={PAPER} color={INK} accent={EMBER} lines={[
          { text: 'Progress should be measured not by the intelligence of our systems, but by the flourishing of our people.', highlight: ['flourishing', 'people'] },
          { text: 'Not by what we produce, but by what we become. This is Human Abundance.', highlight: ['become', 'human', 'abundance'] },
        ]} />

        {/* Masonry B — end of the page, with pillar tiles woven in */}
        <div style={{ paddingBottom: 'clamp(64px, 10vw, 140px)', background: PAPER }}>
          <Masonry tiles={TILES_B} bg={PAPER} />
        </div>
      </div>
    </PageReveal>
  );
}

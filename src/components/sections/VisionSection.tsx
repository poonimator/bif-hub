'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import PageReveal from '../PageReveal';
import BPHumanAbundanceHero from '../brand-playbook/BPHumanAbundanceHero';

/* eslint-disable @next/next/no-img-element */

const ease = [0.16, 1, 0.3, 1] as const;
const SERIF = "'Brasil', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";
const BODY = "'Public Sans', system-ui, sans-serif";

const DARK = '#0e0e0a';
const PAPER = '#F4EFE6';
const EMBER = '#BB3308';
const INK = '#232323';

const IMG = (n: number) => `/humanabundance/ha-${String(n).padStart(2, '0')}.jpg`;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z]/g, '');

/** Justified, uppercase Brasil headline with word-by-word rise; key words accent in ember. */
function JustifiedReveal({ text, color, highlight = [] }: { text: string; color: string; highlight?: string[] }) {
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
              style={{ display: 'inline-block', color: set.has(norm(w)) ? EMBER : color }}
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
function Block({ bg, color, lines }: { bg: string; color: string; lines: { text: string; highlight?: string[] }[] }) {
  return (
    <section style={{ background: bg, padding: 'clamp(80px, 11vw, 168px) clamp(24px, 4vw, 56px)' }}>
      <div style={{ maxWidth: 1512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 3vw, 48px)' }}>
        {lines.map((l, i) => <JustifiedReveal key={i} text={l.text} color={color} highlight={l.highlight} />)}
      </div>
    </section>
  );
}

/** A full-width band of images (the half distributed through the manifesto). */
function ImageBand({ from, to }: { from: number; to: number }) {
  const ns = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  return (
    <motion.div
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, ease }}
      style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, gap: 10, padding: '0 10px', background: DARK }}
    >
      {ns.map((n) => (
        <img key={n} src={IMG(n)} alt="" aria-hidden="true" loading="lazy" style={{ width: '100%', height: 'clamp(150px, 20vw, 280px)', objectFit: 'cover', display: 'block', borderRadius: 6 }} />
      ))}
    </motion.div>
  );
}

const PILLARS = [
  { name: 'Mindful Societies', bg: INK, color: PAPER, body: 'As information becomes infinite, attention becomes precious. Mindful Societies explores how individuals, communities and institutions cultivate presence, meaning and belonging in an age of constant stimulation — keeping human wellbeing in step with technological change.' },
  { name: 'Intelligent Economies', bg: EMBER, color: PAPER, body: 'As capability expands through AI, automation and digital infrastructure, the question is no longer what technology can do, but who it empowers. Intelligent Economies explores how innovation, ownership and opportunity create broader participation, agency and prosperity.' },
  { name: 'Regenerative Systems', bg: PAPER, color: INK, body: 'The future cannot be built on extraction alone. Regenerative Systems explores how economies, cities and infrastructures can generate growth while renewing the ecological and social systems they depend upon.' },
];

// Bottom masonry: the other half of the images (22–42) with pillar tiles blended in.
type Tile = { type: 'img'; n: number } | { type: 'text'; idx: number };
const TILES: Tile[] = (() => {
  const out: Tile[] = [];
  const at = [26, 33, 40]; let p = 0;
  for (let n = 22; n <= 42; n++) {
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
          .va-tile { border-radius: 6px; padding: clamp(20px, 1.6vw, 28px); }
          .va-tile h3 { font-family: ${SERIF}; font-weight: 500; font-size: clamp(20px, 1.5vw, 26px); letter-spacing: -0.01em; margin: 0 0 12px; }
          .va-tile p { font-family: ${BODY}; font-size: 14px; line-height: 1.6; margin: 0; }
          @media (max-width: 1100px) { .va-masonry { column-count: 3; } }
          @media (max-width: 600px) { .va-masonry { column-count: 2; } }
        `}</style>

        {/* Opener */}
        <BPHumanAbundanceHero />

        {/* 1 */}
        <Block bg={PAPER} color={INK} lines={[{ text: 'Humanity has spent centuries solving scarcity. Today, we face a different challenge.', highlight: ['scarcity', 'challenge'] }]} />
        <ImageBand from={1} to={6} />

        {/* 2 — merged: question + limitation */}
        <Block bg={DARK} color={PAPER} lines={[
          { text: 'What happens when intelligence becomes abundant?', highlight: ['intelligence', 'abundant'] },
          { text: 'But intelligence alone does not create meaning. Capability alone does not create purpose.', highlight: ['meaning', 'purpose'] },
        ]} />
        <ImageBand from={7} to={12} />

        {/* 3 — the scarce, human things: centered paragraph with image above */}
        <section style={{ background: PAPER, color: INK, padding: 'clamp(64px, 9vw, 140px) clamp(24px, 5vw, 80px) clamp(80px, 11vw, 168px)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(28px, 4vw, 48px)' }}>
            <motion.img
              src={IMG(13)} alt="" aria-hidden="true" loading="lazy"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.9, ease }}
              style={{ width: '100%', maxWidth: 560, height: 'auto', borderRadius: 8, display: 'block' }}
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.8, ease }}
              style={{ margin: 0, fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(20px, 2.4vw, 32px)', lineHeight: 1.4, letterSpacing: '-0.01em' }}
            >
              As we advance, humanity searches for what remains scarce — <span style={{ color: EMBER }}>presence, belonging, trust, purpose, connection</span>. The things that remain human.
            </motion.p>
          </div>
        </section>
        <ImageBand from={14} to={21} />

        {/* 4 — merged: thesis + conclusion */}
        <Block bg={DARK} color={PAPER} lines={[
          { text: 'Progress should be measured not by the intelligence of our systems, but by the flourishing of our people.', highlight: ['flourishing', 'people'] },
          { text: 'Not by what we produce, but by what we become. This is Human Abundance.', highlight: ['become', 'human', 'abundance'] },
        ]} />

        {/* Bottom masonry — the other half + blended pillar tiles */}
        <div style={{ background: DARK, padding: 'clamp(48px, 6vw, 96px) clamp(12px, 2vw, 24px) clamp(112px, 16vw, 200px)' }}>
          <div className="va-masonry">
            {TILES.map((t, i) =>
              t.type === 'img' ? (
                <img key={`i${i}`} src={IMG(t.n)} alt="" aria-hidden="true" loading="lazy" />
              ) : (
                <div key={`t${i}`} className="va-tile" style={{ background: PILLARS[t.idx].bg, color: PILLARS[t.idx].color }}>
                  <h3>{PILLARS[t.idx].name}</h3>
                  <p style={{ opacity: 0.82 }}>{PILLARS[t.idx].body}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </PageReveal>
  );
}

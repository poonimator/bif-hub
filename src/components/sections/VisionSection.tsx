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

/**
 * Justified, uppercase Brasil headline with a word-by-word rise reveal —
 * the BPHero treatment, reused for the manifesto statements.
 */
function JustifiedReveal({ text, color, accent }: { text: string; color: string; accent?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const words = text.split(' ');
  return (
    <h2
      ref={ref}
      style={{
        margin: 0, fontFamily: SERIF, fontWeight: 500,
        fontSize: 'clamp(40px, 8.2vw, 150px)', lineHeight: 'normal',
        letterSpacing: '-0.03em', textAlign: 'justify', textTransform: 'uppercase', color,
      }}
    >
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.15em', marginBottom: '-0.15em' }}>
            <motion.span
              style={{ display: 'inline-block', color: accent && i === words.length - 1 ? accent : color }}
              initial={{ y: '115%' }}
              animate={inView ? { y: '0%' } : { y: '115%' }}
              transition={{ duration: 0.9, delay: 0.05 + i * 0.06, ease }}
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

function Block({ bg, color, text, accent }: { bg: string; color: string; text: string; accent?: string }) {
  return (
    <section style={{ background: bg, padding: 'clamp(80px, 11vw, 168px) clamp(24px, 4vw, 56px)' }}>
      <div style={{ maxWidth: 1512, margin: '0 auto' }}>
        <JustifiedReveal text={text} color={color} accent={accent} />
      </div>
    </section>
  );
}

const MANIFESTO: { bg: string; color: string; text: string; accent?: string }[] = [
  { bg: PAPER, color: INK, text: 'Humanity has spent centuries solving scarcity. Today, we face a different challenge.' },
  { bg: EMBER, color: PAPER, text: 'What happens when intelligence becomes abundant?' },
  { bg: DARK, color: PAPER, text: 'But intelligence alone does not create meaning. Capability alone does not create purpose.' },
  { bg: PAPER, color: INK, text: 'As we advance, humanity searches for what remains scarce. Presence. Belonging. Trust. Purpose. Connection. The things that remain human.' },
  { bg: EMBER, color: PAPER, text: 'Progress should be measured not by the intelligence of our systems, but by the flourishing of our people.' },
  { bg: DARK, color: PAPER, text: 'Not by what we produce, but by what we become. This is Human Abundance.', accent: EMBER },
];

// Pillar text tiles, blended into the masonry among the images.
const PILLARS = [
  { name: 'Mindful Societies', bg: INK, color: PAPER, body: 'As information becomes infinite, attention becomes precious. Mindful Societies explores how individuals, communities and institutions cultivate presence, meaning and belonging in an age of constant stimulation — keeping human wellbeing in step with technological change.' },
  { name: 'Intelligent Economies', bg: EMBER, color: PAPER, body: 'As capability expands through AI, automation and digital infrastructure, the question is no longer what technology can do, but who it empowers. Intelligent Economies explores how innovation, ownership and opportunity create broader participation, agency and prosperity.' },
  { name: 'Regenerative Systems', bg: PAPER, color: INK, body: 'The future cannot be built on extraction alone. Regenerative Systems explores how economies, cities and infrastructures can generate growth while renewing the ecological and social systems they depend upon.' },
];

// Build the masonry sequence: 42 images with the 3 pillar tiles blended in.
type Tile = { type: 'img'; n: number } | { type: 'text'; idx: number };
const TILES: Tile[] = (() => {
  const out: Tile[] = [];
  const at = [5, 17, 30]; // positions to drop the pillar text tiles
  let p = 0;
  for (let n = 1; n <= 42; n++) {
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

        {/* Opener — Human Abundance hero (mountains + script mark) */}
        <BPHumanAbundanceHero />

        {/* Manifesto — BPHero justified-reveal treatment */}
        {MANIFESTO.map((m, i) => <Block key={i} {...m} />)}

        {/* Masonry — all images, with pillar content blended in as text tiles */}
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

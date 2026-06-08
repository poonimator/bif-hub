'use client';

import { motion } from 'framer-motion';
import PageReveal from '../PageReveal';
import BPHumanAbundanceHero from '../brand-playbook/BPHumanAbundanceHero';

/* eslint-disable @next/next/no-img-element */

const ease = [0.16, 1, 0.3, 1] as const;
const SERIF = "'Brasil', Georgia, serif";
const MONO = "'Space Mono', 'Courier New', monospace";

const DARK = '#0e0e0a';
const PAPER = '#F4EFE6';
const EMBER = '#BB3308';
const INK = '#16150F';

const IMG = (n: number) => `/humanabundance/ha-${String(n).padStart(2, '0')}.jpg`;
const ALL = Array.from({ length: 42 }, (_, i) => i + 1);

const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.5 },
  transition: { duration: 0.9, ease },
};

/** A full-bleed brand-style statement section. */
function Statement({
  bg, color, children, size = 'clamp(28px, 4vw, 60px)', pad = 'clamp(96px, 16vh, 220px)', maxW = 900,
}: {
  bg: string; color: string; children: React.ReactNode; size?: string; pad?: string; maxW?: number;
}) {
  return (
    <section style={{ background: bg, color, padding: `${pad} clamp(24px, 5vw, 80px)` }}>
      <motion.div
        {...reveal}
        style={{
          maxWidth: maxW, margin: '0 auto', textAlign: 'center',
          fontFamily: SERIF, fontWeight: 500, fontSize: size, lineHeight: 1.12, letterSpacing: '-0.02em',
          display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.4vw, 32px)',
        }}
      >
        {children}
      </motion.div>
    </section>
  );
}

const PILLARS = [
  { name: 'Mindful Societies', img: IMG(7), body: 'As information becomes infinite, attention becomes precious. Mindful Societies explores how individuals, communities and institutions cultivate presence, meaning and belonging in an age of constant stimulation, ensuring that human wellbeing keeps pace with technological change.' },
  { name: 'Intelligent Economies', img: IMG(23), body: 'As capability expands through AI, automation and digital infrastructure, the question is no longer what technology can do, but who it empowers. Intelligent Economies explores how innovation, ownership and opportunity can create broader participation, agency and prosperity in the Intelligent Age.' },
  { name: 'Regenerative Systems', img: IMG(36), body: 'The future cannot be built on extraction alone. Regenerative Systems explores how economies, cities and infrastructures can generate growth while renewing the ecological and social systems they depend upon, creating long-term resilience for people, communities and the planet.' },
];

export default function VisionSection() {
  return (
    <PageReveal current="vision">
      <div style={{ background: DARK, color: PAPER, overflow: 'hidden', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <style>{`
          .va-masonry { column-count: 4; column-gap: 12px; }
          .va-masonry img { width: 100%; height: auto; display: block; margin-bottom: 12px; break-inside: avoid; border-radius: 6px; }
          @media (max-width: 1100px) { .va-masonry { column-count: 3; } }
          @media (max-width: 600px) { .va-masonry { column-count: 2; } }
          .va-pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(24px, 3vw, 48px); }
          @media (max-width: 820px) { .va-pillars { grid-template-columns: 1fr; gap: clamp(40px, 9vw, 64px); } }
        `}</style>

        {/* Opener — brand Human Abundance hero (mountains + script mark) */}
        <BPHumanAbundanceHero />

        {/* Manifesto — brand-style statement sections */}
        <Statement bg={DARK} color={PAPER}>
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E5C64C', fontWeight: 400 }}>The Worldview</span>
          <span>Humanity has spent centuries solving scarcity.</span>
          <span style={{ color: 'rgba(244,239,230,0.62)' }}>Today, we face a different challenge.</span>
        </Statement>

        <Statement bg={EMBER} color={PAPER} size="clamp(34px, 5vw, 76px)">
          <span>What happens when intelligence becomes abundant?</span>
        </Statement>

        <Statement bg={PAPER} color={INK} size="clamp(24px, 3.2vw, 44px)">
          <span style={{ color: '#8A8473' }}>Artificial intelligence can generate knowledge. Algorithms can create at scale. Machines can perform tasks once reserved for experts.</span>
          <span style={{ fontSize: 'clamp(30px, 4vw, 60px)' }}>But intelligence alone does not create meaning.</span>
          <span style={{ fontSize: 'clamp(30px, 4vw, 60px)' }}>Capability alone does not create purpose.</span>
        </Statement>

        {/* Full-bleed image break */}
        <motion.div {...reveal} style={{ width: '100%', height: 'clamp(280px, 56vh, 640px)', overflow: 'hidden' }}>
          <img src={IMG(15)} alt="" aria-hidden="true" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </motion.div>

        {/* The scarce, human things */}
        <Statement bg={DARK} color={PAPER}>
          <span style={{ color: 'rgba(244,239,230,0.62)', fontSize: 'clamp(20px, 2.4vw, 30px)' }}>As technology advances, humanity finds itself searching for what remains scarce.</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2px, 0.6vw, 8px)', marginTop: 'clamp(12px, 2vw, 28px)' }}>
            {['Presence.', 'Belonging.', 'Trust.', 'Purpose.', 'Connection.'].map((w, i) => (
              <motion.span key={w} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.7 }} transition={{ duration: 0.6, ease, delay: i * 0.08 }} style={{ fontSize: 'clamp(40px, 7vw, 104px)', lineHeight: 1.04 }}>
                {w}
              </motion.span>
            ))}
          </div>
          <span style={{ color: 'rgba(244,239,230,0.62)', fontSize: 'clamp(20px, 2.4vw, 30px)', marginTop: 'clamp(20px, 3vw, 40px)' }}>The things that remain human.</span>
        </Statement>

        {/* The belief */}
        <Statement bg={EMBER} color={PAPER} size="clamp(28px, 3.6vw, 54px)" maxW={1000}>
          <span>Human Abundance is the belief that progress should be measured not by the intelligence of our systems, but by the flourishing of our people.</span>
        </Statement>

        <Statement bg={DARK} color={PAPER}>
          <span style={{ color: 'rgba(244,239,230,0.62)' }}>Not by what we produce.</span>
          <span>But by what we become.</span>
          <span style={{ color: 'rgba(244,239,230,0.62)', fontSize: 'clamp(20px, 2.4vw, 30px)', marginTop: 'clamp(16px, 2vw, 28px)' }}>The future belongs to societies that can expand both capability and consciousness — both prosperity and purpose, both innovation and wisdom.</span>
        </Statement>

        {/* Full-bleed image break */}
        <motion.div {...reveal} style={{ width: '100%', height: 'clamp(280px, 56vh, 640px)', overflow: 'hidden' }}>
          <img src={IMG(29)} alt="" aria-hidden="true" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </motion.div>

        <Statement bg={DARK} color={PAPER} size="clamp(44px, 8vw, 120px)">
          <span style={{ color: EMBER }}>This is Human Abundance.</span>
          <span style={{ color: 'rgba(244,239,230,0.62)', fontSize: 'clamp(20px, 2.4vw, 30px)' }}>A future where humanity flourishes in an age of abundant intelligence.</span>
        </Statement>

        {/* Masonry gallery */}
        <div style={{ padding: '0 clamp(12px, 2vw, 24px) clamp(40px, 6vw, 96px)' }}>
          <div className="va-masonry">
            {ALL.map((n) => (<img key={n} src={IMG(n)} alt="" aria-hidden="true" loading="lazy" />))}
          </div>
        </div>

        {/* Three pillars */}
        <section style={{ background: DARK, color: PAPER, padding: 'clamp(40px, 6vw, 96px) clamp(24px, 5vw, 80px) clamp(112px, 16vw, 200px)' }}>
          <div className="va-pillars" style={{ maxWidth: 1440, margin: '0 auto' }}>
            {PILLARS.map((p) => (
              <motion.div key={p.name} {...reveal} style={{ display: 'flex', flexDirection: 'column' }}>
                <img src={p.img} alt="" aria-hidden="true" loading="lazy" style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 8, display: 'block' }} />
                <h3 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 'clamp(22px, 2.4vw, 32px)', letterSpacing: '-0.01em', margin: '22px 0 12px' }}>{p.name}</h3>
                <p style={{ fontFamily: "'Public Sans', system-ui, sans-serif", fontSize: 16, lineHeight: 1.6, color: 'rgba(244,239,230,0.66)', margin: 0 }}>{p.body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageReveal>
  );
}

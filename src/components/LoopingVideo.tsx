'use client';

import { useEffect, useRef } from 'react';

// smoothstep — eases the dissolve so it doesn't start/stop abruptly
function ease(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

interface LoopingVideoProps {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  playbackRate?: number;     // 1 = normal speed; <1 slows the footage
  crossfadeSeconds?: number; // wall-clock length of the loop dissolve
  playing?: boolean;         // false → pause both videos + stop the rAF loop
}

export default function LoopingVideo({ src, poster, className, style, playbackRate = 0.6, crossfadeSeconds = 2, playing = true }: LoopingVideoProps) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const active = useRef<'a' | 'b'>('a');

  const callerZ = typeof style?.zIndex === 'number' ? style.zIndex : 1;

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;
    // Paused (e.g. a section overlay covers the grid): stop decoding entirely.
    if (!playing) { a.pause(); b.pause(); return; }

    const rate = playbackRate;
    const CROSSFADE = crossfadeSeconds * rate; // window measured in video-time

    a.playbackRate = rate;
    b.playbackRate = rate;
    a.play().catch(() => {});

    let raf: number;

    // Guarded writes — only touch the DOM when a value actually changes, so
    // steady-state frames (the common case) do reads only and trigger no
    // style recalc. With 8 videos on the homepage this avoids ~240 redundant
    // style writes per second.
    const setOp = (el: HTMLVideoElement, v: number | string) => {
      const s = typeof v === 'number' ? String(v) : v;
      if (el.style.opacity !== s) el.style.opacity = s;
    };
    function setLayers(primary: HTMLVideoElement, secondary: HTMLVideoElement) {
      // Outgoing/primary sits ON TOP and fades out over the fully-opaque incoming
      const p = String(callerZ);
      const s = String(callerZ - 1);
      if (primary.style.zIndex !== p) primary.style.zIndex = p;
      if (secondary.style.zIndex !== s) secondary.style.zIndex = s;
    }

    function tick() {
      const primary   = active.current === 'a' ? a! : b!;
      const secondary = active.current === 'a' ? b! : a!;

      if (primary.duration && primary.duration > 0) {
        const elapsed   = primary.currentTime;
        const remaining = primary.duration - elapsed;

        if (remaining <= CROSSFADE) {
          // Dissolve: incoming held fully opaque underneath, outgoing fades out on top
          setLayers(primary, secondary);

          if (secondary.paused) {
            secondary.currentTime = 0;
            secondary.playbackRate = rate;
            setOp(secondary, 1);
            secondary.play().catch(() => {});
          }

          setOp(primary, 1 - ease(1 - remaining / CROSSFADE));
          setOp(secondary, 1);

          if (remaining <= 0.05) {
            active.current = active.current === 'a' ? 'b' : 'a';
            primary.pause();
            primary.currentTime = 0;
            setOp(primary, 0);
            // new primary (the incoming) takes the top layer
            setLayers(secondary, primary);
            setOp(secondary, 1);
          }
        } else if (elapsed < CROSSFADE) {
          // Initial fade-in over the static poster
          setLayers(primary, secondary);
          setOp(primary, ease(elapsed / CROSSFADE));
          setOp(secondary, 0);
        } else {
          setLayers(primary, secondary);
          setOp(primary, 1);
          setOp(secondary, 0);
        }
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [src, callerZ, playbackRate, crossfadeSeconds, playing]);

  // Strip opacity/animation/zIndex from caller — we own those entirely
  const { opacity: _o, animation: _a, zIndex: _z, ...passthroughStyle } = style ?? {};

  const base: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top',
    pointerEvents: 'none',
    ...passthroughStyle,
  };

  return (
    <>
      <video
        ref={aRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className={className}
        style={{ ...base, opacity: 0, zIndex: callerZ }}
      />
      <video
        ref={bRef}
        src={src}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className={className}
        style={{ ...base, opacity: 0, zIndex: callerZ - 1 }}
      />
    </>
  );
}

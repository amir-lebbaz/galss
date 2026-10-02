import React, { useEffect, useRef, useState } from 'react';
import { BackdropTheme, HERO_BACKDROP_IMAGE } from '../data/catalog';

interface SupernaturalBackdropProps {
  theme: BackdropTheme;
  reducedMotion: boolean;
}

export const SupernaturalBackdrop: React.FC<SupernaturalBackdropProps> = ({
  theme,
  reducedMotion,
}) => {
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorAuraRef = useRef<HTMLDivElement>(null);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  useEffect(() => {
    if (reducedMotion) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let auraX = mouseX;
    let auraY = mouseY;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('button, a, input, textarea, select, [data-cursor-interactive]');
      setIsHoveringInteractive(Boolean(interactive));
    };

    const animateFollow = () => {
      // Smooth spring interpolation for the outer magnetic ring and ambient light aura
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      auraX += (mouseX - auraX) * 0.09;
      auraY += (mouseY - auraY) * 0.09;

      if (cursorRingRef.current) {
        const scale = isHoveringInteractive ? 1.55 : 1;
        cursorRingRef.current.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0) scale(${scale})`;
      }

      if (cursorAuraRef.current) {
        cursorAuraRef.current.style.transform = `translate3d(${auraX - 260}px, ${auraY - 260}px, 0)`;
      }

      rafId = requestAnimationFrame(animateFollow);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animateFollow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion, isHoveringInteractive]);

  return (
    <>
      {/* Fixed vivid multi-layered backdrop whose colors bleed through every glass panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#060813]"
      >
        {/* Photographic / studio light refraction base layer with Zero-Broken-Image fallback */}
        {imageLoaded && (
          <img
            src={HERO_BACKDROP_IMAGE}
            alt="خلفية ضوئية متدرجة"
            referrerPolicy="no-referrer"
            onError={() => setImageLoaded(false)}
            className="h-full w-full object-cover opacity-50 scale-105 transition-opacity duration-700"
          />
        )}

        {/* Dynamic theme color bleed overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.tintOverlay} transition-colors duration-700`}
        />

        {/* Supernatural floating aurora orbs */}
        <div
          className="animate-aurora-1 absolute -top-32 -right-24 h-[620px] w-[620px] rounded-full blur-3xl opacity-80"
          style={{ background: theme.orbOne }}
        />
        <div
          className="animate-aurora-2 absolute top-1/3 -left-36 h-[560px] w-[560px] rounded-full blur-3xl opacity-75"
          style={{ background: theme.orbTwo }}
        />
        <div
          className="animate-pulse-aura absolute -bottom-40 right-1/4 h-[640px] w-[640px] rounded-full blur-3xl opacity-70"
          style={{ background: theme.orbThree }}
        />

        {/* Cursor-following ambient refraction spotlight that bleeds through glass panels */}
        {!reducedMotion && (
          <div
            ref={cursorAuraRef}
            className="hidden lg:block absolute top-0 left-0 h-[520px] w-[520px] rounded-full pointer-events-none opacity-65"
            style={{
              background:
                'radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, rgba(99, 102, 241, 0.18) 45%, rgba(0, 0, 0, 0) 72%)',
              willChange: 'transform',
            }}
          />
        )}

        {/* Measured contrast scrim to preserve >= 4.5:1 WCAG AA readability across all regions */}
        <div className="absolute inset-0 bg-slate-950/35" />
      </div>

      {/* Supernatural Magnetic Custom Cursor Follower (Desktop only, respects reduced motion) */}
      {!reducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 hidden lg:block overflow-hidden"
        >
          <div
            ref={cursorRingRef}
            className={`absolute top-0 left-0 h-10 w-10 rounded-full border transition-colors duration-150 ${
              isHoveringInteractive
                ? 'border-amber-300/90 bg-amber-400/15 shadow-[0_0_24px_rgba(251,191,36,0.45)]'
                : 'border-white/45 bg-white/5'
            }`}
            style={{
              backdropFilter: 'blur(4px)',
              willChange: 'transform',
            }}
          />
          <div
            ref={cursorDotRef}
            className="absolute top-0 left-0 h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_12px_#fbbf24]"
            style={{ willChange: 'transform' }}
          />
        </div>
      )}
    </>
  );
};

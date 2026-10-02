import React, { useRef, useState } from 'react';

interface GlassTiltCardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  disabledTilt?: boolean;
  intensity?: number;
  onClick?: () => void;
}

export const GlassTiltCard: React.FC<GlassTiltCardProps> = ({
  children,
  className = '',
  elevated = false,
  disabledTilt = false,
  intensity = 5.5,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabledTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setTransformStyle(
      `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.008, 1.008, 1.008)`
    );
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22,
    });
  };

  const handleMouseLeave = () => {
    if (disabledTilt) return;
    setTransformStyle('perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: disabledTilt ? undefined : transformStyle,
        transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: disabledTilt ? undefined : 'transform',
      }}
      className={`relative overflow-hidden rounded-2xl ${
        elevated ? 'glass-surface-elevated' : 'glass-surface'
      } ${className}`}
    >
      {/* Dynamic cursor refraction glare across the glass surface */}
      {!disabledTilt && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-200"
          style={{
            opacity: glarePosition.opacity,
            background: `radial-gradient(480px circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.32), rgba(251, 191, 36, 0.08) 40%, transparent 75%)`,
          }}
        />
      )}

      {/* Top edge specular highlight line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/45 to-transparent"
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

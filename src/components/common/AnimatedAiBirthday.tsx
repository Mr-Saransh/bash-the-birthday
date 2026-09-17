'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Gift, Cake, Heart } from 'lucide-react';
import Image from 'next/image';

interface AnimatedAiBirthdayProps {
  recipientName?: string;
  senderName?: string;
  initialMode?: 'cake' | 'gift';
  onWishMade?: () => void;
  compact?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  spin: number;
  rot: number;
  isConfetti?: boolean;
  shape?: 'circle' | 'star' | 'rect';
}

const WARM_BIRTHDAY_COLORS = [
  '#fbbf24', // Champagne Gold
  '#f59e0b', // Amber
  '#f43f5e', // Strawberry Rose
  '#fb7185', // Soft Rose
  '#ea580c', // Warm Coral
  '#fde047', // Candlelight Honey
  '#fffbeb', // Starlight White
];

export default function AnimatedAiBirthday({
  recipientName,
  senderName,
  initialMode = 'cake',
  onWishMade,
  compact = false,
}: AnimatedAiBirthdayProps) {
  const [mode, setMode] = useState<'cake' | 'gift'>(initialMode);
  const [wished, setWished] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Synthesize a soft, heartwarming golden chime using Web Audio API
  const playWishChime = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Warm celebratory chord: C5, E5, G5, B5, C6 in sequence
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 1.8);
      });
    } catch {
      // Audio autoplay policy or unavailable — silent fallback
    }
  }, []);

  // Trigger wish celebration with confetti and stardust explosion
  const handleMakeWish = () => {
    setWished(true);
    setWishCount((c) => c + 1);
    playWishChime();
    onWishMade?.();

    // Spawn celebratory golden and warm rose particles (scaled for mobile performance)
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = mode === 'cake' ? canvas.height * 0.35 : canvas.height * 0.45;
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    const burstCount = isMobileDevice ? 50 : 130;

    for (let i = 0; i < burstCount; i++) {
      const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5);
      const speed = 2.5 + Math.random() * 6.5;
      const isConfetti = Math.random() > 0.4;
      particlesRef.current.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isConfetti ? 3.5 : 1.5),
        size: isConfetti ? 4 + Math.random() * 5 : 2 + Math.random() * 4,
        alpha: 1,
        maxAlpha: 1,
        life: 0,
        maxLife: 90 + Math.random() * 60,
        color: WARM_BIRTHDAY_COLORS[Math.floor(Math.random() * WARM_BIRTHDAY_COLORS.length)],
        spin: (Math.random() - 0.5) * 0.2,
        rot: Math.random() * Math.PI * 2,
        isConfetti,
        shape: isConfetti ? (Math.random() > 0.5 ? 'rect' : 'star') : 'circle',
      });
    }
  };

  // 3D Parallax tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Canvas particle loop: ambient embers + candle flames + wish burst
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    const isMobile = window.innerWidth < 768;
    const maxAmbientParticles = isMobile ? 30 : 75;

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    let frame = 0;

    const render = () => {
      if (!isVisible) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      frame++;
      ctx.clearRect(0, 0, width, height);

      // Continuously spawn ambient floating candle embers
      const spawnInterval = isMobile ? 6 : 3;
      if (frame % spawnInterval === 0 && particlesRef.current.length < maxAmbientParticles) {
        const cx = mode === 'cake' ? width * (0.35 + Math.random() * 0.3) : width * (0.4 + Math.random() * 0.2);
        const cy = mode === 'cake' ? height * (0.22 + Math.random() * 0.18) : height * (0.4 + Math.random() * 0.2);

        particlesRef.current.push({
          x: cx + (Math.random() - 0.5) * 60,
          y: cy + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(0.6 + Math.random() * 1.4),
          size: 1.5 + Math.random() * 3,
          alpha: 0.1,
          maxAlpha: 0.6 + Math.random() * 0.4,
          life: 0,
          maxLife: 60 + Math.random() * 50,
          color: WARM_BIRTHDAY_COLORS[Math.floor(Math.random() * WARM_BIRTHDAY_COLORS.length)],
          spin: (Math.random() - 0.5) * 0.05,
          rot: Math.random() * Math.PI,
          shape: Math.random() > 0.7 ? 'star' : 'circle',
        });
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.spin;

        if (p.isConfetti) {
          p.vy += 0.1; // gravity
          p.vx *= 0.98; // drag
        } else {
          // soft horizontal sway
          p.x += Math.sin((frame + p.life) * 0.05) * 0.35;
        }

        const progress = p.life / p.maxLife;
        if (progress < 0.2) {
          p.alpha = (progress / 0.2) * p.maxAlpha;
        } else {
          p.alpha = (1 - (progress - 0.2) / 0.8) * p.maxAlpha;
        }

        if (p.life >= p.maxLife || p.alpha <= 0.01) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.isConfetti ? 2 : 8;

        if (p.shape === 'star') {
          // 4-point star sparkle
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s * 1.6);
          ctx.quadraticCurveTo(0, 0, s * 1.6, 0);
          ctx.quadraticCurveTo(0, 0, 0, s * 1.6);
          ctx.quadraticCurveTo(0, 0, -s * 1.6, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s * 1.6);
          ctx.fill();
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.size, -p.size * 0.6, p.size * 2, p.size * 1.2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mode]);

  const imageSrc = mode === 'cake' ? '/images/ai-birthday-cake.jpg' : '/images/ai-birthday-gift.jpg';
  const imageAlt = mode === 'cake' ? 'Enchanted AI Birthday Cake with warm candlelight' : 'Magical AI Birthday Gift Box with radiant golden stardust';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: compact ? '380px' : '480px',
        margin: '0 auto',
        perspective: '1200px',
        userSelect: 'none',
      }}
    >
      {/* Warm ambient celebratory back-glow */}
      <div
        style={{
          position: 'absolute',
          inset: '-20px',
          borderRadius: '36px',
          background: mode === 'cake'
            ? 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(244,63,94,0.18) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, rgba(251,191,36,0.2) 45%, transparent 70%)',
          filter: 'blur(35px)',
          transform: `scale(${isHovered ? 1.08 : 1})`,
          transition: 'transform 0.5s ease, background 0.8s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main card with 3D tilt */}
      <motion.div
        animate={{
          rotateY: tilt.x,
          rotateX: tilt.y,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          position: 'relative',
          borderRadius: '28px',
          overflow: 'hidden',
          background: 'linear-gradient(165deg, #1f131a 0%, #110910 100%)',
          border: '1.5px solid rgba(251, 191, 36, 0.35)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.65), 0 0 40px rgba(251, 191, 36, 0.15)',
          transformStyle: 'preserve-3d',
          zIndex: 1,
        }}
      >
        {/* Top Header Tag */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            right: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(18, 10, 16, 0.75)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#fbbf24',
              letterSpacing: '0.04em',
            }}
          >
            <Sparkles size={12} fill="#fbbf24" />
            <span>AI Interactive Art</span>
          </div>

          {/* Mode switch pills */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(18, 10, 16, 0.75)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '2px',
              gap: '2px',
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setMode('cake'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.3rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s',
                background: mode === 'cake' ? 'linear-gradient(135deg, #f43f5e, #fb923c)' : 'transparent',
                color: mode === 'cake' ? '#ffffff' : '#e0a4b5',
              }}
            >
              <Cake size={12} />
              <span>Cake</span>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setMode('gift'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.3rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s',
                background: mode === 'gift' ? 'linear-gradient(135deg, #fbbf24, #ea580c)' : 'transparent',
                color: mode === 'gift' ? '#ffffff' : '#e0a4b5',
              }}
            >
              <Gift size={12} />
              <span>Gift</span>
            </button>
          </div>
        </div>

        {/* AI Image with breathing zoom animation */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.035, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 480px"
              style={{
                objectFit: 'cover',
                filter: 'contrast(1.04) saturate(1.08)',
              }}
            />
          </motion.div>

          {/* Candle flame light pulse overlay on cake */}
          {mode === 'cake' && (
            <motion.div
              animate={{
                opacity: [0.35, 0.7, 0.45, 0.8, 0.35],
                scale: [0.98, 1.04, 1.01, 1.06, 0.98],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                top: '12%',
                left: '28%',
                width: '44%',
                height: '35%',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(254, 240, 138, 0.35) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 70%)',
                pointerEvents: 'none',
                filter: 'blur(16px)',
              }}
            />
          )}

          {/* Golden sheen light sweep animation */}
          <motion.div
            animate={{
              x: ['-120%', '220%'],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '40%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
            }}
          />

          {/* Particle canvas layer */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />

          {/* Bottom vignette gradient for readable text */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '45%',
              background: 'linear-gradient(to top, rgba(17, 9, 16, 0.95) 0%, rgba(17, 9, 16, 0.6) 50%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 6,
            }}
          />
        </div>

        {/* Interactive Bottom Control Panel */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(180deg, rgba(26, 14, 22, 0.92) 0%, #120910 100%)',
            borderTop: '1px solid rgba(251, 191, 36, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.875rem',
            textAlign: 'center',
          }}
        >
          {/* Recipient Dedication */}
          {recipientName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fb7185', fontSize: '0.85rem', fontWeight: 600 }}>
              <Heart size={13} fill="#fb7185" />
              <span>For {recipientName} {senderName ? `· from ${senderName}` : ''}</span>
            </div>
          )}

          {/* Wish message popup */}
          <AnimatePresence>
            {wished && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(251,191,36,0.2))',
                  border: '1px solid rgba(251,191,36,0.4)',
                  color: '#fffbeb',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  boxShadow: '0 4px 20px rgba(251,191,36,0.2)',
                }}
              >
                ✨ Wish #{wishCount} sent into the stars! May it blossom! 🎂
              </motion.div>
            )}
          </AnimatePresence>

          {/* The "Make a Wish" Action Button */}
          <motion.button
            onClick={handleMakeWish}
            whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(251, 191, 36, 0.45)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '100%',
              padding: '0.85rem 1.5rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 50%, #fbbf24 100%)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(244, 63, 94, 0.35)',
              transition: 'box-shadow 0.3s',
            }}
          >
            {mode === 'cake' ? (
              <>
                <Flame size={18} fill="#ffffff" />
                <span>{wished ? 'Make Another Wish 🕯️' : 'Blow Candles & Make a Wish ✨'}</span>
              </>
            ) : (
              <>
                <Sparkles size={18} fill="#ffffff" />
                <span>{wished ? 'Unwrap Another Sparkle 🎁' : 'Open the Birthday Gift Box 🎁'}</span>
              </>
            )}
          </motion.button>

          <p style={{ fontSize: '0.75rem', color: '#c49aa8', margin: 0 }}>
            {mode === 'cake'
              ? 'Tap to blow candles & launch golden birthday sparks'
              : 'Tap to release stardust & warm birthday wishes'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

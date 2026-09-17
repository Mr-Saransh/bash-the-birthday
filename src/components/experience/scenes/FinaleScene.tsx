'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';
import { firstName } from '@/lib/utils';
import { Sparkles, Heart } from 'lucide-react';

interface FinaleSceneProps {
  config: ExperienceConfig;
  onNext: () => void;
}

interface BirthdayWishBubble {
  id: number;
  emoji: string;
  wish: string;
  initialX: number; // percentage
  speed: number;
  size: number;
}

export default function FinaleScene({ config, onNext }: FinaleSceneProps) {
  const [giftOpened, setGiftOpened] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [poppedBubbles, setPoppedBubbles] = useState<Set<number>>(new Set());
  const [lastPoppedWish, setLastPoppedWish] = useState<string | null>(null);

  const name = firstName(config.data.recipientName).toUpperCase();
  const { colors, typography } = config.theme;
  const finalLine = config.content.finalLine;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Grand celebratory arpeggio fanfare using Web Audio API
  const playCelebrationFanfare = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      // Uplifting C-Major celebration arpeggio
      const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        const start = ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 2.4);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }, []);

  // Playful bubble pop sound
  const playBubblePop = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1250, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio autoplay policy fallback
    }
  }, []);

  const handleOpenGift = () => {
    playCelebrationFanfare();
    setGiftOpened(true);
    setTimeout(() => {
      setShowFinalMessage(true);
    }, 1100);
  };

  const handlePopBubble = (bubble: BirthdayWishBubble) => {
    if (poppedBubbles.has(bubble.id)) return;
    playBubblePop();
    setPoppedBubbles((prev) => new Set([...prev, bubble.id]));
    setLastPoppedWish(`${bubble.emoji} ${bubble.wish}`);
    setTimeout(() => setLastPoppedWish(null), 3000);
  };

  const wishBubbles: BirthdayWishBubble[] = [
    { id: 1, emoji: '🎂', wish: 'Sweetest Moments Ahead!', initialX: 10, speed: 11, size: 68 },
    { id: 2, emoji: '👑', wish: 'Pure Royalty Forever!', initialX: 28, speed: 13, size: 76 },
    { id: 3, emoji: '✨', wish: 'Endless Magic & Wonder!', initialX: 48, speed: 10.5, size: 66 },
    { id: 4, emoji: '🥂', wish: 'Cheers To Your Brilliance!', initialX: 68, speed: 14, size: 74 },
    { id: 5, emoji: '💖', wish: 'Deeply & Completely Loved!', initialX: 85, speed: 12, size: 65 },
    { id: 6, emoji: '🌟', wish: 'Your Most Legendary Era!', initialX: 20, speed: 12.5, size: 72 },
    { id: 7, emoji: '🔥', wish: 'Totally Unstoppable!', initialX: 78, speed: 11.5, size: 70 },
  ];

  const floatingEmojis = ['🎉', '🎂', '👑', '✨', '🎈', '💖', '🥳'];
  const particleCount = isMobile ? 22 : 42;

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: giftOpened
          ? `radial-gradient(ellipse at center, ${colors.bgSurface} 0%, ${colors.bg} 85%)`
          : colors.bg,
        transition: 'background 1.5s ease',
        overflow: 'hidden',
        padding: 'clamp(1rem, 4vw, 2.5rem)',
        position: 'relative',
      }}
    >
      <AnimatePresence mode="wait">
        {!giftOpened ? (
          /* Gift box — before opening */
          <motion.div
            key="gift"
            className="scene-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.4,
              filter: 'blur(16px)',
              transition: { duration: 0.7 },
            }}
            style={{ gap: '1.75rem', maxWidth: '440px' }}
          >
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="body-text"
              style={{ color: colors.textMuted, fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}
            >
              One final surprise for you.
            </motion.p>

            {/* Glowing gift box button */}
            <motion.button
              onClick={handleOpenGift}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -8, 0],
              }}
              transition={{
                opacity: { delay: 0.4, duration: 0.7 },
                scale: { delay: 0.4, type: 'spring', stiffness: 220, damping: 16 },
                y: {
                  delay: 1,
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                },
              }}
              whileHover={{
                scale: 1.06,
                boxShadow: `0 0 65px ${colors.glow}`,
              }}
              whileTap={{ scale: 0.94 }}
              style={{
                width: 'clamp(180px, 46vw, 230px)',
                height: 'clamp(180px, 46vw, 230px)',
                borderRadius: '32px',
                border: `2px solid ${colors.accent}80`,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 45px ${colors.glow}`,
              }}
              aria-label="Open your birthday gift"
            >
              <img
                src="/images/ai-birthday-gift.jpg"
                alt="Enchanted Birthday Gift"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)',
                }}
              />
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="caption-text"
              style={{
                color: colors.accent,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                justifyContent: 'center',
                fontWeight: 600,
              }}
            >
              <Sparkles size={14} />
              <span>Tap the glowing gift box to open</span>
            </motion.p>
          </motion.div>
        ) : (
          /* After opening — THE GRAND HIGH-ENERGY CELEBRATION */
          <motion.div
            key="reveal"
            className="scene-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              gap: '1.5rem',
              maxWidth: '680px',
              position: 'relative',
              width: '100%',
              minHeight: '85vh',
              justifyContent: 'center',
            }}
          >
            {/* 1. Celebratory Fireworks & Confetti Canvas Shower */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              {Array.from({ length: particleCount }).map((_, i) => {
                const size = (i % 5) * 2 + 4;
                const isGlow = i < 8;
                return (
                  <motion.div
                    key={i}
                    initial={{
                      x: '50vw',
                      y: '45vh',
                      scale: 0,
                      opacity: 1,
                      rotate: 0,
                    }}
                    animate={{
                      x: `${((i * 19) % 96) + 2}vw`,
                      y: `${((i * 27) % 94) + 3}vh`,
                      scale: [0, 1.6, 0.8],
                      opacity: [1, 0.9, 0],
                      rotate: (i % 2 === 0 ? 1 : -1) * 360,
                    }}
                    transition={{
                      duration: 2.4 + (i % 4) * 0.5,
                      delay: (i % 6) * 0.08,
                      ease: 'easeOut',
                    }}
                    style={{
                      position: 'absolute',
                      width: size,
                      height: size,
                      borderRadius: i % 3 === 0 ? '50%' : '3px',
                      background: isGlow
                        ? colors.accent
                        : i % 2 === 0
                        ? colors.accentSecondary
                        : colors.particle,
                      boxShadow: isGlow
                        ? `0 0 16px ${colors.accent}`
                        : 'none',
                    }}
                  />
                );
              })}
            </div>

            {/* 2. Rotating Cosmic Celebration Sunburst Halo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: '85vw',
                height: '85vw',
                maxWidth: '560px',
                maxHeight: '560px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${colors.glow} 0%, rgba(255,255,255,0.05) 40%, transparent 70%)`,
                filter: 'blur(45px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* 3. Orbiting Celebration Emojis Dancing Around The Title */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              {floatingEmojis.map((emoji, idx) => {
                const angle = (idx / floatingEmojis.length) * Math.PI * 2;
                const radius = isMobile ? 125 : 210;
                const xOffset = Math.cos(angle) * radius;
                const yOffset = Math.sin(angle) * radius * 0.65;

                return (
                  <motion.span
                    key={idx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0.85, 1.2, 0.95],
                      opacity: [0.6, 1, 0.7],
                      y: [yOffset - 8, yOffset + 8, yOffset - 8],
                      x: xOffset,
                    }}
                    transition={{
                      scale: { delay: 0.4 + idx * 0.1, duration: 0.6 },
                      opacity: { delay: 0.4 + idx * 0.1, duration: 0.6 },
                      y: { duration: 3 + idx * 0.3, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '38%',
                      fontSize: isMobile ? '1.4rem' : '1.9rem',
                      display: 'inline-block',
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
                    }}
                  >
                    {emoji}
                  </motion.span>
                );
              })}
            </div>

            {/* 4. Crystal Clear Direction Banner: Tap Floating Bubbles! */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.04, 1],
                  boxShadow: [
                    `0 0 15px ${colors.glow}`,
                    `0 0 28px ${colors.glow}`,
                    `0 0 15px ${colors.glow}`,
                  ],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 1.2rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))',
                  border: `1.5px solid ${colors.accent}`,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <motion.span
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ fontSize: '1.1rem' }}
                >
                  🎈
                </motion.span>
                <span
                  style={{
                    fontSize: 'clamp(0.8rem, 2.3vw, 0.94rem)',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.02em',
                  }}
                >
                  {poppedBubbles.size === wishBubbles.length
                    ? '🎉 You unlocked all birthday wishes! ✦'
                    : `Tap the floating bubbles to pop wishes! (${poppedBubbles.size}/${wishBubbles.length})`}
                </span>
              </motion.div>

              {/* Toast for last popped wish */}
              <AnimatePresence>
                {lastPoppedWish && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.9 }}
                    style={{
                      padding: '0.35rem 1rem',
                      borderRadius: '9999px',
                      background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentSecondary})`,
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      boxShadow: `0 4px 20px ${colors.glow}`,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {lastPoppedWish}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 5. THE EXHILARATING "HAPPY BIRTHDAY, [NAME]." TITLE */}
            <div style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}>
              <motion.h1
                style={{
                  fontFamily: typography.displayFont,
                  fontSize: 'clamp(2.5rem, 8.5vw, 5.5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.04,
                  textAlign: 'center',
                  margin: 0,
                  textShadow: `0 0 40px ${colors.glow}`,
                }}
              >
                {/* Word 1: HAPPY */}
                <motion.span
                  initial={{ opacity: 0, scale: 0.3, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 220, damping: 14 }}
                  style={{ display: 'block', marginBottom: '0.1em', color: '#ffffff' }}
                >
                  HAPPY
                </motion.span>

                {/* Word 2: BIRTHDAY, */}
                <motion.span
                  initial={{ opacity: 0, scale: 0.3, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.8, type: 'spring', stiffness: 220, damping: 14 }}
                  style={{ display: 'block', marginBottom: '0.1em', color: '#ffffff' }}
                >
                  BIRTHDAY,
                </motion.span>

                {/* Word 3: [NAME]. with continuous shimmer */}
                <motion.span
                  initial={{ opacity: 0, scale: 0.2, y: 45 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    opacity: { delay: 0.7, duration: 0.8 },
                    scale: { delay: 0.7, type: 'spring', stiffness: 260, damping: 15 },
                    y: { delay: 0.7, type: 'spring', stiffness: 260, damping: 15 },
                    backgroundPosition: { duration: 4, repeat: Infinity, ease: 'linear' },
                  }}
                  style={{
                    display: 'block',
                    background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentSecondary}, #ffffff, ${colors.accent})`,
                    backgroundSize: '300% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: `drop-shadow(0 0 30px ${colors.accent}90)`,
                  }}
                >
                  {name}.
                </motion.span>
              </motion.h1>
            </div>

            {/* 6. Personalized Prophecy Closing Line */}
            {showFinalMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'relative',
                  zIndex: 6,
                  maxWidth: '520px',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${colors.accent}30`,
                  borderRadius: '20px',
                  padding: '1.25rem 1.75rem',
                  backdropFilter: 'blur(10px)',
                  boxShadow: `0 8px 25px rgba(0,0,0,0.4), 0 0 20px ${colors.glow}`,
                }}
              >
                <p
                  style={{
                    fontSize: 'clamp(0.95rem, 2.6vw, 1.18rem)',
                    color: colors.text,
                    lineHeight: 1.65,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {finalLine}
                </p>
              </motion.div>
            )}

            {/* 7. Complete Journey CTA Button */}
            {showFinalMessage && (
              <motion.button
                className="btn-primary"
                onClick={onNext}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.9rem 2.4rem',
                  position: 'relative',
                  zIndex: 8,
                  fontSize: '1rem',
                  boxShadow: `0 10px 35px ${colors.glow}`,
                  fontWeight: 700,
                  gap: '0.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <span>Complete Journey</span>
                <Sparkles size={16} />
              </motion.button>
            )}

            {/* 8. Interactive Floating Birthday Wish Bubbles Rising from Below */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 7,
              }}
            >
              {wishBubbles.map((bubble) => {
                const isPopped = poppedBubbles.has(bubble.id);
                if (isPopped) return null;

                return (
                  <motion.div
                    key={bubble.id}
                    initial={{
                      y: '105vh',
                      x: `${bubble.initialX}vw`,
                      scale: 0.8,
                    }}
                    animate={{
                      y: '-25vh',
                      x: [
                        `${bubble.initialX}vw`,
                        `${bubble.initialX + (bubble.id % 2 === 0 ? 5 : -5)}vw`,
                        `${bubble.initialX}vw`,
                      ],
                      scale: [0.85, 1.08, 0.92, 1],
                    }}
                    transition={{
                      y: {
                        duration: bubble.speed,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: bubble.id * 1.2,
                      },
                      x: {
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                      scale: {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }}
                    style={{
                      position: 'absolute',
                      pointerEvents: 'auto',
                    }}
                  >
                    <motion.button
                      onClick={() => handlePopBubble(bubble)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.7 }}
                      style={{
                        width: isMobile ? `${bubble.size * 0.85}px` : `${bubble.size}px`,
                        height: isMobile ? `${bubble.size * 0.85}px` : `${bubble.size}px`,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 35% 28%, rgba(255,255,255,0.45) 0%, ${colors.accent}40 45%, ${colors.bgSurface} 95%)`,
                        border: '2px solid rgba(255, 255, 255, 0.7)',
                        boxShadow: `0 0 25px ${colors.glow}, inset 0 2px 6px rgba(255,255,255,0.8), inset 0 -4px 10px ${colors.accent}50`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        overflow: 'hidden',
                        padding: 0,
                      }}
                      aria-label={`Pop wish: ${bubble.wish}`}
                    >
                      {/* Top-Left Specular Liquid Glass Curve */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '10%',
                          left: '16%',
                          width: '40%',
                          height: '24%',
                          borderRadius: '50%',
                          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                          transform: 'rotate(-28deg)',
                          pointerEvents: 'none',
                        }}
                      />

                      <span style={{ fontSize: isMobile ? '1.4rem' : '1.75rem', position: 'relative', zIndex: 2 }}>
                        {bubble.emoji}
                      </span>

                      {/* Tap text hint */}
                      <span
                        style={{
                          fontSize: '0.55rem',
                          fontWeight: 800,
                          color: '#ffffff',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                          position: 'relative',
                          zIndex: 2,
                        }}
                      >
                        TAP!
                      </span>
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

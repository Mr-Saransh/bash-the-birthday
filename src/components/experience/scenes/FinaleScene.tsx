'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';
import { firstName } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface FinaleSceneProps {
  config: ExperienceConfig;
  onNext: () => void;
}

export default function FinaleScene({ config, onNext }: FinaleSceneProps) {
  const [giftOpened, setGiftOpened] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // Soft celebratory chime using Web Audio
  const playChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.09 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 2);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }, []);

  const handleOpenGift = () => {
    playChime();
    setGiftOpened(true);
    setTimeout(() => {
      setShowFinalMessage(true);
    }, 1100);
  };

  const particleCount = isMobile ? 18 : 36;

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
                scale: 1.05,
                boxShadow: `0 0 60px ${colors.glow}`,
              }}
              whileTap={{ scale: 0.94 }}
              style={{
                width: 'clamp(180px, 46vw, 230px)',
                height: 'clamp(180px, 46vw, 230px)',
                borderRadius: '32px',
                border: `2px solid ${colors.accent}60`,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 35px ${colors.glow}`,
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
              }}
            >
              <Sparkles size={14} />
              <span>Tap the glowing gift box to open</span>
            </motion.p>
          </motion.div>
        ) : (
          /* After opening — THE BIG CELEBRATION */
          <motion.div
            key="reveal"
            className="scene-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ gap: '1.75rem', maxWidth: '580px', position: 'relative' }}
          >
            {/* Optimized celebration particles for 60fps on mobile */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            >
              {Array.from({ length: particleCount }).map((_, i) => {
                const size = (i % 4) * 2 + 3;
                const isGlow = i < 6;
                return (
                  <motion.div
                    key={i}
                    initial={{
                      x: '50vw',
                      y: '50vh',
                      scale: 0,
                      opacity: 1,
                    }}
                    animate={{
                      x: `${((i * 17) % 95) + 2}vw`,
                      y: `${((i * 23) % 95) + 2}vh`,
                      scale: [0, 1.4, 0.7],
                      opacity: [1, 0.8, 0],
                    }}
                    transition={{
                      duration: 2 + (i % 3) * 0.6,
                      delay: (i % 5) * 0.1,
                      ease: 'easeOut',
                    }}
                    style={{
                      position: 'absolute',
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      background: isGlow
                        ? colors.accent
                        : i % 2 === 0
                        ? colors.accentSecondary
                        : colors.particle,
                      boxShadow: isGlow
                        ? `0 0 12px ${colors.accent}`
                        : 'none',
                    }}
                  />
                );
              })}
            </div>

            {/* Glowing backdrop halo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                width: '75vw',
                height: '75vw',
                maxWidth: '480px',
                maxHeight: '480px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
                filter: 'blur(35px)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />

            {/* HAPPY BIRTHDAY, [NAME] */}
            <motion.h1
              initial={{
                opacity: 0,
                scale: 0.4,
                filter: 'blur(20px)',
                y: 35,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                y: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontFamily: typography.displayFont,
                fontSize: 'clamp(2.2rem, 8vw, 5.2rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
                wordBreak: 'break-word',
                margin: 0,
              }}
            >
              <span style={{ display: 'block', marginBottom: '0.15em' }}>
                HAPPY
              </span>
              <span style={{ display: 'block', marginBottom: '0.15em' }}>
                BIRTHDAY,
              </span>
              <span
                style={{
                  display: 'block',
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentSecondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {name}.
              </span>
            </motion.h1>

            {/* Final personalized prophecy / closing wish */}
            {showFinalMessage && (
              <motion.p
                initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: 'clamp(1rem, 2.6vw, 1.25rem)',
                  color: colors.textMuted,
                  position: 'relative',
                  zIndex: 2,
                  maxWidth: '440px',
                  lineHeight: 1.65,
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                {finalLine}
              </motion.p>
            )}

            {/* Continue to outro */}
            {showFinalMessage && (
              <motion.button
                className="btn-primary"
                onClick={onNext}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.8rem 2.2rem',
                  position: 'relative',
                  zIndex: 2,
                  boxShadow: `0 8px 30px ${colors.glow}`,
                }}
              >
                <span>Complete Journey ✦</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

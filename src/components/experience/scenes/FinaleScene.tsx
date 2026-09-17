'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';
import { firstName } from '@/lib/utils';

interface FinaleSceneProps {
  config: ExperienceConfig;
  onNext: () => void;
}

export default function FinaleScene({ config, onNext }: FinaleSceneProps) {
  const [giftOpened, setGiftOpened] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const name = firstName(config.data.recipientName).toUpperCase();
  const { colors, typography } = config.theme;
  const finalLine = config.content.finalLine;

  const handleOpenGift = () => {
    setGiftOpened(true);
    setTimeout(() => {
      setShowFinalMessage(true);
    }, 1200);
  };

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: giftOpened
          ? `radial-gradient(ellipse at center, ${colors.bgSurface} 0%, ${colors.bg} 70%)`
          : colors.bg,
        transition: 'background 1.5s ease',
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
              scale: 1.5,
              filter: 'blur(20px)',
              transition: { duration: 0.8 },
            }}
            style={{ gap: '2rem' }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="body-text"
              style={{ color: colors.textMuted }}
            >
              One last thing.
            </motion.p>

            {/* AI-crafted glowing gift box */}
            <motion.button
              onClick={handleOpenGift}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { delay: 0.5, duration: 0.8 },
                scale: { delay: 0.5, type: 'spring', stiffness: 200, damping: 15 },
                y: {
                  delay: 1.2,
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                },
              }}
              whileHover={{
                scale: 1.06,
                boxShadow: `0 0 70px ${colors.glow}`,
              }}
              whileTap={{ scale: 0.94 }}
              style={{
                width: 'clamp(180px, 45vw, 240px)',
                height: 'clamp(180px, 45vw, 240px)',
                borderRadius: '32px',
                border: `2px solid ${colors.accent}60`,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 15px 50px rgba(0,0,0,0.5), 0 0 35px ${colors.glow}`,
              }}
              aria-label="Open your gift"
            >
              <img
                src="/images/ai-birthday-gift.jpg"
                alt="Enchanted AI Birthday Gift"
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
              transition={{ delay: 1.5, duration: 0.6 }}
              className="caption-text"
              style={{ color: colors.textMuted }}
            >
              Tap the glowing gift to open
            </motion.p>
          </motion.div>
        ) : (
          /* After opening — THE BIG REVEAL */
          <motion.div
            key="reveal"
            className="scene-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ gap: '2rem' }}
          >
            {/* Celebration particles */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
            >
              {Array.from({ length: 40 }).map((_, i) => {
                const size = Math.random() * 6 + 2;
                const isGlow = i < 10;
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
                      x: `${Math.random() * 100}vw`,
                      y: `${Math.random() * 100}vh`,
                      scale: [0, 1.5, 0.8],
                      opacity: [1, 0.8, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 0.5,
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
                        ? `0 0 ${size * 4}px ${colors.accent}`
                        : 'none',
                    }}
                  />
                );
              })}
            </div>

            {/* Glowing backdrop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                width: '80vw',
                height: '80vw',
                maxWidth: '600px',
                maxHeight: '600px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }}
            />

            {/* HAPPY BIRTHDAY, [NAME] */}
            <motion.h1
              initial={{
                opacity: 0,
                scale: 0.3,
                filter: 'blur(30px)',
                y: 50,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                y: 0,
              }}
              transition={{
                delay: 0.5,
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontFamily: typography.displayFont,
                fontSize: 'clamp(2.5rem, 10vw, 6rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <span style={{ display: 'block', marginBottom: '0.2em' }}>
                HAPPY
              </span>
              <span style={{ display: 'block', marginBottom: '0.2em' }}>
                BIRTHDAY,
              </span>
              <span
                className="gradient-text"
                style={{ display: 'block' }}
              >
                {name}.
              </span>
            </motion.h1>

            {/* Final personalized line */}
            {showFinalMessage && (
              <motion.p
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                  color: colors.textMuted,
                  position: 'relative',
                  zIndex: 2,
                  maxWidth: '400px',
                }}
              >
                {finalLine}
              </motion.p>
            )}

            {/* Continue to outro */}
            {showFinalMessage && (
              <motion.button
                className="btn-ghost"
                onClick={onNext}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  marginTop: '2rem',
                  borderColor: `${colors.accent}30`,
                  color: colors.accent,
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                ✦
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

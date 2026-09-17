'use client';

import { motion } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';
import { Sparkles, Heart } from 'lucide-react';

interface MemorySceneProps {
  config: ExperienceConfig;
  onNext: () => void;
}

export default function MemoryScene({ config, onNext }: MemorySceneProps) {
  const { colors, typography } = config.theme;
  const memory = config.data.memory || config.content.memoryTribute;
  const memoryIntro = config.content.memoryIntro || 'A memory they carry with them…';
  const photoUrl = config.data.photoUrl;

  if (!memory && !photoUrl) {
    onNext();
    return null;
  }

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${colors.bgSurface} 0%, ${colors.bg} 85%)`,
        padding: 'clamp(1rem, 3.5vw, 2.5rem)',
        overflowY: 'auto',
      }}
    >
      <div
        className="scene-content"
        style={{
          gap: 'clamp(1.2rem, 3vh, 2.2rem)',
          maxWidth: photoUrl ? '560px' : '500px',
        }}
      >
        {/* Memory intro line */}
        <motion.p
          className="body-text"
          initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            color: colors.textMuted,
            fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={14} color={colors.accent} />
          <span>{memoryIntro}</span>
        </motion.p>

        {/* Memory Card: Either with Polaroid Photo or purely text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            borderRadius: '24px',
            background: `linear-gradient(165deg, ${colors.bgSurface} 0%, rgba(10, 5, 9, 0.9) 100%)`,
            border: `1.5px solid ${colors.accent}40`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.65), 0 0 35px ${colors.glow}`,
            padding: photoUrl ? 'clamp(1rem, 3vw, 1.75rem)' : 'clamp(1.5rem, 5vw, 2.5rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            position: 'relative',
          }}
        >
          {/* Polaroid Photo Frame if photo exists */}
          {photoUrl && (
            <motion.div
              initial={{ rotate: -2, scale: 0.96 }}
              animate={{ rotate: [ -2, 1, -1 ], y: [0, -4, 0] }}
              transition={{
                rotate: { duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
                y: { duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              }}
              style={{
                width: '100%',
                maxWidth: '420px',
                background: '#ffffff',
                padding: '12px 12px 24px 12px',
                borderRadius: '8px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 20px rgba(251,191,36,0.2)',
                position: 'relative',
              }}
            >
              {/* Photo tape / sticker at top */}
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '70px',
                  height: '22px',
                  background: 'rgba(251, 191, 36, 0.55)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '2px',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              />

              <div
                style={{
                  width: '100%',
                  maxHeight: 'clamp(180px, 36vh, 280px)',
                  aspectRatio: '4 / 3',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  background: '#0a0a0a',
                }}
              >
                <img
                  src={photoUrl}
                  alt="Cherished Memory"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  loading="eager"
                />
              </div>

              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <span
                  style={{
                    fontFamily: 'Caveat, "Brush Script MT", cursive, sans-serif',
                    fontSize: '1.2rem',
                    color: '#1a1016',
                    fontWeight: 600,
                  }}
                >
                  Unforgettable moments with you ✦
                </span>
              </div>
            </motion.div>
          )}

          {/* Memory text */}
          {memory && (
            <div style={{ textAlign: 'center', maxWidth: '460px' }}>
              {!photoUrl && (
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'Georgia, serif',
                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                    lineHeight: 1,
                    color: colors.accent,
                    marginBottom: '-0.5rem',
                    userSelect: 'none',
                    opacity: 0.4,
                  }}
                >
                  &ldquo;
                </span>
              )}
              <p
                style={{
                  fontFamily: typography.bodyFont,
                  fontSize: 'clamp(0.98rem, 2.4vw, 1.2rem)',
                  fontWeight: 500,
                  lineHeight: 1.7,
                  color: colors.text,
                }}
              >
                {memory}
              </p>
            </div>
          )}
        </motion.div>

        {/* Continue button */}
        <motion.button
          className="btn-ghost"
          onClick={onNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            borderColor: `${colors.accent}40`,
            color: colors.accent,
            padding: '0.75rem 2rem',
            background: 'rgba(251, 191, 36, 0.08)',
          }}
        >
          Continue →
        </motion.button>
      </div>
    </motion.div>
  );
}

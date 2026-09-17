'use client';

import { motion } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';
import { firstName } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface ThingsAboutYouSceneProps {
  config: ExperienceConfig;
  onNext: () => void;
}

export default function ThingsAboutYouScene({
  config,
  onNext,
}: ThingsAboutYouSceneProps) {
  const name = firstName(config.data.recipientName);
  const observations = config.content.observations || [];
  const { colors, typography } = config.theme;

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        padding: 'clamp(1rem, 4vw, 2.5rem)',
        overflowY: 'auto',
      }}
    >
      <div className="scene-content" style={{ gap: 'clamp(1.5rem, 3.5vh, 2.5rem)', maxWidth: '520px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center' }}
        >
          <p
            className="caption-text"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: colors.textMuted,
              marginBottom: '0.5rem',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
            }}
          >
            <Sparkles size={13} color={colors.accent} />
            <span>Scientifically Verified</span>
          </p>
          <h2
            style={{
              fontFamily: typography.displayFont,
              fontSize: 'clamp(1.5rem, 4.5vw, 2.3rem)',
              fontWeight: 700,
              letterSpacing: typography.displayTracking,
              color: colors.text,
              margin: 0,
            }}
          >
            Things that are deeply{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentSecondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {name}
            </span>
          </h2>
        </motion.div>

        {/* Observations list */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 1 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
              },
            },
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            width: '100%',
          }}
        >
          {observations.map((obs, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, x: -20, filter: 'blur(4px)' },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: 'blur(0px)',
                  transition: {
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              whileHover={{ scale: 1.01, borderColor: `${colors.accent}60` }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                padding: '0.9rem 1.15rem',
                borderRadius: '16px',
                background: `linear-gradient(145deg, ${colors.bgSurface} 0%, rgba(18, 10, 16, 0.8) 100%)`,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
              }}
            >
              <span
                style={{
                  color: colors.accent,
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  lineHeight: 1.4,
                  flexShrink: 0,
                }}
              >
                ✦
              </span>
              <p
                style={{
                  color: colors.text,
                  fontSize: 'clamp(0.92rem, 2.4vw, 1.08rem)',
                  lineHeight: 1.6,
                  textAlign: 'left',
                  margin: 0,
                }}
              >
                {obs}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue */}
        <motion.button
          className="btn-primary"
          onClick={onNext}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: observations.length * 0.15 + 0.8, duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop: '0.5rem',
            padding: '0.75rem 2rem',
            boxShadow: `0 8px 25px ${colors.glow}`,
          }}
        >
          <span>Continue Journey →</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

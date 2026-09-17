'use client';

import { motion } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';
import { firstName } from '@/lib/utils';

interface ThingsAboutYouSceneProps {
  config: ExperienceConfig;
  onNext: () => void;
}

export default function ThingsAboutYouScene({
  config,
  onNext,
}: ThingsAboutYouSceneProps) {
  const name = firstName(config.data.recipientName);
  const observations = config.content.observations;
  const { colors, typography } = config.theme;

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="scene-content" style={{ gap: '2.5rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center' }}
        >
          <p
            className="caption-text"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: colors.textMuted,
              marginBottom: '0.75rem',
            }}
          >
            Statistically speaking
          </p>
          <h2
            style={{
              fontFamily: typography.displayFont,
              fontSize: 'clamp(1.5rem, 4.5vw, 2.5rem)',
              fontWeight: typography.displayWeight,
              letterSpacing: typography.displayTracking,
              color: colors.text,
            }}
          >
            Things that are very{' '}
            <span className="gradient-text">{name}</span>
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
                staggerChildren: 0.2,
                delayChildren: 0.5,
              },
            },
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '500px',
          }}
        >
          {observations.map((obs, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, x: -30, filter: 'blur(6px)' },
                visible: {
                  opacity: 1,
                  x: 0,
                  filter: 'blur(0px)',
                  transition: {
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                background: `${colors.bgSurface}80`,
                border: `1px solid rgba(255,255,255,0.04)`,
              }}
            >
              <span
                style={{
                  color: colors.accent,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  flexShrink: 0,
                }}
              >
                •
              </span>
              <p
                style={{
                  color: colors.text,
                  fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                  lineHeight: 1.6,
                  textAlign: 'left',
                }}
              >
                {obs}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue */}
        <motion.button
          className="btn-ghost"
          onClick={onNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: observations.length * 0.2 + 1.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop: '1rem',
            borderColor: `${colors.accent}30`,
            color: colors.accent,
          }}
        >
          Continue →
        </motion.button>
      </div>
    </motion.div>
  );
}

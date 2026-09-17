'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';

interface EmotionalCoreSceneProps {
  config: ExperienceConfig;
  onNext: () => void;
}

export default function EmotionalCoreScene({
  config,
  onNext,
}: EmotionalCoreSceneProps) {
  const [stage, setStage] = useState(0);
  const { colors, typography } = config.theme;
  const message = config.data.optionalMessage || config.content.fallbackMessage;
  const transition = config.content.emotionalTransition;
  const senderName = config.data.senderName;

  useEffect(() => {
    const delays = [1500, 2500, 1500];
    if (stage < 3) {
      const timer = setTimeout(() => {
        setStage((s) => s + 1);
      }, delays[stage] || 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: `radial-gradient(ellipse at center, ${colors.bgSurface} 0%, ${colors.bg} 80%)`,
      }}
    >
      <div className="scene-content" style={{ gap: '2.5rem' }}>
        {/* Emotional transition */}
        {stage >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: typography.displayFont,
              fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
              fontWeight: 600,
              color: colors.textMuted,
            }}
          >
            {transition}
          </motion.p>
        )}

        {/* "Here's the real reason this exists." */}
        {stage >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: typography.displayFont,
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              fontWeight: 500,
              color: colors.text,
            }}
          >
            Here&apos;s the real reason this exists.
          </motion.p>
        )}

        {/* The actual message */}
        {stage >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(15px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: 'clamp(2rem, 6vw, 3rem)',
              maxWidth: '520px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: 'clamp(1.15rem, 3vw, 1.5rem)',
                lineHeight: 1.8,
                color: colors.text,
                fontWeight: 400,
              }}
            >
              {message}
            </p>

            {/* Sender attribution */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{
                marginTop: '2rem',
                fontSize: '0.9rem',
                color: colors.accent,
                fontWeight: 500,
              }}
            >
              — {senderName}
            </motion.p>
          </motion.div>
        )}

        {/* Continue */}
        {stage >= 3 && (
          <motion.button
            className="btn-ghost"
            onClick={onNext}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              marginTop: '1rem',
              borderColor: `${colors.accent}30`,
              color: colors.accent,
            }}
          >
            One last thing →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

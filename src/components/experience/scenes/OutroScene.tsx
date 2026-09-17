'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';

interface OutroSceneProps {
  config: ExperienceConfig;
  onNext: () => void;
}

export default function OutroScene({ config }: OutroSceneProps) {
  const [stage, setStage] = useState(0);
  const { colors, typography } = config.theme;

  useEffect(() => {
    if (stage < 2) {
      const timer = setTimeout(() => {
        setStage((s) => s + 1);
      }, stage === 0 ? 1200 : 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleCreateNew = () => {
    // Navigate to creation flow
    window.location.href = '/';
  };

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="scene-content" style={{ gap: '2rem' }}>
        {/* "Okay, that was yours." */}
        {stage >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: typography.displayFont,
              fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
              fontWeight: 600,
              color: colors.text,
            }}
          >
            Okay, that was yours.
          </motion.p>
        )}

        {/* "Who deserves one of these?" */}
        {stage >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            <p
              className="body-text-lg"
              style={{ color: colors.textMuted }}
            >
              Who deserves one of these?
            </p>

            <motion.button
              className="btn-primary"
              onClick={handleCreateNew}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 12px 40px ${colors.glow}`,
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.05rem',
                background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
              }}
            >
              <span>Create a birthday experience</span>
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="caption-text"
              style={{ color: colors.textMuted }}
            >
              It takes less than 60 seconds ✦
            </motion.p>
          </motion.div>
        )}

        {/* Replay option */}
        {stage >= 2 && (
          <motion.button
            className="btn-ghost"
            onClick={() => window.location.reload()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              marginTop: '1rem',
              fontSize: '0.85rem',
            }}
          >
            Replay this experience
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

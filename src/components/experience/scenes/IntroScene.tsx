'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';
import { firstName } from '@/lib/utils';

interface IntroSceneProps {
  config: ExperienceConfig;
  onNext: () => void;
}

export default function IntroScene({ config, onNext }: IntroSceneProps) {
  const [stage, setStage] = useState(0);
  const name = firstName(config.data.recipientName);
  const lines = config.content.introLines;

  useEffect(() => {
    if (stage < lines.length) {
      const timer = setTimeout(() => {
        setStage((s) => s + 1);
      }, stage === 0 ? 1500 : 2200);
      return () => clearTimeout(timer);
    }
  }, [stage, lines.length]);

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ background: config.theme.colors.bg }}
    >
      {/* Subtle ambient particles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              borderRadius: '50%',
              background: config.theme.colors.particle,
              opacity: 0.15,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 50, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="scene-content" style={{ gap: '2rem' }}>
        {/* Line 1: "Hey, [Name]." */}
        {stage >= 1 && (
          <motion.h1
            className="display-text"
            initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: config.theme.typography.displayFont,
              fontSize: config.theme.typography.displaySize,
              fontWeight: config.theme.typography.displayWeight,
              letterSpacing: config.theme.typography.displayTracking,
            }}
          >
            {lines[0]}
          </motion.h1>
        )}

        {/* Line 2: "Someone has been planning something for you." */}
        {stage >= 2 && (
          <motion.p
            className="body-text-lg"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: '480px' }}
          >
            {lines[1]}
          </motion.p>
        )}

        {/* Line 3: "Before you see it…" + ENTER button */}
        {stage >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem',
              marginTop: '1rem',
            }}
          >
            <p
              className="body-text"
              style={{ color: config.theme.colors.textMuted }}
            >
              {lines[2]}
            </p>

            <motion.button
              className="btn-primary"
              onClick={onNext}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={{ scale: 1.05, boxShadow: `0 12px 40px ${config.theme.colors.glow}` }}
              whileTap={{ scale: 0.97 }}
              aria-label="Enter the birthday experience"
              style={{
                padding: '1rem 3rem',
                fontSize: '1.1rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: `linear-gradient(135deg, ${config.theme.colors.gradientFrom}, ${config.theme.colors.gradientTo})`,
              }}
            >
              <span>Enter</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

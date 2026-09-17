'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';
import { firstName } from '@/lib/utils';

interface PersonalityRevealSceneProps {
  config: ExperienceConfig;
  onNext: () => void;
}

export default function PersonalityRevealScene({
  config,
  onNext,
}: PersonalityRevealSceneProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const name = firstName(config.data.recipientName);
  const descriptors = config.content.personalityDescriptors;
  const relationshipLine = config.content.relationshipLine;

  useEffect(() => {
    // Progressive reveal of personality traits
    if (revealedCount <= descriptors.length + 1) {
      const delay = revealedCount === 0 ? 800 : 1800;
      const timer = setTimeout(() => {
        setRevealedCount((c) => c + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowContinue(true), 600);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, descriptors.length]);

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="scene-content" style={{ gap: '2.5rem' }}>
        {/* "People know you as [Name]." */}
        {revealedCount >= 1 && (
          <motion.p
            className="body-text-lg"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ color: config.theme.colors.textMuted }}
          >
            People know you as{' '}
            <span style={{ color: config.theme.colors.accent, fontWeight: 600 }}>
              {name}
            </span>
            .
          </motion.p>
        )}

        {/* Relationship line */}
        {revealedCount >= 2 && (
          <motion.p
            className="body-text-lg"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontStyle: 'italic',
              color: config.theme.colors.textMuted,
              fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
            }}
          >
            {relationshipLine}
          </motion.p>
        )}

        {/* Personality descriptors — one by one */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          {descriptors.map((desc, i) => {
            const isRevealed = revealedCount >= i + 3; // offset by greeting + relationship
            if (!isRevealed) return null;
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  fontFamily: config.theme.typography.displayFont,
                  fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: config.theme.colors.text,
                  textAlign: 'center',
                }}
              >
                {desc}
              </motion.p>
            );
          })}
        </div>

        {/* Continue */}
        {showContinue && (
          <motion.button
            className="btn-ghost"
            onClick={onNext}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              marginTop: '1.5rem',
              borderColor: `${config.theme.colors.accent}30`,
              color: config.theme.colors.accent,
            }}
          >
            Continue →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

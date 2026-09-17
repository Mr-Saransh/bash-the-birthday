'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';
import { firstName } from '@/lib/utils';
import { Crown, Sparkles } from 'lucide-react';

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
  const descriptors = config.content.personalityDescriptors || [];
  const relationshipLine = config.content.relationshipLine;
  const personalityTitle = config.content.personalityTitle;
  const soundtrackNote = config.content.soundtrackNote;

  const totalStages = descriptors.length + 3;

  useEffect(() => {
    if (revealedCount <= totalStages) {
      const delay = revealedCount === 0 ? 600 : revealedCount === 1 ? 1200 : 1500;
      const timer = setTimeout(() => {
        setRevealedCount((c) => c + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowContinue(true), 500);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, totalStages]);

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
      <div className="scene-content" style={{ gap: 'clamp(1.5rem, 3.5vh, 2.5rem)', maxWidth: '580px' }}>
        {/* Stage 1: "People know you as [Name]." */}
        {revealedCount >= 1 && (
          <motion.p
            className="body-text-lg"
            initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ color: config.theme.colors.textMuted, fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}
          >
            People know you as{' '}
            <span style={{ color: config.theme.colors.accent, fontWeight: 700 }}>
              {name}
            </span>
            .
          </motion.p>
        )}

        {/* Stage 2: Relationship line */}
        {revealedCount >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontStyle: 'italic',
              color: config.theme.colors.textMuted,
              fontSize: 'clamp(0.92rem, 2.4vw, 1.15rem)',
              lineHeight: 1.6,
            }}
          >
            &ldquo;{relationshipLine}&rdquo;
          </motion.p>
        )}

        {/* Stage 3: The Custom Persona Title (NO generic guessing) */}
        {revealedCount >= 3 && personalityTitle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, type: 'spring', stiffness: 220, damping: 20 }}
            style={{
              padding: 'clamp(0.85rem, 2.5vw, 1.25rem) clamp(1.2rem, 4vw, 2rem)',
              borderRadius: '9999px',
              background: `linear-gradient(135deg, rgba(244,63,94,0.15), rgba(251,191,36,0.18))`,
              border: `1.5px solid ${config.theme.colors.accent}60`,
              boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 25px ${config.theme.colors.glow}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <Crown size={20} color={config.theme.colors.accent} />
            <span
              style={{
                fontFamily: config.theme.typography.displayFont,
                fontSize: 'clamp(1rem, 3.2vw, 1.35rem)',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                background: `linear-gradient(135deg, ${config.theme.colors.accent}, ${config.theme.colors.accentSecondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {personalityTitle}
            </span>
          </motion.div>
        )}

        {/* Stage 4+: Personality descriptors */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {descriptors.map((desc, i) => {
            const isRevealed = revealedCount >= i + 4;
            if (!isRevealed) return null;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  width: '100%',
                }}
              >
                <p
                  style={{
                    fontFamily: config.theme.typography.displayFont,
                    fontSize: 'clamp(1.05rem, 3vw, 1.45rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: config.theme.colors.text,
                    textAlign: 'center',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Soundtrack note if provided */}
        {revealedCount >= totalStages && soundtrackNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: config.theme.colors.accentSecondary,
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            <Sparkles size={13} />
            <span>{soundtrackNote}</span>
          </motion.div>
        )}

        {/* Continue */}
        {showContinue && (
          <motion.button
            className="btn-ghost"
            onClick={onNext}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              marginTop: '0.75rem',
              borderColor: `${config.theme.colors.accent}40`,
              color: config.theme.colors.accent,
              padding: '0.75rem 2rem',
            }}
          >
            Continue →
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GenerationExperienceProps {
  recipientName: string;
  onComplete: () => void;
}

const STAGES = [
  { text: 'Getting the vibe right', emoji: '✨', duration: 1200 },
  { text: 'Creating the story', emoji: '📖', duration: 1400 },
  { text: 'Picking the memories', emoji: '📸', duration: 1000 },
  { text: 'Adding the little details', emoji: '🎨', duration: 1300 },
  { text: 'Preparing the surprise', emoji: '🎁', duration: 1500 },
];

export default function GenerationExperience({
  recipientName,
  onComplete,
}: GenerationExperienceProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (currentStage < STAGES.length) {
      const timer = setTimeout(() => {
        setCurrentStage((s) => s + 1);
      }, STAGES[currentStage].duration);
      return () => clearTimeout(timer);
    } else if (!complete) {
      const timer = setTimeout(() => {
        setComplete(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentStage, complete]);

  useEffect(() => {
    if (complete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [complete, onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem)',
        background: 'var(--bg-primary)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3rem',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        {!complete ? (
          <>
            {/* Animated orb */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 40px rgba(124, 58, 237, 0.2)',
                  '0 0 80px rgba(124, 58, 237, 0.4)',
                  '0 0 40px rgba(124, 58, 237, 0.2)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, var(--gradient-from), var(--gradient-to))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentStage}
                  initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: '2rem' }}
                >
                  {STAGES[Math.min(currentStage, STAGES.length - 1)].emoji}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* Title */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textAlign: 'center',
              }}
            >
              Building {recipientName.split(' ')[0]}&apos;s birthday universe…
            </motion.p>

            {/* Stage list */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                width: '100%',
              }}
            >
              {STAGES.map((stage, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: i <= currentStage ? 1 : 0.3,
                    x: 0,
                  }}
                  transition={{
                    delay: i * 0.15,
                    duration: 0.5,
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.95rem',
                    color:
                      i < currentStage
                        ? 'var(--accent)'
                        : i === currentStage
                        ? 'var(--text-primary)'
                        : 'var(--text-muted)',
                    fontWeight: i === currentStage ? 500 : 400,
                    transition: 'color 0.3s, font-weight 0.3s',
                  }}
                >
                  {i < currentStage ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    >
                      ✓
                    </motion.span>
                  ) : i === currentStage ? (
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      ●
                    </motion.span>
                  ) : (
                    <span style={{ opacity: 0.3 }}>○</span>
                  )}
                  <span>{stage.text}</span>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* Complete state */
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'center',
            }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ fontSize: '3rem' }}
            >
              ✦
            </motion.span>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              Your surprise is ready.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';

interface MemorySceneProps {
  config: ExperienceConfig;
  onNext: () => void;
}

export default function MemoryScene({ config, onNext }: MemorySceneProps) {
  const { colors, typography } = config.theme;
  const memory = config.data.memory;
  const memoryIntro = config.content.memoryIntro;

  if (!memory) {
    // This shouldn't render if no memory, but handle gracefully
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
    >
      <div className="scene-content" style={{ gap: '3rem' }}>
        {/* Memory intro */}
        <motion.p
          className="body-text"
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            color: colors.textMuted,
            fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
          }}
        >
          {memoryIntro}
        </motion.p>

        {/* The memory itself */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding: 'clamp(2rem, 6vw, 3rem)',
            borderRadius: '20px',
            background: `${colors.bgSurface}80`,
            border: `1px solid rgba(255,255,255,0.06)`,
            maxWidth: '480px',
            width: '100%',
          }}
        >
          {/* Decorative quote mark */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            style={{
              display: 'block',
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              lineHeight: 1,
              color: colors.accent,
              marginBottom: '-0.5rem',
              userSelect: 'none',
            }}
          >
            &ldquo;
          </motion.span>

          <p
            style={{
              fontFamily: typography.displayFont,
              fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
              fontWeight: 500,
              lineHeight: 1.7,
              color: colors.text,
              textAlign: 'left',
            }}
          >
            {memory}
          </p>
        </motion.div>

        {/* Continue */}
        <motion.button
          className="btn-ghost"
          onClick={onNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
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

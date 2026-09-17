'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';
import { firstName } from '@/lib/utils';

interface InteractiveUniverseSceneProps {
  config: ExperienceConfig;
  onNext: () => void;
}

interface DiscoverableItem {
  id: string;
  emoji: string;
  label: string;
  content: string;
  color: string;
}

export default function InteractiveUniverseScene({
  config,
  onNext,
}: InteractiveUniverseSceneProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [discoveredItems, setDiscoveredItems] = useState<Set<string>>(new Set());
  const [secretFound, setSecretFound] = useState(false);
  const [secretHoldTimer, setSecretHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [showSecretReveal, setShowSecretReveal] = useState(false);
  const name = firstName(config.data.recipientName);
  const { colors } = config.theme;

  const items: DiscoverableItem[] = [
    {
      id: 'star',
      emoji: '⭐',
      label: 'Why You\'re Great',
      content: `One thing ${config.data.senderName} loves about you: ${config.data.favoriteThing}`,
      color: colors.accent,
    },
    {
      id: 'observations',
      emoji: '🔮',
      label: 'Your Vibe',
      content: config.content.personalityDescriptors[0] || 'Impossible to define. That\'s the point.',
      color: colors.accentSecondary,
    },
    ...(config.data.memory
      ? [{
          id: 'memory',
          emoji: '📸',
          label: 'A Memory',
          content: config.data.memory,
          color: '#fbbf24',
        }]
      : []),
    {
      id: 'joke',
      emoji: '😂',
      label: 'Inside Thing',
      content: config.content.observations[0] || 'Being unreasonably yourself about everything.',
      color: '#34d399',
    },
    {
      id: 'message',
      emoji: '💬',
      label: 'A Message',
      content: config.data.optionalMessage || config.content.fallbackMessage,
      color: '#60a5fa',
    },
  ];

  const handleDiscover = useCallback((id: string) => {
    setOpenItem(id);
    setDiscoveredItems((prev) => new Set([...prev, id]));
  }, []);

  const handleCloseItem = useCallback(() => {
    setOpenItem(null);
  }, []);

  // Secret interaction: long press on the center area
  const handleSecretStart = useCallback(() => {
    if (secretFound) return;
    const timer = setTimeout(() => {
      setSecretFound(true);
      setShowSecretReveal(true);
    }, 3000);
    setSecretHoldTimer(timer);
  }, [secretFound]);

  const handleSecretEnd = useCallback(() => {
    if (secretHoldTimer) {
      clearTimeout(secretHoldTimer);
      setSecretHoldTimer(null);
    }
  }, [secretHoldTimer]);

  // Floating positions for items
  const positions = [
    { x: '15%', y: '20%' },
    { x: '72%', y: '15%' },
    { x: '8%', y: '60%' },
    { x: '78%', y: '55%' },
    { x: '45%', y: '75%' },
  ];

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ padding: 0, cursor: 'default' }}
    >
      {/* Scene title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{
          position: 'absolute',
          top: 'clamp(2rem, 6vh, 4rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <p
          className="caption-text"
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: colors.textMuted,
            marginBottom: '0.5rem',
          }}
        >
          Explore
        </p>
        <p
          className="heading-text"
          style={{
            fontFamily: config.theme.typography.displayFont,
            fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
          }}
        >
          {name}&apos;s Universe
        </p>
      </motion.div>

      {/* Floating interactive objects */}
      {items.map((item, i) => {
        const pos = positions[i % positions.length];
        const isDiscovered = discoveredItems.has(item.id);
        const floatDuration = 4 + Math.random() * 3;
        const floatDelay = i * 0.5;

        return (
          <motion.button
            key={item.id}
            onClick={() => handleDiscover(item.id)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -15, 0],
            }}
            transition={{
              opacity: { delay: 0.5 + i * 0.15, duration: 0.5 },
              scale: {
                delay: 0.5 + i * 0.15,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              },
              y: {
                duration: floatDuration,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: floatDelay,
              },
            }}
            whileHover={{
              scale: 1.15,
              boxShadow: `0 0 40px ${item.color}40`,
            }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: 'clamp(70px, 15vw, 100px)',
              height: 'clamp(70px, 15vw, 100px)',
              borderRadius: '50%',
              background: isDiscovered
                ? `${item.color}15`
                : `${colors.bgSurface}`,
              border: `1px solid ${isDiscovered ? `${item.color}40` : 'rgba(255,255,255,0.06)'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              zIndex: 5,
            }}
            aria-label={`Discover: ${item.label}`}
          >
            <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>{item.emoji}</span>
            <span
              style={{
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: isDiscovered ? item.color : colors.textMuted,
                fontWeight: 500,
              }}
            >
              {item.label}
            </span>
            {isDiscovered && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: item.color,
                }}
              />
            )}
          </motion.button>
        );
      })}

      {/* Secret hotspot — center of screen, invisible */}
      <div
        onMouseDown={handleSecretStart}
        onMouseUp={handleSecretEnd}
        onMouseLeave={handleSecretEnd}
        onTouchStart={handleSecretStart}
        onTouchEnd={handleSecretEnd}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 4,
        }}
        aria-hidden="true"
      >
        {/* Tiny barely-visible star */}
        <motion.span
          animate={{
            opacity: [0.1, 0.25, 0.1],
            scale: [0.8, 1, 0.8],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            color: colors.particle,
          }}
        >
          ✦
        </motion.span>
      </div>

      {/* Item detail modal */}
      <AnimatePresence>
        {openItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseItem}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              padding: '1.5rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{
                padding: 'clamp(1.5rem, 5vw, 2.5rem)',
                maxWidth: '420px',
                width: '100%',
                textAlign: 'center',
              }}
            >
              {(() => {
                const item = items.find((i) => i.id === openItem);
                if (!item) return null;
                return (
                  <>
                    <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                      {item.emoji}
                    </p>
                    <p
                      style={{
                        fontFamily: config.theme.typography.displayFont,
                        fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                        fontWeight: 600,
                        color: item.color,
                        marginBottom: '1rem',
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="body-text"
                      style={{
                        color: colors.text,
                        lineHeight: 1.8,
                      }}
                    >
                      {item.content}
                    </p>
                    <button
                      onClick={handleCloseItem}
                      className="btn-ghost"
                      style={{
                        marginTop: '1.5rem',
                        fontSize: '0.85rem',
                      }}
                    >
                      Close
                    </button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret reveal overlay */}
      <AnimatePresence>
        {showSecretReveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSecretReveal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 25,
              padding: '2rem',
              gap: '1.5rem',
            }}
          >
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              style={{
                fontFamily: config.theme.typography.displayFont,
                fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                fontWeight: 600,
                color: colors.accent,
              }}
            >
              You found the secret. ✦
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="body-text"
              style={{ maxWidth: '380px', textAlign: 'center', color: colors.text }}
            >
              {config.content.secretMessage}
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              onClick={() => setShowSecretReveal(false)}
              className="btn-ghost"
              style={{ marginTop: '1rem' }}
            >
              Keep exploring
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button — appears after discovering items */}
      {discoveredItems.size >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            position: 'absolute',
            bottom: 'clamp(2rem, 5vh, 4rem)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <motion.button
            className="btn-ghost"
            onClick={onNext}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              borderColor: `${colors.accent}30`,
              color: colors.accent,
            }}
          >
            Continue →
          </motion.button>
          <p
            style={{
              textAlign: 'center',
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: colors.textMuted,
            }}
          >
            {discoveredItems.size}/{items.length} discovered
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

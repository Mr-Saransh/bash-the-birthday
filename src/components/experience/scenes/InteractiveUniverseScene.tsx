'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExperienceConfig } from '@/lib/types';
import { firstName } from '@/lib/utils';
import { Sparkles, X } from 'lucide-react';

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
  image?: string;
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
  const [isMobile, setIsMobile] = useState(false);

  const name = firstName(config.data.recipientName);
  const { colors } = config.theme;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const items: DiscoverableItem[] = [
    {
      id: 'star',
      emoji: '⭐',
      label: 'Why You\'re Loved',
      content: `One thing ${config.data.senderName} adores about you: ${config.data.favoriteThing}`,
      color: colors.accent,
    },
    {
      id: 'observations',
      emoji: '👑',
      label: 'Your Persona',
      content: config.content.personalityTitle || config.content.personalityDescriptors[0] || 'The Birthday Icon',
      color: colors.accentSecondary,
    },
    ...(config.data.photoUrl
      ? [
          {
            id: 'photo',
            emoji: '📸',
            label: 'Memory Photo',
            content: config.data.memory || 'A snapshot of pure magic and genuine smiles.',
            color: '#f43f5e',
            image: config.data.photoUrl,
          },
        ]
      : []),
    ...(config.data.quirkOrHabit
      ? [
          {
            id: 'quirk',
            emoji: '😜',
            label: 'Signature Quirk',
            content: `Documented specialty: ${config.data.quirkOrHabit}`,
            color: '#fb923c',
          },
        ]
      : []),
    ...(config.data.insideJoke
      ? [
          {
            id: 'joke',
            emoji: '🤫',
            label: 'Inside Joke',
            content: `The classified inside joke: "${config.data.insideJoke}"`,
            color: '#34d399',
          },
        ]
      : [
          {
            id: 'joke',
            emoji: '😂',
            label: 'Inside Thing',
            content: config.content.observations[0] || 'Being unreasonably yourself about everything.',
            color: '#34d399',
          },
        ]),
    ...(config.data.favoriteSong
      ? [
          {
            id: 'song',
            emoji: '🎵',
            label: 'Your Anthem',
            content: `Playing on repeat in the multiverse: ${config.data.favoriteSong}`,
            color: '#ec4899',
          },
        ]
      : []),
    {
      id: 'message',
      emoji: '💌',
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
    }, 2500);
    setSecretHoldTimer(timer);
  }, [secretFound]);

  const handleSecretEnd = useCallback(() => {
    if (secretHoldTimer) {
      clearTimeout(secretHoldTimer);
      setSecretHoldTimer(null);
    }
  }, [secretHoldTimer]);

  // Viewport-safe positions for mobile vs desktop
  const desktopPositions = [
    { x: '14%', y: '22%' },
    { x: '72%', y: '20%' },
    { x: '10%', y: '58%' },
    { x: '76%', y: '56%' },
    { x: '25%', y: '78%' },
    { x: '65%', y: '78%' },
    { x: '45%', y: '16%' },
  ];

  const mobilePositions = [
    { x: '12%', y: '18%' },
    { x: '62%', y: '18%' },
    { x: '10%', y: '42%' },
    { x: '64%', y: '42%' },
    { x: '15%', y: '66%' },
    { x: '60%', y: '66%' },
    { x: '38%', y: '82%' },
  ];

  const positions = isMobile ? mobilePositions : desktopPositions;

  return (
    <motion.div
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ padding: 0, cursor: 'default', overflow: 'hidden' }}
    >
      {/* Scene title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{
          position: 'absolute',
          top: 'clamp(1.5rem, 5vh, 3.5rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 10,
          width: '90%',
          pointerEvents: 'none',
        }}
      >
        <p
          className="caption-text"
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: colors.textMuted,
            marginBottom: '0.3rem',
            fontSize: '0.8rem',
          }}
        >
          ✦ Tap the stars to explore ✦
        </p>
        <h2
          style={{
            fontFamily: config.theme.typography.displayFont,
            fontSize: 'clamp(1.4rem, 4.5vw, 2.2rem)',
            color: colors.text,
            margin: 0,
          }}
        >
          {name}&apos;s Universe
        </h2>
      </motion.div>

      {/* Floating celestial objects */}
      {items.map((item, i) => {
        const pos = positions[i % positions.length];
        const isDiscovered = discoveredItems.has(item.id);
        const floatDuration = 4 + (i % 3);
        const floatDelay = i * 0.3;

        return (
          <motion.button
            key={item.id}
            onClick={() => handleDiscover(item.id)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { delay: 0.3 + i * 0.1, duration: 0.5 },
              scale: {
                delay: 0.3 + i * 0.1,
                type: 'spring',
                stiffness: 240,
                damping: 18,
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
              scale: 1.12,
              boxShadow: `0 0 35px ${item.color}55`,
            }}
            whileTap={{ scale: 0.92 }}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: isMobile ? '72px' : 'clamp(80px, 12vw, 98px)',
              height: isMobile ? '72px' : 'clamp(80px, 12vw, 98px)',
              borderRadius: '50%',
              background: isDiscovered
                ? `radial-gradient(circle, ${item.color}25 0%, ${colors.bgSurface} 80%)`
                : `${colors.bgSurface}`,
              border: `1.5px solid ${isDiscovered ? `${item.color}60` : 'rgba(255,255,255,0.12)'}`,
              boxShadow: isDiscovered
                ? `0 0 25px ${item.color}35`
                : '0 8px 25px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              zIndex: 5,
              padding: '6px',
            }}
            aria-label={`Discover: ${item.label}`}
          >
            <span style={{ fontSize: isMobile ? '1.5rem' : '1.8rem' }}>{item.emoji}</span>
            <span
              style={{
                fontSize: isMobile ? '0.58rem' : '0.66rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: isDiscovered ? item.color : colors.textMuted,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '90%',
              }}
            >
              {item.label}
            </span>

            {/* Discovered indicator badge */}
            {isDiscovered && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: item.color,
                  boxShadow: `0 0 8px ${item.color}`,
                }}
              />
            )}
          </motion.button>
        );
      })}

      {/* Secret star hotspot in center */}
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
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Secret cosmic hotspot"
      >
        <motion.span
          animate={{
            opacity: [0.15, 0.45, 0.15],
            scale: [0.85, 1.15, 0.85],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontSize: '1.1rem',
            color: colors.accent,
            userSelect: 'none',
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
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
              padding: '1.25rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 320, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card"
              style={{
                padding: 'clamp(1.25rem, 4vw, 2rem)',
                maxWidth: '440px',
                width: '100%',
                textAlign: 'center',
                position: 'relative',
                maxHeight: '85vh',
                overflowY: 'auto',
                border: `1.5px solid ${colors.accent}40`,
                boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
              }}
            >
              {/* Close icon top right */}
              <button
                onClick={handleCloseItem}
                style={{
                  position: 'absolute',
                  top: '0.85rem',
                  right: '0.85rem',
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label="Close"
              >
                <X size={16} />
              </button>

              {(() => {
                const item = items.find((i) => i.id === openItem);
                if (!item) return null;
                return (
                  <>
                    <p style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
                      {item.emoji}
                    </p>
                    <p
                      style={{
                        fontFamily: config.theme.typography.displayFont,
                        fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)',
                        fontWeight: 700,
                        color: item.color,
                        marginBottom: '0.85rem',
                      }}
                    >
                      {item.label}
                    </p>

                    {/* Image display if this item has an uploaded Cloudinary photo */}
                    {item.image && (
                      <div
                        style={{
                          width: '100%',
                          maxHeight: '220px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          marginBottom: '1rem',
                          border: `1px solid ${item.color}50`,
                          boxShadow: `0 8px 25px rgba(0,0,0,0.5)`,
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.label}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <p
                      className="body-text"
                      style={{
                        color: colors.text,
                        lineHeight: 1.7,
                        fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                      }}
                    >
                      {item.content}
                    </p>

                    <button
                      onClick={handleCloseItem}
                      className="btn-primary"
                      style={{
                        marginTop: '1.5rem',
                        padding: '0.65rem 1.75rem',
                        fontSize: '0.9rem',
                        background: item.color,
                        color: '#ffffff',
                      }}
                    >
                      <span>Got it ✨</span>
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
              background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 35,
              padding: '2rem',
              gap: '1.25rem',
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24, #f43f5e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 35px rgba(251, 191, 36, 0.4)',
              }}
            >
              <Sparkles size={32} color="#ffffff" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              style={{
                fontFamily: config.theme.typography.displayFont,
                fontSize: 'clamp(1.4rem, 4.5vw, 2rem)',
                fontWeight: 700,
                color: colors.accent,
                textAlign: 'center',
                margin: 0,
              }}
            >
              Secret Star Unlocked! ✦
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="body-text"
              style={{ maxWidth: '400px', textAlign: 'center', color: colors.text, lineHeight: 1.7 }}
            >
              {config.content.secretMessage}
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setShowSecretReveal(false)}
              className="btn-ghost"
              style={{
                marginTop: '0.75rem',
                borderColor: `${colors.accent}50`,
                color: colors.accent,
              }}
            >
              Keep exploring
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button — appears after discovering at least 2 items */}
      {discoveredItems.size >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            bottom: 'clamp(1.5rem, 4vh, 3.5rem)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <motion.button
            className="btn-primary"
            onClick={onNext}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '0.75rem 2rem',
              boxShadow: `0 8px 30px ${colors.glow}`,
            }}
          >
            <span>Continue Journey →</span>
          </motion.button>
          <p
            style={{
              textAlign: 'center',
              marginTop: '0.4rem',
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

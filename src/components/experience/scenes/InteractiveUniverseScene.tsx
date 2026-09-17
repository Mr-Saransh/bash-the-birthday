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

  const playBubblePop = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1150, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio autoplay policy fallback
    }
  }, []);

  const handleDiscover = useCallback((id: string) => {
    playBubblePop();
    setOpenItem(id);
    setDiscoveredItems((prev) => new Set([...prev, id]));
  }, [playBubblePop]);

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

  // Viewport-safe positions for mobile vs desktop — completely clear of top header and bottom controls
  const desktopPositions = [
    { x: '12%', y: '25%' },
    { x: '72%', y: '25%' },
    { x: '8%', y: '50%' },
    { x: '76%', y: '50%' },
    { x: '16%', y: '74%' },
    { x: '68%', y: '74%' },
    { x: '42%', y: '75%' },
  ];

  const mobilePositions = [
    { x: '8%', y: '24%' },
    { x: '65%', y: '24%' },
    { x: '6%', y: '42%' },
    { x: '67%', y: '42%' },
    { x: '8%', y: '60%' },
    { x: '65%', y: '60%' },
    { x: '37%', y: '75%' },
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
      {/* Scene title & Crystal Clear Direction Banner — Safely constrained within viewport */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{
          position: 'absolute',
          top: 'clamp(0.6rem, 2vh, 1.4rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 15,
          width: '94%',
          maxWidth: '380px',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.35rem',
          boxSizing: 'border-box',
        }}
      >
        <h2
          style={{
            fontFamily: config.theme.typography.displayFont,
            fontSize: 'clamp(1.25rem, 4vw, 1.85rem)',
            fontWeight: 800,
            color: colors.text,
            margin: 0,
            letterSpacing: '-0.02em',
            textShadow: `0 0 25px ${colors.glow}`,
            lineHeight: 1.15,
          }}
        >
          {name}&apos;s Universe 🌌
        </h2>

        {/* Clear, compact bubble-tap instruction pill */}
        <motion.div
          animate={{
            scale: [1, 1.03, 1],
            boxShadow: [
              `0 0 15px ${colors.glow}`,
              `0 0 25px ${colors.glow}`,
              `0 0 15px ${colors.glow}`,
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))',
            border: `1.5px solid ${colors.accent}`,
            backdropFilter: 'blur(12px)',
            pointerEvents: 'auto',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '1rem', display: 'inline-block', flexShrink: 0 }}
          >
            🫧
          </motion.span>
          <span
            style={{
              fontSize: 'clamp(0.72rem, 2.3vw, 0.84rem)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            {discoveredItems.size === items.length
              ? '🎉 All bubbles popped!'
              : `Tap bubbles to pop! (${discoveredItems.size}/${items.length})`}
          </span>
        </motion.div>

        {/* Progress track */}
        <div
          style={{
            width: '110px',
            height: '3.5px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.12)',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ width: `${(discoveredItems.size / items.length) * 100}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentSecondary})`,
              borderRadius: '9999px',
              boxShadow: `0 0 8px ${colors.accent}`,
            }}
          />
        </div>
      </motion.div>

      {/* Floating luminous celestial glass bubbles */}
      {items.map((item, i) => {
        const pos = positions[i % positions.length];
        const isDiscovered = discoveredItems.has(item.id);
        const floatDuration = 3.8 + (i % 3);
        const floatDelay = i * 0.3;

        return (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              zIndex: 5,
            }}
          >
            {/* Radiating beacon ripple wave for unvisited bubbles */}
            {!isDiscovered && (
              <motion.div
                animate={{
                  scale: [1, 1.45, 1.85],
                  opacity: [0.8, 0.3, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  inset: -6,
                  borderRadius: '50%',
                  border: `2px solid ${item.color}`,
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
            )}

            {/* Tap guide tooltip for the first unvisited bubble */}
            {!isDiscovered && i === 0 && discoveredItems.size === 0 && (
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: -30,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #f43f5e, #fbbf24)',
                  color: '#ffffff',
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 15px rgba(244,63,94,0.5)',
                  zIndex: 12,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <span>👆 TAP ME!</span>
              </motion.div>
            )}

            <motion.button
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
                scale: 1.15,
                boxShadow: `0 0 45px ${item.color}80, inset 0 2px 8px rgba(255,255,255,0.9)`,
              }}
              whileTap={{ scale: 0.88 }}
              style={{
                width: isMobile ? '76px' : 'clamp(84px, 12.5vw, 104px)',
                height: isMobile ? '76px' : 'clamp(84px, 12.5vw, 104px)',
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 28%, rgba(255,255,255,0.3) 0%, ${isDiscovered ? `${item.color}35` : `${item.color}20`} 40%, ${colors.bgSurface} 95%)`,
                border: `2px solid ${isDiscovered ? item.color : 'rgba(255, 255, 255, 0.55)'}`,
                boxShadow: isDiscovered
                  ? `0 0 35px ${item.color}65, inset 0 2px 6px rgba(255,255,255,0.8), inset 0 -4px 12px ${item.color}45`
                  : `0 8px 30px rgba(0,0,0,0.6), 0 0 20px ${item.color}40, inset 0 2px 6px rgba(255,255,255,0.7), inset 0 -4px 12px ${item.color}30`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                zIndex: 5,
                padding: '6px',
                position: 'relative',
                overflow: 'hidden',
              }}
              aria-label={`Discover: ${item.label}`}
            >
              {/* Specular Curved Highlight (Liquid Glass Top-Left) */}
              <div
                style={{
                  position: 'absolute',
                  top: '9%',
                  left: '16%',
                  width: '40%',
                  height: '24%',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  transform: 'rotate(-28deg)',
                  pointerEvents: 'none',
                }}
              />

              {/* Specular Curved Highlight (Liquid Glass Bottom-Right) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10%',
                  right: '16%',
                  width: '32%',
                  height: '18%',
                  borderRadius: '50%',
                  background: `radial-gradient(ellipse at center, ${item.color}99 0%, transparent 80%)`,
                  transform: 'rotate(-15deg)',
                  pointerEvents: 'none',
                }}
              />

              {/* Content / Thumbnail */}
              {item.image ? (
                <div
                  style={{
                    width: isMobile ? '34px' : '40px',
                    height: isMobile ? '34px' : '40px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                  }}
                >
                  <img
                    src={item.image}
                    alt="Memory"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <span style={{ fontSize: isMobile ? '1.55rem' : '1.9rem', position: 'relative', zIndex: 2 }}>
                  {item.emoji}
                </span>
              )}

              <span
                style={{
                  fontSize: isMobile ? '0.58rem' : '0.66rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: isDiscovered ? '#ffffff' : colors.textMuted,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '92%',
                  position: 'relative',
                  zIndex: 2,
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}
              >
                {item.label}
              </span>

              {/* Discovered Check Indicator */}
              {isDiscovered && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: 3,
                    right: 3,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: item.color,
                    boxShadow: `0 0 10px ${item.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px',
                    color: '#ffffff',
                    fontWeight: 900,
                  }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          </div>
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

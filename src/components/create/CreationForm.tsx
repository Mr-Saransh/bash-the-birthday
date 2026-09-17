'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import type { BirthdayData, Personality, Relationship } from '@/lib/types';
import { PERSONALITIES, RELATIONSHIPS } from '@/lib/types';
import GenerationExperience from './GenerationExperience';
import ShareScreen from './ShareScreen';
import { buildExperience } from '@/engine/experience-builder';
import { slugify } from '@/lib/utils';
import type { ExperienceConfig } from '@/lib/types';

const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  'best-friend': 'Best Friend',
  friend: 'Friend',
  partner: 'Partner',
  sibling: 'Sibling',
  parent: 'Parent',
  'someone-special': 'Someone Special',
  other: 'Other',
};

const PERSONALITY_LABELS: Record<Personality, string> = {
  chaotic: 'Chaotic',
  funny: 'Funny',
  soft: 'Soft',
  adventurous: 'Adventurous',
  introvert: 'Introvert',
  'main-character': 'Main Character',
  'class-clown': 'Class Clown',
  ambitious: 'Ambitious',
  mysterious: 'Mysterious',
};

const PERSONALITY_EMOJIS: Record<Personality, string> = {
  chaotic: '🌪️',
  funny: '😂',
  soft: '🌸',
  adventurous: '🗺️',
  introvert: '🌙',
  'main-character': '🎬',
  'class-clown': '🤡',
  ambitious: '🚀',
  mysterious: '🔮',
};

type FlowStage = 'form' | 'generating' | 'share';

export default function CreationForm() {
  const [stage, setStage] = useState<FlowStage>('form');
  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState<ExperienceConfig | null>(null);

  // Form state
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [personality, setPersonality] = useState<Personality | null>(null);
  const [favoriteThing, setFavoriteThing] = useState('');
  const [memory, setMemory] = useState('');
  const [optionalMessage, setOptionalMessage] = useState('');
  const [songUrl, setSongUrl] = useState('');

  const canProceed = () => {
    switch (step) {
      case 0:
        return recipientName.trim().length > 0 && relationship !== null;
      case 1:
        return personality !== null;
      case 2:
        return favoriteThing.trim().length > 0 && senderName.trim().length > 0;
      case 3:
        return true; // optional step
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!relationship || !personality) return;

    const data: BirthdayData = {
      recipientName: recipientName.trim(),
      senderName: senderName.trim(),
      relationship,
      personality,
      favoriteThing: favoriteThing.trim(),
      memory: memory.trim() || undefined,
      optionalMessage: optionalMessage.trim() || undefined,
      songUrl: songUrl.trim() || undefined,
    };

    // Generate slug
    const randomPart = Math.random().toString(36).substring(2, 6);
    const slug = `${slugify(data.recipientName)}-${randomPart}`;

    // Build experience
    const config = buildExperience(data, slug);
    setExperience(config);

    // Store in localStorage for demo
    localStorage.setItem(`bv-${slug}`, JSON.stringify(data));

    // Move to generation stage
    setStage('generating');
  };

  if (stage === 'generating' && experience) {
    return (
      <GenerationExperience
        recipientName={recipientName}
        onComplete={() => setStage('share')}
      />
    );
  }

  if (stage === 'share' && experience) {
    return <ShareScreen slug={experience.slug} recipientName={recipientName} />;
  }

  const totalSteps = 4;

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1.5rem, 5vw, 4rem)',
        background: 'var(--bg-primary)',
        position: 'relative',
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(255,255,255,0.05)',
          zIndex: 20,
        }}
      >
        <motion.div
          animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--gradient-from), var(--gradient-to))',
          }}
        />
      </div>

      <div
        style={{
          maxWidth: '480px',
          width: '100%',
        }}
      >
        <AnimatePresence mode="wait">
          {/* ─── Step 0: Name + Relationship ─── */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              <div>
                <p
                  className="caption-text"
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Step 1 of {totalSteps}
                </p>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Who is this for?
                </h2>
              </div>

              {/* Name input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label
                  htmlFor="recipientName"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Their name
                </label>
                <input
                  id="recipientName"
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Riya"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    fontSize: '1.1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = 'var(--accent)')
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = 'rgba(255,255,255,0.08)')
                  }
                />
              </div>

              {/* Relationship pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  They are your…
                </label>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  {RELATIONSHIPS.map((rel) => (
                    <button
                      key={rel}
                      onClick={() => setRelationship(rel)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background:
                          relationship === rel
                            ? 'var(--accent)'
                            : 'var(--bg-surface)',
                        color:
                          relationship === rel
                            ? '#ffffff'
                            : 'var(--text-secondary)',
                        border:
                          relationship === rel
                            ? '1px solid var(--accent)'
                            : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {RELATIONSHIP_LABELS[rel]}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Step 1: Personality ─── */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              <div>
                <p
                  className="caption-text"
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Step 2 of {totalSteps}
                </p>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                  }}
                >
                  What&apos;s their vibe?
                </h2>
                <p
                  className="body-text"
                  style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}
                >
                  Pick the one that fits best.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '0.5rem',
                }}
              >
                {PERSONALITIES.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPersonality(p)}
                    style={{
                      padding: '0.875rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background:
                        personality === p
                          ? 'rgba(192, 132, 252, 0.15)'
                          : 'var(--bg-surface)',
                      color:
                        personality === p
                          ? 'var(--accent)'
                          : 'var(--text-secondary)',
                      border:
                        personality === p
                          ? '1px solid var(--accent)'
                          : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <span>{PERSONALITY_EMOJIS[p]}</span>
                    <span>{PERSONALITY_LABELS[p]}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─── Step 2: Favorite thing + Sender name ─── */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              <div>
                <p
                  className="caption-text"
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Step 3 of {totalSteps}
                </p>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                  }}
                >
                  The personal touch
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label
                  htmlFor="favoriteThing"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  One thing you love about them
                </label>
                <input
                  id="favoriteThing"
                  type="text"
                  value={favoriteThing}
                  onChange={(e) => setFavoriteThing(e.target.value)}
                  placeholder="e.g. overthinking playlists at 2 AM"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    fontSize: '1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = 'var(--accent)')
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = 'rgba(255,255,255,0.08)')
                  }
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label
                  htmlFor="senderName"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  Your name
                </label>
                <input
                  id="senderName"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Aarav"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    fontSize: '1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = 'var(--accent)')
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = 'rgba(255,255,255,0.08)')
                  }
                />
              </div>
            </motion.div>
          )}

          {/* ─── Step 3: Optional extras ─── */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              <div>
                <p
                  className="caption-text"
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '0.5rem',
                  }}
                >
                  Step 4 of {totalSteps} · Optional
                </p>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Want to add more?
                </h2>
                <p
                  className="body-text"
                  style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}
                >
                  Everything here is optional. Skip if you want.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label
                  htmlFor="memory"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  A short memory
                </label>
                <textarea
                  id="memory"
                  value={memory}
                  onChange={(e) => setMemory(e.target.value)}
                  placeholder="That time we..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    fontSize: '1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = 'var(--accent)')
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = 'rgba(255,255,255,0.08)')
                  }
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label
                  htmlFor="optionalMessage"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  A personal message
                </label>
                <textarea
                  id="optionalMessage"
                  value={optionalMessage}
                  onChange={(e) => setOptionalMessage(e.target.value)}
                  placeholder="Keep it short. The experience does most of the talking."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    fontSize: '1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = 'var(--accent)')
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = 'rgba(255,255,255,0.08)')
                  }
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label
                  htmlFor="songUrl"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                  }}
                >
                  A song link (Spotify, YouTube, etc.)
                </label>
                <input
                  id="songUrl"
                  type="url"
                  value={songUrl}
                  onChange={(e) => setSongUrl(e.target.value)}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    fontSize: '1rem',
                    background: 'var(--bg-surface)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = 'var(--accent)')
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = 'rgba(255,255,255,0.08)')
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2.5rem',
            gap: '1rem',
          }}
        >
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="btn-ghost"
              style={{ gap: '0.5rem' }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="btn-primary"
              style={{
                gap: '0.5rem',
                opacity: canProceed() ? 1 : 0.4,
                cursor: canProceed() ? 'pointer' : 'not-allowed',
              }}
            >
              <span>Next</span>
              <ArrowRight size={16} style={{ position: 'relative', zIndex: 1 }} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="btn-primary"
              style={{ gap: '0.5rem' }}
            >
              <Sparkles size={16} style={{ position: 'relative', zIndex: 1 }} />
              <span>Create Surprise</span>
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

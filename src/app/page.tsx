'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Heart,
  Play,
  Gift,
  Cake,
  Camera,
  Music,
  MessageCircle,
  Star,
  ShieldCheck,
  Zap,
  Smile,
  CheckCircle2,
  Share2,
  HelpCircle,
  ChevronUp,
} from 'lucide-react';
import type { BirthdayData, Personality, Relationship, ExperienceConfig } from '@/lib/types';
import { PERSONALITIES, RELATIONSHIPS } from '@/lib/types';
import GenerationExperience from '@/components/create/GenerationExperience';
import ShareScreen from '@/components/create/ShareScreen';
import ExperienceShell from '@/components/experience/ExperienceShell';
import AnimatedAiBirthday from '@/components/common/AnimatedAiBirthday';
import PhotoUploader from '@/components/create/PhotoUploader';
import { buildExperience } from '@/engine/experience-builder';
import { slugify, encodeBirthdayData, decodeBirthdayData } from '@/lib/utils';

const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  'best-friend': '👯 Best Friend',
  partner: '❤️ Partner',
  friend: '🤝 Friend',
  sibling: '🏠 Sibling',
  parent: '🌟 Parent',
  'someone-special': '✨ Someone Special',
  other: '💫 Other',
};

const VIBE_DETAILS: Record<Personality, { name: string; emoji: string; desc: string; colors: string }> = {
  'main-character': {
    name: 'Golden Gala',
    emoji: '👑',
    desc: 'Champagne gold, amber candlelight, royalty energy',
    colors: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
  },
  soft: {
    name: 'Strawberry Velvet',
    emoji: '🍓',
    desc: 'Strawberries & cream, soft rose, tender affection',
    colors: 'linear-gradient(135deg, #fb7185, #f43f5e)',
  },
  adventurous: {
    name: 'Candlelight Amber',
    emoji: '🕯️',
    desc: 'Glowing honey amber, fireside warmth, cozy celebration',
    colors: 'linear-gradient(135deg, #f97316, #fbbf24)',
  },
  chaotic: {
    name: 'Festive Confetti',
    emoji: '🎉',
    desc: 'Coral spark, golden embers, vibrant party joy',
    colors: 'linear-gradient(135deg, #f43f5e, #fb923c)',
  },
  funny: {
    name: 'Velvet Sparkler',
    emoji: '🔮',
    desc: 'Deep midnight velvet with golden starbursts',
    colors: 'linear-gradient(135deg, #be123c, #fbbf24)',
  },
  introvert: {
    name: 'Cozy Glow',
    emoji: '🌸',
    desc: 'Gentle warmth, soft embers, quiet heartfelt magic',
    colors: 'linear-gradient(135deg, #fb7185, #f59e0b)',
  },
  'class-clown': {
    name: 'Party Spark',
    emoji: '🎈',
    desc: 'Bright laughs, golden confetti, playful delight',
    colors: 'linear-gradient(135deg, #f43f5e, #fde047)',
  },
  ambitious: {
    name: 'Star Spotlight',
    emoji: '⭐',
    desc: 'Cinematic gold, spotlight glow, grand celebration',
    colors: 'linear-gradient(135deg, #fbbf24, #ea580c)',
  },
  mysterious: {
    name: 'Midnight Amber',
    emoji: '✨',
    desc: 'Deep velvet sky, glowing starlight, secret wishes',
    colors: 'linear-gradient(135deg, #f97316, #e11d48)',
  },
};

const DEMO_DATA: BirthdayData = {
  recipientName: 'Maya',
  senderName: 'Alex',
  relationship: 'best-friend',
  personality: 'main-character',
  favoriteThing: 'the way you turn every ordinary Tuesday into an unforgettable adventure',
  quirkOrHabit: 'has 47 open tabs and speaks in random accents when nervous',
  superpowerOrTitle: 'Crown Ruler of Spontaneous Midnight Quests',
  favoriteSong: 'Golden Hour - JVKE',
  insideJoke: 'the 2 AM parallel universe debate over spicy ramen',
  memory: 'getting lost in the pouring rain singing retro anthems at the top of our lungs until our stomachs ached',
  optionalMessage: 'You light up every room you enter. Here is to another magical year around the sun!',
  photoUrl: '/images/ai-birthday-cake.jpg',
};

type PageView = 'hub' | 'generating' | 'share' | 'experience';

function BirthdayAppContent() {
  const [view, setView] = useState<PageView>('hub');
  const [step, setStep] = useState(0);
  const [activeExperience, setActiveExperience] = useState<ExperienceConfig | null>(null);
  const [generatedPayload, setGeneratedPayload] = useState<string>('');
  const [generatedSlug, setGeneratedSlug] = useState<string>('');
  const [isRecipientDirectLoad, setIsRecipientDirectLoad] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Form state — Hyper-personalized (zero generic guessing)
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [relationship, setRelationship] = useState<Relationship | null>('best-friend');
  const [personality, setPersonality] = useState<Personality | null>('main-character');
  const [favoriteThing, setFavoriteThing] = useState('');
  const [quirkOrHabit, setQuirkOrHabit] = useState('');
  const [superpowerOrTitle, setSuperpowerOrTitle] = useState('');
  const [favoriteSong, setFavoriteSong] = useState('');
  const [insideJoke, setInsideJoke] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [memory, setMemory] = useState('');
  const [optionalMessage, setOptionalMessage] = useState('');
  const [songUrl, setSongUrl] = useState('');

  // Check URL query params (?b=...) or hash (#b=...) on initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let payloadStr: string | null = null;
    const searchParams = new URLSearchParams(window.location.search);
    const bQuery = searchParams.get('b') || searchParams.get('data');
    if (bQuery) {
      payloadStr = bQuery;
    } else if (window.location.hash) {
      const hash = window.location.hash.replace(/^#/, '');
      const hashParams = new URLSearchParams(hash);
      payloadStr = hashParams.get('b') || hashParams.get('data') || (hash.startsWith('b=') ? hash.substring(2) : null);
    }

    if (payloadStr) {
      const decoded = decodeBirthdayData<BirthdayData>(payloadStr);
      if (decoded && decoded.recipientName) {
        const slug = `${slugify(decoded.recipientName)}-share`;
        const config = buildExperience(decoded, slug);
        setActiveExperience(config);
        setIsRecipientDirectLoad(true);
        setView('experience');
      }
    }
  }, []);

  const totalSteps = 4;

  const canProceed = () => {
    switch (step) {
      case 0: return recipientName.trim().length > 0 && senderName.trim().length > 0 && relationship !== null;
      case 1: return personality !== null;
      case 2: return favoriteThing.trim().length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const getFormData = useCallback((): BirthdayData => {
    return {
      recipientName: recipientName.trim(),
      senderName: senderName.trim(),
      relationship: relationship || 'best-friend',
      personality: personality || 'main-character',
      favoriteThing: favoriteThing.trim(),
      quirkOrHabit: quirkOrHabit.trim() || undefined,
      superpowerOrTitle: superpowerOrTitle.trim() || undefined,
      favoriteSong: favoriteSong.trim() || undefined,
      insideJoke: insideJoke.trim() || undefined,
      photoUrl: photoUrl || undefined,
      memory: memory.trim() || undefined,
      optionalMessage: optionalMessage.trim() || undefined,
      songUrl: songUrl.trim() || undefined,
    };
  }, [recipientName, senderName, relationship, personality, favoriteThing, quirkOrHabit, superpowerOrTitle, favoriteSong, insideJoke, photoUrl, memory, optionalMessage, songUrl]);

  const createSurpriseConfig = useCallback((): { config: ExperienceConfig; payload: string; slug: string } => {
    const data = getFormData();
    const randomPart = Math.random().toString(36).substring(2, 6);
    const slug = `${slugify(data.recipientName)}-${randomPart}`;
    const config = buildExperience(data, slug);
    const payload = encodeBirthdayData(data);

    if (typeof window !== 'undefined') {
      localStorage.setItem(`bv-${slug}`, JSON.stringify(data));
      localStorage.setItem('bv-latest-payload', payload);
    }

    return { config, payload, slug };
  }, [getFormData]);

  // Handle submit to AI generation & share stage
  const handleGenerate = async () => {
    if (!canProceed()) return;
    const data = getFormData();
    const randomPart = Math.random().toString(36).substring(2, 6);
    const slug = `${slugify(data.recipientName)}-${randomPart}`;

    setView('generating');
    setIsAiGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      const config = (res.ok && result.content)
        ? buildExperience(data, slug, result.content)
        : buildExperience(data, slug);

      const payload = encodeBirthdayData(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`bv-${slug}`, JSON.stringify(data));
        localStorage.setItem('bv-latest-payload', payload);
      }

      setActiveExperience(config);
      setGeneratedPayload(payload);
      setGeneratedSlug(slug);
    } catch (err) {
      console.warn('AI generation error, falling back to local experience builder:', err);
      const config = buildExperience(data, slug);
      const payload = encodeBirthdayData(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`bv-${slug}`, JSON.stringify(data));
        localStorage.setItem('bv-latest-payload', payload);
      }
      setActiveExperience(config);
      setGeneratedPayload(payload);
      setGeneratedSlug(slug);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Immediate preview of current inputs
  const handlePreviewDirect = () => {
    if (!recipientName.trim() || !senderName.trim()) {
      // If user clicks preview before typing, load Maya demo
      loadDemo();
      return;
    }
    const { config, payload, slug } = createSurpriseConfig();
    setActiveExperience(config);
    setGeneratedPayload(payload);
    setGeneratedSlug(slug);
    setView('experience');
  };

  // Load interactive demo
  const loadDemo = () => {
    const slug = 'maya-demo';
    const config = buildExperience(DEMO_DATA, slug);
    const payload = encodeBirthdayData(DEMO_DATA);
    setRecipientName(DEMO_DATA.recipientName);
    setSenderName(DEMO_DATA.senderName);
    setRelationship(DEMO_DATA.relationship);
    setPersonality(DEMO_DATA.personality);
    setFavoriteThing(DEMO_DATA.favoriteThing);
    setQuirkOrHabit(DEMO_DATA.quirkOrHabit || '');
    setSuperpowerOrTitle(DEMO_DATA.superpowerOrTitle || '');
    setFavoriteSong(DEMO_DATA.favoriteSong || '');
    setInsideJoke(DEMO_DATA.insideJoke || '');
    setPhotoUrl(DEMO_DATA.photoUrl || '');
    setMemory(DEMO_DATA.memory || '');
    setOptionalMessage(DEMO_DATA.optionalMessage || '');
    setActiveExperience(config);
    setGeneratedPayload(payload);
    setGeneratedSlug(slug);
    setView('experience');
  };

  // Quick autofill for fast testing
  const handleQuickFill = () => {
    setRecipientName('Riya');
    setSenderName('Aarav');
    setRelationship('partner');
    setPersonality('chaotic');
    setFavoriteThing('the 2 AM parallel universe debates over spicy ramen');
    setQuirkOrHabit('has 47 browser tabs and talks in funny accents when nervous');
    setSuperpowerOrTitle('Chief Parallel Universe Investigator & Certified Ramen Oracle');
    setFavoriteSong('Golden Hour - JVKE');
    setInsideJoke('the monsoon tea stall flood adventure');
    setPhotoUrl('/images/ai-birthday-cake.jpg');
    setMemory('getting stuck under that tiny tea stall awning laughing until our stomachs hurt');
    setOptionalMessage('You make every ordinary Tuesday into an unforgettable adventure.');
  };

  // ─── Direct Experience View (for recipient or instant preview) ───
  if (view === 'experience' && activeExperience) {
    return (
      <ExperienceShell
        config={activeExperience}
        onExit={() => {
          setView('hub');
          setIsRecipientDirectLoad(false);
        }}
      />
    );
  }

  // ─── Generation Animation Stage ───
  if (view === 'generating' && activeExperience) {
    return (
      <GenerationExperience
        recipientName={recipientName}
        onComplete={() => setView('share')}
      />
    );
  }

  // ─── Share Stage ───
  if (view === 'share' && activeExperience) {
    return (
      <ShareScreen
        slug={generatedSlug}
        recipientName={recipientName}
        payload={generatedPayload}
        onPreview={() => setView('experience')}
        onCreateNew={() => {
          setView('hub');
          setStep(0);
        }}
      />
    );
  }

  // Input styles
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1.15rem',
    fontSize: '1rem',
    background: 'rgba(26, 16, 22, 0.8)',
    border: '1.5px solid rgba(251, 191, 36, 0.2)',
    borderRadius: '14px',
    color: '#fffdf5',
    outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
    fontFamily: 'inherit',
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse at 50% 15%, #180b14 0%, #0c080e 65%, #070407 100%)',
        color: '#fffdf5',
        position: 'relative',
        overflowX: 'hidden',
        padding: 'clamp(1.5rem, 4vw, 3.5rem) clamp(1rem, 3vw, 2.5rem)',
      }}
    >
      {/* Warm Ambient Celebratory Backlight Orbs (Pure birthday colors: gold, rose, amber) */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute', top: '-15%', right: '-8%',
            width: '55vw', height: '55vw', maxWidth: '560px', maxHeight: '560px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(244,63,94,0.12) 45%, transparent 70%)',
            filter: 'blur(45px)',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '-15%', left: '-8%',
            width: '50vw', height: '50vw', maxWidth: '520px', maxHeight: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,63,94,0.16) 0%, rgba(249,115,22,0.1) 50%, transparent 70%)',
            filter: 'blur(45px)',
          }}
        />
      </div>

      <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ═══════════════ HEADER BAR ═══════════════ */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'clamp(2rem, 5vw, 3.5rem)',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(251, 191, 36, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f43f5e, #fbbf24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
              }}
            >
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
                Bash The Birthday
              </span>
              <span style={{ fontSize: '0.72rem', color: '#fbbf24', marginLeft: '0.5rem', fontWeight: 600 }}>
                ONE-PAGE EDITION
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={loadDemo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                color: '#fbbf24',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Play size={13} fill="#fbbf24" />
              <span>Live Demo</span>
            </button>
          </div>
        </header>

        {/* ═══════════════ MAIN HERO GRID ═══════════════ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 5vw, 3.5rem)',
            alignItems: 'center',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
          }}
        >
          {/* Left Column: Headline & Value Prop */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1.1rem',
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, rgba(244,63,94,0.15), rgba(251,191,36,0.15))',
                border: '1px solid rgba(251,191,36,0.3)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#fbbf24',
                width: 'fit-content',
              }}
            >
              <Heart size={14} fill="#f43f5e" color="#f43f5e" />
              Not an ordinary card · A living digital surprise
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
              }}
            >
              Make their birthday{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 45%, #fbbf24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                impossible to forget.
              </span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)',
                lineHeight: 1.65,
                color: '#d6b8c4',
                maxWidth: '520px',
              }}
            >
              Enter a few personal details in under 60 seconds. We weave them into an enchanting, interactive celebration experience powered by AI artwork, candlelight, and heartwarming memories.
            </p>

            {/* CTA action buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href="#create-card"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.95rem 2rem',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #f43f5e, #fb923c, #fbbf24)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1.02rem',
                  boxShadow: '0 10px 35px rgba(244, 63, 94, 0.4)',
                  transition: 'transform 0.2s',
                }}
              >
                <Sparkles size={18} />
                <span>Create a Surprise Now</span>
                <ArrowRight size={18} />
              </a>

              <button
                onClick={loadDemo}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.95rem 1.6rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  color: '#fbbf24',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Play size={16} fill="#fbbf24" />
                <span>Test Demo Surprise</span>
              </button>
            </div>

            {/* Birthday trust metrics */}
            <div
              style={{
                display: 'flex',
                gap: '0.65rem',
                marginTop: '0.75rem',
                flexWrap: 'wrap',
                fontSize: '0.82rem',
                color: '#fcd19c',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                }}
              >
                <Zap size={13} color="#fbbf24" />
                <span>Ready in <strong>60 seconds</strong></span>
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                }}
              >
                <Sparkles size={13} color="#f43f5e" />
                <span><strong>Zero generic guessing</strong></span>
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                }}
              >
                <Share2 size={13} color="#fbbf24" />
                <span><strong>60 FPS mobile smooth</strong></span>
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Animated AI Birthday Centerpiece */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AnimatedAiBirthday
              recipientName={recipientName || 'Your Special Person'}
              senderName={senderName || 'You'}
              initialMode="cake"
            />
          </div>
        </div>

        {/* ═══════════════ CREATOR SECTION ═══════════════ */}
        <section
          id="create-card"
          style={{
            position: 'relative',
            borderRadius: '32px',
            background: 'linear-gradient(165deg, rgba(28, 14, 24, 0.85) 0%, rgba(14, 8, 13, 0.95) 100%)',
            border: '1.5px solid rgba(251, 191, 36, 0.3)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7), 0 0 50px rgba(251, 191, 36, 0.12)',
            padding: 'clamp(1.5rem, 4vw, 3rem)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Section Heading with quick fill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: '1.25rem',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#fbbf24',
                }}
              >
                Step {step + 1} of {totalSteps}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
                  fontWeight: 700,
                  marginTop: '0.2rem',
                }}
              >
                {step === 0 && 'Who are we celebrating today? 💝'}
                {step === 1 && 'What is their birthday vibe? ✨'}
                {step === 2 && 'Hyper-Personal Touch — No Guessing! 🎯'}
                {step === 3 && 'Memories, Photo & Blessings 📸'}
              </h2>
            </div>

            <button
              onClick={handleQuickFill}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#e0a4b5',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={12} />
              <span>Autofill sample</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              overflow: 'hidden',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${((step + 1) / totalSteps) * 100}%`,
                background: 'linear-gradient(90deg, #f43f5e, #fb923c, #fbbf24)',
                transition: 'width 0.35s ease',
              }}
            />
          </div>

          {/* Step Form Body */}
          <div>
            {/* STEP 0: RECIPIENT & SENDER & RELATIONSHIP */}
            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="recipientName" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fcd19c' }}>
                      Their name (the birthday star) <span style={{ color: '#f43f5e' }}>*</span>
                    </label>
                    <input
                      id="recipientName"
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Riya, Maya, Sunny"
                      style={inputStyle}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#fbbf24';
                        e.target.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(251, 191, 36, 0.2)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="senderName" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fcd19c' }}>
                      Your name (the creator) <span style={{ color: '#f43f5e' }}>*</span>
                    </label>
                    <input
                      id="senderName"
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Aarav, Alex, Bestie"
                      style={inputStyle}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#fbbf24';
                        e.target.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(251, 191, 36, 0.2)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fcd19c' }}>
                    They are your… <span style={{ color: '#f43f5e' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {RELATIONSHIPS.map((rel) => {
                      const isSelected = relationship === rel;
                      return (
                        <button
                          key={rel}
                          type="button"
                          onClick={() => setRelationship(rel)}
                          style={{
                            padding: '0.65rem 1.15rem',
                            borderRadius: '9999px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.25s',
                            background: isSelected
                              ? 'linear-gradient(135deg, #f43f5e, #fb923c)'
                              : 'rgba(26, 16, 22, 0.6)',
                            color: isSelected ? '#ffffff' : '#d4a4b5',
                            border: isSelected
                              ? '1.5px solid #fbbf24'
                              : '1px solid rgba(255,255,255,0.08)',
                            boxShadow: isSelected ? '0 4px 20px rgba(244, 63, 94, 0.35)' : 'none',
                          }}
                        >
                          {RELATIONSHIP_LABELS[rel]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: BIRTHDAY VIBE & PALETTE */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ fontSize: '0.92rem', color: '#d6b8c4', margin: 0 }}>
                  Choose a color atmosphere that matches their spirit. Every theme uses warm celebratory birthday colors:
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '0.85rem',
                  }}
                >
                  {PERSONALITIES.map((p) => {
                    const vibe = VIBE_DETAILS[p] || VIBE_DETAILS['main-character'];
                    const isSelected = personality === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPersonality(p)}
                        style={{
                          padding: '1rem',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.4rem',
                          transition: 'all 0.25s',
                          background: isSelected
                            ? 'linear-gradient(145deg, rgba(38, 20, 32, 0.95), rgba(22, 12, 18, 0.95))'
                            : 'rgba(22, 12, 18, 0.5)',
                          border: isSelected ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: isSelected ? '0 0 25px rgba(251, 191, 36, 0.25)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '1.5rem' }}>{vibe.emoji}</span>
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: vibe.colors,
                              boxShadow: '0 0 8px rgba(251, 191, 36, 0.4)',
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.98rem', color: isSelected ? '#fbbf24' : '#ffffff' }}>
                          {vibe.name}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#baa0aa', lineHeight: 1.4 }}>
                          {vibe.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: HYPER-PERSONAL TOUCH (NO GENERIC GUESSING) */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ fontSize: '0.88rem', color: '#fbbf24', margin: 0, fontWeight: 500 }}>
                  ✨ Our AI crafts custom storytelling directly from your answers. No generic clichés like &quot;music lover&quot;!
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="favoriteThing" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fcd19c' }}>
                    One specific thing you adore / cherish about them <span style={{ color: '#f43f5e' }}>*</span>
                  </label>
                  <input
                    id="favoriteThing"
                    type="text"
                    value={favoriteThing}
                    onChange={(e) => setFavoriteThing(e.target.value)}
                    placeholder="e.g. the 2 AM parallel universe debates over spicy ramen, or their infectious laugh"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="quirkOrHabit" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fcd19c' }}>
                    Their signature quirk, funny habit, or catchphrase <span style={{ fontSize: '0.75rem', color: '#baa0aa' }}>(recommended)</span>
                  </label>
                  <input
                    id="quirkOrHabit"
                    type="text"
                    value={quirkOrHabit}
                    onChange={(e) => setQuirkOrHabit(e.target.value)}
                    placeholder="e.g. has 47 open browser tabs and speaks in accents when nervous"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="favoriteSong" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fcd19c' }}>
                      Their favorite song / anthem <span style={{ fontSize: '0.75rem', color: '#baa0aa' }}>(optional)</span>
                    </label>
                    <input
                      id="favoriteSong"
                      type="text"
                      value={favoriteSong}
                      onChange={(e) => setFavoriteSong(e.target.value)}
                      placeholder="e.g. Golden Hour - JVKE, Taylor Swift"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="insideJoke" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fcd19c' }}>
                      An inside joke or secret reference <span style={{ fontSize: '0.75rem', color: '#baa0aa' }}>(optional)</span>
                    </label>
                    <input
                      id="insideJoke"
                      type="text"
                      value={insideJoke}
                      onChange={(e) => setInsideJoke(e.target.value)}
                      placeholder="e.g. the monsoon tea stall flood adventure"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: MEMORIES, PHOTO & BLESSINGS */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Cloudinary Photo Uploader */}
                <PhotoUploader
                  label="Add a Photo Memory (Powered by Cloudinary)"
                  sublabel="Upload a favorite picture of them or you two together. It will appear in a glowing memory frame!"
                  value={photoUrl}
                  onChange={(url) => setPhotoUrl(url)}
                  onRemove={() => setPhotoUrl('')}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="memory" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fcd19c' }}>
                    A sweet shared memory <span style={{ fontSize: '0.75rem', color: '#baa0aa' }}>(optional)</span>
                  </label>
                  <textarea
                    id="memory"
                    value={memory}
                    onChange={(e) => setMemory(e.target.value)}
                    placeholder="Remember that night when we..."
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="optionalMessage" style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fcd19c' }}>
                    A personal heartfelt blessing / note <span style={{ fontSize: '0.75rem', color: '#baa0aa' }}>(optional)</span>
                  </label>
                  <textarea
                    id="optionalMessage"
                    value={optionalMessage}
                    onChange={(e) => setOptionalMessage(e.target.value)}
                    placeholder="May this year bring you all the wonder you give to the world..."
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Navigation Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              flexWrap: 'wrap',
            }}
          >
            <div>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '9999px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {/* Preview Button (always accessible) */}
              <button
                type="button"
                onClick={handlePreviewDirect}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem 1.3rem',
                  borderRadius: '9999px',
                  background: 'rgba(251, 191, 36, 0.1)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  color: '#fbbf24',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                <Play size={14} fill="#fbbf24" />
                <span>Instant Preview</span>
              </button>

              {step < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.8rem',
                    borderRadius: '9999px',
                    background: canProceed()
                      ? 'linear-gradient(135deg, #f43f5e, #fb923c)'
                      : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: canProceed() ? 'pointer' : 'not-allowed',
                    opacity: canProceed() ? 1 : 0.45,
                    boxShadow: canProceed() ? '0 4px 20px rgba(244, 63, 94, 0.3)' : 'none',
                  }}
                >
                  <span>Next</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!canProceed() || isAiGenerating}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 2.2rem',
                    borderRadius: '9999px',
                    background: canProceed() && !isAiGenerating
                      ? 'linear-gradient(135deg, #f43f5e 0%, #fb923c 50%, #fbbf24 100%)'
                      : 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: canProceed() && !isAiGenerating ? 'pointer' : 'not-allowed',
                    opacity: canProceed() && !isAiGenerating ? 1 : 0.5,
                    boxShadow: canProceed() ? '0 8px 30px rgba(244, 63, 94, 0.45)' : 'none',
                  }}
                >
                  <Sparkles size={18} />
                  <span>{isAiGenerating ? 'Weaving AI Birthday Magic...' : 'Generate Personalized Surprise 🎁'}</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════ EXPERIENCE CHAPTERS SHOWCASE ═══════════════ */}
        <section
          style={{
            marginTop: 'clamp(4rem, 8vw, 6.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                color: '#fbbf24',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              <Sparkles size={13} />
              Inside The Experience
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 4.5vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                marginTop: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              A cinematic 5-chapter celebration{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #f43f5e, #fb923c, #fbbf24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                they will never forget.
              </span>
            </h2>
            <p
              style={{
                color: '#d6b8c4',
                fontSize: 'clamp(0.95rem, 2vw, 1.08rem)',
                marginTop: '0.75rem',
                lineHeight: 1.6,
              }}
            >
              No boring static cards. Your answers are woven into a fluid, animated interactive storybook that runs like a dream on any phone.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Chapter 1 */}
            <div
              style={{
                padding: '1.75rem',
                borderRadius: '24px',
                background: 'linear-gradient(165deg, rgba(30, 16, 26, 0.8) 0%, rgba(16, 9, 15, 0.9) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(244,63,94,0.25), rgba(251,191,36,0.2))',
                  border: '1px solid rgba(244,63,94,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={22} color="#fbbf24" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Chapter 01
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginTop: '0.2rem' }}>
                  The Personal Prologue
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#c4a6b2', marginTop: '0.5rem', lineHeight: 1.55 }}>
                  A cinematic sequence calling them out by name with suspenseful text lines that build anticipation before the big reveal.
                </p>
              </div>
            </div>

            {/* Chapter 2 */}
            <div
              style={{
                padding: '1.75rem',
                borderRadius: '24px',
                background: 'linear-gradient(165deg, rgba(30, 16, 26, 0.8) 0%, rgba(16, 9, 15, 0.9) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(251,191,36,0.25), rgba(249,115,22,0.2))',
                  border: '1px solid rgba(251,191,36,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cake size={22} color="#fbbf24" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Chapter 02
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginTop: '0.2rem' }}>
                  Royal Persona Proclamation
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#c4a6b2', marginTop: '0.5rem', lineHeight: 1.55 }}>
                  AI crowns them with a bespoke Royal Title and 3 delightfully accurate descriptors based strictly on their real habits.
                </p>
              </div>
            </div>

            {/* Chapter 3 */}
            <div
              style={{
                padding: '1.75rem',
                borderRadius: '24px',
                background: 'linear-gradient(165deg, rgba(30, 16, 26, 0.8) 0%, rgba(16, 9, 15, 0.9) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(217,70,239,0.2))',
                  border: '1px solid rgba(244,63,94,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Star size={22} color="#fb7185" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Chapter 03
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginTop: '0.2rem' }}>
                  Interactive Solar System
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#c4a6b2', marginTop: '0.5rem', lineHeight: 1.55 }}>
                  A celestial constellation where they tap floating stars to uncover their signature quirk, inside joke, and favorite anthem.
                </p>
              </div>
            </div>

            {/* Chapter 4 */}
            <div
              style={{
                padding: '1.75rem',
                borderRadius: '24px',
                background: 'linear-gradient(165deg, rgba(30, 16, 26, 0.8) 0%, rgba(16, 9, 15, 0.9) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(251,191,36,0.25), rgba(244,63,94,0.2))',
                  border: '1px solid rgba(251,191,36,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Camera size={22} color="#fbbf24" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Chapter 04
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginTop: '0.2rem' }}>
                  Illuminated Polaroid Memory
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#c4a6b2', marginTop: '0.5rem', lineHeight: 1.55 }}>
                  Your uploaded photo floats in an illuminated Polaroid frame with ambient candlelight reflection and emotional memory notes.
                </p>
              </div>
            </div>

            {/* Chapter 5 */}
            <div
              style={{
                padding: '1.75rem',
                borderRadius: '24px',
                background: 'linear-gradient(165deg, rgba(30, 16, 26, 0.8) 0%, rgba(16, 9, 15, 0.9) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(244,63,94,0.25), rgba(251,191,36,0.2))',
                  border: '1px solid rgba(244,63,94,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Gift size={22} color="#f43f5e" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Chapter 05
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginTop: '0.2rem' }}>
                  Candle Blowout & Grand Finale
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#c4a6b2', marginTop: '0.5rem', lineHeight: 1.55 }}>
                  They make a silent wish, tap the glowing candles, unwrap the digital gift box, and trigger a 60 FPS celebratory confetti shower.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ HOW IT WORKS (3 SIMPLE STEPS) ═══════════════ */}
        <section
          style={{
            marginTop: 'clamp(4rem, 8vw, 6.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              <Zap size={13} />
              Quick & Effortless
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 4.5vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                marginTop: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              How it works in 3 quick steps
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                padding: '2rem',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f43f5e, #fb923c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: '#ffffff',
                }}
              >
                1
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
                Share Their True Quirks
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#c4a6b2', lineHeight: 1.6 }}>
                Answer 4 quick prompts with real habits, their favorite anthem, and that 2 AM inside joke only you two understand.
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                padding: '2rem',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fb923c, #fbbf24)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: '#ffffff',
                }}
              >
                2
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
                AI Synthesizes The Magic
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#c4a6b2', lineHeight: 1.6 }}>
                BazaarLink AI scripts tailored narrative copy, and Cloudinary formats your photo into an illuminated floating memory.
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                padding: '2rem',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fbbf24, #f43f5e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: '#ffffff',
                }}
              >
                3
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
                Drop The Link On Mobile
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#c4a6b2', lineHeight: 1.6 }}>
                Send the private link via WhatsApp, iMessage, or Instagram. It plays immediately in their phone browser without installing anything.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════ REAL REACTIONS / TESTIMONIALS ═══════════════ */}
        <section
          style={{
            marginTop: 'clamp(4rem, 8vw, 6.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                color: '#fbbf24',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              <Heart size={13} fill="#f43f5e" color="#f43f5e" />
              Heartfelt Reactions
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 4.5vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                marginTop: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              Loved by best friends & partners
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Review 1 */}
            <div
              style={{
                padding: '1.75rem',
                borderRadius: '24px',
                background: 'rgba(26, 15, 23, 0.7)',
                border: '1px solid rgba(251, 191, 36, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#fbbf24', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#fbbf24" />
                  ))}
                </div>
                <p style={{ fontSize: '0.95rem', color: '#f0d9e2', lineHeight: 1.6, fontStyle: 'italic' }}>
                  &ldquo;Sent this to my girlfriend at midnight. When she clicked into the memory star and saw our road trip photo with our spicy ramen inside joke, she cried happy tears. 1000x better than a generic card!&rdquo;
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f43f5e, #fbbf24)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: '#ffffff',
                  }}
                >
                  L
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.92rem' }}>Liam D.</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#fbbf24' }}>Partner celebration</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div
              style={{
                padding: '1.75rem',
                borderRadius: '24px',
                background: 'rgba(26, 15, 23, 0.7)',
                border: '1px solid rgba(251, 191, 36, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#fbbf24', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#fbbf24" />
                  ))}
                </div>
                <p style={{ fontSize: '0.95rem', color: '#f0d9e2', lineHeight: 1.6, fontStyle: 'italic' }}>
                  &ldquo;My best friend literally thought I spent a week coding this. The royal persona title was hilarious and so spot on. The mobile animation ran super smooth without any lag.&rdquo;
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fb923c, #f43f5e)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: '#ffffff',
                  }}
                >
                  S
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.92rem' }}>Samira N.</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#fbbf24' }}>Best friend surprise</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div
              style={{
                padding: '1.75rem',
                borderRadius: '24px',
                background: 'rgba(26, 15, 23, 0.7)',
                border: '1px solid rgba(251, 191, 36, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#fbbf24', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#fbbf24" />
                  ))}
                </div>
                <p style={{ fontSize: '0.95rem', color: '#f0d9e2', lineHeight: 1.6, fontStyle: 'italic' }}>
                  &ldquo;Made one for my sister across the country. She opened it on WhatsApp during our FaceTime call and watching her tap each interactive star was priceless!&rdquo;
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fbbf24, #ea580c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: '#ffffff',
                  }}
                >
                  K
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.92rem' }}>Kiran M.</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#fbbf24' }}>Sibling celebration</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ FREQUENTLY ASKED QUESTIONS ═══════════════ */}
        <section
          style={{
            marginTop: 'clamp(4rem, 8vw, 6.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e0a4b5',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              <HelpCircle size={13} />
              Got Questions?
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 4.5vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                marginTop: '0.75rem',
                lineHeight: 1.2,
              }}
            >
              Everything you need to know
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem',
              maxWidth: '920px',
              margin: '0 auto',
              width: '100%',
            }}
          >
            <div
              style={{
                padding: '1.5rem',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fcd19c', marginBottom: '0.5rem' }}>
                Do they need to install an app or sign up?
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#c4a6b2', lineHeight: 1.6, margin: 0 }}>
                Never! It is a pure web experience. When they tap the link on WhatsApp, iMessage, or Instagram, it opens immediately in their mobile browser without any barrier.
              </p>
            </div>

            <div
              style={{
                padding: '1.5rem',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fcd19c', marginBottom: '0.5rem' }}>
                What if I don&apos;t have a photo to upload?
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#c4a6b2', lineHeight: 1.6, margin: 0 }}>
                Photos are 100% optional. If you omit a photo, the experience gracefully presents an enchanted celestial memory star surrounded by animated candlelight particles.
              </p>
            </div>

            <div
              style={{
                padding: '1.5rem',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fcd19c', marginBottom: '0.5rem' }}>
                Will it lag on budget or older phones?
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#c4a6b2', lineHeight: 1.6, margin: 0 }}>
                No. We specifically engineered it with hardware-accelerated transforms, adaptive mobile particle throttling, and pause-on-scroll background rendering to maintain a silky 60 FPS.
              </p>
            </div>

            <div
              style={{
                padding: '1.5rem',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fcd19c', marginBottom: '0.5rem' }}>
                Is it really completely free to create and send?
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#c4a6b2', lineHeight: 1.6, margin: 0 }}>
                Yes! There are zero hidden fees, subscriptions, or paywalls. Create as many magical surprise links for your loved ones as you wish.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════ FINAL CALL-TO-ACTION BANNER ═══════════════ */}
        <section
          style={{
            marginTop: 'clamp(4rem, 8vw, 6.5rem)',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            borderRadius: '32px',
            background: 'linear-gradient(135deg, rgba(244,63,94,0.18) 0%, rgba(251,191,36,0.2) 100%)',
            border: '1.5px solid rgba(251,191,36,0.35)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(244,63,94,0.15)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f43f5e, #fbbf24)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(251,191,36,0.45)',
            }}
          >
            <Sparkles size={28} color="#ffffff" />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              maxWidth: '650px',
              lineHeight: 1.15,
            }}
          >
            Ready to make someone feel truly special today?
          </h2>

          <p style={{ color: '#f0d9e2', fontSize: '1.05rem', maxWidth: '520px', lineHeight: 1.6 }}>
            Fill out the 4 short prompts in under 60 seconds. Get your instant celebration link and brighten their entire year.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href="#create-card"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.95rem 2.2rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #f43f5e, #fb923c, #fbbf24)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: '0 10px 35px rgba(244, 63, 94, 0.45)',
              }}
            >
              <Sparkles size={18} />
              <span>Create Their Surprise Now</span>
            </a>
            <button
              onClick={loadDemo}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.95rem 1.6rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                color: '#fbbf24',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              <Play size={16} fill="#fbbf24" />
              <span>Watch Live Demo</span>
            </button>
          </div>
        </section>

        {/* ═══════════════ PREMIUM CONSUMER FOOTER ═══════════════ */}
        <footer
          style={{
            marginTop: 'clamp(4rem, 8vw, 6rem)',
            paddingTop: '3rem',
            paddingBottom: '2rem',
            borderTop: '1px solid rgba(251, 191, 36, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Brand header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #f43f5e, #fbbf24)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(251, 191, 36, 0.35)',
                }}
              >
                <Sparkles size={17} color="#ffffff" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Bash The Birthday
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#c4a6b2', maxWidth: '440px' }}>
              Reinventing digital birthday celebrations with interactive storytelling, glowing memories, and zero generic guesswork.
            </p>
          </div>

          {/* Feature Badges */}
          <div
            style={{
              display: 'flex',
              gap: '0.6rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              fontSize: '0.78rem',
              color: '#fcd19c',
            }}
          >
            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              ⚡ 100% Free Forever
            </span>
            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              🔒 Zero Data Tracking
            </span>
            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              📱 60 FPS Mobile Optimized
            </span>
            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              ✨ Powered by Deep Personalization
            </span>
          </div>

          {/* Quick links & Back to Top */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              fontSize: '0.86rem',
            }}
          >
            <a
              href="#create-card"
              style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600 }}
            >
              Create Surprise
            </a>
            <button
              onClick={loadDemo}
              style={{
                background: 'none',
                border: 'none',
                color: '#e0a4b5',
                fontSize: '0.86rem',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Watch Demo
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                background: 'none',
                border: 'none',
                color: '#e0a4b5',
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: 0,
              }}
            >
              <span>Back to top</span>
              <ChevronUp size={14} />
            </button>
          </div>

          {/* Copyright & Signoff */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              fontSize: '0.8rem',
              color: '#8c6877',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '1.5rem',
              width: '100%',
              maxWidth: '560px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#e0a4b5' }}>
              <span>Crafted with</span>
              <Heart size={13} fill="#f43f5e" color="#f43f5e" />
              <span>for unforgettable celebrations across the universe</span>
            </div>
            <p style={{ margin: 0, color: '#7a5a69', fontSize: '0.76rem' }}>
              &copy; {new Date().getFullYear()} Bash The Birthday. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0c080e',
            color: '#fbbf24',
          }}
        >
          Loading birthday magic...
        </div>
      }
    >
      <BirthdayAppContent />
    </Suspense>
  );
}

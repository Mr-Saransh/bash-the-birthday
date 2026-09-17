'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { ExperienceConfig, SceneType } from '@/lib/types';
import IntroScene from './scenes/IntroScene';
import PersonalityRevealScene from './scenes/PersonalityRevealScene';
import InteractiveUniverseScene from './scenes/InteractiveUniverseScene';
import ThingsAboutYouScene from './scenes/ThingsAboutYouScene';
import MemoryScene from './scenes/MemoryScene';
import EmotionalCoreScene from './scenes/EmotionalCoreScene';
import FinaleScene from './scenes/FinaleScene';
import OutroScene from './scenes/OutroScene';

interface ExperienceShellProps {
  config: ExperienceConfig;
  onExit?: () => void;
}

const SCENE_COMPONENTS: Record<SceneType, React.ComponentType<{ config: ExperienceConfig; onNext: () => void; onBack?: () => void }>> = {
  intro: IntroScene,
  'personality-reveal': PersonalityRevealScene,
  'interactive-universe': InteractiveUniverseScene,
  'things-about-you': ThingsAboutYouScene,
  memory: MemoryScene,
  'emotional-core': EmotionalCoreScene,
  finale: FinaleScene,
  outro: OutroScene,
  secret: OutroScene, // Secret is triggered within other scenes, not standalone
};

export default function ExperienceShell({ config, onExit }: ExperienceShellProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const scenes = config.scenes;
  const currentScene = scenes[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < scenes.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, scenes.length]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goBack]);

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const { colors } = config.theme;
    root.style.setProperty('--bg-primary', colors.bg);
    root.style.setProperty('--bg-surface', colors.bgSurface);
    root.style.setProperty('--text-primary', colors.text);
    root.style.setProperty('--text-secondary', colors.textMuted);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-secondary', colors.accentSecondary);
    root.style.setProperty('--gradient-from', colors.gradientFrom);
    root.style.setProperty('--gradient-to', colors.gradientTo);
    root.style.setProperty('--accent-glow', colors.glow);

    return () => {
      root.style.removeProperty('--bg-primary');
      root.style.removeProperty('--bg-surface');
      root.style.removeProperty('--text-primary');
      root.style.removeProperty('--text-secondary');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-secondary');
      root.style.removeProperty('--gradient-from');
      root.style.removeProperty('--gradient-to');
      root.style.removeProperty('--accent-glow');
    };
  }, [config.theme]);

  if (!currentScene) return null;

  const SceneComponent = SCENE_COMPONENTS[currentScene.type];
  if (!SceneComponent) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: config.theme.colors.bg,
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
      {/* Progress indicator */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          zIndex: 60,
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${((currentIndex + 1) / scenes.length) * 100}%`,
            background: `linear-gradient(90deg, ${config.theme.colors.gradientFrom}, ${config.theme.colors.gradientTo})`,
            transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>

      {/* Floating exit / creator toggle */}
      {onExit && (
        <button
          onClick={onExit}
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 70,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(18, 12, 16, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            color: '#fbbf24',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <span>✕ Close Experience</span>
        </button>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        <SceneComponent
          key={`${currentScene.type}-${currentIndex}`}
          config={config}
          onNext={goNext}
          onBack={currentIndex > 0 ? goBack : undefined}
        />
      </AnimatePresence>
    </div>
  );
}

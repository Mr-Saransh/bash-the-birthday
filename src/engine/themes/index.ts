import type { ThemeConfig } from '@/lib/types';

// ─── FESTIVE CONFETTI THEME (Chaotic) ──────────────────────────────
// Energetic, popping celebration with warm coral, festive berry, and golden spark.
export const chaoticTheme: ThemeConfig = {
  id: 'chaotic',
  name: 'Festive Confetti',
  personality: 'chaotic',
  colors: {
    bg: '#0f080c',
    bgSurface: '#1a0e16',
    text: '#fff8f5',
    textMuted: '#d49baf',
    accent: '#f43f5e',
    accentSecondary: '#fb923c',
    gradientFrom: '#f43f5e',
    gradientTo: '#fbbf24',
    glow: 'rgba(244, 63, 94, 0.3)',
    particle: '#fde047',
  },
  typography: {
    displayFont: 'var(--font-display)',
    bodyFont: 'var(--font-body)',
    displaySize: 'clamp(2.5rem, 8vw, 6rem)',
    headingSize: 'clamp(1.5rem, 4vw, 3rem)',
    bodySize: 'clamp(1rem, 2.5vw, 1.25rem)',
    displayTracking: '-0.03em',
    displayWeight: 700,
  },
  animation: {
    transitionType: 'glitch',
    durationScale: 1,
    springStiffness: 300,
    springDamping: 20,
    staggerDelay: 0.08,
    useParallax: true,
    ambientStyle: 'floating-objects',
  },
  scene: {
    universeLayout: 'floating',
    celebrationStyle: 'particle-bloom',
    secretInteraction: 'long-press',
    giftRevealStyle: 'explode',
  },
};

// ─── STRAWBERRY & ROSE THEME (Soft) ────────────────────────────────
// Heartwarming strawberries and cream, soft rose gold, tender affection.
export const softTheme: ThemeConfig = {
  id: 'soft',
  name: 'Strawberry & Rose',
  personality: 'soft',
  colors: {
    bg: '#12090e',
    bgSurface: '#201019',
    text: '#fff1f4',
    textMuted: '#e0a4b5',
    accent: '#fb7185',
    accentSecondary: '#fda4af',
    gradientFrom: '#fb7185',
    gradientTo: '#f43f5e',
    glow: 'rgba(251, 113, 133, 0.28)',
    particle: '#fecdd3',
  },
  typography: {
    displayFont: 'var(--font-display)',
    bodyFont: 'var(--font-body)',
    displaySize: 'clamp(2.5rem, 8vw, 5.5rem)',
    headingSize: 'clamp(1.5rem, 4vw, 2.8rem)',
    bodySize: 'clamp(1rem, 2.5vw, 1.2rem)',
    displayTracking: '-0.02em',
    displayWeight: 600,
  },
  animation: {
    transitionType: 'fade',
    durationScale: 1.4,
    springStiffness: 120,
    springDamping: 30,
    staggerDelay: 0.15,
    useParallax: false,
    ambientStyle: 'gentle-pulse',
  },
  scene: {
    universeLayout: 'constellation',
    celebrationStyle: 'aurora',
    secretInteraction: 'hold',
    giftRevealStyle: 'dissolve',
  },
};

// ─── GOLDEN GALA THEME (Main Character) ─────────────────────────────
// Pure birthday royalty: shimmering champagne gold, amber candlelight, glowing filigree.
export const mainCharacterTheme: ThemeConfig = {
  id: 'main-character',
  name: 'Golden Gala',
  personality: 'main-character',
  colors: {
    bg: '#0c0a06',
    bgSurface: '#1a140b',
    text: '#fffdf5',
    textMuted: '#d1b98f',
    accent: '#fbbf24',
    accentSecondary: '#f59e0b',
    gradientFrom: '#fbbf24',
    gradientTo: '#ea580c',
    glow: 'rgba(251, 191, 36, 0.32)',
    particle: '#fef08a',
  },
  typography: {
    displayFont: 'var(--font-display)',
    bodyFont: 'var(--font-body)',
    displaySize: 'clamp(3rem, 10vw, 7rem)',
    headingSize: 'clamp(1.8rem, 5vw, 3.5rem)',
    bodySize: 'clamp(1rem, 2.5vw, 1.3rem)',
    displayTracking: '-0.04em',
    displayWeight: 800,
  },
  animation: {
    transitionType: 'zoom',
    durationScale: 1.2,
    springStiffness: 200,
    springDamping: 25,
    staggerDelay: 0.1,
    useParallax: true,
    ambientStyle: 'gradient-shift',
  },
  scene: {
    universeLayout: 'room',
    celebrationStyle: 'light-rays',
    secretInteraction: 'double-tap',
    giftRevealStyle: 'shatter',
  },
};

// ─── CANDLELIGHT AMBER THEME (Adventurous) ──────────────────────────
// Glowing honey amber, warm candlelight flame, cozy fireside celebration.
export const adventurousTheme: ThemeConfig = {
  id: 'adventurous',
  name: 'Candlelight Amber',
  personality: 'adventurous',
  colors: {
    bg: '#0e0a07',
    bgSurface: '#1c130d',
    text: '#fffbf5',
    textMuted: '#cca686',
    accent: '#f97316',
    accentSecondary: '#fbbf24',
    gradientFrom: '#f97316',
    gradientTo: '#f59e0b',
    glow: 'rgba(249, 115, 22, 0.28)',
    particle: '#fed7aa',
  },
  typography: {
    displayFont: 'var(--font-display)',
    bodyFont: 'var(--font-body)',
    displaySize: 'clamp(2.5rem, 8vw, 5.5rem)',
    headingSize: 'clamp(1.5rem, 4vw, 3rem)',
    bodySize: 'clamp(1rem, 2.5vw, 1.25rem)',
    displayTracking: '-0.02em',
    displayWeight: 700,
  },
  animation: {
    transitionType: 'slide',
    durationScale: 1.1,
    springStiffness: 180,
    springDamping: 28,
    staggerDelay: 0.1,
    useParallax: true,
    ambientStyle: 'starfield',
  },
  scene: {
    universeLayout: 'path',
    celebrationStyle: 'sparkle-rain',
    secretInteraction: 'swipe',
    giftRevealStyle: 'unfold',
  },
};

// ─── VELVET SPARKLER THEME (Funny) ──────────────────────────────────
// Deep rich velvet with sparkling golden ember bursts, joyful and warm.
export const funnyTheme: ThemeConfig = {
  id: 'funny',
  name: 'Velvet Sparkler',
  personality: 'funny',
  colors: {
    bg: '#0f0810',
    bgSurface: '#1d1020',
    text: '#fff8fd',
    textMuted: '#cba2ca',
    accent: '#f43f5e',
    accentSecondary: '#fbbf24',
    gradientFrom: '#f43f5e',
    gradientTo: '#fb923c',
    glow: 'rgba(244, 63, 94, 0.25)',
    particle: '#fde68a',
  },
  typography: {
    displayFont: 'var(--font-display)',
    bodyFont: 'var(--font-body)',
    displaySize: 'clamp(2.5rem, 8vw, 6rem)',
    headingSize: 'clamp(1.5rem, 4vw, 3rem)',
    bodySize: 'clamp(1rem, 2.5vw, 1.25rem)',
    displayTracking: '-0.02em',
    displayWeight: 700,
  },
  animation: {
    transitionType: 'glitch',
    durationScale: 0.9,
    springStiffness: 400,
    springDamping: 15,
    staggerDelay: 0.06,
    useParallax: false,
    ambientStyle: 'floating-objects',
  },
  scene: {
    universeLayout: 'scatter',
    celebrationStyle: 'particle-bloom',
    secretInteraction: 'tap-hidden',
    giftRevealStyle: 'explode',
  },
};

// ─── Theme Registry ─────────────────────────────────────────────────

import type { Personality } from '@/lib/types';

const themeMap: Record<string, ThemeConfig> = {
  chaotic: chaoticTheme,
  funny: funnyTheme,
  soft: softTheme,
  adventurous: adventurousTheme,
  'main-character': mainCharacterTheme,
  introvert: softTheme,
  'class-clown': funnyTheme,
  ambitious: mainCharacterTheme,
  mysterious: adventurousTheme,
};

export function getThemeForPersonality(personality: Personality): ThemeConfig {
  return themeMap[personality] ?? mainCharacterTheme;
}

export function getAllThemes(): ThemeConfig[] {
  return [mainCharacterTheme, softTheme, chaoticTheme, adventurousTheme, funnyTheme];
}

// ─── Personality & Relationship Types ────────────────────────────────

export const PERSONALITIES = [
  'chaotic',
  'funny',
  'soft',
  'adventurous',
  'introvert',
  'main-character',
  'class-clown',
  'ambitious',
  'mysterious',
] as const;

export type Personality = (typeof PERSONALITIES)[number];

export const RELATIONSHIPS = [
  'best-friend',
  'friend',
  'partner',
  'sibling',
  'parent',
  'someone-special',
  'other',
] as const;

export type Relationship = (typeof RELATIONSHIPS)[number];

// ─── Birthday Data (Form Input) ─────────────────────────────────────

export interface BirthdayData {
  recipientName: string;
  senderName: string;
  relationship: Relationship;
  personality: Personality;
  favoriteThing: string;
  memory?: string;
  optionalMessage?: string;
  photoUrl?: string;
  photoUrl2?: string;
  songUrl?: string;
  /** Hilarious signature quirk, habit, or catchphrase */
  quirkOrHabit?: string;
  /** What makes them uniquely them / superpower / unofficial title */
  superpowerOrTitle?: string;
  /** Favorite song, anthem, or music artist */
  favoriteSong?: string;
  /** Inside joke or unique shared reference */
  insideJoke?: string;
}

// ─── Generated Content ──────────────────────────────────────────────

export interface GeneratedContent {
  /** Lines shown during the intro / mystery stage */
  introLines: string[];
  /** Custom royal or hilarious persona title (e.g. Chief Parallel Universe Investigator) */
  personalityTitle?: string;
  /** Personality-derived observations ("statistically very [Name]") */
  observations: string[];
  /** Intro text before the memory reveal */
  memoryIntro: string;
  /** Cinematic / heartwarming storytelling of their memory */
  memoryTribute?: string;
  /** Playful personality descriptors for the reveal stage */
  personalityDescriptors: string[];
  /** The emotional transition line */
  emotionalTransition: string;
  /** Lightweight supportive line if no custom message provided */
  fallbackMessage: string;
  /** The big final line after HAPPY BIRTHDAY */
  finalLine: string;
  /** Hidden surprise message */
  secretMessage: string;
  /** Relationship-based intro descriptor */
  relationshipLine: string;
  /** Soundtrack or musical dedication line */
  soundtrackNote?: string;
}

// ─── Theme Configuration ────────────────────────────────────────────

export interface ThemeColors {
  /** Primary background */
  bg: string;
  /** Secondary / surface background */
  bgSurface: string;
  /** Primary text */
  text: string;
  /** Secondary / muted text */
  textMuted: string;
  /** Accent color */
  accent: string;
  /** Secondary accent */
  accentSecondary: string;
  /** Gradient start */
  gradientFrom: string;
  /** Gradient end */
  gradientTo: string;
  /** Glow / highlight color */
  glow: string;
  /** Particle / ambient element color */
  particle: string;
}

export interface ThemeTypography {
  /** Display font family (headings, big reveals) */
  displayFont: string;
  /** Body font family */
  bodyFont: string;
  /** Extra-large display size */
  displaySize: string;
  /** Heading size */
  headingSize: string;
  /** Body text size */
  bodySize: string;
  /** Letter spacing for display text */
  displayTracking: string;
  /** Font weight for display text */
  displayWeight: number;
}

export interface ThemeAnimation {
  /** Scene transition style */
  transitionType: 'fade' | 'slide' | 'zoom' | 'glitch' | 'blur';
  /** Base duration multiplier */
  durationScale: number;
  /** Spring stiffness */
  springStiffness: number;
  /** Spring damping */
  springDamping: number;
  /** Stagger delay between items */
  staggerDelay: number;
  /** Whether to use parallax effects */
  useParallax: boolean;
  /** Background ambient animation style */
  ambientStyle: 'particles' | 'gradient-shift' | 'starfield' | 'floating-objects' | 'gentle-pulse';
}

export interface ThemeScene {
  /** Interactive universe layout style */
  universeLayout: 'floating' | 'constellation' | 'room' | 'path' | 'scatter';
  /** Finale celebration style (NOT confetti) */
  celebrationStyle: 'glow-burst' | 'particle-bloom' | 'light-rays' | 'aurora' | 'sparkle-rain';
  /** Secret interaction type */
  secretInteraction: 'hold' | 'tap-hidden' | 'swipe' | 'double-tap' | 'long-press';
  /** How the gift box appears */
  giftRevealStyle: 'unwrap' | 'explode' | 'dissolve' | 'unfold' | 'shatter';
}

export interface ThemeConfig {
  id: string;
  name: string;
  personality: Personality;
  colors: ThemeColors;
  typography: ThemeTypography;
  animation: ThemeAnimation;
  scene: ThemeScene;
}

// ─── Scene Types ────────────────────────────────────────────────────

export type SceneType =
  | 'intro'
  | 'personality-reveal'
  | 'interactive-universe'
  | 'memory'
  | 'things-about-you'
  | 'emotional-core'
  | 'finale'
  | 'secret'
  | 'outro';

export interface SceneConfig {
  type: SceneType;
  /** Whether this scene is included in the sequence */
  enabled: boolean;
  /** Scene-specific data overrides */
  data?: Record<string, unknown>;
}

// ─── Full Experience Configuration ──────────────────────────────────

export interface ExperienceConfig {
  /** The raw input data */
  data: BirthdayData;
  /** Selected theme */
  theme: ThemeConfig;
  /** Generated textual content */
  content: GeneratedContent;
  /** Ordered scene sequence */
  scenes: SceneConfig[];
  /** Unique slug for the experience */
  slug: string;
}

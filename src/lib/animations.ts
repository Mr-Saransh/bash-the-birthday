import type { Variants, Transition } from 'framer-motion';

// ─── Transition Presets ─────────────────────────────────────────────

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 20,
  mass: 1,
};

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 15,
  mass: 0.8,
};

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
  mass: 0.6,
};

export const easeOut: Transition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1],
};

export const easeCinematic: Transition = {
  duration: 1.2,
  ease: [0.16, 1, 0.3, 1],
};

export const easeSlowReveal: Transition = {
  duration: 1.8,
  ease: [0.25, 0.46, 0.45, 0.94],
};

// ─── Variant Factories ──────────────────────────────────────────────

/** Fade in from below with blur */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -20, filter: 'blur(4px)', transition: { duration: 0.4 } },
};

/** Blur-to-sharp text reveal */
export const blurReveal: Variants = {
  hidden: { opacity: 0, filter: 'blur(20px)', scale: 0.95 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Dramatic scale entrance (main character energy) */
export const cinematicReveal: Variants = {
  hidden: { opacity: 0, scale: 0.8, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Stagger container for child animations */
export const staggerContainer = (
  staggerDelay = 0.1,
  delayChildren = 0.3
): Variants => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

/** Individual stagger child */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Floating animation for ambient objects */
export const floatingObject = (
  duration = 6,
  yRange = 20,
  delay = 0
): Variants => ({
  animate: {
    y: [0, -yRange, 0],
    rotate: [0, 3, -3, 0],
    transition: {
      y: {
        duration,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut',
        delay,
      },
      rotate: {
        duration: duration * 1.5,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut',
        delay,
      },
    },
  },
});

/** Gentle pulse glow */
export const pulseGlow: Variants = {
  animate: {
    opacity: [0.4, 0.8, 0.4],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

/** Scene transition — full page enter/exit */
export const sceneTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(6px)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/** Spring pop for interactive elements */
export const springPop: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  tap: { scale: 0.95 },
  hover: { scale: 1.05 },
};

/** Typewriter-like letter reveal */
export const letterReveal = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay,
    },
  },
});

/** Gift box explosion */
export const giftExplode: Variants = {
  closed: {
    scale: 1,
    rotate: 0,
  },
  opening: {
    scale: [1, 1.1, 1.2, 0],
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.6,
      times: [0, 0.3, 0.6, 1],
    },
  },
};

/** The big HAPPY BIRTHDAY reveal */
export const grandReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    filter: 'blur(30px)',
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

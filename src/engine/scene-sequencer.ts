import type { BirthdayData, SceneConfig } from '@/lib/types';

/**
 * Determines the ordered sequence of scenes based on available data.
 * Scenes with missing optional data are excluded.
 */
export function buildSceneSequence(data: BirthdayData): SceneConfig[] {
  const scenes: SceneConfig[] = [
    {
      type: 'intro',
      enabled: true,
    },
    {
      type: 'personality-reveal',
      enabled: true,
    },
    {
      type: 'interactive-universe',
      enabled: true,
    },
    {
      type: 'things-about-you',
      enabled: true,
    },
    {
      type: 'memory',
      enabled: !!data.memory,
    },
    {
      type: 'emotional-core',
      enabled: true,
    },
    {
      type: 'finale',
      enabled: true,
    },
    {
      type: 'outro',
      enabled: true,
    },
  ];

  // Secret scene exists but isn't in the main sequence —
  // it's triggered by hidden interaction within another scene
  return scenes.filter((s) => s.enabled);
}

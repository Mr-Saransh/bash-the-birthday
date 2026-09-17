import type { BirthdayData, ExperienceConfig, GeneratedContent } from '@/lib/types';
import { getThemeForPersonality } from '@/engine/themes';
import { generateContent } from '@/engine/content-generator';
import { buildSceneSequence } from '@/engine/scene-sequencer';

/**
 * The main orchestrator: takes raw birthday data and produces
 * a complete ExperienceConfig ready to render.
 */
export function buildExperience(
  data: BirthdayData,
  slug: string,
  customContent?: GeneratedContent
): ExperienceConfig {
  const theme = getThemeForPersonality(data.personality);
  const content = customContent || generateContent(data);
  const scenes = buildSceneSequence(data);

  return {
    data,
    theme,
    content,
    scenes,
    slug,
  };
}

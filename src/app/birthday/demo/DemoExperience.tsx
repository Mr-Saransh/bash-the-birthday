'use client';

import ExperienceShell from '@/components/experience/ExperienceShell';
import type { ExperienceConfig } from '@/lib/types';

interface DemoExperienceProps {
  config: ExperienceConfig;
}

export default function DemoExperience({ config }: DemoExperienceProps) {
  return <ExperienceShell config={config} />;
}

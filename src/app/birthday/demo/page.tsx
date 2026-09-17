import { buildExperience } from '@/engine/experience-builder';
import type { BirthdayData } from '@/lib/types';
import type { Metadata } from 'next';
import DemoExperience from './DemoExperience';

// Hardcoded demo data for the stunning first experience
const DEMO_DATA: BirthdayData = {
  recipientName: 'Riya',
  senderName: 'Aarav',
  relationship: 'best-friend',
  personality: 'chaotic',
  favoriteThing: 'overthinking playlists at 2 AM',
  memory:
    'That time we got lost trying to find that rooftop cafe and ended up eating street food in the rain. You said it was the best meal of your life. It probably was.',
  optionalMessage:
    'You make chaos look like art, and I honestly wouldn\'t have it any other way. Here\'s to another year of you being impossible to keep up with. I\'m glad I get to try.',
};

export const metadata: Metadata = {
  title: 'A birthday surprise for Riya 🎂',
  description: 'Someone made something special for Riya.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemoPage() {
  const experience = buildExperience(DEMO_DATA, 'demo');

  return <DemoExperience config={experience} />;
}

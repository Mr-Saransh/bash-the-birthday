import type { Metadata } from 'next';
import DynamicExperience from './DynamicExperience';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  // Extract name from slug (format: name-xxxx)
  const namePart = slug.split('-').slice(0, -1).join('-') || slug;
  const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);

  return {
    title: `A birthday surprise for ${name} 🎂`,
    description: `Someone made something special for ${name}.`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `A birthday surprise for ${name} 🎂`,
      description: `Someone made something special for ${name}.`,
    },
  };
}

export default async function BirthdayPage({ params }: PageProps) {
  const { slug } = await params;
  return <DynamicExperience slug={slug} />;
}

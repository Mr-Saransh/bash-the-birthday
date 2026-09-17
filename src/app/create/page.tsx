import type { Metadata } from 'next';
import CreationForm from '@/components/create/CreationForm';

export const metadata: Metadata = {
  title: 'Create a Birthday Experience — Birthdayverse',
  description:
    'Fill out a tiny form in under 60 seconds. Get a unique link. Send them a surprise they\'ll actually remember.',
};

export default function CreatePage() {
  return <CreationForm />;
}

'use client';

import { useEffect, useState } from 'react';
import { buildExperience } from '@/engine/experience-builder';
import type { BirthdayData, ExperienceConfig } from '@/lib/types';
import { decodeBirthdayData } from '@/lib/utils';
import ExperienceShell from '@/components/experience/ExperienceShell';
import { motion } from 'framer-motion';

interface DynamicExperienceProps {
  slug: string;
}

export default function DynamicExperience({ slug }: DynamicExperienceProps) {
  const [config, setConfig] = useState<ExperienceConfig | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 1. Check URL query params or hash for portable sharing (?b=... or #b=...)
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const bQuery = searchParams.get('b') || searchParams.get('data');
      let payload = bQuery;

      if (!payload && window.location.hash) {
        const hash = window.location.hash.replace(/^#/, '');
        const hashParams = new URLSearchParams(hash);
        payload = hashParams.get('b') || hashParams.get('data') || (hash.startsWith('b=') ? hash.substring(2) : null);
      }

      if (payload) {
        const decoded = decodeBirthdayData<BirthdayData>(payload);
        if (decoded && decoded.recipientName) {
          const experience = buildExperience(decoded, slug);
          setConfig(experience);
          return;
        }
      }
    }

    // 2. Fallback to localStorage
    const stored = typeof window !== 'undefined' ? localStorage.getItem(`bv-${slug}`) : null;
    if (stored) {
      try {
        const data: BirthdayData = JSON.parse(stored);
        const experience = buildExperience(data, slug);
        setConfig(experience);
      } catch {
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [slug]);

  if (error) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'var(--bg-primary)',
          textAlign: 'center',
          gap: '1.5rem',
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          This experience doesn&apos;t exist yet.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="body-text"
          style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}
        >
          It might have expired, or the link might be wrong. Want to create a new
          birthday surprise?
        </motion.p>
        <motion.a
          href="/create"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="btn-primary"
          style={{ textDecoration: 'none', padding: '0.875rem 2rem' }}
        >
          <span>Create a Birthday</span>
        </motion.a>
      </div>
    );
  }

  if (!config) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
        }}
      >
        <motion.div
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.95, 1, 0.95],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gradient-from), var(--gradient-to))',
          }}
        />
      </div>
    );
  }

  return <ExperienceShell config={config} />;
}

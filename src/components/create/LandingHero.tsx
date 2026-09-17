'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function LandingHero() {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem)',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
      }}
    >
      {/* Ambient gradient orbs */}
      <div
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}
      >
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '-15%',
            right: '-10%',
            width: '50vw',
            height: '50vw',
            maxWidth: '600px',
            maxHeight: '600px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: '45vw',
            height: '45vw',
            maxWidth: '500px',
            maxHeight: '500px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '720px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(192, 132, 252, 0.08)',
            border: '1px solid rgba(192, 132, 252, 0.15)',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: 'var(--accent)',
          }}
        >
          <Sparkles size={14} />
          Not your average birthday card
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--text-primary)',
          }}
        >
          Make their birthday{' '}
          <span className="gradient-text">impossible to forget.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: '500px',
          }}
        >
          Tell us a little about them. We&apos;ll turn it into a surprise they&apos;ll
          actually remember.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <Link href="/create" style={{ textDecoration: 'none' }}>
            <motion.button
              className="btn-primary"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 12px 40px rgba(124, 58, 237, 0.4)',
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1.05rem',
                gap: '0.75rem',
              }}
            >
              <span>Create a Birthday</span>
              <ArrowRight size={18} style={{ position: 'relative', zIndex: 1 }} />
            </motion.button>
          </Link>

          <Link
            href="/birthday/demo"
            style={{ textDecoration: 'none' }}
          >
            <motion.button
              className="btn-ghost"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{ fontSize: '0.9rem' }}
            >
              See a demo experience →
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats / social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '2.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { label: 'Under 60 seconds', value: '⚡' },
            { label: 'Feels handmade', value: '✨' },
            { label: 'Actually shareable', value: '🔗' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
              }}
            >
              <span>{stat.value}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

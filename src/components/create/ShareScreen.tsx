'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Play, Sparkles } from 'lucide-react';

interface ShareScreenProps {
  slug: string;
  recipientName: string;
  payload?: string;
  onPreview?: () => void;
  onCreateNew?: () => void;
}

export default function ShareScreen({
  slug,
  recipientName,
  payload,
  onPreview,
  onCreateNew,
}: ShareScreenProps) {
  const [copied, setCopied] = useState(false);
  const name = recipientName.split(' ')[0] || recipientName;

  // Use URL-safe query param so it works everywhere on Vercel with zero database setup
  const shareUrl = typeof window !== 'undefined'
    ? (payload ? `${window.location.origin}/?b=${payload}` : `${window.location.origin}/birthday/${slug}`)
    : `/birthday/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey ${name}! 🎂✨ I made a special interactive birthday surprise just for you:\n\n${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `A birthday surprise for ${name} 🎂`,
          text: `Someone made something special for ${name}.`,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1.5rem, 5vw, 4rem)',
        background: 'var(--bg-primary)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.75rem',
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Celebration icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(251,191,36,0.25))',
            border: '1.5px solid rgba(251,191,36,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 35px rgba(251,191,36,0.25)',
          }}
        >
          <Sparkles size={36} color="#fbbf24" />
        </motion.div>

        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 5vw, 2.4rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            {name}&apos;s Surprise is Ready! 🎁
          </h1>
          <p className="body-text" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            Send this link to them. When they open it, their personalized interactive celebration will play instantly!
          </p>
        </div>

        {/* URL display card */}
        <div
          style={{
            width: '100%',
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <p
            style={{
              fontSize: '0.85rem',
              color: '#fef08a',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              textAlign: 'left',
              fontFamily: 'monospace',
            }}
          >
            {shareUrl}
          </p>
          <button
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: copied ? 'rgba(34, 197, 94, 0.2)' : 'linear-gradient(135deg, #f43f5e, #fb923c)',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Share buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <button
            onClick={handleWhatsApp}
            style={{
              flex: 1,
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(37, 211, 102, 0.15)',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              color: '#25d366',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            Send on WhatsApp
          </button>

          {'share' in (typeof window !== 'undefined' ? window.navigator : {}) && (
            <button
              onClick={handleShare}
              style={{
                flex: 1,
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              More Options
            </button>
          )}
        </div>

        {/* In-page preview button */}
        {onPreview && (
          <motion.button
            onClick={onPreview}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              width: '100%',
              padding: '0.85rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(244,63,94,0.15))',
              border: '1px solid rgba(251,191,36,0.4)',
              color: '#fbbf24',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Play size={16} fill="#fbbf24" />
            <span>Preview Full Surprise on This Page</span>
          </motion.button>
        )}

        {/* Create another button */}
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="btn-ghost"
            style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}
          >
            ← Create another birthday surprise
          </button>
        )}
      </motion.div>
    </div>
  );
}

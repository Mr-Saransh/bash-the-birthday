'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, UploadCloud, X, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface PhotoUploaderProps {
  label?: string;
  sublabel?: string;
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  accentColor?: string;
}

export default function PhotoUploader({
  label = 'Add a Photo Memory (Optional)',
  sublabel = 'Upload their photo, a funny selfie, or a cherished memory',
  value,
  onChange,
  onRemove,
  accentColor = '#fbbf24',
}: PhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadFile = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    // Check size < 15MB
    if (file.size > 15 * 1024 * 1024) {
      setError('Photo is too large (max 15MB). Please choose a smaller one.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      console.error('Upload error:', err);
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fcd19c' }}>
          {label}
        </span>
        {sublabel && (
          <span style={{ fontSize: '0.78rem', color: '#bca0aa', lineHeight: 1.4 }}>
            {sublabel}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <AnimatePresence mode="wait">
        {value ? (
          /* Preview state */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'relative',
              borderRadius: '18px',
              overflow: 'hidden',
              background: 'rgba(26, 14, 22, 0.8)',
              border: `1.5px solid ${accentColor}60`,
              boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 25px ${accentColor}25`,
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem',
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <img
                src={value}
                alt="Uploaded Memory"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80', fontSize: '0.82rem', fontWeight: 600 }}>
                <CheckCircle size={14} />
                <span>Uploaded to Cloudinary</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#bca0aa', marginTop: '0.2rem', margin: 0 }}>
                Will be framed in the Memory & Interactive Universe scenes!
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  onRemove?.();
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(244, 63, 94, 0.2)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  color: '#f43f5e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                aria-label="Remove photo"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Empty / Upload Dropzone state */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '16px',
              background: dragOver ? 'rgba(251, 191, 36, 0.1)' : 'rgba(26, 14, 22, 0.65)',
              border: `1.5px dashed ${dragOver ? accentColor : 'rgba(251, 191, 36, 0.3)'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              textAlign: 'center',
            }}
          >
            {isUploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '3px solid rgba(251,191,36,0.2)',
                    borderTopColor: accentColor,
                  }}
                />
                <span style={{ fontSize: '0.85rem', color: accentColor, fontWeight: 600 }}>
                  Uploading & optimizing photo...
                </span>
              </div>
            ) : (
              <>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(244,63,94,0.18), rgba(251,191,36,0.18))',
                    border: `1px solid ${accentColor}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: accentColor,
                  }}
                >
                  <Camera size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#fef08a' }}>
                    Tap to take photo or choose from library
                  </p>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.74rem', color: '#bca0aa' }}>
                    Supports JPG, PNG, WEBP · Drag & drop or mobile camera
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p style={{ color: '#f43f5e', fontSize: '0.78rem', margin: '0.2rem 0 0 0' }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}

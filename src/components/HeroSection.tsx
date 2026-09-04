'use client';

import React from 'react';
import { Play, Shield, Zap, TrendingUp, HandMetal } from 'lucide-react';
import { GameInfo } from '@/types/game';

interface HeroSectionProps {
  onQuickPlay: (game: GameInfo) => void;
  featuredGame: GameInfo;
  onScrollToGames: () => void;
}

export default function HeroSection({
  onQuickPlay,
  featuredGame,
  onScrollToGames
}: HeroSectionProps) {
  return (
    <section
      className="hero-container"
      style={{
        position: 'relative',
        padding: '52px 28px 36px 28px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center'
      }}
    >
      {/* Eyebrow badge */}
      <div
        className="hero-eyebrow"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'rgba(243, 112, 33, 0.12)',
          border: '1px solid rgba(243, 112, 33, 0.35)',
          padding: '6px 18px',
          borderRadius: '50px',
          marginBottom: '18px'
        }}
      >
        <span style={{
          fontSize: 'clamp(0.7rem, 2.5vw, 0.82rem)',
          fontWeight: 700,
          letterSpacing: '0.8px',
          color: '#f37021',
          textTransform: 'uppercase'
        }}>
          Sampath Bank Digital Innovation Hub
        </span>
      </div>

      <h1
        className="hero-title"
        style={{
          fontSize: 'clamp(2.1rem, 5vw, 3.8rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-1px',
          color: '#ffffff',
          marginBottom: '18px',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        Experience Banking in{' '}
        <span style={{
          background: 'linear-gradient(135deg, #f37021 0%, #ffaa00 50%, #d4af37 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Augmented Reality
        </span>
      </h1>

      <p
        className="hero-description"
        style={{
          fontSize: 'clamp(0.92rem, 2.8vw, 1.15rem)',
          color: '#94a3b8',
          lineHeight: 1.6,
          maxWidth: '680px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '28px'
        }}
      >
        Step up to the future of Sri Lankan digital banking. Control transactions, settle utility bills, grow e-Fixed Deposits, and deflect cyber threats using only real-time webcam motion tracking.
      </p>

      <div
        className="hero-cta-group"
        style={{
          display: 'flex',
          gap: '14px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}
      >
        <button
          id="hero-btn-quickplay"
          onClick={() => onQuickPlay(featuredGame)}
          className="btn-primary"
          style={{ padding: '16px 36px', fontSize: '1.05rem' }}
        >
          <Play size={18} fill="currentColor" />
          <span>Launch Featured Game</span>
        </button>

        <button
          id="hero-btn-view-all"
          onClick={onScrollToGames}
          className="btn-secondary"
          style={{ padding: '16px 28px' }}
        >
          <span>Explore All 4 Games</span>
        </button>
      </div>

      {/* 4 Feature Pillars */}
      <div
        className="hero-features"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          maxWidth: '1000px',
          margin: '0 auto',
          textAlign: 'left'
        }}
      >
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Zap size={20} color="#f37021" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>QuickPay Settle</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Instant utility bill clearing</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <TrendingUp size={20} color="#d4af37" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>e-FD Wealth Rain</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Compound savings vault</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <HandMetal size={20} color="#00ff88" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Hands-Free Tilt</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Head-angle quick approval</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Shield size={20} color="#00f2ff" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Cyber Shield</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Biometric fraud defense</div>
          </div>
        </div>
      </div>
    </section>
  );
}

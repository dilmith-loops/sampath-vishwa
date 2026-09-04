'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { withBasePath } from '@/utils/paths';
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
        padding: '48px 28px 36px 28px',
        maxWidth: '1360px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      <div
        className="hero-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center'
        }}
      >
        {/* Left Col: Narrative & Call to Action */}
        <div>
          {/* Eyebrow badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(243, 112, 33, 0.12)',
            border: '1px solid rgba(243, 112, 33, 0.35)',
            padding: '8px 20px',
            borderRadius: '50px',
            marginBottom: '20px'
          }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '1px',
              color: '#f37021',
              textTransform: 'uppercase'
            }}>
              Sampath Bank Digital Innovation Hub
            </span>
          </div>

          <h1
            className="hero-title"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-1px',
              color: '#ffffff',
              marginBottom: '20px'
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

          <p style={{
            fontSize: '1.15rem',
            color: '#94a3b8',
            lineHeight: 1.65,
            maxWidth: '560px',
            marginBottom: '32px'
          }}>
            Step up to the future of Sri Lankan digital banking. Control transactions, settle utility bills, grow e-Fixed Deposits, and deflect cyber threats using only real-time webcam motion tracking.
          </p>

          <div
            className="hero-cta-group"
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}
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

          {/* 4 Feature Pillars Pill Grid */}
          <div
            className="hero-features"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              maxWidth: '520px'
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
              <Zap size={20} color="#f37021" />
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
              <TrendingUp size={20} color="#d4af37" />
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
              <HandMetal size={20} color="#00ff88" />
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
              <Shield size={20} color="#00f2ff" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Cyber Shield</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Biometric fraud defense</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Featured Kiosk Showcase Frame */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div
            className="hero-preview-kiosk"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '420px',
              background: 'linear-gradient(180deg, rgba(15, 28, 58, 0.9) 0%, rgba(5, 11, 24, 0.95) 100%)',
              border: '2px solid rgba(243, 112, 33, 0.35)',
              borderRadius: '28px',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(243, 112, 33, 0.25)',
              overflow: 'hidden'
            }}
          >
            {/* Top Kiosk Camera & Sensor Notch */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
              <div style={{ width: '60px', height: '5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.2)' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
            </div>

            {/* Visual Kiosk Preview Poster */}
            <div style={{
              position: 'relative',
              height: '320px',
              borderRadius: '18px',
              background: 'radial-gradient(circle at center, #0f244c 0%, #050b18 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '20px'
            }}>
              {/* Brand Watermark */}
              <div style={{
                position: 'absolute',
                top: 14,
                left: 14,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0,0,0,0.5)',
                padding: '4px 10px',
                borderRadius: '20px',
                backdropFilter: 'blur(8px)'
              }}>
                <Image src={withBasePath('/brand/sampath-punkalasa.png')} width={20} height={20} alt="" />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f37021' }}>VISHWA AR</span>
              </div>

              <div style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'rgba(0, 255, 136, 0.15)',
                color: '#00ff88',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.68rem',
                fontWeight: 700
              }}>
                KIOSK READY
              </div>

              <div style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'rgba(243, 112, 33, 0.15)',
                border: '2px solid #f37021',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(243, 112, 33, 0.4)',
                marginBottom: '16px'
              }}>
                <Play size={28} color="#f37021" fill="#f37021" style={{ marginLeft: 3 }} />
              </div>

              <div style={{
                fontSize: '0.75rem',
                letterSpacing: '1.5px',
                color: '#f37021',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '4px'
              }}>
                Featured Interactive Experience
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                {featuredGame.title}
              </h3>

              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '280px', lineHeight: 1.4 }}>
                {featuredGame.tagline}
              </p>

              {/* Bottom gesture pill */}
              <div style={{
                marginTop: '16px',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}>
                Gesture: <strong style={{ color: '#fff' }}>{featuredGame.gestureName}</strong>
              </div>
            </div>

            {/* Bottom Kiosk Action */}
            <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>PLATFORM ENGINE</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>Next.js + MediaPipe</div>
              </div>

              <button
                id="kiosk-frame-launch-btn"
                onClick={() => onQuickPlay(featuredGame)}
                className="btn-primary"
                style={{ padding: '10px 22px', fontSize: '0.88rem' }}
              >
                <span>Play Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

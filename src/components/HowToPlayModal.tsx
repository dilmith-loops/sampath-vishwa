'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Camera, CheckCircle2, Play, Lightbulb } from 'lucide-react';
import { GAMES } from '@/data/games';
import { GameInfo } from '@/types/game';

interface HowToPlayModalProps {
  selectedGame: GameInfo | null;
  onClose: () => void;
  onLaunchGame: (game: GameInfo) => void;
}

export default function HowToPlayModal({
  selectedGame,
  onClose,
  onLaunchGame
}: HowToPlayModalProps) {
  const [activeGameIndex, setActiveGameIndex] = useState<number>(() => {
    if (!selectedGame) return 0;
    const idx = GAMES.findIndex(g => g.id === selectedGame.id);
    return idx >= 0 ? idx : 0;
  });

  if (!selectedGame) return null;
  const game = GAMES[activeGameIndex] || GAMES[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'rgba(3, 7, 18, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '780px',
          background: 'linear-gradient(180deg, #0a1329 0%, #050b18 100%)',
          border: '1px solid rgba(243, 112, 33, 0.35)',
          borderRadius: '28px',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(243, 112, 33, 0.2)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Image
              src="/brand/sampath-punkalasa.png"
              alt="Sampath Logo"
              width={42}
              height={42}
              style={{ borderRadius: 10 }}
            />
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                Player Guide & <span style={{ color: '#f37021' }}>Gestures</span>
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Master touchless banking interactions on Sampath Vishwa
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Game Switcher Tabs */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '20px',
            alignItems: 'center'
          }}
        >
          {GAMES.map((g, idx) => {
            const shortLabels: Record<string, string> = {
              'swipe-settle': 'Swipe & Settle',
              'multitasker': 'Multitasker',
              'wealth-rain': 'Wealth Rain',
              'biometric-shield': 'Biometric Shield'
            };
            const label = shortLabels[g.id] || g.title;

            return (
              <button
                key={g.id}
                onClick={() => setActiveGameIndex(idx)}
                style={{
                  background: activeGameIndex === idx
                    ? `linear-gradient(135deg, ${g.accentColor} 0%, ${g.secondaryColor} 100%)`
                    : 'transparent',
                  color: activeGameIndex === idx ? '#ffffff' : '#94a3b8',
                  boxShadow: activeGameIndex === idx ? `0 4px 14px ${g.accentColor}50` : 'none',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', maxHeight: '460px' }}>
          {/* Game Banner Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${game.accentColor}40`,
            borderRadius: '18px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{game.title}</h3>
                <div style={{ fontSize: '0.82rem', color: game.accentColor, fontWeight: 700 }}>
                  Feature: {game.featurePillar}
                </div>
              </div>
              <div style={{
                background: `${game.accentColor}20`,
                color: game.accentColor,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                {game.badge}
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              {game.tagline}
            </p>
          </div>

          {/* How to Play Step-by-Step */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              <span>Step-by-Step Instructions</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {game.howToPlay.map((step, sIdx) => (
                <div
                  key={sIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '12px 16px'
                  }}
                >
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: `${game.accentColor}30`,
                    color: game.accentColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                    marginTop: 2
                  }}>
                    {sIdx + 1}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-world Vishwa Banking Innovations */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#00ff88" />
              <span>How Sampath Vishwa Powers This in Real Life</span>
            </h4>

            <div style={{
              background: 'rgba(0, 255, 136, 0.05)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: '14px',
              padding: '14px 18px'
            }}>
              {game.benefits.map((benefit, bIdx) => (
                <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>
                  <span style={{ color: '#00ff88', fontWeight: 800 }}>✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(243, 112, 33, 0.1)',
            border: '1px solid rgba(243, 112, 33, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px'
          }}>
            <Lightbulb size={20} color="#f37021" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: '#fdba74' }}>
              <strong>Pro Tip:</strong> {game.tips}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94a3b8' }}>
            <Camera size={14} />
            <span>Webcam motion tracking active</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onLaunchGame(game);
            }}
            className="btn-primary"
            style={{
              background: `linear-gradient(135deg, ${game.accentColor} 0%, ${game.secondaryColor} 100%)`,
              padding: '12px 28px'
            }}
          >
            <Play size={16} fill="currentColor" />
            <span>Play {game.title.replace('The ', '')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

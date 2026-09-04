'use client';

import React from 'react';
import { Play, HelpCircle, Trophy, Clock, Smartphone, Headphones, Coins, ShieldCheck } from 'lucide-react';
import { GameInfo } from '@/types/game';

interface GameCardProps {
  game: GameInfo;
  highScore: number;
  onPlay: (game: GameInfo) => void;
  onShowHelp: (game: GameInfo) => void;
}

function getGameIcon(gameId: string, color: string) {
  switch (gameId) {
    case 'swipe-settle':
      return <Smartphone size={24} color={color} />;
    case 'multitasker':
      return <Headphones size={24} color={color} />;
    case 'wealth-rain':
      return <Coins size={24} color={color} />;
    case 'biometric-shield':
      return <ShieldCheck size={24} color={color} />;
    default:
      return null;
  }
}

export default function GameCard({
  game,
  highScore,
  onPlay,
  onShowHelp
}: GameCardProps) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(10, 20, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = game.accentColor;
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 20px 40px -10px ${game.accentColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
      }}
    >
      {/* Top Meta Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: `${game.accentColor}18`,
            border: `1px solid ${game.accentColor}40`,
            color: game.accentColor,
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '0.74rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <span>{game.badge}</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: '#94a3b8'
          }}>
            <Clock size={13} />
            <span>{game.durationSec}s Sprint</span>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: `${game.accentColor}15`,
            border: `1.5px solid ${game.accentColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 4px 16px ${game.accentColor}25`
          }}>
            {getGameIcon(game.id, game.accentColor)}
          </div>

          <div style={{ minHeight: '52px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2
            }}>
              {game.title}
            </h3>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: game.accentColor,
              letterSpacing: '0.5px',
              marginTop: '2px'
            }}>
              {game.subtitle}
            </div>
          </div>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '0.92rem',
          color: '#cbd5e1',
          lineHeight: 1.6,
          marginBottom: '20px',
          minHeight: '72px'
        }}>
          {game.description}
        </p>

        {/* Gesture & Tracking Details Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '14px',
          padding: '12px 16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Motion Input</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>{game.gestureName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Computer Vision</span>
            <span style={{ fontSize: '0.76rem', color: game.accentColor, fontWeight: 600 }}>{game.trackingTech}</span>
          </div>
        </div>
      </div>

      {/* Card Footer with High Score & Play Buttons */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={16} color="#d4af37" />
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>High Score:</span>
          </div>
          <div style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: highScore > 0 ? '#00ff88' : '#64748b'
          }}>
            {highScore > 0 ? highScore.toLocaleString() : '---'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            id={`btn-play-${game.id}`}
            onClick={() => onPlay(game)}
            className="btn-primary"
            style={{
              flex: 1,
              background: `linear-gradient(135deg, ${game.accentColor} 0%, ${game.secondaryColor} 100%)`,
              boxShadow: `0 8px 24px ${game.accentColor}35`,
              color: game.id === 'multitasker' ? '#050b18' : '#ffffff',
              padding: '14px 20px',
              fontSize: '0.95rem',
              fontWeight: 800
            }}
          >
            <Play size={16} fill="currentColor" />
            <span>Play Game</span>
          </button>

          <button
            id={`btn-help-${game.id}`}
            onClick={() => onShowHelp(game)}
            className="btn-secondary"
            style={{ padding: '14px' }}
            title="How to Play"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

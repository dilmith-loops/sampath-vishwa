'use client';

import React from 'react';
import { Play, HelpCircle, Smartphone, Headphones, Coins, ShieldCheck } from 'lucide-react';
import { GameInfo } from '@/types/game';

interface GameCardProps {
  game: GameInfo;
  highScore?: number;
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
        padding: '24px 26px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '24px',
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
      {/* Title & Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: `${game.accentColor}18`,
          border: `1.5px solid ${game.accentColor}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 4px 16px ${game.accentColor}25`
        }}>
          {getGameIcon(game.id, game.accentColor)}
        </div>

        <div>
          <h3 style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.25,
            margin: 0
          }}>
            {game.title}
          </h3>
          <div style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: game.accentColor,
            marginTop: '4px',
            letterSpacing: '0.3px'
          }}>
            {game.subtitle}
          </div>
        </div>
      </div>

      {/* Play Button & Help */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
            fontSize: '1rem',
            fontWeight: 800,
            borderRadius: '50px'
          }}
        >
          <Play size={18} fill="currentColor" />
          <span>Play Game</span>
        </button>

        <button
          id={`btn-help-${game.id}`}
          onClick={() => onShowHelp(game)}
          className="btn-secondary"
          style={{ padding: '14px', borderRadius: '50px' }}
          title="How to Play"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </div>
  );
}

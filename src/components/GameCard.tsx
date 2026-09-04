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
      return <Smartphone size={22} color={color} />;
    case 'multitasker':
      return <Headphones size={22} color={color} />;
    case 'wealth-rain':
      return <Coins size={22} color={color} />;
    case 'biometric-shield':
      return <ShieldCheck size={22} color={color} />;
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
        borderRadius: '20px',
        padding: '20px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        minHeight: '150px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = game.accentColor;
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 16px 36px -8px ${game.accentColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.35)';
      }}
    >
      {/* Game Icon & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${game.accentColor}18`,
          border: `1.5px solid ${game.accentColor}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 4px 12px ${game.accentColor}25`
        }}>
          {getGameIcon(game.id, game.accentColor)}
        </div>

        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.25,
          margin: 0,
          letterSpacing: '-0.2px'
        }}>
          {game.title}
        </h3>
      </div>

      {/* Play Game Button & Help */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          id={`btn-play-${game.id}`}
          onClick={() => onPlay(game)}
          className="btn-primary"
          style={{
            flex: 1,
            background: `linear-gradient(135deg, ${game.accentColor} 0%, ${game.secondaryColor} 100%)`,
            boxShadow: `0 6px 20px ${game.accentColor}35`,
            color: game.id === 'multitasker' ? '#050b18' : '#ffffff',
            padding: '11px 16px',
            fontSize: '0.9rem',
            fontWeight: 800,
            borderRadius: '50px',
            whiteSpace: 'nowrap',
            gap: '8px'
          }}
        >
          <Play size={15} fill="currentColor" />
          <span>Play Game</span>
        </button>

        <button
          id={`btn-help-${game.id}`}
          onClick={() => onShowHelp(game)}
          className="btn-secondary"
          style={{ padding: '11px 12px', borderRadius: '50px', flexShrink: 0 }}
          title="How to Play"
        >
          <HelpCircle size={16} />
        </button>
      </div>
    </div>
  );
}

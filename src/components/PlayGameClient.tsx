'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { withBasePath } from '@/utils/paths';
import { GAMES } from '@/data/games';
import { ArrowLeft, RotateCcw, Maximize2 } from 'lucide-react';

interface PlayGameClientProps {
  gameId: string;
}

export default function PlayGameClient({ gameId }: PlayGameClientProps) {
  const game = GAMES.find(g => g.id === gameId);

  if (!game) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px'
      }}>
        <h2 style={{ fontSize: '2rem', color: '#f37021', marginBottom: '12px' }}>Game Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>The requested AR experience does not exist.</p>
        <Link href="/" className="btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Arcade Lobby</span>
        </Link>
      </div>
    );
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.warn);
    } else {
      document.exitFullscreen().catch(console.warn);
    }
  };

  const gameSrc = withBasePath(`/games/${game.id}/index.html`);

  const handleRestart = () => {
    const iframe = document.getElementById('kiosk-frame') as HTMLIFrameElement;
    if (iframe) iframe.src = gameSrc;
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#030712',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Top HUD Bar */}
      <header
        className="nav-header"
        style={{
          padding: '12px 20px',
          background: 'rgba(5, 11, 24, 0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} />
            <span className="hide-on-mobile">Lobby</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image
              src={withBasePath('/brand/sampath-punkalasa.png')}
              alt="Sampath Logo"
              width={28}
              height={28}
              style={{ borderRadius: 6, flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>
                {game.title}
              </div>
              <div className="hide-on-mobile" style={{ fontSize: '0.7rem', color: game.accentColor, fontWeight: 600 }}>
                {game.trackingTech}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handleRestart} className="btn-secondary" style={{ padding: '8px 12px' }} title="Restart">
            <RotateCcw size={15} />
            <span className="hide-on-mobile" style={{ fontSize: '0.78rem' }}>Restart</span>
          </button>

          <button onClick={toggleFullscreen} className="btn-secondary hide-on-mobile" style={{ padding: '8px 10px' }} title="Fullscreen">
            <Maximize2 size={15} />
          </button>
        </div>
      </header>

      {/* Main Kiosk Viewport */}
      <main className="theater-stage-container">
        <div className="theater-frame" style={{
          width: '100%',
          height: '100%',
          maxWidth: 'calc((100vh - 80px) * 9 / 16)',
          aspectRatio: '9 / 16',
          borderRadius: '20px',
        }}>
          <iframe
            id="kiosk-frame"
            src={gameSrc}
            title={game.title}
            allow="camera; microphone; display-capture; autoplay"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
          />
        </div>
      </main>
    </div>
  );
}

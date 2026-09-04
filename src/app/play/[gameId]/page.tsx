'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GAMES } from '@/data/games';
import { ArrowLeft, RotateCcw, Maximize2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ gameId: string }>;
}

export default function PlayGamePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const game = GAMES.find(g => g.id === resolvedParams.gameId);

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

  const handleRestart = () => {
    const iframe = document.getElementById('kiosk-frame') as HTMLIFrameElement;
    if (iframe) iframe.src = game.iframePath;
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
      <header style={{
        padding: '12px 24px',
        background: 'rgba(5, 11, 24, 0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link href="/" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} />
            <span>Lobby</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image
              src="/brand/sampath-punkalasa.png"
              alt="Sampath Logo"
              width={32}
              height={32}
              style={{ borderRadius: 8 }}
            />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                {game.title}
              </div>
              <div style={{ fontSize: '0.7rem', color: game.accentColor, fontWeight: 600 }}>
                {game.trackingTech}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={handleRestart} className="btn-secondary" style={{ padding: '8px 14px' }} title="Restart">
            <RotateCcw size={16} />
            <span style={{ fontSize: '0.8rem' }}>Restart</span>
          </button>

          <button onClick={toggleFullscreen} className="btn-secondary" style={{ padding: '8px 12px' }} title="Fullscreen">
            <Maximize2 size={16} />
          </button>
        </div>
      </header>

      {/* Main Kiosk Viewport */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          maxWidth: 'calc((100vh - 80px) * 9 / 16)',
          aspectRatio: '9 / 16',
          borderRadius: '24px',
          border: '2px solid rgba(243, 112, 33, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(243, 112, 33, 0.25)',
          overflow: 'hidden'
        }}>
          <iframe
            id="kiosk-frame"
            src={game.iframePath}
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

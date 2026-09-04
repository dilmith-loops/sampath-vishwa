'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { withBasePath } from '@/utils/paths';
import { GAMES } from '@/data/games';
import { ArrowLeft, RotateCcw, Maximize2, Trophy, Clock } from 'lucide-react';

interface PlayGameClientProps {
  gameId: string;
}

const getInitialTime = (gameId?: string) => {
  if (gameId === 'biometric-shield') return '01:00';
  if (gameId === 'multitasker') return '00:45';
  if (gameId === 'swipe-settle') return '00:30';
  if (gameId === 'wealth-rain') return '00:45';
  return '--:--';
};

export default function PlayGameClient({ gameId }: PlayGameClientProps) {
  const game = GAMES.find(g => g.id === gameId);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>(getInitialTime(gameId));

  useEffect(() => {
    setCurrentScore(0);
    setCurrentTime(getInitialTime(gameId));
  }, [gameId]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;

      if (e.data.type === 'GAME_SCORE_UPDATE') {
        setCurrentScore(e.data.score || 0);
      } else if (e.data.type === 'GAME_TIME_UPDATE') {
        if (e.data.timeFormatted) {
          setCurrentTime(e.data.timeFormatted);
        } else if (typeof e.data.timeLeft === 'number') {
          const mins = Math.floor(e.data.timeLeft / 60);
          const secs = e.data.timeLeft % 60;
          setCurrentTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
        }
      } else if (e.data.type === 'GAME_OVER') {
        setCurrentScore(e.data.score || 0);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
    setCurrentScore(0);
    setCurrentTime(getInitialTime(gameId));
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
                Sampath Vishwa AR
              </div>
            </div>
          </div>
        </div>

        {/* Center: Live Score & Timer Sync HUD */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '6px 16px',
          borderRadius: '50px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          flexShrink: 0
        }}>
          {/* Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Trophy size={15} color="#d4af37" />
            <span style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '0.5px' }}>SCORE</span>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.2rem',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 0 10px rgba(243, 112, 33, 0.5)'
            }}>
              {currentScore.toLocaleString()}
            </span>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.15)' }} />

          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} color="#00ff88" />
            <span style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '0.5px' }}>TIME</span>
            <span style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.2rem',
              fontWeight: 900,
              color: '#00ff88',
              letterSpacing: '0.5px'
            }}>
              {currentTime}
            </span>
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
          maxHeight: '100%',
          maxWidth: 'calc((100vh - 100px) * 9 / 16)',
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

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { withBasePath } from '@/utils/paths';
import { X, RotateCcw, Maximize2, Smartphone, Monitor, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameInfo } from '@/types/game';

interface GameTheaterModalProps {
  game: GameInfo | null;
  onClose: () => void;
  onRecordScore: (gameId: string, gameTitle: string, score: number) => void;
  initialKioskAspect?: boolean;
}

export default function GameTheaterModal({
  game,
  onClose,
  onRecordScore,
  initialKioskAspect = true
}: GameTheaterModalProps) {
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [isKioskRatio, setIsKioskRatio] = useState<boolean>(initialKioskAspect);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentScore(0);
    setIsKioskRatio(initialKioskAspect);
  }, [game, initialKioskAspect]);

  // Listen to postMessage from game iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;

      if (e.data.type === 'GAME_SCORE_UPDATE') {
        setCurrentScore(e.data.score || 0);
      } else if (e.data.type === 'GAME_OVER') {
        const finalScore = e.data.score || 0;
        setCurrentScore(finalScore);

        if (game) {
          onRecordScore(game.id, game.title, finalScore);
        }

        // Fire celebration confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) {
          console.warn(err);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [game, onRecordScore]);

  if (!game) return null;

  const gameSrc = withBasePath(`/games/${game.id}/index.html`);

  const restartGame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = gameSrc;
      setCurrentScore(0);
    }
  };

  const toggleModalFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.warn);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.warn);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(2, 6, 18, 0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}
    >
      {/* Top Floating Control Bar */}
      <div className="theater-hud-bar">
        {/* Left: Brand & Game Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image
            src={withBasePath('/brand/sampath-punkalasa.png')}
            alt="Sampath Logo"
            width={32}
            height={32}
            style={{ borderRadius: 8, flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
              {game.title}
            </div>
            <div className="hide-on-mobile" style={{ fontSize: '0.72rem', color: game.accentColor, fontWeight: 700, letterSpacing: '0.5px' }}>
              Sampath Vishwa AR
            </div>
          </div>
        </div>

        {/* Center: Live Score Sync HUD */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '6px 14px',
          borderRadius: '50px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          flexShrink: 0
        }}>
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

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Ratio Toggle (Hidden on mobile) */}
          <button
            id="theater-toggle-ratio"
            onClick={() => setIsKioskRatio(!isKioskRatio)}
            className="btn-secondary hide-on-mobile"
            title={isKioskRatio ? 'Switch to Wide Display' : 'Switch to 9:16 Kiosk Ratio'}
            style={{ padding: '8px 12px' }}
          >
            {isKioskRatio ? <Monitor size={15} /> : <Smartphone size={15} />}
            <span style={{ fontSize: '0.76rem' }}>{isKioskRatio ? '9:16 Kiosk' : 'Wide View'}</span>
          </button>

          {/* Restart */}
          <button
            id="theater-btn-restart"
            onClick={restartGame}
            className="btn-secondary"
            title="Restart Session"
            style={{ padding: '8px 12px' }}
          >
            <RotateCcw size={15} />
            <span className="hide-on-mobile" style={{ fontSize: '0.76rem' }}>Restart</span>
          </button>

          {/* Fullscreen */}
          <button
            id="theater-btn-fullscreen"
            onClick={toggleModalFullscreen}
            className="btn-secondary hide-on-mobile"
            title="Toggle Fullscreen"
            style={{ padding: '8px 10px' }}
          >
            <Maximize2 size={15} />
          </button>

          {/* Close / Exit */}
          <button
            id="theater-btn-close"
            onClick={onClose}
            className="btn-primary"
            style={{
              padding: '8px 14px',
              fontSize: '0.82rem',
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
            }}
          >
            <X size={15} />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Main Game Screen Canvas / Iframe */}
      <div className="theater-stage-container" style={{
        padding: isKioskRatio ? '6px 14px 16px 14px' : '0 14px 16px 14px',
      }}>
        <div className="theater-frame" style={{
          width: isKioskRatio ? 'auto' : '100%',
          height: '100%',
          maxHeight: '100%',
          aspectRatio: isKioskRatio ? '9 / 16' : 'auto',
          maxWidth: isKioskRatio ? 'calc((100vh - 120px) * 9 / 16)' : '1400px',
          borderRadius: isKioskRatio ? '20px' : '16px',
        }}>

          <iframe
            ref={iframeRef}
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
      </div>

      {/* Bottom Hint Banner (Hidden on mobile to maximize viewport) */}
      <div className="hide-on-mobile" style={{
        padding: '6px 16px 12px 16px',
        fontSize: '0.75rem',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <span>Powered by Sampath Vishwa AR Engine • Stand within camera view for optimal gesture tracking</span>
      </div>
    </div>
  );
}

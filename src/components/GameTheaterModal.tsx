'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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

  const restartGame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = game.iframePath;
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
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        zIndex: 10
      }}>
        {/* Left: Brand & Game Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image
            src="/brand/sampath-punkalasa.png"
            alt="Sampath Logo"
            width={36}
            height={36}
            style={{ borderRadius: 8 }}
          />
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
              {game.title}
            </div>
            <div style={{ fontSize: '0.72rem', color: game.accentColor, fontWeight: 700, letterSpacing: '0.5px' }}>
              Sampath Vishwa AR • {game.trackingTech}
            </div>
          </div>
        </div>

        {/* Center: Live Score Sync HUD */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '8px 22px',
          borderRadius: '50px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}>
          <Trophy size={16} color="#d4af37" />
          <span style={{ fontSize: '0.75rem', opacity: 0.8, letterSpacing: '1px' }}>SCORE</span>
          <span style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.4rem',
            fontWeight: 900,
            color: '#ffffff',
            textShadow: '0 0 10px rgba(243, 112, 33, 0.5)'
          }}>
            {currentScore.toLocaleString()}
          </span>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Ratio Toggle */}
          <button
            id="theater-toggle-ratio"
            onClick={() => setIsKioskRatio(!isKioskRatio)}
            className="btn-secondary"
            title={isKioskRatio ? 'Switch to Wide Display' : 'Switch to 9:16 Kiosk Ratio'}
            style={{ padding: '10px 14px' }}
          >
            {isKioskRatio ? <Monitor size={16} /> : <Smartphone size={16} />}
            <span style={{ fontSize: '0.78rem' }}>{isKioskRatio ? '9:16 Kiosk' : 'Wide View'}</span>
          </button>

          {/* Restart */}
          <button
            id="theater-btn-restart"
            onClick={restartGame}
            className="btn-secondary"
            title="Restart Session"
            style={{ padding: '10px 14px' }}
          >
            <RotateCcw size={16} />
            <span style={{ fontSize: '0.78rem' }}>Restart</span>
          </button>

          {/* Fullscreen */}
          <button
            id="theater-btn-fullscreen"
            onClick={toggleModalFullscreen}
            className="btn-secondary"
            title="Toggle Fullscreen"
            style={{ padding: '10px' }}
          >
            <Maximize2 size={16} />
          </button>

          {/* Close / Exit */}
          <button
            id="theater-btn-close"
            onClick={onClose}
            className="btn-primary"
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)'
            }}
          >
            <X size={16} />
            <span>Exit Game</span>
          </button>
        </div>
      </div>

      {/* Main Game Screen Canvas / Iframe */}
      <div style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isKioskRatio ? '10px 20px 20px 20px' : '0 20px 20px 20px',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'relative',
          width: isKioskRatio ? 'auto' : '100%',
          height: '100%',
          aspectRatio: isKioskRatio ? '9 / 16' : 'auto',
          maxWidth: isKioskRatio ? 'calc((100vh - 110px) * 9 / 16)' : '1400px',
          maxHeight: 'calc(100vh - 100px)',
          background: '#050b18',
          borderRadius: isKioskRatio ? '24px' : '18px',
          border: '2px solid rgba(243, 112, 33, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(243, 112, 33, 0.25)',
          overflow: 'hidden'
        }}>
          {/* Top Notch for Kiosk Feel */}
          {isKioskRatio && (
            <div style={{
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.25)',
              borderRadius: '3px',
              zIndex: 20,
              pointerEvents: 'none'
            }} />
          )}

          <iframe
            ref={iframeRef}
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
      </div>

      {/* Bottom Hint Banner */}
      <div style={{
        padding: '8px 16px 14px 16px',
        fontSize: '0.78rem',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <span>Powered by Sampath Vishwa AR Engine • Stand within webcam view for optimal gesture tracking</span>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { withBasePath } from '@/utils/paths';
import { X, RotateCcw, Maximize2, Smartphone, Monitor, Trophy, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameInfo } from '@/types/game';

interface GameTheaterModalProps {
  game: GameInfo | null;
  onClose: () => void;
  onRecordScore: (gameId: string, gameTitle: string, score: number) => void;
  initialKioskAspect?: boolean;
}

const getInitialTime = (gameId?: string) => {
  if (gameId === 'biometric-shield') return '01:00';
  if (gameId === 'multitasker') return '00:45';
  if (gameId === 'swipe-settle') return '00:30';
  if (gameId === 'wealth-rain') return '00:45';
  return '--:--';
};

const getTagline = (gameId?: string) => {
  switch (gameId) {
    case 'swipe-settle': return 'QUICKPAY SETTLE';
    case 'multitasker': return 'HANDS-FREE HUB';
    case 'wealth-rain': return 'e-FD WEALTH RAIN';
    case 'biometric-shield': return 'CYBER SHIELD';
    default: return 'QUICKPAY SETTLE';
  }
};

export default function GameTheaterModal({
  game,
  onClose,
  onRecordScore,
  initialKioskAspect = true
}: GameTheaterModalProps) {
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>(getInitialTime(game?.id));
  const [currentLives, setCurrentLives] = useState<number>(3);
  const [isKioskRatio, setIsKioskRatio] = useState<boolean>(initialKioskAspect);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentScore(0);
    setCurrentTime(getInitialTime(game?.id));
    setCurrentLives(3);
    setIsKioskRatio(initialKioskAspect);
  }, [game, initialKioskAspect]);

  // Listen to postMessage from game iframe
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
      } else if (e.data.type === 'GAME_LIVES_UPDATE') {
        if (typeof e.data.lives === 'number') {
          setCurrentLives(e.data.lives);
        }
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
      setCurrentTime(getInitialTime(game?.id));
      setCurrentLives(3);
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
        {/* Exact Sampath Vishwa In-Game Header as requested */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(180deg, rgba(5, 11, 24, 0.94) 0%, rgba(5, 11, 24, 0.78) 100%)',
          padding: '6px 14px',
          borderRadius: '14px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)',
          gap: '12px',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          {/* Brand Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '7px',
              background: '#f37021',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(243, 112, 33, 0.35)'
            }}>
              <Image
                src={withBasePath('/brand/sampath-punkalasa.png')}
                alt="Sampath Bank"
                width={26}
                height={26}
                style={{ borderRadius: '5px' }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800,
                fontSize: '0.88rem',
                color: '#ffffff',
                lineHeight: 1.15,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                Sampath Vishwa
              </div>
              <div style={{
                fontSize: '0.58rem',
                color: '#f37021',
                fontWeight: 800,
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1,
                marginTop: '2px'
              }}>
                {getTagline(game.id)}
              </div>
            </div>
          </div>

          {/* Orange Divider */}
          <div style={{
            width: '2px',
            height: '28px',
            background: '#f37021',
            borderRadius: '2px',
            flexShrink: 0
          }} />

          {/* Stats Group: Points */}
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', flexShrink: 0 }}>
            <div style={{
              fontSize: '0.56rem',
              color: '#cbd5e1',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              lineHeight: 1,
              marginBottom: '2px'
            }}>
              POINTS
            </div>
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.35rem',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 0 12px rgba(243, 112, 33, 0.6)',
              lineHeight: 1
            }}>
              {currentScore >= 10000 ? currentScore.toLocaleString() : String(currentScore).padStart(4, '0')}
            </div>
          </div>

          {/* Stats Group: Gold Timer Box */}
          <div style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#d4af37',
            background: 'rgba(212, 175, 55, 0.12)',
            padding: '6px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
            lineHeight: 1,
            flexShrink: 0
          }}>
            {currentTime}
          </div>

          {/* Shields Section for Biometric Defense */}
          {game.id === 'biometric-shield' && (
            <>
              <div style={{
                width: '1px',
                height: '24px',
                background: 'rgba(0, 242, 255, 0.3)',
                flexShrink: 0
              }} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(5, 11, 24, 0.85)',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid rgba(0, 242, 255, 0.4)',
                boxShadow: '0 0 12px rgba(0, 242, 255, 0.25)',
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: '#00f2ff',
                  lineHeight: 1
                }}>
                  SHIELDS
                </span>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: i < currentLives ? '#f37021' : '#27272a',
                        boxShadow: i < currentLives ? '0 0 8px #f37021' : 'none',
                        opacity: i < currentLives ? 1 : 0.35,
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
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

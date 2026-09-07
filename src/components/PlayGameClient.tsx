'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { withBasePath } from '@/utils/paths';
import { GAMES } from '@/data/games';
import { ArrowLeft, RotateCcw, Maximize2, Gamepad2, Camera } from 'lucide-react';

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

const getTagline = (gameId?: string) => {
  switch (gameId) {
    case 'swipe-settle': return 'QUICKPAY SETTLE';
    case 'multitasker': return 'HANDS-FREE HUB';
    case 'wealth-rain': return 'e-FD WEALTH RAIN';
    case 'biometric-shield': return 'CYBER SHIELD';
    default: return 'SAMPATH VISHWA';
  }
};

export default function PlayGameClient({ gameId }: PlayGameClientProps) {
  const game = GAMES.find(g => g.id === gameId);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>(getInitialTime(gameId));
  const [currentLives, setCurrentLives] = useState<number>(3);
  const [inputMode, setInputMode] = useState<'CAMERA' | 'JOYSTICK'>('CAMERA');
  const [gamepadConnected, setGamepadConnected] = useState<boolean>(false);
  const [controllerCount, setControllerCount] = useState<number>(0);

  useEffect(() => {
    setCurrentScore(0);
    setCurrentTime(getInitialTime(gameId));
    setCurrentLives(3);
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
      } else if (e.data.type === 'GAME_LIVES_UPDATE') {
        if (typeof e.data.lives === 'number') {
          setCurrentLives(e.data.lives);
        }
      } else if (e.data.type === 'GAME_OVER') {
        setCurrentScore(e.data.score || 0);
      } else if (e.data.type === 'GAME_JOYSTICK_READY') {
        const iframe = document.getElementById('kiosk-frame') as HTMLIFrameElement;
        iframe?.contentWindow?.postMessage({
          type: 'SET_INPUT_MODE',
          mode: inputMode
        }, '*');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [inputMode]);

  // Monitor Gamepad connection & stream inputs when in JOYSTICK mode
  useEffect(() => {
    const checkGamepads = () => {
      if (typeof navigator === 'undefined' || !navigator.getGamepads) return;
      const gps = navigator.getGamepads();
      let count = 0;
      for (let i = 0; i < gps.length; i++) {
        if (gps[i] && gps[i]?.connected) count++;
      }
      setGamepadConnected(count > 0);
      setControllerCount(count);
    };

    checkGamepads();
    window.addEventListener('gamepadconnected', checkGamepads);
    window.addEventListener('gamepaddisconnected', checkGamepads);

    let animId: number;
    const pollLoop = () => {
      if (inputMode === 'JOYSTICK' && typeof navigator !== 'undefined' && navigator.getGamepads) {
        const gps = navigator.getGamepads();
        let primary: Gamepad | null = null;
        let count = 0;
        for (let i = 0; i < gps.length; i++) {
          if (gps[i] && gps[i]?.connected) {
            count++;
            if (!primary) primary = gps[i];
          }
        }
        setGamepadConnected(count > 0);
        setControllerCount(count);

        if (primary) {
          const iframe = document.getElementById('kiosk-frame') as HTMLIFrameElement;
          const DEADZONE = 0.14;
          const applyDeadzone = (val: number) => Math.abs(val) < DEADZONE ? 0 : (val - Math.sign(val) * DEADZONE) / (1 - DEADZONE);
          const stickX = applyDeadzone(primary.axes[0] || 0);
          const stickY = applyDeadzone(primary.axes[1] || 0);
          const stick2X = applyDeadzone(primary.axes[2] || 0);
          const stick2Y = applyDeadzone(primary.axes[3] || 0);
          const trigger = Boolean(primary.buttons[0]?.pressed || (primary.buttons[0]?.value ?? 0) > 0.25);
          const leftTrigger = Boolean(primary.buttons[4]?.pressed || primary.buttons[6]?.pressed);
          const rightTrigger = Boolean(primary.buttons[5]?.pressed || primary.buttons[7]?.pressed);

          iframe?.contentWindow?.postMessage({
            type: 'VR_JOYSTICK_STATE',
            connected: true,
            controllerCount: count,
            stickX,
            stickY,
            stick2X,
            stick2Y,
            trigger,
            leftTrigger,
            rightTrigger
          }, '*');
        }
      }
      animId = requestAnimationFrame(pollLoop);
    };

    animId = requestAnimationFrame(pollLoop);

    return () => {
      window.removeEventListener('gamepadconnected', checkGamepads);
      window.removeEventListener('gamepaddisconnected', checkGamepads);
      cancelAnimationFrame(animId);
    };
  }, [inputMode]);

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

  const toggleInputMode = () => {
    const nextMode = inputMode === 'CAMERA' ? 'JOYSTICK' : 'CAMERA';
    setInputMode(nextMode);
    const iframe = document.getElementById('kiosk-frame') as HTMLIFrameElement;
    iframe?.contentWindow?.postMessage({
      type: 'SET_INPUT_MODE',
      mode: nextMode
    }, '*');
  };

  const handleRestart = () => {
    const iframe = document.getElementById('kiosk-frame') as HTMLIFrameElement;
    if (iframe) iframe.src = gameSrc;
    setCurrentScore(0);
    setCurrentTime(getInitialTime(gameId));
    setCurrentLives(3);
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
          padding: '10px 20px',
          background: 'rgba(5, 11, 24, 0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
          gap: '12px'
        }}
      >
        {/* Left: Back button */}
        <Link href="/" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem', flexShrink: 0 }}>
          <ArrowLeft size={16} />
          <span className="hide-on-mobile">Lobby</span>
        </Link>

        {/* Center: Exact In-Game Header */}
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
          overflow: 'hidden',
          flexShrink: 1,
          minWidth: 0
        }}>
          {/* Brand Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div style={{
              width: '30px',
              height: '30px',
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
                width={24}
                height={24}
                style={{ borderRadius: '5px' }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800,
                fontSize: '0.85rem',
                color: '#ffffff',
                lineHeight: 1.15,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                Sampath Vishwa
              </div>
              <div style={{
                fontSize: '0.55rem',
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
            height: '26px',
            background: '#f37021',
            borderRadius: '2px',
            flexShrink: 0
          }} />

          {/* Points */}
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', flexShrink: 0 }}>
            <div style={{
              fontSize: '0.52rem',
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
              fontSize: '1.3rem',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 0 12px rgba(243, 112, 33, 0.6)',
              lineHeight: 1
            }}>
              {currentScore >= 10000 ? currentScore.toLocaleString() : String(currentScore).padStart(4, '0')}
            </div>
          </div>

          {/* Gold Timer Box */}
          <div style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1.2rem',
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

          {/* Shields Meter for Biometric Defense */}
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

        {/* Right: Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Mode Switcher Button */}
          <button
            onClick={toggleInputMode}
            className="btn-secondary"
            style={{
              padding: '7px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              background: inputMode === 'JOYSTICK' ? 'rgba(0, 242, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
              border: inputMode === 'JOYSTICK' ? '1px solid #00f2ff' : '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: inputMode === 'JOYSTICK' ? '0 0 16px rgba(0, 242, 255, 0.35)' : 'none',
              color: inputMode === 'JOYSTICK' ? '#00f2ff' : '#cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
            title={inputMode === 'JOYSTICK' ? 'VR Joystick Mode Active - Click for Camera Mode' : 'AR Camera Tracking Active - Click for VR Joystick Mode'}
          >
            {inputMode === 'JOYSTICK' ? <Gamepad2 size={16} /> : <Camera size={16} />}
            <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.3px' }}>
              {inputMode === 'JOYSTICK' ? 'VR Joystick' : 'AR Camera'}
            </span>
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: inputMode === 'JOYSTICK' ? (gamepadConnected ? '#00ff88' : '#f37021') : '#00ff88',
                boxShadow: inputMode === 'JOYSTICK' ? (gamepadConnected ? '0 0 8px #00ff88' : '0 0 8px #f37021') : '0 0 8px #00ff88',
                transition: 'all 0.3s ease'
              }}
              title={inputMode === 'JOYSTICK' ? (gamepadConnected ? `${controllerCount} Controller(s) Ready` : 'Waiting for controller button press') : 'Camera Active'}
            />
          </button>

          <button onClick={handleRestart} className="btn-secondary" style={{ padding: '8px 12px' }} title="Restart">
            <RotateCcw size={15} />
            <span className="hide-on-mobile" style={{ fontSize: '0.78rem' }}>Restart</span>
          </button>

          <button onClick={toggleFullscreen} className="btn-secondary hide-on-mobile" style={{ padding: '8px 10px' }} title="Fullscreen">
            <Maximize2 size={15} />
          </button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="theater-stage-container" style={{ padding: '0 14px 16px 14px' }}>
        <div className="theater-frame" style={{
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          maxWidth: '1400px',
          aspectRatio: 'auto',
          borderRadius: '16px',
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


'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trophy, HelpCircle, Smartphone, Volume2, VolumeX, Camera, Maximize2 } from 'lucide-react';

interface NavbarProps {
  onOpenLeaderboard: () => void;
  onOpenHowToPlay: () => void;
  isKioskAspect: boolean;
  onToggleKioskAspect: () => void;
}

export default function Navbar({
  onOpenLeaderboard,
  onOpenHowToPlay,
  isKioskAspect,
  onToggleKioskAspect
}: NavbarProps) {
  const [cameraActive, setCameraActive] = useState<boolean | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  useEffect(() => {
    // Check if camera permission was previously granted or devices exist
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const hasCam = devices.some(d => d.kind === 'videoinput');
          setCameraActive(hasCam);
        })
        .catch(() => setCameraActive(false));
    }
  }, []);

  const toggleSound = () => {
    setIsSoundMuted(!isSoundMuted);
    window.postMessage({ type: 'TOGGLE_MUTE', isMuted: !isSoundMuted }, '*');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '16px 28px',
      background: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      {/* Brand Identification */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none'
        }}>
          <div style={{
            position: 'relative',
            width: 46,
            height: 46,
            flexShrink: 0,
            filter: 'drop-shadow(0 4px 14px rgba(243, 112, 33, 0.45))'
          }}>
            <Image
              src="/brand/sampath-punkalasa.png"
              alt="Sampath Bank"
              width={46}
              height={46}
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              priority
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/brand/vishwa-logo.png"
              alt="Sampath Vishwa Online Banking"
              width={170}
              height={52}
              style={{ objectFit: 'contain', height: '36px', width: 'auto', display: 'block' }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Controls & Nav actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Camera Status Indicator */}
        <div
          title={cameraActive ? 'Webcam detected' : 'Webcam required for AR motion'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 14px',
            borderRadius: '30px',
            fontSize: '0.8rem',
            color: cameraActive ? '#00ff88' : '#cbd5e1'
          }}
        >
          <Camera size={15} color={cameraActive ? '#00ff88' : '#f37021'} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
            {cameraActive === null ? 'Checking Camera...' : cameraActive ? 'Camera Ready' : 'Camera Off'}
          </span>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: cameraActive ? '#00ff88' : '#f37021',
            boxShadow: cameraActive ? '0 0 8px #00ff88' : 'none'
          }} />
        </div>

        {/* Kiosk Mode Ratio Toggle */}
        <button
          id="btn-toggle-kiosk-view"
          onClick={onToggleKioskAspect}
          className="btn-secondary"
          title="Toggle 9:16 Vertical Kiosk view preview"
          style={{
            borderColor: isKioskAspect ? 'var(--color-sampath-orange)' : undefined,
            color: isKioskAspect ? '#f37021' : undefined
          }}
        >
          <Smartphone size={16} />
          <span style={{ fontSize: '0.82rem' }}>
            {isKioskAspect ? 'Kiosk 9:16 Active' : 'Kiosk View'}
          </span>
        </button>

        {/* Fullscreen Kiosk */}
        <button
          id="btn-toggle-fullscreen"
          onClick={toggleFullscreen}
          className="btn-secondary"
          title="Full Screen Display Mode"
        >
          <Maximize2 size={16} />
        </button>

        {/* Sound Toggle */}
        <button
          id="btn-toggle-sound"
          onClick={toggleSound}
          className="btn-secondary"
          title={isSoundMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isSoundMuted ? <VolumeX size={16} color="#ff4d4d" /> : <Volume2 size={16} color="#00ff88" />}
        </button>

        {/* How to Play */}
        <button
          id="btn-how-to-play"
          onClick={onOpenHowToPlay}
          className="btn-secondary"
        >
          <HelpCircle size={16} />
          <span>Guide</span>
        </button>

        {/* Leaderboard Button */}
        <button
          id="btn-nav-leaderboard"
          onClick={onOpenLeaderboard}
          className="btn-primary"
          style={{ padding: '10px 22px', fontSize: '0.9rem' }}
        >
          <Trophy size={16} />
          <span>Rankings</span>
        </button>
      </div>
    </header>
  );
}

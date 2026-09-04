'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { withBasePath } from '@/utils/paths';
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
    <header
      className="nav-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(5, 11, 24, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}
    >
      {/* Brand Identification */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none'
        }}>
          <div style={{
            position: 'relative',
            width: 40,
            height: 40,
            flexShrink: 0,
            filter: 'drop-shadow(0 4px 14px rgba(243, 112, 33, 0.45))'
          }}>
            <Image
              src={withBasePath('/brand/sampath-punkalasa.png')}
              alt="Sampath Bank"
              width={40}
              height={40}
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              priority
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src={withBasePath('/brand/vishwa-logo.png')}
              alt="Sampath Vishwa Online Banking"
              width={150}
              height={46}
              style={{ objectFit: 'contain', height: '32px', width: 'auto', display: 'block' }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Controls & Nav actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Camera Status Indicator */}
        <div
          title={cameraActive ? 'Webcam detected' : 'Webcam required for AR motion'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '7px 12px',
            borderRadius: '30px',
            fontSize: '0.8rem',
            color: cameraActive ? '#00ff88' : '#cbd5e1'
          }}
        >
          <Camera size={15} color={cameraActive ? '#00ff88' : '#f37021'} />
          <span className="hide-on-mobile" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
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

        {/* Kiosk Mode Ratio Toggle (Hidden on mobile since phone is already 9:16) */}
        <button
          id="btn-toggle-kiosk-view"
          onClick={onToggleKioskAspect}
          className="btn-secondary hide-on-mobile"
          title="Toggle 9:16 Vertical Kiosk view preview"
          style={{
            borderColor: isKioskAspect ? 'var(--color-sampath-orange)' : undefined,
            color: isKioskAspect ? '#f37021' : undefined,
            padding: '8px 14px'
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
          style={{ padding: '8px 12px' }}
          title="Full Screen Display Mode"
        >
          <Maximize2 size={16} />
        </button>

        {/* Sound Toggle */}
        <button
          id="btn-toggle-sound"
          onClick={toggleSound}
          className="btn-secondary"
          style={{ padding: '8px 12px' }}
          title={isSoundMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isSoundMuted ? <VolumeX size={16} color="#ff4d4d" /> : <Volume2 size={16} color="#00ff88" />}
        </button>

        {/* How to Play */}
        <button
          id="btn-how-to-play"
          onClick={onOpenHowToPlay}
          className="btn-secondary"
          style={{ padding: '8px 14px' }}
        >
          <HelpCircle size={16} />
          <span className="nav-btn-text">Guide</span>
        </button>

        {/* Leaderboard Button */}
        <button
          id="btn-nav-leaderboard"
          onClick={onOpenLeaderboard}
          className="btn-primary"
          style={{ padding: '8px 18px', fontSize: '0.85rem' }}
        >
          <Trophy size={16} />
          <span className="nav-btn-text">Rankings</span>
        </button>
      </div>
    </header>
  );
}

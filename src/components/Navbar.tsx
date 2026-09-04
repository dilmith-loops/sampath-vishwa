'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { withBasePath } from '@/utils/paths';
import { Trophy, HelpCircle, Smartphone, Volume2, VolumeX, Maximize2 } from 'lucide-react';

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
  const [isSoundMuted, setIsSoundMuted] = useState(false);

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
    >
      {/* Brand Identification */}
      <div className="nav-brand">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none'
        }}>
          <div className="brand-logo-icon" style={{
            position: 'relative',
            width: 38,
            height: 38,
            flexShrink: 0,
            filter: 'drop-shadow(0 4px 14px rgba(243, 112, 33, 0.45))'
          }}>
            <Image
              src={withBasePath('/brand/sampath-punkalasa.png')}
              alt="Sampath Bank"
              width={38}
              height={38}
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              priority
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src={withBasePath('/brand/vishwa-logo.png')}
              alt="Sampath Vishwa Online Banking"
              width={140}
              height={42}
              className="brand-logo-text"
              style={{ objectFit: 'contain', height: '28px', width: 'auto', display: 'block' }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Controls & Nav actions */}
      <div className="nav-controls">
        {/* Kiosk Mode Ratio Toggle (Desktop only: phone is naturally portrait) */}
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

        {/* Fullscreen Kiosk (Desktop only) */}
        <button
          id="btn-toggle-fullscreen"
          onClick={toggleFullscreen}
          className="btn-secondary hide-on-mobile"
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

        {/* How to Play Guide */}
        <button
          id="btn-how-to-play"
          onClick={onOpenHowToPlay}
          className="btn-secondary"
          style={{ padding: '8px 14px' }}
          title="Player Guide & Gestures"
        >
          <HelpCircle size={16} />
          <span className="nav-btn-text hide-on-mobile">Guide</span>
        </button>

        {/* Leaderboard Button */}
        <button
          id="btn-nav-leaderboard"
          onClick={onOpenLeaderboard}
          className="btn-primary"
          style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          title="Top Player Rankings"
        >
          <Trophy size={16} />
          <span className="nav-btn-text hide-on-mobile">Rankings</span>
        </button>
      </div>
    </header>
  );
}

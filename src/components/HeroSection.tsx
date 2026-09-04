'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <section
      className="hero-container"
      style={{
        position: 'relative',
        padding: '44px 28px 18px 28px',
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center'
      }}
    >
      {/* Eyebrow badge */}
      <div
        className="hero-eyebrow"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'rgba(243, 112, 33, 0.12)',
          border: '1px solid rgba(243, 112, 33, 0.35)',
          padding: '6px 18px',
          borderRadius: '50px',
          marginBottom: '16px'
        }}
      >
        <span style={{
          fontSize: 'clamp(0.7rem, 2.5vw, 0.82rem)',
          fontWeight: 700,
          letterSpacing: '0.8px',
          color: '#f37021',
          textTransform: 'uppercase'
        }}>
          Sampath Bank Digital Innovation Hub
        </span>
      </div>

      <h1
        className="hero-title"
        style={{
          fontSize: 'clamp(2.1rem, 5vw, 3.8rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-1px',
          color: '#ffffff',
          marginBottom: '16px',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        Experience Banking in{' '}
        <span style={{
          background: 'linear-gradient(135deg, #f37021 0%, #ffaa00 50%, #d4af37 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Augmented Reality
        </span>
      </h1>

      <p
        className="hero-description"
        style={{
          fontSize: 'clamp(0.92rem, 2.8vw, 1.15rem)',
          color: '#94a3b8',
          lineHeight: 1.6,
          maxWidth: '680px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '8px'
        }}
      >
        Step up to the future of Sri Lankan digital banking. Control transactions, settle utility bills, grow e-Fixed Deposits, and deflect cyber threats using only real-time webcam motion tracking.
      </p>
    </section>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import { Shield, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(3, 7, 18, 0.95)',
      padding: '48px 28px 32px 28px'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Brand Col */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <Image
              src="/brand/sampath-punkalasa.png"
              alt="Sampath Logo"
              width={40}
              height={40}
              style={{ objectFit: 'contain' }}
            />
            <Image
              src="/brand/vishwa-logo.png"
              alt="Sampath Vishwa"
              width={160}
              height={46}
              style={{ objectFit: 'contain', height: '32px', width: 'auto' }}
            />
          </div>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '340px' }}>
            Sampath Vishwa is Sri Lanka’s premier internet & digital banking service, empowering seamless everyday payments, investments, and secure wealth management.
          </p>
        </div>

        {/* 4 Pillars Col */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
            Digital Banking Features
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>• Instant Utility Bill Settlement (CEB, Water, Telecom)</li>
            <li style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>• Real-Time e-Fixed Deposits & Savings Accounts</li>
            <li style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>• Biometric Login & AI Anti-Fraud Shield</li>
            <li style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>• Multi-Account Scheduled Transfers & Standing Orders</li>
          </ul>
        </div>

        {/* Kiosk Technology Col */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>
            Branch Kiosk Deployment
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '14px' }}>
            Designed for interactive touchscreens, vertical kiosk stands (9:16 portrait), and interactive exhibition booths at Sampath Bank Super Branches.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00ff88', fontSize: '0.8rem', fontWeight: 600 }}>
            <Shield size={16} />
            <span>Bank-grade secure client-side AI execution</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        paddingTop: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
          © {new Date().getFullYear()} Sampath Bank PLC. All Rights Reserved. Licensed Commercial Bank in Sri Lanka.
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <a
            href="https://www.sampathvishwa.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              color: '#f37021',
              textDecoration: 'none'
            }}
          >
            <span>Sampath Vishwa Portal</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}

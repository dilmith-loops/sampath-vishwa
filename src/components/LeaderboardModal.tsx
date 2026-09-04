'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Trophy, Medal, Flame, Trash2 } from 'lucide-react';
import { GAMES } from '@/data/games';
import { ScoreRecord } from '@/types/game';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: ScoreRecord[];
  onClearScores: () => void;
}

export default function LeaderboardModal({
  isOpen,
  onClose,
  scores,
  onClearScores
}: LeaderboardModalProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  if (!isOpen) return null;

  const filteredScores = activeTab === 'all'
    ? scores
    : scores.filter(s => s.gameId === activeTab);

  const sortedScores = [...filteredScores].sort((a, b) => b.score - a.score);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'linear-gradient(180deg, #0a1329 0%, #050b18 100%)',
          border: '1px solid rgba(243, 112, 33, 0.35)',
          borderRadius: '28px',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(243, 112, 33, 0.2)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'rgba(243, 112, 33, 0.15)',
              border: '1px solid #f37021',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(243, 112, 33, 0.3)'
            }}>
              <Trophy size={26} color="#d4af37" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                Sampath Vishwa <span style={{ color: '#f37021' }}>Hall of Fame</span>
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Top Kiosk Scores & Digital Banking Champions
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Game Filter Tabs */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '20px',
            alignItems: 'center'
          }}
        >
          <button
            onClick={() => setActiveTab('all')}
            style={{
              background: activeTab === 'all'
                ? 'linear-gradient(135deg, #f37021 0%, #ff8c42 100%)'
                : 'transparent',
              color: activeTab === 'all' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'all' ? '0 4px 14px rgba(243, 112, 33, 0.4)' : 'none',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            All Games
          </button>
          {GAMES.map(g => {
            const shortLabels: Record<string, string> = {
              'swipe-settle': 'Swipe & Settle',
              'multitasker': 'Multitasker',
              'wealth-rain': 'Wealth Rain',
              'biometric-shield': 'Biometric Shield'
            };
            const label = shortLabels[g.id] || g.title;

            return (
              <button
                key={g.id}
                onClick={() => setActiveTab(g.id)}
                style={{
                  background: activeTab === g.id
                    ? 'linear-gradient(135deg, #f37021 0%, #ff8c42 100%)'
                    : 'transparent',
                  color: activeTab === g.id ? '#ffffff' : '#94a3b8',
                  boxShadow: activeTab === g.id ? '0 4px 14px rgba(243, 112, 33, 0.4)' : 'none',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Scores List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', maxHeight: '440px' }}>
          {sortedScores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <Flame size={40} color="#f37021" style={{ margin: '0 auto 12px auto', opacity: 0.8 }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>No High Scores Yet</div>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                Launch any of the 4 AR kiosk experiences to set the first platform record!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sortedScores.map((rec, index) => {
                const isTop3 = index < 3;
                const medalColors = ['#ffd700', '#c0c0c0', '#cd7f32'];

                return (
                  <div
                    key={`${rec.gameId}-${rec.timestamp}-${index}`}
                    style={{
                      background: isTop3 ? 'rgba(243, 112, 33, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isTop3 ? 'rgba(243, 112, 33, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
                      borderRadius: '14px',
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: isTop3 ? medalColors[index] : 'rgba(255, 255, 255, 0.1)',
                        color: isTop3 ? '#050b18' : '#cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '0.85rem'
                      }}>
                        {isTop3 ? <Medal size={16} /> : index + 1}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                          {rec.playerName || 'Vishwa Player'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#f37021' }}>
                          {rec.gameTitle}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '1.3rem',
                        fontWeight: 900,
                        color: isTop3 ? '#d4af37' : '#ffffff'
                      }}>
                        {rec.score.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                        {new Date(rec.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info & Clear button */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Scores are saved locally on this kiosk device.
          </div>
          {scores.length > 0 && (
            <button
              onClick={onClearScores}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Trash2 size={14} />
              <span>Reset Records</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

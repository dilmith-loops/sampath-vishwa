'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import GameCard from '@/components/GameCard';
import GameTheaterModal from '@/components/GameTheaterModal';
import LeaderboardModal from '@/components/LeaderboardModal';
import HowToPlayModal from '@/components/HowToPlayModal';
import { GAMES } from '@/data/games';
import { GameInfo, ScoreRecord } from '@/types/game';
import { Layers, Trophy, Camera } from 'lucide-react';

const DEFAULT_SCORES: ScoreRecord[] = [
  { gameId: 'swipe-settle', gameTitle: 'The AR Swipe & Settle', playerName: 'Dilmith K.', score: 1400, timestamp: Date.now() - 3600000 * 2 },
  { gameId: 'multitasker', gameTitle: 'The Multitasker’s Masterpiece', playerName: 'Kavinda P.', score: 2800, timestamp: Date.now() - 3600000 * 5 },
  { gameId: 'wealth-rain', gameTitle: 'Rain of Wealth', playerName: 'Nadeesha S.', score: 85000, timestamp: Date.now() - 3600000 * 12 },
  { gameId: 'biometric-shield', gameTitle: 'Biometric Security Shield', playerName: 'Sampath Pro', score: 2200, timestamp: Date.now() - 3600000 * 24 }
];

export default function HomePage() {
  const [selectedGameForPlay, setSelectedGameForPlay] = useState<GameInfo | null>(null);
  const [selectedGameForHelp, setSelectedGameForHelp] = useState<GameInfo | null>(null);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isKioskAspect, setIsKioskAspect] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [scores, setScores] = useState<ScoreRecord[]>([]);

  const gamesSectionRef = useRef<HTMLDivElement>(null);

  // Load scores from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sampath_vishwa_scores');
      if (stored) {
        setScores(JSON.parse(stored));
      } else {
        setScores(DEFAULT_SCORES);
        localStorage.setItem('sampath_vishwa_scores', JSON.stringify(DEFAULT_SCORES));
      }
    } catch (e) {
      setScores(DEFAULT_SCORES);
    }
  }, []);

  const handleRecordScore = (gameId: string, gameTitle: string, score: number) => {
    if (score <= 0) return;
    const newRecord: ScoreRecord = {
      gameId,
      gameTitle,
      playerName: 'Vishwa Hero',
      score,
      timestamp: Date.now()
    };
    const updated = [newRecord, ...scores];
    setScores(updated);
    try {
      localStorage.setItem('sampath_vishwa_scores', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleClearScores = () => {
    setScores([]);
    try {
      localStorage.removeItem('sampath_vishwa_scores');
    } catch (e) {
      console.warn(e);
    }
  };

  const getHighScoreForGame = (gameId: string) => {
    const gameScores = scores.filter(s => s.gameId === gameId);
    if (gameScores.length === 0) return 0;
    return Math.max(...gameScores.map(s => s.score));
  };

  const filteredGames = filterCategory === 'all'
    ? GAMES
    : GAMES.filter(g => g.gestureType === filterCategory);

  const scrollToGames = () => {
    gamesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenHowToPlay={() => setSelectedGameForHelp(GAMES[0])}
        isKioskAspect={isKioskAspect}
        onToggleKioskAspect={() => setIsKioskAspect(!isKioskAspect)}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Hero Showcase Section */}
        <HeroSection
          featuredGame={GAMES[0]}
          onQuickPlay={(game) => setSelectedGameForPlay(game)}
          onScrollToGames={scrollToGames}
        />

        {/* Interactive Games Catalog Section */}
        <section
          ref={gamesSectionRef}
          className="catalog-section"
        >
          {/* Section Header with Category Filters */}
          <div className="catalog-header">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#f37021',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px'
                }}>
                  <Layers size={14} />
                  <span>Choose Your Experience</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.15 }}>
                  The 4 Pillars of <span style={{ color: '#f37021' }}>Sampath Vishwa</span>
                </h2>
              </div>

              {/* Filter Pills */}
              <div className="filter-pills-wrap no-scrollbar">
                {[
                  { id: 'all', label: 'All 4 Games' },
                  { id: 'hand', label: '🖐 Hand Motion' },
                  { id: 'head', label: '👤 Head Tilt' },
                  { id: 'two-hands', label: '🤲 Two Hands' },
                  { id: 'pose', label: '🛡 Body Shield' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterCategory(filter.id)}
                    className="filter-pill"
                    style={{
                      background: filterCategory === filter.id ? '#f37021' : 'rgba(255, 255, 255, 0.05)',
                      color: filterCategory === filter.id ? '#ffffff' : '#94a3b8'
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4 Games Grid */}
          <div className="games-grid">
            {filteredGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                highScore={getHighScoreForGame(game.id)}
                onPlay={(g) => setSelectedGameForPlay(g)}
                onShowHelp={(g) => setSelectedGameForHelp(g)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Game Theater Modal */}
      {selectedGameForPlay && (
        <GameTheaterModal
          game={selectedGameForPlay}
          onClose={() => setSelectedGameForPlay(null)}
          onRecordScore={handleRecordScore}
          initialKioskAspect={isKioskAspect}
        />
      )}

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        scores={scores}
        onClearScores={handleClearScores}
      />

      {/* How To Play Modal */}
      {selectedGameForHelp && (
        <HowToPlayModal
          selectedGame={selectedGameForHelp}
          onClose={() => setSelectedGameForHelp(null)}
          onLaunchGame={(g) => {
            setSelectedGameForHelp(null);
            setSelectedGameForPlay(g);
          }}
        />
      )}
    </>
  );
}

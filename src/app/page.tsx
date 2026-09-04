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
  const [scores, setScores] = useState<ScoreRecord[]>([]);

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
        <HeroSection />

        {/* Interactive Games Catalog Section */}
        <section className="catalog-section">
          {/* 4 Games Grid */}
          <div className="games-grid">
            {GAMES.map(game => (
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

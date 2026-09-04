export type GestureType = 'hand' | 'head' | 'two-hands' | 'pose';

export interface GameInfo {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  featurePillar: string;
  badge: string;
  trackingTech: string;
  gestureType: GestureType;
  gestureName: string;
  accentColor: string;
  secondaryColor: string;
  iframePath: string;
  durationSec: number;
  howToPlay: string[];
  benefits: string[];
  tips: string;
}

export interface ScoreRecord {
  gameId: string;
  gameTitle: string;
  playerName: string;
  score: number;
  timestamp: number;
}

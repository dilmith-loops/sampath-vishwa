import React from 'react';
import { GAMES } from '@/data/games';
import PlayGameClient from '@/components/PlayGameClient';

export function generateStaticParams() {
  return GAMES.map((game) => ({
    gameId: game.id,
  }));
}

interface PageProps {
  params: Promise<{ gameId: string }>;
}

export default async function PlayGamePage({ params }: PageProps) {
  const { gameId } = await params;
  return <PlayGameClient gameId={gameId} />;
}

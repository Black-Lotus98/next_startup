'use client';

import { GameProvider } from '@/contexts/game-context';

export default function SpaceInvadersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GameProvider>{children}</GameProvider>;
}

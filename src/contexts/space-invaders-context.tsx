'use client';

import React, { createContext, useContext, useState } from 'react';

interface SpaceInvadersContextType {
  backHref: string;
  setBackHref: (href: string) => void;
}

const SpaceInvadersContext = createContext<SpaceInvadersContextType | undefined>(undefined);

export function SpaceInvadersProvider({ children }: { children: React.ReactNode }) {
  const [backHref, setBackHref] = useState('/space-invaders');

  return (
    <SpaceInvadersContext.Provider value={{ backHref, setBackHref }}>
      {children}
    </SpaceInvadersContext.Provider>
  );
}

export function useSpaceInvaders() {
  const context = useContext(SpaceInvadersContext);
  if (context === undefined) {
    throw new Error('useSpaceInvaders must be used within SpaceInvadersProvider');
  }
  return context;
}

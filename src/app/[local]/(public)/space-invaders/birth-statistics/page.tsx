'use client';

import SpaceInvadersLayout from '@/components/layouts/SpaceInvadersLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTurnProgression } from '@/hooks/use-turn-progression';
import { useLocalizedPathname } from '@/hooks/use-localized-pathname';
import { formatNumber } from '@/lib/space-invaders/game-utils';

const BirthStatisticsPage = () => {
  const router = useRouter();
  const getLocalizedPath = useLocalizedPathname();
  const { gameState, calculateDemographicsForTurn } = useTurnProgression();
  const [demographics, setDemographics] = useState<{
    numberOfBirths: number;
    numberOfDeaths: number;
  } | null>(null);

  // Calculate demographics when component mounts (only once)
  useEffect(() => {
    if (!demographics) {
      const calculated = calculateDemographicsForTurn();
      setDemographics(calculated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const totalHumanPopulation =
    gameState.rebelHumans + gameState.sympathizers + gameState.scientists;

  return (
    <SpaceInvadersLayout
      href={getLocalizedPath('/space-invaders/main-menu')}
      className="font-alien-robot"
      gap="0"
    >
      <div
        className="row-span-3 col-span-12 flex justify-center items-center"
        style={{ borderStyle: 'ridge' }}
      >
        <div className="text-2xl font-bold">Lord Invader</div>
      </div>

      <div
        className="text-center mx-[5%] row-span-6 col-span-12 flex flex-col gap-4 justify-center items-center"
        style={{ borderStyle: 'ridge' }}
      >
        <div className="text-2xl font-bold">
          You have {formatNumber(gameState.meat)} kg of Meat
        </div>

        {demographics ? (
          <>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(demographics.numberOfBirths)} humans have been born
              this year
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatNumber(demographics.numberOfDeaths)} humans have died this
              year
            </div>

            <div className="text-lg text-gray-600 mt-4">
              Net change: {demographics.numberOfBirths - demographics.numberOfDeaths > 0 ? '+' : ''}
              {formatNumber(demographics.numberOfBirths - demographics.numberOfDeaths)} humans
            </div>

            <div className="text-sm text-gray-500">
              Total human population: {formatNumber(totalHumanPopulation)}
            </div>
          </>
        ) : (
          <div className="text-lg">Calculating statistics...</div>
        )}
      </div>

      <div className="flex justify-center items-center row-span-1 col-span-12">
        <Button
          onClick={() => router.push(getLocalizedPath('/space-invaders/taxes'))}
          className="bg-[#b6f486] hover:bg-[#b6f486]/90 text-[#400e63]"
          disabled={!demographics}
        >
          Continue
        </Button>
      </div>
    </SpaceInvadersLayout>
  );
};

export default BirthStatisticsPage;

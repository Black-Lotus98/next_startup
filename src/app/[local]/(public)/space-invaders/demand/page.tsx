'use client';

import SpaceInvadersLayout from '@/components/layouts/SpaceInvadersLayout';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTurnProgression } from '@/hooks/use-turn-progression';
import { useLocalizedPathname } from '@/hooks/use-localized-pathname';
import { formatNumber } from '@/lib/space-invaders/game-utils';

const DemandPage = () => {
  const router = useRouter();
  const getLocalizedPath = useLocalizedPathname();
  const { releaseMeat, advanceTurn, gameState } = useTurnProgression();
  const [releaseAmount, setReleaseAmount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [hasReleased, setHasReleased] = useState(false);

  // Calculate minimum reserve (20% of current meat)
  const minimumReserve = gameState.meat * 0.2;
  const maxRelease = gameState.meat - minimumReserve;
  const minRelease = gameState.meat_demand;

  const handleRelease = () => {
    if (releaseAmount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    const result = releaseMeat(releaseAmount);
    setMessage(result.message);

    if (result.success) {
      setHasReleased(true);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleContinue = () => {
    if (!hasReleased) {
      setMessage('You must release meat before continuing');
      return;
    }

    // Advance to next turn/year
    advanceTurn();

    // Navigate to birth statistics
    router.push(getLocalizedPath('/space-invaders/birth-statistics'));
  };

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
        <div className="text-xl">
          Meat demand is {formatNumber(gameState.meat_demand)} kg. How much meat
          will you release for consumption?
        </div>
        <div className="text-lg">
          You must keep at least 20% of your stock ({formatNumber(minimumReserve)} kg)
        </div>
        <div className="text-sm text-gray-600">
          Minimum release: {formatNumber(minRelease)} kg | Maximum release:{' '}
          {formatNumber(maxRelease)} kg
        </div>

        {message && (
          <div
            className={`text-sm p-2 rounded ${
              message.includes('Cannot') || message.includes('must') || message.includes('Please')
                ? 'bg-red-200 text-red-800'
                : 'bg-green-200 text-green-800'
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex justify-center items-center gap-2">
          <input
            type="number"
            value={releaseAmount || ''}
            onChange={(e) => {
              setReleaseAmount(Number(e.target.value) || 0);
              setMessage(null);
            }}
            min={minRelease}
            max={maxRelease}
            placeholder="Enter amount (kg)"
            className="h-auto border-2 border-primary-a0 rounded-md focus:outline-offset-2 focus-visible:outline-[#b6f486] p-2 w-48"
            disabled={hasReleased}
          />
          {!hasReleased && (
            <Button
              onClick={handleRelease}
              className="bg-[#b6f486] hover:bg-[#b6f486]/90 text-[#400e63]"
            >
              Release Meat
            </Button>
          )}
        </div>

        {releaseAmount > 0 && !hasReleased && (
          <div className="text-sm text-gray-600">
            Remaining after release: {formatNumber(gameState.meat - releaseAmount)} kg
          </div>
        )}

        {hasReleased && (
          <div className="text-sm text-green-600 font-semibold">
            ✓ Meat released successfully! Click Continue to advance to next turn.
          </div>
        )}

        <div className="flex justify-center items-center">
          <Button
            onClick={handleContinue}
            disabled={!hasReleased}
            className="bg-[#b6f486] hover:bg-[#b6f486]/90 text-[#400e63] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      </div>
    </SpaceInvadersLayout>
  );
};

export default DemandPage;

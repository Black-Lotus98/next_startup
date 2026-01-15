'use client';

import SpaceInvadersLayout from '@/components/layouts/SpaceInvadersLayout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useGameState } from '@/hooks/use-game-state'
import { formatNumber } from '@/lib/space-invaders/game-utils'
import { useLocalizedPathname } from '@/hooks/use-localized-pathname'

const StatusColumn = ({ title, number, unit }: { title: string, number: number | string, unit: string }) => {
  return (
    <div className="flex flex-col w-full h-full text-center items-center justify-center grow gap-2 border-8 border-[#b6f486]" style={{ borderStyle: 'ridge' }}>
      <span className="md:text-2xl sm:text-lg text-sm">{title}</span>
      <span className="font-bold md:text-xl text-md">{number}</span>
      <span className="md:text-sm text-xs">{unit}</span>
    </div>
  )
}

const MarketButton = ({ href, title }: { href: string, title: string }) => {
  return (
    <Link href={href} className="bg-[#b6f486] hover:bg-[#b6f486]/90 text-[#400e63] w-full h-full grow border-8 border-[#b6f486] text-center p-4 flex items-center justify-center
    active:scale-95 cursor-pointer" style={{ borderStyle: 'ridge' }}>
      {title}
    </Link>
  )
}

const MainMenu = () => {
  const { gameState } = useGameState()
  const getLocalizedPath = useLocalizedPathname()

  // Calculate percentage of food saved
  const foodSavedPercentage = gameState.meat > 0
    ? ((gameState.meat - gameState.meat_demand) / gameState.meat * 100).toFixed(0)
    : '0'

  return (
    <SpaceInvadersLayout href={getLocalizedPath('/space-invaders')} className="font-big-pixel">
      <div className="col-span-12 row-span-4 flex flex-col gap-4 justify-center items-center text-center">
        <h3>Big Alien Mafia Gangster Boss</h3>
        <h4>Human saved by rebel humans {foodSavedPercentage}% of your food!</h4>
        <h4>You are in year {gameState.year} </h4>
      </div>

      <div className="row-span-4 col-span-12 flex justify-center items-center" style={{ borderStyle: 'ridge' }}>
        <StatusColumn title="Meat Demand" number={formatNumber(gameState.meat_demand)} unit="Container" />
        <StatusColumn title="Meat Price" number={formatNumber(gameState.meat_price, 2)} unit="per 1000" />
        <StatusColumn title="Stock Price" number={formatNumber(gameState.stock_price, 2)} unit="Stock" />
        <StatusColumn title="Treasury Xeno" number={formatNumber(gameState.xeno_matter)} unit="xeno matter" />
      </div>

      <div className="row-span-1 col-span-12 flex flex-col gap-4 justify-center items-center">
        Use the buttons below if you wish to buy or Sell grains and lands
      </div>

      <div className="row-span-4 col-span-12  flex flex-col md:flex-row justify-center items-center border-8 border-[#b6f486] gap-4 p-4" style={{ borderStyle: 'ridge' }}>

        <MarketButton href={getLocalizedPath('/space-invaders/meat-market')} title="Meat Market" />
        <MarketButton href={getLocalizedPath('/space-invaders/stock-market')} title="Stock Market" />
      </div>

      <div className="row-span-4 col-span-12 flex justify-center items-center" style={{ borderStyle: 'ridge' }}>
        <Link href={getLocalizedPath('/space-invaders/demand')}>
          <Button className="bg-[#b6f486] hover:bg-[#b6f486]/90 text-[#400e63] px-4 py-2 h-full  border-8 border-[#b6f486]" style={{ borderStyle: 'ridge' }} >
            Continue
          </Button>
        </Link>
      </div>
    </SpaceInvadersLayout >
  )
}

export default MainMenu

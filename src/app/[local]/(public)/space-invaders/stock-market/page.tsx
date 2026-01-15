'use client';

import SpaceInvadersLayout from '@/components/layouts/SpaceInvadersLayout'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMarketActions } from '@/hooks/use-market-actions'
import { useLocalizedPathname } from '@/hooks/use-localized-pathname'
import { formatNumber } from '@/lib/space-invaders/game-utils'

const StatusColumn = ({ title, number, unit }: { title: string, number: number | string, unit: string }) => {
  return (
    <div className="flex flex-col w-full h-full text-center items-center justify-center grow gap-2 border-8 border-[#b6f486]" style={{ borderStyle: 'ridge' }}>
      <span className="md:text-2xl sm:text-lg text-sm">{title}</span>
      <span className="font-bold md:text-xl text-md">{number}</span>
      <span className="md:text-sm text-xs">{unit}</span>
    </div>
  )
}

const StockMarket = () => {
  const [stockAmount, setStockAmount] = useState(0)
  const [isBuying, setIsBuying] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const getLocalizedPath = useLocalizedPathname()
  const { buyStocks, sellStocks, gameState } = useMarketActions()

  const handleTransaction = () => {
    if (stockAmount <= 0) {
      setMessage('Please enter a valid amount')
      return
    }

    const result = isBuying
      ? buyStocks(stockAmount)
      : sellStocks(stockAmount)

    setMessage(result.message)
    
    if (result.success) {
      setStockAmount(0)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const totalCost = gameState.stock_price * stockAmount

  return (
    <SpaceInvadersLayout href={getLocalizedPath('/space-invaders/main-menu')} className="font-big-pixel">
      <div className="col-span-12 row-span-4 flex flex-col gap-4 justify-center items-center text-center border-8 border-[#b6f486]" style={{ borderStyle: 'ridge' }}>
        <h3>Stock Market</h3>
        <div className="text-lg font-semibold">
          You have {formatNumber(gameState.xeno_matter)} xeno matter
        </div>
        <div className="text-lg font-semibold">
          You own {formatNumber(gameState.owned_stocks)} / {formatNumber(gameState.maxStock)} stocks
        </div>
      </div>

      <div className="row-span-4 col-span-12 flex justify-center items-center border-8 border-[#b6f486]" style={{ borderStyle: 'ridge' }}>
        <StatusColumn title="Stock Price" number={formatNumber(gameState.stock_price, 2)} unit="per stock" />
        <StatusColumn title="Owned Stocks" number={formatNumber(gameState.owned_stocks)} unit="stocks" />
        <StatusColumn title="Available" number={formatNumber(gameState.maxStock - gameState.owned_stocks)} unit="stocks" />
        <StatusColumn title="Treasury Xeno" number={formatNumber(gameState.xeno_matter)} unit="xeno matter" />
      </div>

      <div className="row-span-4 col-span-12 flex flex-col gap-4 p-4 border-8 border-[#b6f486]" style={{ borderStyle: 'ridge' }}>
        <div className='flex items-center gap-4'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input 
              checked={isBuying} 
              onChange={() => {
                setIsBuying(true)
                setMessage(null)
              }} 
              type='radio' 
              name="stock" 
              className='w-4 h-4 cursor-pointer' 
            />
            <span className='font-semibold'>Buy Stocks</span>
          </label>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input 
              checked={!isBuying} 
              onChange={() => {
                setIsBuying(false)
                setMessage(null)
              }} 
              type='radio' 
              name="stock" 
              className='w-4 h-4 cursor-pointer' 
            />
            <span className='font-semibold'>Sell Stocks</span>
          </label>
        </div>

        {message && (
          <div className={`text-sm p-2 rounded ${message.includes('Insufficient') || message.includes('must be') || message.includes('Cannot exceed') ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
            {message}
          </div>
        )}

        {stockAmount > 0 && (
          <div className='text-sm text-gray-600'>
            {isBuying ? 'Cost' : 'Revenue'}: {formatNumber(totalCost, 2)} xeno matter
          </div>
        )}

        <div className='flex items-center gap-2'>
          <input 
            value={stockAmount || ''} 
            onChange={(e) => {
              setStockAmount(Number(e.target.value) || 0)
              setMessage(null)
            }} 
            type="number" 
            id="stockAmount" 
            placeholder='Enter amount (stocks)'
            min="0"
            className='h-auto border-2 border-primary-a0 rounded-md focus:outline-offset-2 focus-visible:outline-[#b6f486] p-2 flex-1' 
          />
          <Button 
            onClick={handleTransaction}
            className='bg-[#b6f486] hover:bg-[#b6f486]/90 text-[#400e63]'
          >
            {isBuying ? 'Buy Stocks' : 'Sell Stocks'}
          </Button>
          <Button 
            onClick={() => router.push(getLocalizedPath('/space-invaders/main-menu'))}
            variant="outline"
          >
            Exit
          </Button>
        </div>
      </div>
    </SpaceInvadersLayout >
  )
}

export default StockMarket

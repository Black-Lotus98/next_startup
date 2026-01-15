'use client'
import SpaceInvadersLayout from '@/components/layouts/SpaceInvadersLayout'
import Image from 'next/image'
import meatMarketImage from '@/assets/images/space-invaders/alienMeatMarket.jpg'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMarketActions } from '@/hooks/use-market-actions'
import { useLocalizedPathname } from '@/hooks/use-localized-pathname'
import { formatNumber } from '@/lib/space-invaders/game-utils'

const MeatMarket = () => {
  const [meatAmount, setMeatAmount] = useState(0)
  const [isBuying, setIsBuying] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const getLocalizedPath = useLocalizedPathname()
  const { buyMeat, sellMeat, gameState } = useMarketActions()

  const handleTransaction = () => {
    if (meatAmount <= 0) {
      setMessage('Please enter a valid amount')
      return
    }

    const result = isBuying
      ? buyMeat(meatAmount)
      : sellMeat(meatAmount)

    setMessage(result.message)
    
    if (result.success) {
      setMeatAmount(0)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const totalCost = isBuying
    ? (gameState.meat_price / 1000) * meatAmount
    : (gameState.meat_price / 1000) * meatAmount

  return (
    <SpaceInvadersLayout href={getLocalizedPath('/space-invaders/main-menu')} className="font-big-pixel" gap="0">
      <div className='row-span-9 col-span-12 flex justify-center items-center w-full h-full border-8 border-[#b6f486]' style={{ borderStyle: 'ridge' }}>
        <Image src={meatMarketImage} alt="Meat Market" width={1000} height={1000} className='w-full h-full object-cover object-center  ' />
      </div>
      <div className='p-4 row-span-3 col-span-12 border-8 border-[#b6f486] flex flex-col gap-2' style={{ borderStyle: 'ridge' }}>
        <div className='text-lg font-semibold'>
          You have {formatNumber(gameState.xeno_matter)} xeno matter and {formatNumber(gameState.meat)} kg of meat
        </div>
        <div>
          <div className='font-semibold mb-2'>
            Meat price is {formatNumber(gameState.meat_price, 2)} per 1000 kg
          </div>
          <div className='flex items-center gap-4'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input 
                checked={isBuying} 
                onChange={() => {
                  setIsBuying(true)
                  setMessage(null)
                }} 
                type='radio' 
                name="meat" 
                className='w-4 h-4 cursor-pointer' 
              />
              <span>Buy Meat</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input 
                checked={!isBuying} 
                onChange={() => {
                  setIsBuying(false)
                  setMessage(null)
                }} 
                type='radio' 
                name="meat" 
                className='w-4 h-4 cursor-pointer' 
              />
              <span>Sell Meat</span>
            </label>
          </div>
        </div>
        {message && (
          <div className={`text-sm p-2 rounded ${message.includes('Insufficient') || message.includes('must be') ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
            {message}
          </div>
        )}
        {meatAmount > 0 && (
          <div className='text-sm text-gray-600'>
            {isBuying ? 'Cost' : 'Revenue'}: {formatNumber(totalCost, 2)} xeno matter
          </div>
        )}
        <div className='flex items-center gap-2'>
          <input 
            value={meatAmount || ''} 
            onChange={(e) => {
              setMeatAmount(Number(e.target.value) || 0)
              setMessage(null)
            }} 
            type="number" 
            id="meatAmount" 
            placeholder='Enter amount (kg)'
            min="0"
            className='h-auto border-2 border-primary-a0 rounded-md focus:outline-offset-2 focus-visible:outline-[#b6f486] p-2 flex-1' 
          />
          <Button 
            onClick={handleTransaction}
            className='bg-[#b6f486] hover:bg-[#b6f486]/90 text-[#400e63]'
          >
            {isBuying ? 'Buy Meat' : 'Sell Meat'}
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

export default MeatMarket

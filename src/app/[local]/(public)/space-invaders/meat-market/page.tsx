'use client'
import SpaceInvadersLayout from '@/components/layouts/SpaceInvadersLayout'
import Image from 'next/image'
import meatMarketImage from '@/assets/images/space-invaders/alienMeatMarket.jpg'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'


const MainMenu = () => {

  const [meatAmount, setMeatAmount] = useState(0)
  const [isBuying, setIsBuying] = useState(true)
  const router = useRouter()
  return (
    <SpaceInvadersLayout href="/space-invaders/main-menu" className="font-big-pixel" gap="0">
      <div className='row-span-9 col-span-12 flex justify-center items-center w-full h-full border-8 border-[#b6f486]' style={{ borderStyle: 'ridge' }}>
        <Image src={meatMarketImage} alt="Meat Market" width={1000} height={1000} className='w-full h-full object-cover object-center  ' />
      </div>
      <div className='p-4 row-span-3 col-span-12 border-8 border-[#b6f486]' style={{ borderStyle: 'ridge' }}>
        <div>You have {123} xeno matter and you have {456} meat</div>
        <div>
          <div>
            Meat price is {789} per 1000 Kgs.
          </div>
          <div className='flex items-center gap-2'>
            <label className='flex items-center gap-2'> Buy Meat:
              <input checked={isBuying} onChange={() => setIsBuying(true)} type='radio' id='meatCheckbox' name="meat" className='w-4 h-4' />
            </label>
            <label className='flex items-center gap-2'> Sell Meat:
              <input checked={!isBuying} onChange={() => setIsBuying(false)} type='radio' id='meatCheckbox' name="meat" className='w-4 h-4' />
            </label>

          </div>
        </div>
        <div className='flex items-center gap-2'>
          <input value={meatAmount} onChange={(e) => setMeatAmount(Number(e.target.value))} type="number" id="meatAmount" placeholder='Enter amount'
            className='h-auto border-2 border-primary-a0 rounded-md focus:outline-offset-2 focus-visible:outline-[#b6f486] p-2' />
          {isBuying ? <Button onClick={() => setIsBuying(false)}> Buy Meat</Button> : <Button onClick={() => setIsBuying(true)}> Sell Meat</Button>}
          <Button onClick={() => router.push('/space-invaders/main-menu')}> Exit</Button>
        </div>

      </div>
    </SpaceInvadersLayout >
  )
}

export default MainMenu

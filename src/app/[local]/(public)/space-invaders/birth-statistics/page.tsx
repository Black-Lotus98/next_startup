"use client"
import SpaceInvadersLayout from '@/components/layouts/SpaceInvadersLayout'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const BirthStatisticsPage = () => {
    const router = useRouter()
    return (
        <SpaceInvadersLayout href="/space-invaders/main-menu" className="font-alien-robot" gap="0">
            <div className='row-span-3 col-span-12 flex justify-center items-center' style={{ borderStyle: 'ridge' }}>
                <div className='text-2xl font-bold'>Lord Invader </div>
            </div>

            <div className="text-center mx-[5%] row-span-6 col-span-12 flex flex-col gap-4 justify-center items-center" style={{ borderStyle: 'ridge' }}>
                <div className='text-2xl font-bold'>You have {1234} kg of Meat</div>
                <div className='text-2xl font-bold'>{100} humans have been born this year</div>
                <div className='text-2xl font-bold'>{100} humans have died this year</div>


            </div>
            <div className="flex justify-center items-center row-span-1 col-span-12" >
                <Button onClick={() => router.push('/space-invaders/taxes')}>Continue</Button>
            </div>
        </SpaceInvadersLayout>
    )
}

export default BirthStatisticsPage

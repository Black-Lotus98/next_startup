"use client"
import SpaceInvadersLayout from '@/components/layouts/SpaceInvadersLayout'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
const DemandPage = () => {
    const router = useRouter()
    return (
        <SpaceInvadersLayout href="/space-invaders/main-menu" className="font-alien-robot" gap="0">
            <div className='row-span-3 col-span-12 flex justify-center items-center' style={{ borderStyle: 'ridge' }}>
                <div className='text-2xl font-bold'>Lord Invader </div>
            </div>

            <div className="text-center mx-[5%] row-span-6 col-span-12 flex flex-col gap-4 justify-center items-center" style={{ borderStyle: 'ridge' }}>
                <div className='text-2xl font-bold'>You have {1234} kg of Meat</div>
                <div className='text-xl'>
                    Meat demand is {12} kg How much meat will you release for consumption
                </div>
                <div>
                    You must keep at least 20% of your stock  </div>
                <div className="flex justify-center items-center" >
                    <input type="number" className="h-auto border-2 border-primary-a0 rounded-md focus:outline-offset-2 focus-visible:outline-[#b6f486] p-2" onChange={() => console.log('test')} />
                </div>
                <div className="flex justify-center items-center" >
                    <Button onClick={() => router.push('/space-invaders/birth-statistics')}>Continue</Button>
                </div>
            </div>
        </SpaceInvadersLayout >
    )
}
export default DemandPage

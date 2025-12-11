import { Button } from '@/components/ui/button'
import Link from 'next/link'
import SpaceInvadersLayout from '@/components/layouts/SpaceInvadersLayout'

const HomePage = () => {
    return (
        <SpaceInvadersLayout>
            <div className=' flex col-span-12 row-span-8 justify-center items-center border-6 border-[#b6f486] ' style={{ borderStyle: 'ridge' }}>
                <h1 className='text-4xl font-bold text-center'>Space Invaders</h1>
            </div>
            <div className='flex flex-col gap-2 row-start-9 col-span-12 row-span-4 p-4 border-6 border-[#b6f486]' style={{ borderStyle: 'ridge' }}>
                <h3 className='text-2xl font-bold'>Credits</h3>
                <div className='flex font-semibold'>
                    Re Produced By: Team Whoever
                </div>
                <div className='flex font-semibold'>
                    Developed Using: React JS
                </div>
                <div className='w-full flex justify-center items-center grow'>
                    <Link href="/space-invaders/main-menu">
                        <Button variant="inherit" className=' bg-[#b6f486] text-[#400e63]' >Start</Button>
                    </Link>
                </div>
            </div>
        </SpaceInvadersLayout>
    )
}

export default HomePage

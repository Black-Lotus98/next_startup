import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import { StyleEnum } from '@/enums/themeButton.enum'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const SpaceInvadersLayout = ({ children, href, className, gap = "4"}: { children: React.ReactNode, href?: string, className?: string, gap?: string }) => {
    return (
        <div className={cn("flex flex-col justify-center items-center h-screen w-full bg-gray-200 dark:bg-surface-a10 sm:p-20 font-alien-robot", className)}>
            {href && <Link href={href}>
                <Button variant="ghost" size="icon" rounded="full" className='absolute top-4 left-4 z-50 hover:shadow-xl'>
                    <ArrowLeft className='size-4 rtl:rotate-180' />
                </Button>
            </Link>}

            <ThemeSwitcher style={StyleEnum.OVERLAY_BUTTON} />
            <div className={`max-w-7xl p-4 w-full h-full grid grid-cols-12 gap-${gap} grid-rows-12 border-6 bg-[#b7bef1] border-[#400e63] text-[#400e63]`} style={{ borderStyle: 'ridge' }}>
                {children}
            </div>
        </div>
    )
}

export default SpaceInvadersLayout

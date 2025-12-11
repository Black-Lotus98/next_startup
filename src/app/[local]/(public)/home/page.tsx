import { ThemeSwitcher } from '@/components/theme-switcher'
import { StyleEnum } from '@/enums/themeButton.enum'
import React from 'react'

const HomePage = () => {
    return (
        <div className="relative h-screen w-full bg-gray-200 dark:bg-surface-a10">
            <ThemeSwitcher style={StyleEnum.OVERLAY_BUTTON} />

        </div>
    )
}

export default HomePage

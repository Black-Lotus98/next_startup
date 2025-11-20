
import React from 'react'
import { useTranslations } from 'next-intl'

const DashboardPage = () => {
    const t = useTranslations('home')
    return (
        <div>
            <h1>{t('title')}</h1>
        </div>
    )
}

export default DashboardPage

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export enum StyleEnum {
    NORMAL_BUTTON = 'normal',
    OVERLAY_BUTTON = 'overlay',
}


interface ThemeSwitcherProps {
    style?: StyleEnum;
}

export function ThemeSwitcher({ style }: ThemeSwitcherProps) {
    const { setTheme, resolvedTheme } = useTheme();

    // Default to light theme during SSR (when resolvedTheme is undefined)
    // This matches defaultTheme="light" in ThemeProvider
    const isDark = resolvedTheme === 'dark';

    // During SSR, resolvedTheme is undefined, so we default to showing Moon icon (light mode)
    // This ensures server and client render match initially
    const showSun = resolvedTheme ? isDark : false;

    const handleToggle = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    console.log('style', style);
    const buttonContent = (
        <Button
            variant="ghost"
            size="icon-lg"
            className={cn(style === StyleEnum.OVERLAY_BUTTON ? 'fixed top-4 right-4 z-50 shadow-lg hover:shadow-xl' : 'hidden',
                'h-9 w-9',
                'rounded-full')}
            onClick={handleToggle}
            aria-label="Toggle theme"
            suppressHydrationWarning
        >
            <span suppressHydrationWarning>
                {showSun ? (
                    <Sun className="h-4 w-4" />
                ) : (
                    <Moon className="h-4 w-4" />
                )}
            </span>
        </Button>
    );

    return (
        <>
            {buttonContent}
        </>
    );
}


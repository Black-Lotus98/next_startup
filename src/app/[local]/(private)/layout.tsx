'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { isRtlLocale, type Locale } from '@/config/i18n';
import { LocaleEnum } from '@/enums/locale.enum';
import { SidebarSide } from '@/enums/sidebar-side.enum';
import { localizedPathClient } from '@/lib/utils-client';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
    const params = useParams();
    const locale = (params.local as Locale) || LocaleEnum.EN;
    const isRtl = isRtlLocale(locale);

    return (
        <SidebarProvider>
            <Sidebar side={isRtl ? SidebarSide.RIGHT : SidebarSide.LEFT}>
                <SidebarHeader>
                    {/* Add your logo/branding here */}
                    <div className="px-2 py-2">
                        <h2 className="text-lg font-semibold text-right rtl:text-right ltr:text-left">
                            My App
                        </h2>
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="rtl:text-right ltr:text-left">
                            Navigation
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild className="rtl:flex-row-reverse rtl:justify-end">
                                        <Link href={localizedPathClient('/dashboard')} className="w-full">
                                            <span>Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                {/* Add more menu items here */}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    {/* Add footer content like user profile, settings, etc. */}
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className={`flex h-16 shrink-0 items-center gap-2 border-b px-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <SidebarTrigger className={isRtl ? '-mr-1' : '-ml-1'} />
                    <div className={`flex flex-1 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                        <ThemeSwitcher />
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default PrivateLayout;

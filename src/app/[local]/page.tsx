import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/config/i18n';
import { localePathname } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { StyleEnum, ThemeSwitcher } from '@/components/theme-switcher';

export function generateStaticParams() {
  return locales.map((locale) => ({ local: locale }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ local: string }>;
}) {
  const { local } = await params;
  setRequestLocale(local);

  const tHome = await getTranslations('home');
  const locale = local as Locale;

  // Define navigation projects/sections
  const projects = [
    {
      id: 'dashboard',
      path: '/dashboard',
      title: tHome('projects.dashboard.title'),
      description: tHome('projects.dashboard.description'),
    },
    {
      id: 'spaceInvaders',
      path: '/space-invaders',
      title: tHome('projects.spaceInvaders.title'),
      description: tHome('projects.spaceInvaders.description'),
    },
  ];

  return (
    <div className="min-h-screen w-full relative">
      <ThemeSwitcher style={StyleEnum.OVERLAY_BUTTON} />

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {tHome('title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {tHome('subtitle')}
          </p>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {projects.map((project) => {
            const href = localePathname(locale, project.path);
            return (
              <Link
                key={project.id}
                href={href}
                className="group block cursor-pointer"
              >
                <div className="h-full p-8 rounded-xl border-2 border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="pt-2 flex items-center">
                      <span className="text-sm font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                        {tHome('view')}
                        <ArrowRightIcon className="w-4 h-4 rtl:rotate-180" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

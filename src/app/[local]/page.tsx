import { Button } from "@/components/ui/button";
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/config/i18n';

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
  const tCommon = await getTranslations('common');

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-4xl font-bold">{tHome('title')}</h1>
      <Button>{tCommon('buttons.click')}</Button>
    </div>
  );
}

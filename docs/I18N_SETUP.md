# Internationalization (i18n) Setup Guide

This project uses **next-intl** for internationalization with URL-based locale routing.

## 📁 File Structure

```
my-app/
├── middleware.ts              # ⚠️ MUST stay in root (Next.js requirement)
├── config/
│   ├── i18n.ts               # Locale configuration
│   └── i18n-request.ts       # Translation loading logic
├── src/
│   └── messages/
│       ├── home/
│       │   ├── en.json
│       │   └── ar.json
│       ├── about/            # Example: when you add an about page
│       │   ├── en.json
│       │   └── ar.json
│       └── [page-name]/      # Each page has its own directory
│           ├── en.json
│           └── ar.json
└── app/
    └── [local]/              # Dynamic locale segment
        ├── layout.tsx
        └── page.tsx
```

## 🔧 Configuration Files

### 1. `middleware.ts` (Root Directory - Required)
**Location:** Must be in the root directory  
**Purpose:** Handles locale detection and routing

```typescript
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config/i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // Always show locale in URL: /en/..., /ar/...
  localeDetection: true   // Detect locale from Accept-Language header
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
```

**Why root?** Next.js requires middleware files to be in the root directory.

---

### 2. `config/i18n.ts`
**Location:** Can be in `config/` or root  
**Purpose:** Defines supported locales and default locale

```typescript
export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
```

**To add a new locale:**
1. Add it to the `locales` array: `['en', 'ar', 'fr']`
2. Create translation files: `src/messages/[page]/fr.json`

---

### 3. `config/i18n-request.ts`
**Location:** Can be in `config/` or root  
**Purpose:** Loads and merges translations from all page directories

```typescript
import { getRequestConfig } from 'next-intl/server';
import { locales } from './i18n';

const pageDirectories = ['home']; // Add new pages here

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  if (!locale || !locales.includes(locale as any)) {
    locale = 'en';
  }

  const messages: Record<string, any> = {};

  for (const page of pageDirectories) {
    try {
      const pageMessages = (await import(`../src/messages/${page}/${locale}.json`)).default;
      messages[page] = pageMessages;
    } catch (error) {
      console.error(`Failed to load messages for page "${page}" and locale "${locale}":`, error);
    }
  }

  return { locale, messages };
});
```

**Important:** Update the import path if you move this file!

---

### 4. `next.config.ts`
**Location:** Root directory (required)  
**Purpose:** Configures Next.js to use next-intl plugin

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./config/i18n-request.ts');

const nextConfig = {};

export default withNextIntl(nextConfig);
```

**Note:** Update the path if you move `i18n-request.ts`!

---

## 📝 Translation Files Structure

Each page has its own directory with locale-specific JSON files:

```
src/messages/
  ├── home/
  │   ├── en.json    { "title": "Welcome", "button": "Click me" }
  │   └── ar.json    { "title": "مرحباً", "button": "اضغط علي" }
  └── about/
      ├── en.json    { "title": "About Us", "description": "..." }
      └── ar.json    { "title": "من نحن", "description": "..." }
```

---

## 🚀 Usage

### In Server Components

```typescript
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

export default async function Page({ params }: { params: Promise<{ local: string }> }) {
  const { local } = await params;
  setRequestLocale(local);
  
  const t = await getTranslations('home'); // 'home' = page directory name
  
  return <h1>{t('title')}</h1>;
}
```

### In Client Components

```typescript
'use client';
import { useTranslations } from 'next-intl';

export default function ClientComponent() {
  const t = useTranslations('home');
  
  return <button>{t('button')}</button>;
}
```

---

## ➕ Adding a New Page

1. **Create translation directory:**
   ```bash
   mkdir -p src/messages/about
   ```

2. **Create translation files:**
   - `src/messages/about/en.json`
   - `src/messages/about/ar.json`

3. **Add to `config/i18n-request.ts`:**
   ```typescript
   const pageDirectories = ['home', 'about']; // Add 'about'
   ```

4. **Create page component:**
   ```typescript
   // app/[local]/about/page.tsx
   import { getTranslations } from 'next-intl/server';
   
   export default async function About({ params }) {
     const { local } = await params;
     const t = await getTranslations('about');
     return <h1>{t('title')}</h1>;
   }
   ```

---

## 🌐 URL Structure

- English: `http://localhost:3000/en/`
- Arabic: `http://localhost:3000/ar/`
- About page (English): `http://localhost:3000/en/about`
- About page (Arabic): `http://localhost:3000/ar/about`

The middleware automatically:
- Redirects `/` to `/en/` (or detected browser locale)
- Ensures locale is always in the URL
- Handles 404 for invalid locales

---

## 🔄 Adding a New Locale

1. **Update `config/i18n.ts`:**
   ```typescript
   export const locales = ['en', 'ar', 'fr'] as const;
   ```

2. **Create translation files for all pages:**
   ```bash
   mkdir -p src/messages/home/fr.json
   mkdir -p src/messages/about/fr.json
   # ... etc
   ```

3. **Update layout.tsx** (if needed for RTL/LTR):
   ```typescript
   <html lang={local} dir={local === 'ar' ? 'rtl' : 'ltr'}>
   ```

---

## 📚 Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)


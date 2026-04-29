---
name: theme-setup
description: >
  Interactive theme and design-token generator for new or existing projects.
  First scans the codebase for existing theme configs, colors, fonts, and
  styling tech — then asks the user whether to update or start fresh. Walks
  through styling technology, frontend framework, color palette, typography,
  spacing, radii, shadows, and breakpoints — then outputs matching config files
  plus a live preview component. Use this skill whenever the user says "set up
  a theme", "create a theme", "theme setup", "design tokens", "color scheme",
  "create color palette", "configure colors", "new project theme", "style
  config", "update my theme", "change my colors", "refactor theme", or anything
  about generating, updating, or auditing a design system, color variables, or
  theme configuration — even if they don't use the word "theme" explicitly.
  Also trigger when someone asks to "set up Tailwind colors", "create MUI
  theme", "generate CSS variables", "create SASS variables", or "audit my
  current theme".
---

# Theme Setup Skill

You are building a complete theme configuration for the user's project.
The process is **conversational** — ask questions **one at a time**, confirm
each answer, then move to the next. Never dump all questions at once.

---

## Step 0 — Codebase Discovery (run BEFORE asking anything)

Before the first question, silently scan the project to understand what
already exists. This shapes every question that follows — you can skip
questions whose answers are already obvious from the codebase, and you can
present the user with a clear "here's what I found" summary.

### What to search for

Use Glob and Grep (not shell find/grep) to look for:

**Styling technology signals:**
- `tailwind.config.*` — Tailwind CSS
- `postcss.config.*` — PostCSS (often paired with Tailwind)
- `*.scss`, `_variables.scss`, `_tokens.scss` — SASS
- `styled-components` or `@emotion` in `package.json` — CSS-in-JS
- `@mui/material` in `package.json` — MUI
- `:root {` blocks in `.css` files — CSS custom properties already in use

**Framework signals:**
- `package.json` → look for `react`, `next`, `vue`, `nuxt`, `@angular/core`,
  `svelte`, `astro`
- `tsconfig.json` / `jsconfig.json` → TypeScript or JS project
- `vite.config.*`, `webpack.config.*`, `next.config.*` — bundler clues

**Existing theme / token files:**
- Any file named `theme.*`, `tokens.*`, `variables.*`, `colors.*`,
  `design-tokens.*`, `palette.*`
- CSS/SCSS files with color definitions (`--color-`, `$color-`, `#hex` patterns)
- `tailwind.config.*` → check `theme.extend.colors`, `theme.extend.fontFamily`,
  `theme.extend.spacing`, etc. for existing customizations
- MUI `createTheme()` calls
- Styled-component / Emotion `ThemeProvider` usages

**Typography signals:**
- Font imports in HTML (`<link>` to Google Fonts / Bunny Fonts)
- `@import` or `@font-face` in CSS/SCSS
- `fontFamily` keys in Tailwind / MUI config
- Font packages in `package.json` (e.g. `@fontsource/*`)

### Present findings

After scanning, present a concise summary to the user:

```
Here's what I found in your project:

  Styling:    Tailwind CSS (tailwind.config.js with 14 custom colors)
  Framework:  React + Vite (TypeScript)
  Colors:     brand (#F28705, 10 shades), neutral, success, danger, warning
  Fonts:      Syne (display), Figtree (body) via Bunny Fonts
  Spacing:    Tailwind defaults (no custom overrides)
  Radius:     Default Tailwind
  Shadows:    Default Tailwind
  Breakpoints: 9 custom (mobileS → desktop)
```

Then ask the key question:

> **Would you like to update the existing theme setup, or start fresh?**
>
> - **Update** — I'll keep what works and only change what you want
> - **Fresh** — I'll build a brand-new theme from scratch (existing files
>   won't be deleted until you confirm)

If the user picks **Update**, pre-fill every subsequent question with the
current values as defaults. The user can confirm each one quickly or change
what they need. This makes the process much faster for projects that already
have a partial theme.

If the user picks **Fresh**, proceed with the normal interview flow but still
be aware of the existing setup so you can warn before overwriting files.

If **nothing is found** (empty or brand-new project), skip the summary and
go straight to Step 1.

---

## Interview Flow

Walk through these steps in order. For each step, present clear options
(use the AskQuestion tool when possible) and wait for the user's response
before proceeding. If Step 0 already identified the answer, show it as the
default and let the user confirm or change it.

### Step 1 — Styling Technology

Ask which styling approach the project uses. Offer at least these options and
allow the user to pick one or combine multiple:

- **Tailwind CSS** → generates `tailwind.config.js` / `tailwind.config.ts` theme extend
- **Plain CSS** → generates a `:root` custom-properties file
- **SASS / SCSS** → generates a `_variables.scss` partial
- **CSS Modules** → generates a `variables.module.css` file
- **MUI (Material UI)** → generates a `createTheme()` config object
- **Styled Components / Emotion** → generates a theme object file
- **Mix** → let the user specify the combination

### Step 2 — Frontend Framework

Ask which frontend framework is being used. This determines the preview
component format and any framework-specific config patterns:

- React (CRA / Vite)
- Next.js
- Vue 3
- Nuxt 3
- Angular
- Svelte / SvelteKit
- Astro
- Plain HTML / Vanilla JS
- Other (let them type)

### Step 3 — Color Palette

Ask the user to provide their **base colors**. For each color, ask:

1. **Color name** (e.g. "brand", "accent", "neutral")
2. **Base hex value** (e.g. `#F28705`)
3. **Number of shades** to generate (default: 10 — from 50 to 900, or the user can choose fewer/more)

Generate lighter and darker shades algorithmically from the base value.
Offer to show the palette before continuing so the user can tweak.

### Step 4 — Semantic Color Mapping

Once the raw palette exists, ask the user to assign **semantic roles**.
Present each role and let them pick from the palette or provide a new hex:

| Role | What it controls | Example |
|------|-----------------|---------|
| `primary` | Main brand actions, links, focus rings | brand-500 |
| `secondary` | Supporting actions, badges | accent-400 |
| `background` | Page / app background | neutral-50 or a custom dark value |
| `surface` | Cards, modals, elevated containers | neutral-100 |
| `text-primary` | Main body text | neutral-900 |
| `text-secondary` | Subtitles, captions, muted text | neutral-500 |
| `text-on-primary` | Text rendered on top of `primary` | white or dark |
| `border` | Default borders, dividers | neutral-200 |
| `success` | Positive feedback | green shade |
| `warning` | Caution states | amber/yellow shade |
| `danger` / `error` | Destructive actions, errors | red shade |
| `info` | Informational callouts | blue shade |

The user may add custom roles (e.g. `highlight`, `muted`, `overlay`).

Also ask: **Do you need a dark mode?** If yes, collect the dark-mode
counterpart for each semantic role (or offer to auto-generate inverted values).

### Step 5 — Typography

Ask about fonts and the type scale:

1. **Display / heading font** — family name (e.g. "Syne", "Playfair Display")
2. **Body font** — family name (e.g. "Inter", "Figtree")
3. **Monospace font** (optional) — for code blocks
4. **Font loading** — Google Fonts, Bunny Fonts, local files, system stack?
5. **Type scale** — offer presets or let the user define:
   - Minor Third (1.2)
   - Major Third (1.25)
   - Perfect Fourth (1.333)
   - Custom ratio
6. **Base font size** (default 16px)
7. **Font weights** to include (e.g. 400, 500, 600, 700)

### Step 6 — Spacing Scale

Ask whether they want:

- **Default 4px grid** (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96…)
- **8px grid** (8, 16, 24, 32, 48, 64, 96…)
- **Custom values** — let them list their own
- **Tailwind default** — use Tailwind's built-in spacing (if Tailwind was chosen)

### Step 7 — Border Radius

Ask for radius tokens:

- `none` (0)
- `sm` (e.g. 4px)
- `md` / `DEFAULT` (e.g. 8px)
- `lg` (e.g. 12px)
- `xl` (e.g. 16px)
- `2xl` (e.g. 24px)
- `full` (9999px)

Or let them provide custom values.

### Step 8 — Shadows

Ask how many shadow levels they need and what style:

- Subtle / minimal (low spread, low opacity)
- Elevated / material (medium spread)
- Dramatic / deep (large spread, colored shadows)
- Custom — let them define each level

Typical levels: `sm`, `DEFAULT`, `md`, `lg`, `xl`, `2xl`, `inner`.

### Step 9 — Breakpoints

Ask whether they want:

- **Framework defaults** (Tailwind, MUI, Bootstrap defaults)
- **Custom breakpoints** — let them name and set px values

### Step 10 — Output Location

Ask: **Where should I save the theme files?**

Suggest a sensible default based on the project structure (e.g. `src/styles/`,
`src/theme/`, project root for config files), but let the user override.

---

## Generation Phase

After all answers are collected, generate **two things**:

### 1. Configuration Files

Based on the styling technology, generate the appropriate config. Match the
format exactly to what the ecosystem expects:

| Tech | Output |
|------|--------|
| Tailwind | `tailwind.config.js` or `.ts` — extend `theme` with colors, fonts, spacing, radius, shadows, screens |
| Plain CSS | `theme.css` with `:root { --color-primary: …; --font-body: …; }` |
| SASS | `_variables.scss` with `$color-primary: …;` maps |
| CSS Modules | `variables.module.css` |
| MUI | `theme.ts` exporting a `createTheme()` call |
| Styled Components / Emotion | `theme.ts` exporting a typed theme object |

If the user picked a **mix**, generate multiple files and explain how they
connect (e.g. Tailwind config that references CSS custom properties).

If **dark mode** was requested, include both light and dark token sets and
show how to switch between them (CSS `prefers-color-scheme`, class toggle,
MUI `palette.mode`, etc.).

### 2. Preview Component

Generate a **theme showcase component** in the user's chosen framework:

- File format matches the framework (`.tsx` for React/Next, `.vue` for Vue/Nuxt, `.svelte`, `.component.ts` for Angular, `.astro`, or `.html`)
- Renders:
  - **Color swatches** — every palette color with its hex and token name
  - **Semantic colors** — each role shown on a sample element
  - **Typography samples** — each heading level, body, caption, mono
  - **Spacing visualization** — boxes showing each spacing step
  - **Radius samples** — boxes with each radius applied
  - **Shadow samples** — cards with each shadow level
  - **Button samples** — primary, secondary, danger, disabled states
  - **Dark mode toggle** (if dark mode was configured)
- Must actually import / use the generated theme so it serves as a living reference

The preview should look polished — it's both a test and a documentation page.

---

## After Generation

Once files are written:

1. List every file created with its path
2. Explain how to import / activate the theme in the user's project
3. If fonts need loading (Google Fonts link, npm package, etc.), provide the
   exact snippet or install command
4. Offer to tweak any value — "Want to adjust any colors, fonts, or spacing?"

---

## Important Guidelines

- **Always run Step 0 first.** Never skip the codebase scan — it's the foundation of every interaction. The user shouldn't have to tell you things the project already answers.
- **Ask one question at a time.** Never present the full interview as a wall of text.
- **Pre-fill from existing config.** When updating, every question's default should come from what's already in the codebase. The user confirms or overrides — this keeps the flow fast.
- **Show defaults.** Even for fresh setups, suggest sensible defaults so the user can just confirm if they're in a hurry.
- **Validate hex codes.** If a user provides an invalid color, ask again.
- **Generate real shades.** Use proper HSL lightness interpolation to create shades — don't just add white or black. Lighter shades should shift slightly warmer, darker shades cooler, just like professional palette tools.
- **Don't overwrite without asking.** If any target file already exists, confirm before writing. Show a diff summary of what will change.
- **Keep the preview self-contained.** The preview component should work with just the theme files — no extra dependencies beyond what the framework already provides.

# Recipe Box

[![Netlify Status](https://api.netlify.com/api/v1/badges/605cd493-aff3-4ab8-bdcc-6005d1ffae26/deploy-status)](https://app.netlify.com/projects/recipes-jxd/deploys)

Jannis & Daisy's family recipe collection, built as a fast, static Astro site.

**Live site: [recipes.jxd.one](https://recipes.jxd.one)**

## Features

- 🌍 **Trilingual** (English, German, French) with fully translated UI and recipe content, including per-locale tag translations
- 🔍 **Instant search** across recipe titles and tags
- 🏷️ **Tag browsing** with a dedicated tag index and per-tag recipe listing
- ⭐ **Favorites** — mark recipes as favorites and filter by them, stored locally in the browser
- 🧑‍🍳 **Cooking mode** — a distraction-free, step-by-step view with built-in timers for steps that need them
- 🛒 **Shopping list** — add recipe ingredients to a combined, checkable shopping list that persists across sessions
- 🌗 **Light/dark theme** toggle
- 📱 Responsive layout, tuned for both mobile and desktop navigation
- 🖨️ Print-friendly recipe pages and a native share button
- 🗺️ Auto-generated sitemap with locale alternates

## Tech stack

- [Astro](https://astro.build) (static site generation, content collections)
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript
- Hosted on [Netlify](https://www.netlify.com)

## Project structure

```text
/
├── public/                  # Static assets (favicon, etc.)
├── src/
│   ├── assets/recipes/      # Recipe images
│   ├── components/          # UI components (search, favorites, shopping list, etc.)
│   ├── content/recipes/     # Recipe content as Markdown (en/, de/, fr/)
│   ├── layouts/             # Shared page layout (nav, header, theme toggle)
│   ├── pages/               # Routes — en at the root, de/ and fr/ for other locales
│   ├── styles/              # Global styles
│   ├── utils/                # i18n, ingredient scaling, tag translation, etc.
│   └── content.config.ts    # Recipe content collection schema
└── package.json
```

## Adding a recipe

Recipes live as Markdown files in `src/content/recipes/` (English at the top level, German under `de/`, French under `fr/`), with frontmatter for title, tags, prep/cook time, servings, ingredients, and steps. See an existing recipe file for the exact shape, or `src/content.config.ts` for the full schema.

## Commands

All commands are run from the root of the project, from a terminal:

| Command             | Action                                      |
| :------------------- | :------------------------------------------ |
| `npm install`         | Installs dependencies                       |
| `npm run dev`         | Starts local dev server at `localhost:4321` |
| `npm run build`       | Builds the production site to `./dist/`     |
| `npm run preview`     | Previews the build locally before deploying |
| `npm run astro check` | Type-checks the project                     |

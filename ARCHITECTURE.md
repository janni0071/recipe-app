# Architecture

This document is the map of *how the app fits together* — the cross-cutting
patterns and conventions that span multiple files. For the *why* behind any
individual piece of non-obvious code, the inline comment next to it is the
source of truth; this file points you to where those live rather than
repeating them.

For setup, commands, and how to add a recipe, see the [README](./README.md).

## The big picture

Recipe Box is a fully **static** [Astro](https://astro.build) site — there is
no server or database at runtime. Everything is computed at build time
(`getCollection`, tag translation, similar-recipe ranking, image
optimization, JSON-LD) and shipped as plain HTML/CSS/JS. Anything dynamic
(favorites, shopping list, checked ingredients, theme, cooking mode) is
**client-only state in `localStorage`**, layered on top of the static pages.

Navigation uses Astro's `<ClientRouter />` (a SPA-style swap), which is the
single most important thing to understand before touching any client script —
see [Client-side interactivity](#client-side-interactivity) below.

## Directory layout

```text
src/
├── content/recipes/     # Recipe content as Markdown — en/ at top level, de/ and fr/ subdirs
├── content.config.ts    # Zod schema for the recipe collection
├── pages/               # Routes: en at root, de/ and fr/ mirror the same tree
├── layouts/BaseLayout.astro   # The single shared shell (head, nav, footer, all global scripts)
├── components/          # UI building blocks (cards, buttons, lists, search)
├── utils/               # Build-time pure helpers (i18n, ingredients, steps, tags, schema, images)
├── styles/global.css    # Global styles + the cooking-mode custom variants
└── assets/recipes/      # Recipe hero images
integrations/
└── strip-inline-script-comments.mjs   # Build step that minifies inline scripts (see Build pipeline)
```

## Content model

Each recipe is a Markdown file with frontmatter validated by
`src/content.config.ts` (title, date, tags, prep/cook time, servings,
`ingredients` as grouped items, `steps` with optional `timerSeconds`).

**A single dish is up to three files** — `foo.md`, `de/foo.md`, `fr/foo.md` —
sharing the same base slug. That shared slug is what ties the translations
together everywhere: locale switching, favorites, and the shopping list are
all keyed by the **locale-agnostic slug**, so the same dish is "the same
recipe" in any language.

**Tag translation is positional.** `utils/tags.ts` pairs a recipe with its
translations and zips their `tags` arrays by index — index *N* in one locale
is assumed to be the same tag as index *N* in another. Authors must keep
translated tags in the same order. (Full rationale in `utils/tags.ts`.)

## Routing & i18n

- **English is the default locale** and lives at the root (`prefixDefaultLocale: false`
  in `astro.config.mjs`); German and French are served under `/de/` and `/fr/`.
- **Page files are duplicated per locale** (`pages/`, `pages/de/`, `pages/fr/`)
  rather than parameterized. Each variant hardcodes its locale — filters the
  collection to its own recipes, calls `useTranslations('de')`, etc. It's
  deliberate duplication: three small mirror files instead of one file full of
  locale branching. When you change a page's structure, change all three.
- **UI strings** live in one place: the `ui` table in `utils/i18n.ts`, keyed by
  dotted string keys. `useTranslations(locale)` returns a `t()` that falls back
  to English for any missing key.

## Client-side interactivity

All interactivity is plain `is:inline` scripts — no framework, no hydration.
Because navigation goes through `<ClientRouter />`, these scripts follow a
strict set of conventions. Get these wrong and things break in subtle,
navigation-only ways.

**1. Re-initialize on `astro:page-load`.** This event fires on the first load
*and* after every SPA navigation. Any setup that touches the current page's DOM
(binding a button, reading data attributes) must run from it, or it won't run
after a client-side navigation.

**2. Astro dedupes byte-identical inline scripts** and won't re-execute one
whose exact text already ran this session. Two consequences:

- **Don't use `define:vars`** to bake page data into a script. On a page that
  produces byte-identical script text (e.g. revisiting the same locale), the
  script is skipped and the baked-in data goes stale. Instead, pass data as
  **DOM attributes** or a **JSON `<script type="application/json">` island**,
  and have the (structurally-shared) script read it fresh each time. See
  `SearchBar.astro` and `shopping-list.astro`.
- **Guard listeners that must bind only once** (document-level delegation,
  `window`/`document` listeners) with a `window.__somethingBound` flag, since
  the same script re-runs on every navigation. See the `__*Bound` flags across
  `BaseLayout.astro`, `StepList.astro`, `CookingModeButton.astro`.

**3. Prefer event delegation on `document`** for controls that are re-rendered
on every navigation (favorites, shopping-list, timer buttons) — bind once,
match with `closest()`, rather than per-element bindings that would need
re-attaching each swap.

**4. Favorites / shopping-list clicks use the capture phase.** `<ClientRouter />`
registers its own bubble-phase click listener that starts navigating the moment
it sees an unprevented anchor click. To intercept a click on an anchor-wrapped
card *before* that fires, the handlers in `BaseLayout.astro` listen in the
**capture** phase so their `stopPropagation()` actually takes effect.

## Persistent (client) state

All persisted state is `localStorage`, and everything recipe-scoped is keyed by
the **locale-agnostic slug** so it survives language switches. Keys:

| Key                     | Shape                                  | Written by |
| :---------------------- | :------------------------------------- | :--------- |
| `theme-preference`      | `'light' \| 'dark'` (defaults to dark) | `BaseLayout.astro` |
| `favorite-recipes`      | `string[]` of slugs                    | `BaseLayout.astro` |
| `shopping-list`         | `{ slug, servings }[]`                 | `BaseLayout.astro`, `shopping-list.astro` |
| `shopping-list-checked` | `string[]` of merged-ingredient keys   | `shopping-list.astro` |
| `checked-ingredients`   | `{ [slug]: string[] }` (per-recipe)    | `IngredientList.astro` |

The shopping list captures the servings count *at the moment a recipe is added*
so a dish added at 2× stays scaled on the list. Ingredients across recipes are
only auto-summed when they share both name **and** unit — mismatched units are
kept as separate lines rather than guessing a conversion (see `shopping-list.astro`).

## Cooking mode

A distraction-free, step-at-a-time reading mode toggled from the recipe page.
Two separate `<html>` classes drive it (both defined as custom variants in
`global.css`):

- **`cooking-mode`** — everything that *doesn't* change page height: colors,
  text fills, icons, backdrops. Toggled **instantly** on tap.
- **`cooking-mode-layout`** — everything that *does* change height: hiding the
  header/footer/tags/similar section, the step list's one-at-a-time collapse,
  per-step timers, the ingredient font-size bump. Toggled **a beat later**.

The split exists because of the **entry/exit wipe animation**
(`CookingModeButton.astro`): a circular reveal grows from the tap point. Any
height change mid-wipe would desync the frozen snapshot from the live page, so
all height-affecting changes are deferred until the wipe finishes.
`cooking-mode-layout` changes are broadcast to the other scripts via a
`cookingmodechange` `CustomEvent` (its `detail.active` is in lockstep with that
class). The wipe itself is a hand-rolled masked DOM clone rather than
`document.startViewTransition()` — the long comment at the top of the click
handler in `CookingModeButton.astro` explains why (mobile browsers abort view
transitions when the URL bar resizes on tap).

## Images

Recipe heroes go through several coordinated tricks (all build- or
`BaseLayout`-driven):

- **Blur placeholders** — `utils/imagePlaceholder.ts` uses `sharp` to inline a
  tiny base64 preview as a CSS background, so the real image fades in over
  something instead of a flat color.
- **Hero preloading** — cards expose `data-hero-src`; `BaseLayout.astro`
  `fetch()`es it at low priority once a card has dwelled on screen, so the
  detail page's hero is already cached on click. Cards visible at load skip the
  dwell delay.
- **Fade-in + view transitions** — `BaseLayout.astro` reveals images on load
  and strips the placeholder before the View Transition snapshot is captured, so
  a cached image doesn't show its blur behind the morphing hero.

## SEO

- **JSON-LD `Recipe` schema** is built per detail page by `utils/recipeSchema.ts`
  (durations parsed to ISO-8601, ingredient/step text flattened).
- **Sitemap** with per-locale alternates is generated by `@astrojs/sitemap`
  (configured in `astro.config.mjs`, 404 excluded).

## Progressive Web App (offline)

The site is installable and works offline via a hand-rolled service worker
(`public/sw.js`) — no Workbox, to keep the build a plain `astro build` and the
logic readable. It is registered once from `BaseLayout.astro` (guarded by a
`window.__swRegistered` flag, since that inline script re-runs on every
navigation).

The whole caching design turns on one split:

- **HTML pages → network-first.** Online, you always get the freshly-deployed
  page; the cache is only a fallback when the network is gone. This is what
  prevents a stale page being served after a deploy. Crucially, this must also
  catch `<ClientRouter/>`'s SPA navigations, which `fetch()` the next page's
  HTML and are *not* `request.mode === 'navigate'` — so "is this HTML?" is
  detected by **URL shape** (extensionless / trailing slash) rather than by mode.
- **Hashed assets (`/_astro/*`, icons, images) → cache-first** (stale-while-
  revalidate). Their filenames are content-hashed, so a cached copy is never
  wrong.

`src/pages/offline.astro` is the fallback for routes never visited while online.
It is **precached on install** and deliberately **standalone** (its own inline
CSS, not the global hashed stylesheet) so it renders correctly with no other
cached asset. Like `404.astro`, it bakes in all three locales and swaps by URL
client-side. Bump `CACHE_VERSION` in `sw.js` to force every client to drop its
old cache on activate. The manifest, icons (generated by
`scripts/generate-pwa-icons.mjs`), and Apple/theme-color meta live in
`public/manifest.webmanifest` and `BaseLayout.astro`'s `<head>`.

## Build pipeline

Standard `astro build`, plus one custom integration:
`integrations/strip-inline-script-comments.mjs` runs at `astro:build:done` and
minifies whitespace/comments out of every `is:inline` script in the emitted
HTML.

This is *why the inline scripts can afford to be so heavily commented* — the
commentary is stripped from production output, so it costs zero shipped bytes.
Because Astro's runtime script dedup relies on byte-identical text, the
integration caches by source string so the same script always minifies
identically.

## A note on comments

Most of this codebase's hard-won knowledge lives in inline comments, and that's
deliberate: they explain *why* a specific, non-obvious line is the way it is
(a browser quirk, a race condition, an ordering constraint), tightly coupled to
the code they describe. This document intentionally does **not** duplicate them —
it captures the connective tissue *between* files. When the two disagree, the
inline comment wins, and this file should be updated.

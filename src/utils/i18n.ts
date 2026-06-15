export const languages = {
  en: { code: 'en', label: 'English' },
  de: { code: 'de', label: 'Deutsch' },
  fr: { code: 'fr', label: 'Français' },
} as const;

export type Locale = keyof typeof languages;

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.tags': 'Tags',
    'page.index.title': 'All Recipes',
    'page.index.heading': 'Our Recipe Collection 🧑‍🍳',
    'page.tags.title': 'All Tags',
    'page.tags.heading': 'Browse by Tag',
    'page.tag.heading': 'Recipes tagged',
    'page.tag.count': 'recipe(s)',
    'footer.copyright': 'Our Recipe Collection',
    'search.placeholder': 'Search for recipes...',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.tags': 'Tags',
    'page.index.title': 'Alle Rezepte',
    'page.index.heading': 'Unsere Rezeptsammlung 🧑‍🍳',
    'page.tags.title': 'Alle Tags',
    'page.tags.heading': 'Nach Tag durchsuchen',
    'page.tag.heading': 'Rezepte mit Tag',
    'page.tag.count': 'Rezept(e)',
    'footer.copyright': 'Unsere Rezeptsammlung',
    'search.placeholder': 'Rezepte suchen...',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.tags': 'Tags',
    'page.index.title': 'Toutes les Recettes',
    'page.index.heading': 'Notre Collection de Recettes 🧑‍🍳',
    'page.tags.title': 'Tous les Tags',
    'page.tags.heading': 'Parcourir par tag',
    'page.tag.heading': 'Recettes avec le tag',
    'page.tag.count': 'recette(s)',
    'footer.copyright': 'Notre Collection de Recettes',
    'search.placeholder': 'Chercher des recettes...',
  },
} as const;

export type UIKey = keyof typeof ui.en;

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui.en[key];
  };
}

/** Returns the root path for a given locale. */
export function getLocalePath(locale: Locale): string {
  return locale === 'en' ? '/' : `/${locale}/`;
}

/** Returns the tags index path for a given locale. */
export function getTagsPath(locale: Locale): string {
  return locale === 'en' ? '/tags' : `/${locale}/tags`;
}

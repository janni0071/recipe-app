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
    'page.index.heading': "Jannis & Daisy's Recipes 🧑‍🍳",
    'page.tags.title': 'All Tags',
    'page.tags.heading': 'Browse by Tag',
    'page.tag.heading': 'Recipes tagged',
    'page.tag.count': 'recipe(s)',
    'footer.copyright': 'Jannis ♡ Daisy',
    'search.placeholder': 'Search for recipes...',
    'search.noResults': 'No matches found',
    '404.heading': "Oops! We haven't cooked this one yet.",
    '404.message': "This page doesn't exist — but Jannis & Daisy are probably in the kitchen working on something delicious.",
    '404.cta': '← Back to the recipes',
    'page.recipe.ingredients': 'Ingredients',
    'page.recipe.servings': 'servings',
    'page.recipe.prep': 'Prep',
    'page.recipe.cook': 'Cook/Bake',
    'page.recipe.similar': 'Similar Recipes',
    'page.recipe.share': 'Share recipe',
    'page.recipe.linkCopied': 'Link copied!',
    'page.recipe.print': 'Print recipe',
    'page.recipe.favorite': 'Toggle favorite',
    'page.index.favoritesOnly': 'Favorites only',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.tags': 'Tags',
    'page.index.title': 'Alle Rezepte',
    'page.index.heading': "Jannis & Daisys Rezepte 🧑‍🍳",
    'page.tags.title': 'Alle Tags',
    'page.tags.heading': 'Nach Tag durchsuchen',
    'page.tag.heading': 'Rezepte mit Tag',
    'page.tag.count': 'Rezept(e)',
    'footer.copyright': 'Jannis ♡ Daisy',
    'search.placeholder': 'Rezepte suchen...',
    'search.noResults': 'Keine Treffer gefunden',
    '404.heading': 'Hoppla! Das haben wir noch nicht gekocht.',
    '404.message': 'Diese Seite gibt es nicht — aber Jannis & Daisy stehen wahrscheinlich gerade in der Küche und kochen etwas Leckeres.',
    '404.cta': '← Zurück zu den Rezepten',
    'page.recipe.ingredients': 'Zutaten',
    'page.recipe.servings': 'Portionen',
    'page.recipe.prep': 'Vorbereitung',
    'page.recipe.cook': 'Garzeit',
    'page.recipe.similar': 'Ähnliche Rezepte',
    'page.recipe.share': 'Rezept teilen',
    'page.recipe.linkCopied': 'Link kopiert!',
    'page.recipe.print': 'Rezept drucken',
    'page.recipe.favorite': 'Favorit umschalten',
    'page.index.favoritesOnly': 'Nur Favoriten',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.tags': 'Tags',
    'page.index.title': 'Toutes les Recettes',
    'page.index.heading': "Les Recettes de Jannis & Daisy 🧑‍🍳",
    'page.tags.title': 'Tous les Tags',
    'page.tags.heading': 'Parcourir par tag',
    'page.tag.heading': 'Recettes avec le tag',
    'page.tag.count': 'recette(s)',
    'footer.copyright': 'Jannis ♡ Daisy',
    'search.placeholder': 'Chercher des recettes...',
    'search.noResults': 'Aucun résultat trouvé',
    '404.heading': "Oups ! On n'a pas encore cuisiné ça.",
    '404.message': "Cette page n'existe pas — mais Jannis & Daisy sont sûrement en cuisine en train de préparer quelque chose de délicieux.",
    '404.cta': '← Retour aux recettes',
    'page.recipe.ingredients': 'Ingrédients',
    'page.recipe.servings': 'portions',
    'page.recipe.prep': 'Préparation',
    'page.recipe.cook': 'Cuisson',
    'page.recipe.similar': 'Recettes similaires',
    'page.recipe.share': 'Partager la recette',
    'page.recipe.linkCopied': 'Lien copié !',
    'page.recipe.print': 'Imprimer la recette',
    'page.recipe.favorite': 'Basculer le favori',
    'page.index.favoritesOnly': 'Favoris uniquement',
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

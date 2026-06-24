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
    'nav.shoppingList': 'Shopping list',
    'page.index.title': 'All Recipes',
    'page.index.heading': '{names} Recipes',
    'page.index.headingNames': "Jannis & Daisy's",
    'page.tags.title': 'All Tags',
    'page.tags.heading': 'Browse by Tag',
    'page.tag.heading': 'Recipes tagged',
    'page.tag.count': 'recipe(s)',
    'page.tag.allTags': '← All tags',
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
    'page.recipe.cookingMode': 'Cooking mode',
    'page.recipe.exitCookingMode': 'Exit cooking mode',
    'page.index.favoritesOnly': 'Favorites only',
    'page.recipe.steps': 'Steps',
    'page.recipe.prevStep': 'Previous step',
    'page.recipe.nextStep': 'Next step',
    'page.recipe.stepProgress': 'Step {current} of {total}',
    'page.recipe.startTimer': 'Start timer',
    'page.recipe.cancelTimer': 'Cancel timer',
    'page.recipe.timerDone': "Time's up!",
    'page.recipe.shoppingList': 'Add to shopping list',
    'page.shoppingList.title': 'Shopping List',
    'page.shoppingList.heading': 'Shopping List',
    'page.shoppingList.empty': 'Your shopping list is empty. Add recipes from their pages to get started.',
    'page.shoppingList.yourRecipes': 'Recipes in your list',
    'page.shoppingList.combined': 'Combined shopping list',
    'page.shoppingList.remove': 'Remove',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.tags': 'Tags',
    'nav.shoppingList': 'Einkaufsliste',
    'page.index.title': 'Alle Rezepte',
    'page.index.heading': '{names} Rezepte',
    'page.index.headingNames': 'Jannis & Daisys',
    'page.tags.title': 'Alle Tags',
    'page.tags.heading': 'Nach Tag durchsuchen',
    'page.tag.heading': 'Rezepte mit Tag',
    'page.tag.count': 'Rezept(e)',
    'page.tag.allTags': '← Alle Tags',
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
    'page.recipe.cookingMode': 'Kochmodus',
    'page.recipe.exitCookingMode': 'Kochmodus beenden',
    'page.index.favoritesOnly': 'Nur Favoriten',
    'page.recipe.steps': 'Zubereitung',
    'page.recipe.prevStep': 'Vorheriger Schritt',
    'page.recipe.nextStep': 'Nächster Schritt',
    'page.recipe.stepProgress': 'Schritt {current} von {total}',
    'page.recipe.startTimer': 'Timer starten',
    'page.recipe.cancelTimer': 'Timer abbrechen',
    'page.recipe.timerDone': 'Zeit ist abgelaufen!',
    'page.recipe.shoppingList': 'Zur Einkaufsliste hinzufügen',
    'page.shoppingList.title': 'Einkaufsliste',
    'page.shoppingList.heading': 'Einkaufsliste',
    'page.shoppingList.empty': 'Deine Einkaufsliste ist leer. Füge Rezepte über ihre Seite hinzu, um zu starten.',
    'page.shoppingList.yourRecipes': 'Rezepte in deiner Liste',
    'page.shoppingList.combined': 'Kombinierte Einkaufsliste',
    'page.shoppingList.remove': 'Entfernen',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.tags': 'Tags',
    'nav.shoppingList': 'Liste de courses',
    'page.index.title': 'Toutes les Recettes',
    'page.index.heading': 'Les Recettes de {names}',
    'page.index.headingNames': 'Jannis & Daisy',
    'page.tags.title': 'Tous les Tags',
    'page.tags.heading': 'Parcourir par tag',
    'page.tag.heading': 'Recettes avec le tag',
    'page.tag.count': 'recette(s)',
    'page.tag.allTags': '← Tous les tags',
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
    'page.recipe.cookingMode': 'Mode cuisine',
    'page.recipe.exitCookingMode': 'Quitter le mode cuisine',
    'page.index.favoritesOnly': 'Favoris uniquement',
    'page.recipe.steps': 'Étapes',
    'page.recipe.prevStep': 'Étape précédente',
    'page.recipe.nextStep': 'Étape suivante',
    'page.recipe.stepProgress': 'Étape {current} sur {total}',
    'page.recipe.startTimer': 'Démarrer le minuteur',
    'page.recipe.cancelTimer': 'Annuler le minuteur',
    'page.recipe.timerDone': "Le temps est écoulé !",
    'page.recipe.shoppingList': 'Ajouter à la liste de courses',
    'page.shoppingList.title': 'Liste de courses',
    'page.shoppingList.heading': 'Liste de courses',
    'page.shoppingList.empty': 'Votre liste de courses est vide. Ajoutez des recettes depuis leur page pour commencer.',
    'page.shoppingList.yourRecipes': 'Recettes dans votre liste',
    'page.shoppingList.combined': 'Liste de courses combinée',
    'page.shoppingList.remove': 'Retirer',
  },
} as const;

export type UIKey = keyof typeof ui.en;

export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui.en[key];
  };
}

/** Splits the homepage heading template around the {names} placeholder so it can be styled separately. */
export function getIndexHeadingParts(locale: Locale): { before: string; names: string; after: string } {
  const t = useTranslations(locale);
  const [before, after] = t('page.index.heading').split('{names}');
  return { before, names: t('page.index.headingNames'), after };
}

/** Returns the root path for a given locale. */
export function getLocalePath(locale: Locale): string {
  return locale === 'en' ? '/' : `/${locale}/`;
}

/** Returns the tags index path for a given locale. */
export function getTagsPath(locale: Locale): string {
  return locale === 'en' ? '/tags' : `/${locale}/tags`;
}

/** Returns the shopping list path for a given locale. */
export function getShoppingListPath(locale: Locale): string {
  return locale === 'en' ? '/shopping-list' : `/${locale}/shopping-list`;
}

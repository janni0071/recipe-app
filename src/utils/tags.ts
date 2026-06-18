import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';

const locales: Locale[] = ['en', 'de', 'fr'];

/** Maps a tag in one locale to its translated form in another, e.g. tagMap.en.de['baking'] === 'backen'. */
type TagMap = Record<Locale, Record<Locale, Record<string, string>>>;

function localeOf(id: string): Locale {
  if (id.startsWith('de/')) return 'de';
  if (id.startsWith('fr/')) return 'fr';
  return 'en';
}

function baseSlugOf(id: string, locale: Locale): string {
  const withoutLocale = locale === 'en' ? id : id.slice(locale.length + 1);
  return withoutLocale.replace(/\.md$/, '');
}

let cached: TagMap | null = null;

/**
 * Builds a cross-locale tag map by pairing each recipe with its translations and
 * zipping their `tags` arrays positionally — content authors keep translated tags
 * in the same order as the original, so index N in one locale is index N in another.
 * Computed once per build (this is a static site, so there's no runtime cost).
 */
export async function getTagTranslations(): Promise<TagMap> {
  if (cached) return cached;

  const recipes = await getCollection('recipes');
  const bySlug = new Map<string, Partial<Record<Locale, CollectionEntry<'recipes'>>>>();

  for (const recipe of recipes) {
    const locale = localeOf(recipe.id);
    const slug = baseSlugOf(recipe.id, locale);
    const group = bySlug.get(slug) ?? {};
    group[locale] = recipe;
    bySlug.set(slug, group);
  }

  const map: TagMap = {
    en: { en: {}, de: {}, fr: {} },
    de: { en: {}, de: {}, fr: {} },
    fr: { en: {}, de: {}, fr: {} },
  };

  for (const group of bySlug.values()) {
    for (const from of locales) {
      const fromRecipe = group[from];
      if (!fromRecipe) continue;
      for (const to of locales) {
        if (from === to) continue;
        const toRecipe = group[to];
        if (!toRecipe) continue;
        fromRecipe.data.tags.forEach((tag, i) => {
          const translated = toRecipe.data.tags[i];
          if (translated && !(tag in map[from][to])) {
            map[from][to][tag] = translated;
          }
        });
      }
    }
  }

  cached = map;
  return map;
}

import type { CollectionEntry } from 'astro:content';

/**
 * Ranks other recipes in the same locale by how many tags they share with
 * `recipe`, dropping anything with zero overlap. Computed entirely at build
 * time (this is a static site), so it costs nothing at request time.
 */
export function getSimilarRecipes(
  recipe: CollectionEntry<'recipes'>,
  localeRecipes: CollectionEntry<'recipes'>[],
  limit = 3
): CollectionEntry<'recipes'>[] {
  const tags = new Set(recipe.data.tags);

  return localeRecipes
    .filter((other) => other.id !== recipe.id)
    .map((other) => ({
      recipe: other,
      score: other.data.tags.filter((tag) => tags.has(tag)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.recipe.data.date.getTime() - a.recipe.data.date.getTime())
    .slice(0, limit)
    .map((entry) => entry.recipe);
}

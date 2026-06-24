import type { IngredientGroup } from './ingredients';
import { formatIngredientText } from './ingredients';
import type { Step } from './steps';
import { stepPlainText } from './steps';

/**
 * Converts "45 min" / "30-35 min" style strings into ISO 8601 durations
 * (e.g. "PT45M"). Ranges use the upper bound, so an estimate never
 * undersells how long something might actually take. Returns undefined for
 * anything that doesn't cleanly match — schema.org's time fields are
 * optional, and omitting one is far safer than emitting a wrong value.
 */
export function parseDurationToISO8601(text: string): string | undefined {
  const range = text.match(/^(\d+)\s*-\s*(\d+)\s*min$/i);
  if (range) return `PT${range[2]}M`;
  const single = text.match(/^(\d+)\s*min$/i);
  if (single) return `PT${single[1]}M`;
  return undefined;
}

function sumDurations(a?: string, b?: string): string | undefined {
  if (!a || !b) return undefined;
  const minutesOf = (iso: string) => parseInt(iso.match(/PT(\d+)M/)?.[1] ?? '0', 10);
  return `PT${minutesOf(a) + minutesOf(b)}M`;
}

export interface RecipeJsonLdInput {
  name: string;
  description: string;
  imageUrl?: string;
  authorName?: string;
  datePublished: Date;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredientGroups: IngredientGroup[];
  steps: Step[];
  pageUrl: string;
  locale: string;
}

export function buildRecipeJsonLd(input: RecipeJsonLdInput): Record<string, unknown> {
  const prepIso = parseDurationToISO8601(input.prepTime);
  const cookIso = parseDurationToISO8601(input.cookTime);

  return {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: input.name,
    description: input.description,
    ...(input.imageUrl && { image: [input.imageUrl] }),
    ...(input.authorName && { author: { '@type': 'Person', name: input.authorName } }),
    datePublished: input.datePublished.toISOString().slice(0, 10),
    ...(prepIso && { prepTime: prepIso }),
    ...(cookIso && { cookTime: cookIso }),
    ...(sumDurations(prepIso, cookIso) && { totalTime: sumDurations(prepIso, cookIso) }),
    recipeYield: String(input.servings),
    recipeIngredient: input.ingredientGroups.flatMap((group) => group.items.map(formatIngredientText)),
    recipeInstructions: input.steps.map((step) => ({
      '@type': 'HowToStep',
      text: stepPlainText(step.text),
      ...(step.timerSeconds && { timeRequired: `PT${step.timerSeconds}S` }),
    })),
    url: input.pageUrl,
    inLanguage: input.locale,
  };
}

import type { IngredientGroup } from './ingredients';
import { formatIngredientText } from './ingredients';

/**
 * Extracts step text from a recipe's raw markdown body. Ingredients live in
 * frontmatter now, so the body is just a heading followed by a numbered
 * list — any non-numbered, non-heading line is treated as a continuation of
 * the previous step, since some recipes hard-wrap a single step across
 * multiple lines.
 */
export function parseStepsFromMarkdown(body: string): string[] {
  const steps: string[] = [];
  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = line.match(/^\d+\.\s+(.*)/);
    if (match) {
      steps.push(match[1]);
    } else if (!line.startsWith('#') && steps.length > 0) {
      steps[steps.length - 1] += ` ${line}`;
    }
  }
  return steps;
}

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
  stepsMarkdownBody: string;
  pageUrl: string;
  locale: string;
}

export function buildRecipeJsonLd(input: RecipeJsonLdInput): Record<string, unknown> {
  const prepIso = parseDurationToISO8601(input.prepTime);
  const cookIso = parseDurationToISO8601(input.cookTime);
  const steps = parseStepsFromMarkdown(input.stepsMarkdownBody);

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
    recipeInstructions: steps.map((text) => ({ '@type': 'HowToStep', text })),
    url: input.pageUrl,
    inLanguage: input.locale,
  };
}

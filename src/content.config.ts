import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const ingredientItem = z.object({
  amount: z.number().optional(),
  amountMax: z.number().optional(),
  unit: z.string().optional(),
  name: z.string(),
});

const ingredientGroup = z.object({
  heading: z.string().optional(),
  items: z.array(ingredientItem),
});

const recipesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/recipes" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    prepTime: z.string(),
    cookTime: z.string(),
    servings: z.number(),
    image: z.string().optional(),
    author: z.string().optional(),
    ingredients: z.array(ingredientGroup),
  }),
});

export const collections = {
  recipes: recipesCollection,
};

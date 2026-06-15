import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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
  }),
});

export const collections = {
  recipes: recipesCollection,
};

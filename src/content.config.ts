import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders"; // Import the glob loader

const recipesCollection = defineCollection({
  // Remove the `type: 'content'` line from your old file
  loader: glob({ pattern: "**/*.md", base: "./src/content/recipes" }), // Add the glob loader
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
    prepTime: z.string(),
    cookTime: z.string(),
    servings: z.number(),
    image: z.string().optional(),
  }),
});

export const collections = {
  recipes: recipesCollection,
};

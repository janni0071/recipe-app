import { defineCollection, z } from "astro:content";

const recipesCollection = defineCollection({
  type: "content",
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

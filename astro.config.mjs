// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://recipes.jxd.one",
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "fr"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

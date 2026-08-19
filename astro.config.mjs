// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import stripInlineScriptComments from "./integrations/strip-inline-script-comments.mjs";
import securityHeaders from "./integrations/security-headers.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://recipes.jxd.one",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404") && !page.includes("/offline"),
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          de: "de",
          fr: "fr",
        },
      },
    }),
    stripInlineScriptComments(),
    // Must come after stripInlineScriptComments so the CSP hashes it emits
    // match the minified inline scripts that actually ship.
    securityHeaders(),
  ],
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

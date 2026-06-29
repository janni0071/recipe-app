import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as esbuild from "esbuild";

// Matches <script> tags with no `src`/`type` attribute, i.e. is:inline
// scripts. JSON-LD, JSON data islands, and module/external scripts are
// excluded since they aren't plain JS (or are already minified by Vite).
const INLINE_SCRIPT = /<script(?![^>]*\s(?:src|type)\s*=)([^>]*)>([\s\S]*?)<\/script>/gi;

async function collectHtmlFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dirPath, entry.name);
      if (entry.isDirectory()) return collectHtmlFiles(full);
      return entry.name.endsWith(".html") ? [full] : [];
    }),
  );
  return files.flat();
}

export default function stripInlineScriptComments() {
  return {
    name: "strip-inline-script-comments",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const htmlFiles = await collectHtmlFiles(outDir);
        // Astro dedupes identical inline scripts across pages at runtime to
        // skip re-execution on client-side navigations, so the same source
        // must always minify to the same output - cache it once per build.
        const cache = new Map();
        let savedBytes = 0;

        for (const file of htmlFiles) {
          const html = await readFile(file, "utf8");
          let changed = false;

          const next = html.replace(INLINE_SCRIPT, (match, attrs, body) => {
            if (!body.trim()) return match;
            let result = cache.get(body);
            if (result === undefined) {
              try {
                result = esbuild.transformSync(body, { loader: "js", minifyWhitespace: true }).code.trim();
              } catch {
                result = body;
              }
              cache.set(body, result);
            }
            if (result !== body) {
              changed = true;
              savedBytes += body.length - result.length;
            }
            return `<script${attrs}>${result}</script>`;
          });

          if (changed) {
            await writeFile(file, next, "utf8");
          }
        }

        logger.info(`stripped inline <script> comments/whitespace, saving ~${(savedBytes / 1024).toFixed(1)}KB raw across ${htmlFiles.length} pages`);
      },
    },
  };
}

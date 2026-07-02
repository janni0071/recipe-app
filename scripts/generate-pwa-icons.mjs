// One-off generator for the PWA/app icons, run by hand when the brand mark
// changes: `node scripts/generate-pwa-icons.mjs`. It rasterizes two SVG
// sources with sharp (already a dependency) into public/icons/. The outputs
// are committed, so the build itself stays a plain `astro build` with no
// image-generation step.
//
// Two sources because maskable/apple icons must be *full-bleed* (the OS masks
// them into a circle/squircle and clips anything past its safe zone), whereas
// the "any"-purpose icons keep the rounded-tile look of the favicon.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
await mkdir(outDir, { recursive: true });

// Rounded tile — matches favicon.svg. Transparent corners are fine for the
// "any" purpose (browsers don't mask these).
const rounded = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#ec4899"/>
  <text x="264" y="330" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="216" font-weight="800" letter-spacing="-8"><tspan fill="#ffffff">J</tspan><tspan fill="#f9a8d4">X</tspan><tspan fill="#ffffff">D</tspan></text>
</svg>`;

// Full-bleed square for maskable + apple-touch. No rounded corners (the OS
// supplies the mask), and the mark is pulled in to sit inside the ~80% safe
// zone so a circular mask never clips it.
const fullBleed = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#ec4899"/>
  <text x="264" y="322" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="184" font-weight="800" letter-spacing="-7"><tspan fill="#ffffff">J</tspan><tspan fill="#f9a8d4">X</tspan><tspan fill="#ffffff">D</tspan></text>
</svg>`;

const jobs = [
  { svg: rounded, size: 192, file: 'icon-192.png' },
  { svg: rounded, size: 512, file: 'icon-512.png' },
  { svg: fullBleed, size: 512, file: 'icon-maskable-512.png' },
  { svg: fullBleed, size: 180, file: 'apple-touch-icon.png' },
];

for (const { svg, size, file } of jobs) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(join(outDir, file));
  console.log('wrote', `public/icons/${file}`, `(${size}×${size})`);
}

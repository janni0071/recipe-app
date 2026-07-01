import sharp from 'sharp';
import type { ImageMetadata } from 'astro';

// Astro attaches `fsPath` (the original file's location on disk) to ESM-imported
// images for its own internal asset hashing, but doesn't expose it in the public
// ImageMetadata type. Guarded below so a future Astro version that renames or
// drops it just disables placeholders instead of breaking the build.
type LocalImage = ImageMetadata & { fsPath?: string };

const cache = new Map<string, string | null>();

/**
 * Generates a tiny, low-quality base64-encoded preview of `image`, sized for
 * the aspect ratio of `width`x`height`. Inlined directly in HTML, it renders
 * instantly with zero network requests, so the real image has something to
 * fade in over instead of a flat placeholder color while it loads.
 */
export async function getBlurPlaceholder(image: LocalImage, width: number, height: number): Promise<string | null> {
  if (typeof image.fsPath !== 'string') return null;

  const key = `${image.fsPath}:${width}x${height}`;
  if (cache.has(key)) return cache.get(key) ?? null;

  let result: string | null = null;
  try {
    const buffer = await sharp(image.fsPath)
      .resize(width, height, { fit: 'cover' })
      .webp({ quality: 40 })
      .toBuffer();
    result = `data:image/webp;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.warn(`Could not generate blur placeholder for ${image.fsPath}:`, error);
  }
  cache.set(key, result);
  return result;
}

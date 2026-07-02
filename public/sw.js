// Recipe Box service worker — hand-rolled (no Workbox) to keep the build a
// plain `astro build` and to stay readable, in the spirit of the rest of the
// app's inline scripts. It does two jobs: make the site installable and make
// already-visited pages work offline.
//
// Caching strategy — the whole design turns on one split:
//
//   • HTML pages  → NETWORK-FIRST. Online, you always get the freshly-deployed
//     page; the cache is only a fallback for when the network is gone. This is
//     what stops a stale page from being served after a deploy. It also has to
//     catch Astro's <ClientRouter/> navigations, which fetch the next page's
//     HTML with fetch() — those are NOT request.mode === 'navigate', so we
//     detect "is this an HTML request?" by URL shape (extensionless / trailing
//     slash) rather than by mode.
//
//   • Hashed assets (/_astro/*, icons, images) → CACHE-FIRST (stale-while-
//     revalidate). Their filenames contain a content hash, so a cached copy is
//     never wrong — serving it instantly and refreshing in the background is
//     both safe and fast.
//
// Bump CACHE_VERSION to force every client to drop the old cache on activate.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `recipe-box-${CACHE_VERSION}`;

// The one page we precache, so there's always a styled offline fallback even
// for a route the user has never opened. It's a self-contained page (its own
// inline CSS), so it renders correctly without any other cached asset.
const OFFLINE_URL = '/offline/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL)),
  );
  // Take over as soon as possible instead of waiting for every tab to close.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Drop caches from older versions.
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

// An HTML request is anything that isn't a file with an extension — pages are
// served as directories (trailing slash) or the bare root. Assets always carry
// an extension (.js, .css, .png, .svg, .webmanifest, .xml …).
function isHtmlRequest(url) {
  return url.pathname.endsWith('/') || !/\.[^/]+$/.test(url.pathname);
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await fetch(request);
    // Stash a copy so this page is available offline next time.
    cache.put(request, fresh.clone());
    return fresh;
  } catch {
    const cached = await cache.match(request);
    return cached || (await cache.match(OFFLINE_URL));
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res && res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || network;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GETs. Everything else (POSTs, cross-origin,
  // extension requests) goes straight to the network untouched.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  event.respondWith(
    isHtmlRequest(url) ? networkFirst(request) : staleWhileRevalidate(request),
  );
});

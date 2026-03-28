import { writeFileSync } from "fs";
import { join } from "path";

const basePath =
  process.env.CAPACITOR === "true" ? "" : "/baystars-drill";
const outDir = "out";

const manifest = {
  name: "Baystars Drill",
  short_name: "Baystars Drill",
  description:
    "横浜DeNAベイスターズの背番号計算ドリル・スタメン作成・選手名鑑を楽しめるファンサイト",
  start_url: `${basePath}/`,
  scope: `${basePath}/`,
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#0046AB",
  icons: [
    {
      src: `${basePath}/icons/icon-192x192.png`,
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: `${basePath}/icons/icon-512x512.png`,
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: `${basePath}/icons/apple-touch-icon.png`,
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
  lang: "ja",
  dir: "ltr",
  categories: ["sports", "entertainment"],
};

const sw = `const CACHE_NAME = "baystars-drill-v1";
const BASE_PATH = "${basePath}";

const PRECACHE_URLS = [
  \`\${BASE_PATH}/\`,
  \`\${BASE_PATH}/favicon.ico\`,
  \`\${BASE_PATH}/icons/icon-192x192.png\`,
  \`\${BASE_PATH}/icons/icon-512x512.png\`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
`;

writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
writeFileSync(join(outDir, "sw.js"), sw);

console.log(`PWA assets generated with basePath: "${basePath}"`);

// Service worker : l'application fonctionne hors ligne.
// Code (HTML/CSS/JS) : cache d'abord. Contenu (content/, data/) : réseau d'abord,
// pour que les mises à jour des règles arrivent dès qu'il y a du réseau.
// Incrémenter VERSION à chaque déploiement qui modifie le code.

const VERSION = 'facturiere-v3';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/app.js',
  'js/db.js',
  'js/util.js',
  'js/pages/accueil.js',
  'js/pages/contenu.js',
  'js/pages/glossaire.js',
  'js/pages/quiz.js',
  'js/pages/simulateur.js',
  'content/societe.md',
  'content/metier.md',
  'content/clientes.md',
  'data/feuille-de-route.json',
  'data/glossaire.json',
  'data/quiz.json',
  'data/simulateur.json',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const isContent = /\/(content|data)\//.test(url.pathname);

  if (isContent) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request)),
    );
  } else {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request)),
    );
  }
});

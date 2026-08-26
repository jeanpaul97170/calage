/* Réseau d'abord, cache ensuite.
   Un cache prioritaire empêchait toute mise à jour : une nouvelle version
   déposée dans le dossier n'était jamais servie tant que le cache existait.

   À CHAQUE PUBLICATION : incrémenter le numéro de CACHE ci-dessous.
   Sans cet incrément, les postes qui ont déjà ouvert l'outil conservent
   l'ancienne version. */
const CACHE = "idj-controle-v102";
const COQUILLE = ["./", "./index.html", "./referentiel.js", "./charte.js", "./tarifs.js",
                  "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(COQUILLE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((cles) => Promise.all(cles.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const local = e.request.url.startsWith(self.location.origin);
  e.respondWith(
    fetch(e.request)
      .then((rep) => {
        if (rep.ok && local) {
          const copie = rep.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copie));
        }
        return rep;
      })
      .catch(() => caches.match(e.request))
  );
});

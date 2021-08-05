import { AsyncCommand, AsyncQuery } from 'tsbase/Patterns/CommandQuery/module';

export enum ServiceWorkerEvents {
  Install = 'install',
  Activate = 'activate',
  Fetch = 'fetch'
}

export enum CachedFiles {
  Index = '/',
  Bundle = '/bundle.js',
  Styles = '/styles.css',
  Favicon = '/images/favicon.jpg',
  AppIcon = '/images/512.png'
}

export type { };
declare const self: ServiceWorkerGlobalScope;

const cacheName = 'fyord';
const version = 'v0.0.1';

const cacheFilesCommand = new AsyncCommand(async () => {
  const cache = await caches.open(version + cacheName);
  return cache.addAll(Array.from(Object.values(CachedFiles)));
});

const deleteOldCacheCommand = new AsyncCommand(async () => {
  const keys = await caches.keys();

  await Promise.all(
    keys
      .filter((key) => { return key.indexOf(version) !== 0; })
      .map((key) => { return caches.delete(key); }));
});

async function fetchAndCache(request: any): Promise<Response> {
  const response = await fetch(request);

  const copy = response.clone();
  await (await caches.open(version + cacheName)).put(request, copy);

  return response;
}

const networkFirstQuery = (request) => new AsyncQuery<Response>(async () => {
  let response = await fetchAndCache(request);

  if (response.status >= 400) {
    const cachedResponse = await caches.match(request);
    response = cachedResponse || (await caches.match(CachedFiles.Index) as Response);
  }

  return response;
});

const handleFetchCommand = (event) => new AsyncCommand(async () => {
  const request = event.request;
  const isCacheable = request.method === 'GET';

  const response = isCacheable ?
    (await networkFirstQuery(request).Execute()).Value :
    await fetch(request);

  event.respondWith(response);
});

self.addEventListener(ServiceWorkerEvents.Install, async (event) => {
  event.waitUntil(cacheFilesCommand.Execute());
});

self.addEventListener(ServiceWorkerEvents.Activate, async (event) => {
  event.waitUntil(deleteOldCacheCommand.Execute());
});

self.addEventListener(ServiceWorkerEvents.Fetch, async (event) => {
  event.waitUntil(handleFetchCommand(event).Execute());
});

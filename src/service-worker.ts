import { Logger, LogLevel } from 'tsbase/Utility/Logger/module';
import { AsyncCommand, AsyncQuery } from 'tsbase/Patterns/CommandQuery/module';

export enum ServiceWorkerEvents {
  Install = 'install',
  Activate = 'activate',
  Fetch = 'fetch'
}

export enum CachedFiles {
  Root = '/',
  Index = '/index.html',
  Bundle = '/index.js',
  Styles = '/index.css',
  Favicon = '/images/favicon.jpg',
  AppIcon = '/images/icons/512.png'
}

export type { };
declare const self: ServiceWorkerGlobalScope;

const cacheName = 'fyord';
const version = 'v0.0.1';

const cacheFilesCommand = new AsyncCommand(async () => {
  const cache = await caches.open(version + cacheName);
  return await cache.addAll(Array.from(Object.values(CachedFiles)));
});

const deleteOldCacheCommand = new AsyncCommand(async () => {
  const keys = (await caches.keys())
    .filter(key => !key.includes(version));

  for (const key of keys) {
    await caches.delete(key);
  }
});

async function fetchAndCache(request: Request): Promise<Response | null> {
  try {
    const response = await fetch(request);

    const copy = response.clone();
    await (await caches.open(version + cacheName)).put(request, copy);

    return response;
  } catch (error) {
    return null;
  }
}

const networkFirstQuery = (request: Request) => new AsyncQuery<Response>(async () => {
  let response = await fetchAndCache(request);

  if (!response) {
    const cachedResponse = await caches.match(request) || await caches.match(request.url.split('?')[0]);
    response = cachedResponse || (await caches.match(CachedFiles.Index) as Response);
  }

  return response;
});

const handleFetchCommand = async (event: FetchEvent): Promise<Response> => {
  const request = event.request;
  const isCacheable = request.method === 'GET' && !['sockjs', 'esbuild'].some(s => request.url.includes(s));

  const response = isCacheable ?
    (await networkFirstQuery(request).Execute()).Value :
    await fetch(request);

  return response as Response;
};

Logger.Instance.EntryLogged.Subscribe(le => {
  // eslint-disable-next-line no-console
  le?.Level === LogLevel.Info && console.log(le.Message);
  le?.Level === LogLevel.Warn && console.warn(le.Message);
  le?.Level === LogLevel.Error && console.error(le.Message);
});

self.addEventListener(ServiceWorkerEvents.Install, async (event) => {
  event.waitUntil(cacheFilesCommand.Execute());
});

self.addEventListener(ServiceWorkerEvents.Activate, async (event) => {
  event.waitUntil(deleteOldCacheCommand.Execute());
});

self.addEventListener(ServiceWorkerEvents.Fetch, async (event) => {
  event.respondWith(handleFetchCommand(event));
});

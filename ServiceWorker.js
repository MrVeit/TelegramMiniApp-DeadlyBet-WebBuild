let cacheName = 'Cache-default';
let version = 'default';
let dynamicFilesToCache = [];

self.addEventListener('message', function(event)
{
    if (event.data && event.data.title === 'SetVersion')
    {
        version = event.data.version;
        cacheName = 'Cache-' + version;
        dynamicFilesToCache = event.data.files;

        console.log('[Service Worker] Setting version to ' + version);
        console.log('[Service Worker] Files to cache: ', dynamicFilesToCache);
    }
});

self.addEventListener("install", function(event)
{
    console.log('[Service Worker] Install ' + version);

    event.waitUntil(
        caches.open(cacheName).then((cache) =>
        {
            return cache.addAll(dynamicFilesToCache).catch(function(error)
            {
                console.error('[Service Worker] Failed to cache', error);
            });
        })
    );
});

self.addEventListener('fetch', function(event)
{
    event.respondWith(
        caches.match(event.request).then(function(response)
        {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', function(event)
{
    console.log('[Service Worker] Activate ' + version);

    event.waitUntil(
        caches.keys().then(function(keyList)
        {
            return Promise.all(keyList.map(function(key)
            {
                if (key !== cacheName)
                {
                    console.log('[Service Worker] Removing old cache', key);

                    return caches.delete(key);
                }
            }));
        })
    );

    return self.clients.claim();
});

self.addEventListener('message', function(event)
{
    console.log('[Service Worker] Message ' + version);

    if (event.data.title && event.data.title === 'VersionTest')
    {
        if (event.data.version !== version)
        {
            messageClient(event.source, {title: 'ReplaceWorker'});
        }
        else
        {
            messageClient(event.source, {title: 'SameVersion'});
        }
    }
});

let messageClient = async function (clientSource, message)
{
    clientSource.postMessage(message);
};

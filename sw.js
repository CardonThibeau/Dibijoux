self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                'about.html',
                'collection.html',
                'homeparty.html',
                'index.html',
                'shop.html',
                'work.html',
                'sw.js',
                'assets/css/reset.css',
                'assets/css/screen.css',
                'assets/js/minjq.js',
                'assets/js/script.js',
                'assets/images/braceletBanner.jpg',
                'assets/images/close.svg',
                'assets/images/Dibijoux_logo.png',
                'assets/images/earringBanner.jpg',
                'assets/images/favicon.ico',
                'assets/images/menu.svg',
                'assets/images/necklaceBanner.jpg',
                'assets/images/ringBanner.jpg',
                'assets/images/watchesBanner.jpg',
                'assets/manifest/manifest.json',
                'images/banner.jpg',
            ]);
        })
    );
});

addEventListener('fetch', event => {
    // Let the browser do its default thing
    // for non-GET requests.
    if (event.request.method != 'GET') return;

    // Prevent the default, and handle the request ourselves.
    event.respondWith(async function() {
        // Try to get the response from a cache.
        const cache = await caches.open('v1');
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
            // If we found a match in the cache, return it, but also
            // update the entry in the cache in the background.
            event.waitUntil(cache.add(event.request));
            return cachedResponse;
        }

        // If we didn't find a match in the cache, use the network.
        return fetch(event.request);
    }());
});

/*
addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;     // if valid response is found in cache return it
                } else {
                    return fetch(event.request)     //fetch from internet
                        .then(function(res) {
                            return caches.open(CACHE_DYNAMIC_NAME)
                                .then(function(cache) {
                                    cache.put(event.request.url, res.clone());    //save the response for future
                                    return res;   // return the fetched data
                                })
                        })
                        .catch(function(err) {       // fallback mechanism
                            return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
                                .then(function(cache) {
                                    return cache.match('/index.html');
                                });
                        });
                }
            })
    );
});
*/
/*
self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response) {
            return response;
        } else {
            return fetch(event.request).then(function (response) {
                // response may be used only once
                // we need to save clone to put one copy in cache
                // and serve second one
                let responseClone = response.clone();

                caches.open('v1').then(function (cache) {
                    cache.put(event.request, responseClone);
                });
                return response;
            }).catch(function () {
                return caches.match('index.html');
            });
        }
    }));
});
*/
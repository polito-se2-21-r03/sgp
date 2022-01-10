export const addDataIntoCache = (cacheName: any, url: any, response: any) => {
    // Converting our respons into Actual Response form
    const data = new Response(JSON.stringify(response));

    if ('caches' in window) {
        // Opening given cache and putting our data into it
        caches.open(cacheName).then((cache) => {
            console.log(data);
            cache.put(url, data);
        });
    }
};


export const getCachedData = async (cacheName: any, url: any) => {
    const cacheStorage   = await caches.open( cacheName );
    const cachedResponse = await cacheStorage.match( url );

    if ( ! cachedResponse || ! cachedResponse.ok ) {
        return false;
    }

    return await cachedResponse.json();
}
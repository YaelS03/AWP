self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open('v3')
        .then(cache =>{
            cache.addAll([
                './',
                './script.js',
                './obj.png',
                'scramble.txt'
            ]);
            console.log("Assets cached.");
        })
        .catch(err => console.log("Could not cache."))
    )
});

self.addEventListener('fetch', event =>{
    console.log("INTERCEPTED");

    event.respondWith(
        caches.match(event.request)
        .then(response =>{
            console.log("V3 The request: ", event.request);
            console.log("V3 Got the response...", response);


            return response || fetch(event.request);

            // if (event.request.url === 'http://localhost/AWP/U1/SW3/obj.png') {
                //     return fetch('https://picsum.photos/800');
                // } else {
                //     return response;
                // }

                
                 //if (event.request.url === 'http://localhost/AWP/U1/SW3/obj.png') {
                 //  return fetch('https://picsum.photos/800')
                 //        .then(res => {
                 //            return caches.open('v1')
                 //            .then(cache => {
                 //                cache.put(event.request, res.clone());
                 //              return res;
                 //           })
                  //       });
                 // } else {
                 //    return response;
                // }
              
                // return fetch('https://www.coursera.org/') 
                // return fetch('https://jsonplaceholder.typicode.com/todos/1') 
                
            
                // return new Response('Bienvenidos');
        })
        .catch(err => {
                console.log("Could not find matching request.");
                return null;
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
         caches.keys()
        .then(keys => {
             keys.forEach(key => {
                if (key === 'v3') caches.delete(key);
             });
         })
     );
 });

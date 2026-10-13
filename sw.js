var V="mark-lpg-v5",CORE=["./","./index.html","./rider.html","./admin.html","./manifest.webmanifest","./manifest-rider.webmanifest","./manifest-admin.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(CORE.map(function(u){return c.add(new Request(u,{cache:"reload"})).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("message",function(e){if(e.data==="skipWaiting")self.skipWaiting()});
self.addEventListener("fetch",function(e){
 var r=e.request,u=new URL(r.url);
 if(r.method!=="GET")return;
 /* pages: always ask the server for the newest copy first; saved copy only when offline */
 if(r.mode==="navigate"){
  e.respondWith(fetch(r,{cache:"no-cache"}).then(function(res){if(res&&res.ok){var c=res.clone();caches.open(V).then(function(x){x.put(r,c)})}return res}).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match(u.pathname,{ignoreSearch:true})}).then(function(m){return m||caches.match("./index.html")})}));return}
 /* own files, Firebase SDK, map library: saved copy first, refreshed in the background */
 if(u.origin===location.origin||u.hostname==="www.gstatic.com"||u.hostname==="cdnjs.cloudflare.com"||u.hostname==="unpkg.com"){
  e.respondWith(caches.match(r).then(function(m){var n=fetch(r,{cache:"no-cache"}).then(function(res){if(res&&(res.ok||res.type==="opaque")){var c=res.clone();caches.open(V).then(function(x){x.put(r,c)})}return res}).catch(function(){return m});return m||n}))}
});

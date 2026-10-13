var V="mark-lpg-v3",CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
 var r=e.request,u=new URL(r.url);
 if(r.method!=="GET")return;
 /* never cache the admin or rider pages */
 if(u.origin===location.origin&&/admin|rider/i.test(u.pathname))return;
 /* page navigations: network first, fall back to cached copy when offline */
 if(r.mode==="navigate"){
  e.respondWith(fetch(r).then(function(res){var c=res.clone();caches.open(V).then(function(x){x.put("./index.html",c)});return res}).catch(function(){return caches.match("./index.html").then(function(m){return m||caches.match("./")})}));return}
 /* own files + Firebase SDK scripts: cache first, update in background */
 if(u.origin===location.origin||u.hostname==="www.gstatic.com"||u.hostname==="cdnjs.cloudflare.com"||u.hostname==="unpkg.com"){
  e.respondWith(caches.match(r).then(function(m){var n=fetch(r).then(function(res){if(res&&(res.ok||res.type==="opaque")){var c=res.clone();caches.open(V).then(function(x){x.put(r,c)})}return res}).catch(function(){return m});return m||n}))}
});

this.workbox=this.workbox||{},this.workbox.core=function(){"use strict";try{self.workbox.v["workbox:core:4.0.0-alpha.0"]=1}catch(e){}var e={debug:0,log:1,warn:2,error:3,silent:4};const t=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);let r=(()=>e.warn)();const a=e=>r<=e,n=e=>r=e,s=()=>r,o=e.error,i=function(r,n,s){const i=0===r.indexOf("group")?o:e[r];if(!a(i))return;if(!s||"groupCollapsed"===r&&t)return void console[r](...n);const c=["%cworkbox",`background: ${s}; color: white; padding: 2px 0.5em; `+"border-radius: 0.5em;"];console[r](...c,...n)},c=()=>{a(o)&&console.groupEnd()},l={groupEnd:c,unprefixed:{groupEnd:c}},u={debug:"#7f8c8d",log:"#2ecc71",warn:"#f39c12",error:"#c0392b",groupCollapsed:"#3498db"};Object.keys(u).forEach(e=>((e,t)=>{l[e]=((...r)=>i(e,r,t)),l.unprefixed[e]=((...t)=>i(e,t))})(e,u[e]));const h=(e,...t)=>{let r=e;return t.length>0&&(r+=` :: ${JSON.stringify(t)}`),r};class w extends Error{constructor(e,t){super(h(e,t)),this.name=e,this.details=t}}const d=new Set;class p{constructor(e,t,{onupgradeneeded:r,onversionchange:a=this.e}={}){this.t=e,this.r=t,this.a=r,this.e=a,this.n=null}async open(){if(!this.n)return this.n=await new Promise((e,t)=>{let r=!1;setTimeout(()=>{r=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const a=indexedDB.open(this.t,this.r);a.onerror=(e=>t(a.error)),a.onupgradeneeded=(e=>{r?(a.transaction.abort(),e.target.result.close()):this.a&&this.a(e)}),a.onsuccess=(t=>{const a=t.target.result;r?a.close():(a.onversionchange=this.e,e(a))})}),this}async get(e,...t){return await this.s("get",e,"readonly",...t)}async add(e,...t){return await this.s("add",e,"readwrite",...t)}async put(e,...t){return await this.s("put",e,"readwrite",...t)}async delete(e,...t){await this.s("delete",e,"readwrite",...t)}async deleteDatabase(){this.close(),this.n=null,await new Promise((e,t)=>{const r=indexedDB.deleteDatabase(this.t);r.onerror=(e=>t(e.target.error)),r.onblocked=(()=>t(new Error("Deletion was blocked."))),r.onsuccess=(()=>e())})}async getAll(e,t,r){return"getAll"in IDBObjectStore.prototype?await this.s("getAll",e,"readonly",t,r):await this.getAllMatching(e,{query:t,count:r})}async getAllMatching(e,t={}){return await this.transaction([e],"readonly",(r,a)=>{const n=r[e],s=t.index?n.index(t.index):n,o=[],i=t.query||null,c=t.direction||"next";s.openCursor(i,c).onsuccess=(e=>{const r=e.target.result;if(r){const{primaryKey:e,key:n,value:s}=r;o.push(t.includeKeys?{primaryKey:e,key:n,value:s}:s),t.count&&o.length>=t.count?a(o):r.continue()}else a(o)})})}async transaction(e,t,r){return await this.open(),await new Promise((a,n)=>{const s=this.n.transaction(e,t);s.onerror=(e=>n(e.target.error)),s.onabort=(e=>n(e.target.error)),s.oncomplete=(()=>a());const o={};for(const t of e)o[t]=s.objectStore(t);r(o,e=>a(e),()=>{n(new Error("The transaction was manually aborted")),s.abort()})})}async s(e,t,r,...a){await this.open();return await this.transaction([t],r,(r,n)=>{r[t][e](...a).onsuccess=(e=>{n(e.target.result)})})}e(e){this.close()}close(){this.n&&this.n.close()}}p.prototype.OPEN_TIMEOUT=2e3;const g={prefix:"workbox",suffix:self.registration.scope,googleAnalytics:"googleAnalytics",precache:"precache",runtime:"runtime"},f=e=>[g.prefix,e,g.suffix].filter(e=>e.length>0).join("-"),y={updateDetails:e=>{Object.keys(g).forEach(t=>{void 0!==e[t]&&(g[t]=e[t])})},getGoogleAnalyticsName:e=>e||f(g.googleAnalytics),getPrecacheName:e=>e||f(g.precache),getRuntimeName:e=>e||f(g.runtime)};var m="cacheDidUpdate",v="cacheWillUpdate",b="cachedResponseWillBeUsed",q="fetchDidFail",E="requestWillFetch",L=(e,t)=>e.filter(e=>t in e);const x=e=>{const t=new URL(e,location);return t.origin===location.origin?t.pathname:t.href},N=async({cacheName:e,request:t,event:r,matchOptions:a,plugins:n=[]})=>{const s=await caches.open(e);let o=await s.match(t,a);for(let s of n)b in s&&(o=await s[b].call(s,{cacheName:e,request:t,event:r,matchOptions:a,cachedResponse:o}));return o},O=async({request:e,response:t,event:r,plugins:a})=>{let n=t,s=!1;for(let t of a)if(v in t&&(s=!0,!(n=await t[v].call(t,{request:e,response:n,event:r}))))break;return s||(n=n.ok?n:null),n||null},k={put:async({cacheName:e,request:t,response:r,event:a,plugins:n=[]}={})=>{if(!r)throw new w("cache-put-with-no-response",{url:x(t.url)});let s=await O({request:t,response:r,event:a,plugins:n});if(!s)return;const o=await caches.open(e),i=L(n,m);let c=i.length>0?await N({cacheName:e,request:t}):null;try{await o.put(t,s)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of d)await e()}(),e}for(let r of i)await r[m].call(r,{cacheName:e,request:t,event:a,oldResponse:c,newResponse:s})},match:N},D={fetch:async({request:e,fetchOptions:t,event:r,plugins:a=[]})=>{if(r&&r.preloadResponse){const e=await r.preloadResponse;if(e)return e}"string"==typeof e&&(e=new Request(e));const n=L(a,q),s=n.length>0?e.clone():null;try{for(let t of a)E in t&&(e=await t[E].call(t,{request:e.clone(),event:r}))}catch(e){throw new w("plugin-error-request-will-fetch",{thrownError:e})}const o=e.clone();try{return await fetch(e,t)}catch(e){for(let t of n)await t[q].call(t,{error:e,event:r,originalRequest:s.clone(),request:o.clone()});throw e}}};var R=Object.freeze({DBWrapper:p,WorkboxError:w,assert:null,cacheNames:y,cacheWrapper:k,fetchWrapper:D,getFriendlyURL:x,logger:l});var A=new class{constructor(){try{self.workbox.v=self.workbox.v||{}}catch(e){}}get cacheNames(){return{googleAnalytics:y.getGoogleAnalyticsName(),precache:y.getPrecacheName(),runtime:y.getRuntimeName()}}setCacheNameDetails(e){y.updateDetails(e)}get logLevel(){return s()}setLogLevel(t){if(t>e.silent||t<e.debug)throw new w("invalid-value",{paramName:"logLevel",validValueDescription:"Please use a value from LOG_LEVELS, i.e 'logLevel = workbox.core.LOG_LEVELS.debug'.",value:t});n(t)}};return Object.assign(A,{_private:R,LOG_LEVELS:e,registerQuotaErrorCallback:function(e){d.add(e)}})}();

//# sourceMappingURL=workbox-core.prod.js.map
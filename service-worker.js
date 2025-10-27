import { BuiltinModuleStrategy, RawResourceStrategy, WorkerResourceStrategy, UrlResourceStrategy, JSONStrategy, TSStrategy, CSSStrategy, VueSFCStrategy } from "./jit/compile-strategy.js";
const worker = globalThis;
worker.addEventListener("install", (event) => {
  worker.skipWaiting();
});
worker.addEventListener("activate", (event) => {
  event.waitUntil(
    worker.clients.claim().then(() => {
      console.log("service worker加载完成，执行重启操作");
      sendReload();
    })
  );
});
worker.addEventListener("message", (event) => {
  console.log(event.data);
  const { action } = event.data;
  switch (action) {
    case "reload":
      sendReload();
      break;
    case "allowJs": {
      const tsStrategy = strategies.find((i) => i instanceof TSStrategy);
      if (tsStrategy) tsStrategy.allowJs = event.data.enabled || false;
      break;
    }
    default:
      console.log("Unknown action");
  }
});
function sendReload() {
  worker.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "reload" });
    });
  });
}
const strategies = [
  new BuiltinModuleStrategy(),
  new RawResourceStrategy(),
  new WorkerResourceStrategy(),
  new UrlResourceStrategy(),
  new JSONStrategy(),
  new TSStrategy({ allowJs: false }),
  new CSSStrategy(),
  new VueSFCStrategy()
];
const proxyedPath = ["/extension", "/noname-builtinModules/", "/jit/test"];
worker.addEventListener("fetch", (event) => {
  const request = event.request;
  if (typeof request.url !== "string") return;
  const url = new URL(request.url);
  if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") return;
  if (!proxyedPath.some((i) => url.pathname.startsWith(i))) return;
  const strategy = strategies.find((s) => s.match({ event, request, url }));
  if (strategy) {
    try {
      event.respondWith(strategy.process({ event, request, url }));
    } catch (e) {
      console.error(request.url, e);
      event.respondWith(Response.error());
    }
  }
});

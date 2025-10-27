import { getDefaultExportFromCjs } from "./_commonjsHelpers.js";
import { __require as requireCoreJsBundle } from "../node_modules/.pnpm/core-js-bundle@3.45.1/node_modules/core-js-bundle/index.js";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
var coreJsBundleExports = requireCoreJsBundle();
const index = /* @__PURE__ */ getDefaultExportFromCjs(coreJsBundleExports);
const index$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: index
}, [coreJsBundleExports]);
export {
  index as default,
  index$1 as i
};

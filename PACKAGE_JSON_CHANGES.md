# package.json changes — Phase 3

Apply these to your existing `package.json`. Only the fields below change;
everything else (`name`, `keywords`, `repository`, etc.) stays as-is.

## 1. Build scripts — swap Tailwind CLI for esbuild (core.css is plain CSS now)

```diff
   "scripts": {
     "build": "vite build",
-    "build:css": "npx @tailwindcss/cli -i ./src/styles/toast.css -o ./dist/notifyx.min.css --minify",
+    "build:css": "esbuild src/styles/core.css --minify --outfile=dist/notifyx.min.css && mkdir -p dist/themes && esbuild src/styles/themes/glass.css --minify --outfile=dist/themes/glass.css",
     "build:all": "bun run build && bun run build:css",
     "verify": "bash scripts/verify-build.sh",
+    "size": "size-limit",
     "dev": "vite",
     "prepare": "bun run build:all"
   },
```

## 2. Exports — add the glass theme and the headless entry

```diff
   "exports": {
     ".": {
       "types": "./dist/index.d.ts",
       "import": "./dist/notifyx.es.js",
       "require": "./dist/notifyx.min.js",
       "default": "./dist/notifyx.es.js"
     },
-    "./style.css": "./dist/notifyx.min.css"
+    "./style.css": "./dist/notifyx.min.css",
+    "./themes/glass.css": "./dist/themes/glass.css",
+    "./headless": {
+      "types": "./dist/headless/index.d.ts",
+      "import": "./dist/headless/index.js"
+    }
   },
```

## 3. Vite config — add the headless entry as a second lib entry

`vite.config.ts` `build.lib.entry` needs to become an object so both
`src/index.ts` and `src/headless/index.ts` get built:

```diff
     lib: {
-      entry: "./src/index.ts",
+      entry: {
+        index: "./src/index.ts",
+        "headless/index": "./src/headless/index.ts",
+      },
       name: "NotifyX",
-      fileName: (format) => {
-        if(format === 'umd') return 'notifyx.min.js';
-        return `notifyx.${format}.js`;
-      },
-      formats: ["es", "umd"]
+      fileName: (format, entryName) => {
+        if (entryName === "index") {
+          return format === "umd" ? "notifyx.min.js" : `notifyx.${format}.js`;
+        }
+        return `${entryName}.js`; // headless/index.js
+      },
+      formats: ["es", "umd"]
     },
```
(UMD headless build is unused but harmless; only the ESM `headless/index.js` is referenced by `exports`.)

## 4. devDependencies — remove Tailwind, add esbuild + size-limit

```diff
   "devDependencies": {
     "@types/bun": "latest",
     "@types/node": "^20.0.0",
-    "tailwindcss": "^4.1.11",
+    "esbuild": "^0.24.0",
+    "@size-limit/file": "^11.0.0",
+    "size-limit": "^11.0.0",
     "terser": "^5.37.0",
     "typescript": "^5.8.2",
     "vite": "^7.0.0",
     "vite-plugin-dts": "^4.0.0",
     "vite-tsconfig-paths": "^5.1.4"
   },
```

## 5. size-limit field (reads `.size-limit.json` if you'd rather keep it separate — already provided)

```diff
+  "size-limit": [
+    { "path": "dist/notifyx.min.js", "limit": "4 KB", "gzip": true },
+    { "path": "dist/notifyx.es.js", "limit": "5 KB", "gzip": true },
+    { "path": "dist/notifyx.min.css", "limit": "2.2 KB", "gzip": true },
+    { "path": "dist/themes/glass.css", "limit": "1.2 KB", "gzip": true }
+  ],
```

## 6. files — include the new dist paths

```diff
   "files": [
     "dist/*.js",
     "dist/*.css",
     "dist/*.d.ts",
+    "dist/headless/*",
+    "dist/themes/*",
     "README.md",
     "LICENSE"
   ],
```

## 7. Delete the legacy stylesheet from the build once verified

`src/styles/toast.css` is superseded by `src/styles/core.css` +
`src/styles/themes/glass.css`. Keep it in the repo until you've confirmed
notifyx.bd renders correctly against the new files, then delete it and
drop its mention from any docs.

---

**@notifyx/react** ships as a separate package (`packages/react/`) with its
own `package.json` — it's a peer-dependency wrapper, not part of this
package.json. Publish it independently once the core `2.4.0` is live, since
its `peerDependencies.notifyx` range points at that version.

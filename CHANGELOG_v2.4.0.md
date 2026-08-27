# v2.4.0 — Core API upgrade

## ✨ Added
- `show()` / `success()` / `error()` / `warning()` / `info()` / `loading()` now return a `ToastId`
- `NotifyX.update(id, options)` — morph any toast in place (content, type, duration)
- `NotifyX.dismiss(id?)` — dismiss one toast or all
- `NotifyX.configure(defaults)` — global defaults
- `NotifyX.count()` — number of visible toasts
- `title` option — two-line title + message toasts
- `action` / `cancel` buttons with `dismissOnClick` control
- `onAutoClose` callback (fires only on timer expiry; `onClose` fires on any close)
- Custom `id` option → automatic deduplication (same id updates instead of stacking)
- `loading` is now a first-class `ToastType`

## 🔄 Changed
- `promise()` now uses ONE toast that morphs loading → success/error in place
- Progress bar animates `transform: scaleX()` (GPU) instead of `width`
- Internal state moved from element expando properties to `Map`/`WeakMap` registry
- Default `duration`: 3000 → 4000ms

## 💥 Breaking
- `POSITIONS.CENTER` removed — `loading()` renders in the normal position flow
- `dismissLoading()` removed — capture the id from `loading()` and call `dismiss(id)`

## 🐛 Fixed
- Removed stray `console.log` from `removeToast` (was shipping in the ES bundle)

# v2.4.0 — Phase 2 additions (same release)

## ✨ Added
- **Stacked toasts (default):** cards collapse into a stack, expand on hover/focus; smooth transform-based reflow when toasts enter/leave
- **Swipe-to-dismiss:** drag any dismissible toast sideways (touch/pen/mouse) — 45% distance or flick velocity dismisses, otherwise springs back; timers pause during drag
- **Theme system:** new calm default (`core.css`, plain CSS, no Tailwind) + opt-in `themes/glass.css` via `data-notifyx-theme="glass"`; manual dark override via `data-notifyx-mode="dark|light"`
- `NotifyX.configure({ stacked: false })` — classic list layout
- `demo.html` — self-contained interactive demo

## 🔄 Changed
- Default theme: solid surfaces + single shadow; infinite shimmer/pulse/glow removed (glass theme keeps a single entrance shimmer)
- Shipped CSS no longer depends on Tailwind
- Sizes (gzip): core CSS 1.97KB (was 3.7KB), glass theme 0.96KB, JS ~3.4KB

## 🐛 Fixed
- `data-removing` attribute was queried by `enforceMaxToasts` but never set — now set in `removeToast`

# v2.4.0 — Phase 3 + Phase 4 (start) additions (same release)

## ✨ Added
- `notifyx/headless` entry point — same engine, no CSS assumptions, documents the stable styling contract (`data-type`, `data-front`, `data-beyond`, `data-swiping`, etc.)
- `data-type` attribute on every toast (kept in sync through `update()`) — a stable CSS hook independent of internal class names
- `@notifyx/react` package scaffold: `<Toaster />` + typed `toast` export (peer-dependency wrapper, zero extra runtime deps)
- `.size-limit.json` size budgets + `scripts/verify-build.sh` (typecheck → smoke tests → dist check → size-limit)
- `.github/workflows/ci.yml` — CI runs typecheck, smoke tests, build, and size-limit on every push/PR
- `PACKAGE_JSON_CHANGES.md` — exact diffs to migrate `package.json`/`vite.config.ts` off Tailwind onto the new `core.css`/`themes/glass.css` build

## 🔄 Changed
- Consolidated duplicated top/bottom stack CSS selectors behind a `--nx-dir` variable (maintainability improvement; gzip size unchanged — repetition was already compressed)

## 📌 Action required (not applied automatically)
- Apply `PACKAGE_JSON_CHANGES.md` to the real `package.json` + `vite.config.ts`
- Delete `src/styles/toast.css` once notifyx.bd is confirmed working against `core.css`
- Publish `@notifyx/react` after core `2.4.0` is live on npm

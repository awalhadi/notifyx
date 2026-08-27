# NotifyX — Project Tracker

> **Purpose of this file:** single source of truth for project stage. Any AI agent, IDE assistant, or contributor MUST read this file first, and MUST update it after completing any task. Keep entries terse and factual.

**Version target:** `2.4.0` · **Last updated:** 2026-07-14 · **Updated by:** Claude (chat session, Phase 3 + Phase 4 start)

---

## Current stage: `PHASE_3_COMPLETE → PHASE_4_IN_PROGRESS`

```
[███████████████████████████░░░]  Phases 1–3 done, Phase 4 ~25%
```

## Roadmap & status

### ✅ Phase 0 — Bug fixes (DONE, v2.3.x)
- [x] Trailing space in `ANIMATION_CLASSES.exit` → `InvalidCharacterError` (fixed)
- [x] Double-removal guard, animationend fallback timeout
- [x] `prefers-reduced-motion` immediate removal path

### ✅ Phase 1 — Core API (DONE, this session — v2.4.0)
- [x] `show()` returns `ToastId`; `Map<ToastId, ToastState>` registry (O(1))
- [x] `NotifyX.update(id, options)` — morphs toast in place, restarts timer
- [x] `NotifyX.dismiss(id?)` — by id, or all
- [x] `promise()` rewritten: ONE toast morphs loading → success/error (no more centered loader)
- [x] `loading` is now a real `ToastType` in normal flow; `POSITIONS.CENTER` **removed (BREAKING)**
- [x] `title` + `message` two-line layout (`.notifyx-title`, `.notifyx-text`)
- [x] `action` / `cancel` buttons (`ToastAction`, `.notifyx-btn-*`)
- [x] `onAutoClose` callback (distinct from `onClose`)
- [x] `NotifyX.configure(defaults)` global config
- [x] `NotifyX.count()`
- [x] Custom `id` option → deduplication (same id updates instead of stacking)
- [x] Expando props (`__notifyx*`) replaced with `WeakMap<HTMLElement, ToastState>`
- [x] `console.log` removed from `removeToast`
- [x] Progress bar: `width` animation → GPU `transform: scaleX()`
- [x] Strict typecheck passes; happy-dom smoke tests pass (ids/update/dismiss/promise/actions/dedup)

### ✅ Phase 2 — UI/UX (DONE, this session)
- [x] Stacked layout (default): `src/utils/stack.ts` — index/offset/scale via CSS vars, expand on hover+focus, `data-front`/`data-beyond`
- [x] Swipe-to-dismiss: `src/utils/swipe.ts` — Pointer Events, 12px intent threshold, rubber-band resistance, 45% width or 0.11px/ms flick
- [x] Reflow animation on exit: transform-transition based (FLIP-equivalent) — siblings glide when a toast leaves
- [x] Calm default theme: `src/styles/core.css` — solid surfaces, single shadow, accent icon dot + progress bar, motion only on enter/exit/interaction
- [x] Theme split: core default / `themes/glass.css` opt-in via `data-notifyx-theme="glass"` (shimmer now runs ONCE on entry, not infinite) / dark via `prefers-color-scheme` + `data-notifyx-mode` override
- [x] `NotifyX.configure({ stacked: false })` for classic list mode
- [x] `demo.html` — self-contained demo (stacking, swipe, themes, morphing promise, update() progress)
- [ ] Playground (notifyx.bd) upgrade — user-side task: embed demo.html patterns, add live code output + Sonner comparison

### ✅ Phase 3 — Package size (DONE)
- [x] Tailwind removed from shipped CSS (`core.css` is plain CSS; `toast.css` is now LEGACY — delete after migration)
- [x] CSS-variable refactor: per-type `--nx-accent/--nx-surface/--nx-fg` blocks
- [x] Unused dots/pulse loaders removed from core
- [x] Theme split shipped: `core.css` + `themes/glass.css`
- [x] Consolidated top/bottom stack selectors via `--nx-dir` variable (maintainability; gzip already handled the repetition so size is unchanged — confirmed 1.97KB either way)
- [x] `package.json` migration documented in `PACKAGE_JSON_CHANGES.md` (build scripts, exports, vite multi-entry, size-limit field) — **apply to the real repo**, not overwritten here since package.json lives in your repo
- [x] `.size-limit.json` + `scripts/verify-build.sh` (typecheck → smoke → dist check → size-limit) + `.github/workflows/ci.yml`

**Measured sizes (gzip, minified):** core.css **1.97KB** (was 3.7KB + Tailwind dep) · glass.css **0.96KB** · JS bundle **~3.4KB** (grew from 1.4KB — stacking+swipe+actions) · total default ≈ **5.3KB** (Sonner ≈ 9KB, react-toastify ≈ 9KB)

### 🟡 Phase 4 — Distribution & trust (started this session, ~25%)
- [x] `notifyx/headless` entry (`src/headless/index.ts`) — same engine, documents the stable `data-*`/class styling contract, zero CSS
- [x] `data-type="success|error|..."` attribute added to every toast + kept in sync on `update()` — the styling hook headless/Tailwind users need
- [x] `@notifyx/react` scaffolded in `packages/react/` — `<Toaster />` (calls `configure()` via `useEffect`) + typed `toast` export; typechecks against real core via path mapping
- [ ] Publish `@notifyx/react` to npm (after core 2.4.0 is live — its peerDependency range points at that version)
- [ ] Vue / Svelte wrappers (not started — React proves the pattern first)
- [ ] Formalize `smoke.test.mts` into Vitest suite; Playwright e2e for swipe gesture (untestable in happy-dom — no real PointerEvent physics) + a11y checks
- [ ] Docs: migration guides from Sonner / react-toastify / Notyf
- [ ] RTL support, keyboard hotkey focus, focus return on keyboard dismiss

## Known issues / debt
- `src/styles/toast.css` is LEGACY (superseded by `core.css` + `themes/glass.css`) — remove from build once notifyx.bd migrates
- `update()` rebuilds inner DOM via a throwaway element — fine, but consider targeted patching later
- No CENTER migration shim — document in CHANGELOG as breaking
- Swipe untested in happy-dom (no real pointer events) — needs Playwright e2e in Phase 4
- README size table needs re-verification after terser build (esbuild numbers recorded above)
- `package.json` / `vite.config.ts` changes are NOT applied automatically — see `PACKAGE_JSON_CHANGES.md` and apply manually to your real repo
- `@notifyx/react`'s `packages/react/` is a scaffold typechecked against local source via `paths` mapping — needs a real build step (tsup/vite) before publishing
- `.size-limit.json` budgets are unverified against a real `bun run build:all` output (verified against esbuild-produced files directly, not the vite pipeline)

## Breaking changes pending release (v2.4.0)
1. `show()`/`success()`/etc. return `ToastId` instead of `void` (additive, safe)
2. `POSITIONS.CENTER` removed; `loading()` renders in normal position flow
3. `dismissLoading()` removed → use `dismiss(id)`
4. Default `duration` 3000 → 4000ms

## How to update this file (for AI agents)
1. Move completed items to `[x]`, update the stage line + progress bar
2. Add new debt/issues as discovered
3. Bump "Last updated" + "Updated by"
4. Never delete history; strike through instead if reversed

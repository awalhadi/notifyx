<div align="center">

# 🚀 NotifyX v4

### The notification library built for the AI era.
**Beautiful enough for designers, powerful enough for AI agents, fast enough for real-time streaming.**

[![npm version](https://img.shields.io/npm/v/notifyx?color=success&style=flat-square)](https://www.npmjs.com/package/notifyx)
[![npm downloads](https://img.shields.io/npm/dm/notifyx?style=flat-square)](https://www.npmjs.com/package/notifyx)
[![bundle size](https://img.shields.io/bundlephobia/minzip/notifyx?style=flat-square)](https://bundlephobia.com/package/notifyx)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/notifyx?style=flat-square)](LICENSE)

[Demo](https://github.com/awalhadi/notifyx) • [Installation](#-installation) • [AI Integration](#-ai--mcp-integration) • [Streaming API](#-streaming-api) • [Themes](#-theme-system) • [Migration](#-migration-guide-v3--v4)

</div>

---

## ✨ Why NotifyX?

NotifyX is designed for modern web applications. It is the first choice for:
- Next.js / React apps
- LLM-powered applications
- MCP server result display
- Agentic workflow UX
- Laravel + Inertia.js projects

### Competitive Differentiation

| Feature | NotifyX v4 | react-hot-toast | sonner | react-toastify |
| :--- | :---: | :---: | :---: | :---: |
| **AI/streaming API** | ✅ Native | ❌ | ❌ | ❌ |
| **MCP-ready** | ✅ | ❌ | ❌ | ❌ |
| **Animation presets** | ✅ 5 options | ❌ | limited | limited |
| **Theme system** | ✅ 6 themes | ❌ | partial | partial |
| **Vanilla JS support**| ✅ | ❌ | ❌ | partial |
| **Zero dependencies** | ✅ | ✅ | ✅ | ❌ |
| **Promise API** | ✅ | ✅ | ✅ | ✅ |
| **Swipe-to-dismiss** | ✅ | ❌ | ✅ | partial |
| **Rich content / actions**| ✅ | ❌ | partial | ✅ |
| **Bundle < 5KB** | ✅ | ✅ | ✅ | ❌ |

---

## 📦 Installation

```bash
# npm
npm install notifyx

# pnpm
pnpm add notifyx

# yarn / bun
yarn add notifyx
```

### Setup

```javascript
import NotifyX from 'notifyx';
import 'notifyx/style.css'; // Don't forget the CSS!

NotifyX.success('Ready for the AI era! 🚀');
```

---

## 🤖 AI & MCP Integration

NotifyX comes with first-class support for AI metadata, making it perfect for LLM and MCP integrations.

```javascript
NotifyX.ai("Processing context...", {
  ai: {
    model: "claude-3-5-sonnet",
    toolName: "read_file",
    latencyMs: 1240,
    tokens: 450
  }
});
```

It renders beautifully with a custom `✦` icon, an indigo palette, and a metadata bar showing exactly what the agent is doing.

---

## 🌊 Streaming API

LLMs stream their responses token-by-token. NotifyX natively supports streaming updates without UI jank.

```javascript
const stream = NotifyX.stream("Thinking...", {
  ai: { model: "gpt-4o", streaming: true },
  position: "bottom-right"
});

// As tokens arrive
stream.update("I have found ");
stream.update("the specific bug ");
stream.update("in your code.");

// When complete
stream.success("Analysis complete!", {
  ai: { streaming: false, latencyMs: 850 }
});
```

A blinking `▋` cursor is natively rendered while streaming is active!

---

## ⏳ Promise API

Manage asynchronous state beautifully with the robust Promise API.

### Example 1: Basic Fetch
```javascript
NotifyX.promise(
  fetch('/api/user/profile'),
  {
    loading: 'Loading profile...',
    success: 'Profile loaded!',
    error: 'Failed to fetch profile'
  }
);
```

### Example 2: Dynamic Success Message
```javascript
NotifyX.promise(
  saveSettings(data),
  {
    loading: 'Saving settings...',
    success: (result) => `Settings saved for ${result.user.name}`,
    error: 'Could not save settings'
  }
);
```

### Example 3: Dynamic Error Parsing
```javascript
NotifyX.promise(
  uploadFile(file),
  {
    loading: 'Uploading...',
    success: 'File uploaded successfully!',
    error: (err) => `Upload failed: ${err.message}`
  }
);
```

---

## 🎨 Theme System

NotifyX v4 ships with 6 distinct themes out of the box.

- `auto` (Default) — Matches system OS preference
- `light` — Clean, modern white
- `dark` — Deep, sleek dark mode
- `glass` — Premium frosted glassmorphism (perfect for rich UI)
- `minimal` — Flat, un-styled barebones (no shadows/borders)
- `brutal` — Monochrome, monospace brutalist styling

### Applying Themes

**Globally:**
```javascript
// Apply to all toasts
NotifyX.setTheme('glass');
```

**Per-Toast:**
```javascript
NotifyX.success('Task complete', { theme: 'brutal' });
```

---

## 🎬 Animation Presets

Choose from 5 premium, GPU-accelerated entrance animations.

- `spring` (Default) — Bouncy, physical, lively
- `slide` — Smooth directional slide-in
- `bloom` — Gentle scale and fade up
- `flip` — 3D rotation flip
- `fade` — Simple opacity fade

```javascript
NotifyX.info('New message arrived', { animation: 'bloom' });
```

---

## ⚙️ Global Configuration

Configure default behaviors once to apply to all toasts.

```javascript
NotifyX.configure({
  theme: 'glass',
  animation: 'spring',
  position: 'top-right',
  duration: 4000,
  maxToasts: 3,
  pauseOnHover: true
});
```

---

## 🔄 Migration Guide (v3 → v4)

**All v3 API methods are fully backward-compatible!** You can safely upgrade without breaking existing code.

**What's new:**
- Imports have been consolidated. You can now import types directly: `import type { ToastOptions } from 'notifyx';`
- `.stream()` now returns a `StreamController` object instead of just an ID.
- The `ai` property has been added to `ToastOptions` for agent metadata.
- CSS size is drastically optimized and GPU-accelerated.
- Added native touch/swipe-to-dismiss support on mobile devices.

---

<div align="center">
Generated for NotifyX by A Awal Hadi — <a href="https://github.com/awalhadi/notifyx">awalhadi/notifyx</a>
</div>

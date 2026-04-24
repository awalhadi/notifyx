<div align="center">

# 🚀 NotifyX v4

### The professional-grade notification library built for the AI era.
**Visually stunning for designers, robust enough for complex architectures, and optimized for real-time AI streaming.**

[![npm version](https://img.shields.io/npm/v/notifyx?color=success&style=flat-square)](https://www.npmjs.com/package/notifyx)
[![npm downloads](https://img.shields.io/npm/dm/notifyx?style=flat-square)](https://www.npmjs.com/package/notifyx)
[![bundle size](https://img.shields.io/bundlephobia/minzip/notifyx?style=flat-square)](https://bundlephobia.com/package/notifyx)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/notifyx?style=flat-square)](LICENSE)

[Demo](https://github.com/awalhadi/notifyx) • [Installation](#-installation) • [AI Integration](#-ai--mcp-integration) • [Stack UI](#-stack-based-ui--priority-queue) • [Themes](#-zero-dependency-theme-system)

</div>

---

## ✨ Why NotifyX?

NotifyX v4 is engineered from the ground up to solve the challenges of modern web applications. Whether you are building an LLM-powered agent workflow, a Next.js SaaS, or an interactive dashboard, NotifyX delivers a pristine user experience.

### Competitive Differentiation

| Feature | NotifyX v4 | react-hot-toast | sonner | react-toastify |
| :--- | :---: | :---: | :---: | :---: |
| **Stack-Based UI** | ✅ Elegant 3D | ❌ | ✅ | ❌ |
| **AI/Streaming API** | ✅ Native | ❌ | ❌ | ❌ |
| **MCP-Ready** | ✅ | ❌ | ❌ | ❌ |
| **Web Animations API** | ✅ GPU Accelerated | ❌ | limited | limited |
| **Theme System** | ✅ 6 robust themes | ❌ | partial | partial |
| **Vanilla JS Support**| ✅ | ❌ | ❌ | partial |
| **Priority Queue** | ✅ | ❌ | ❌ | ❌ |
| **Zero Dependencies** | ✅ | ✅ | ✅ | ❌ |
| **Bundle < 7KB** | ✅ | ✅ | ✅ | ❌ |

---

## 📦 Installation

```bash
# npm
npm install notifyx

# pnpm
pnpm add notifyx

# bun
bun add notifyx
```

### Setup

```javascript
import NotifyX from 'notifyx';
import 'notifyx/style.css'; // Required for UI styling

NotifyX.success('Ready for the AI era! 🚀');
```

---

## 🏗 Stack-Based UI & Priority Queue

NotifyX v4 departs from legacy list-based rendering, introducing a **Stack-Based Architecture**. 
Notifications gracefully stack with dynamic `transform: scale()` and `translateY()` 3D layering, saving vertical screen real estate while feeling incredibly premium.

Under the hood, the **Priority Queue Manager** handles influxes of notifications perfectly. If an application throws 20 events at once, NotifyX will instantly display the allowed maximum (`maxToasts`), gracefully holding the rest in memory and seamlessly rendering them as active toasts are dismissed.

---

## 🤖 AI & MCP Integration

NotifyX provides first-class support for AI metadata, rendering Model Context Protocol (MCP) tool calls, token counts, and latency flawlessly.

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

It renders elegantly with a custom `✦` icon, specialized color palettes, and a structured metadata bar showcasing agent workflow steps.

---

## 🌊 Streaming API

LLMs stream responses token-by-token. NotifyX's `StreamingBridge` ensures smooth, jank-free progressive text rendering.

```javascript
const stream = NotifyX.stream("Thinking...", {
  ai: { model: "gpt-4o", streaming: true },
  position: "bottom-right"
});

// Stream chunks as they arrive
stream.update("I have found ");
stream.update("the specific bug ");
stream.update("in your code.");

// Finalize
stream.success("Analysis complete!", {
  ai: { streaming: false, latencyMs: 850 }
});
```
*A blinking `▋` cursor is natively rendered while streaming is active!*

---

## ⏳ Promise API

Manage asynchronous workflows beautifully.

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

---

## 🎨 Zero-Dependency Theme System

NotifyX v4 ships with 6 distinct, highly-polished themes powered by Vanilla CSS Custom Properties—no Tailwind required.

- `auto` (Default) — Adapts to OS preference
- `light` — Pristine, modern white
- `dark` — Deep, sleek dark mode
- `glass` — Premium frosted glassmorphism 
- `minimal` — Flat, pure content focus
- `brutal` — Monochrome, monospace brutalist

**Usage:**
```javascript
// Globally
NotifyX.setTheme('glass');

// Per-Toast
NotifyX.success('Task complete', { theme: 'brutal' });
```

---

## 🎬 Animation Engine

Powered by the **Web Animations API** for buttery-smooth 60fps rendering, bypassing Main Thread blocking.

- `spring` (Default) — Bouncy, physical, lively
- `slide` — Smooth directional translation
- `bloom` — Elegant scale and fade
- `flip` — 3D spatial rotation
- `fade` — Simple opacity transition

```javascript
NotifyX.info('System update', { animation: 'bloom' });
```

---

## 🛠️ Advanced Subsystem Accessors

Because NotifyX v4 is built on a modular architecture, we expose the underlying subsystems directly on the `NotifyX` object for advanced control:

- **`NotifyX.queue`**: Access the Min-Heap priority queue (`ToastQueue`) instance. Manage overflow, peak queued states, or manually flush items.
- **`NotifyX.animation`**: Access the `AnimationEngine` directly. Hook into the Web Animations API (WAAPI) engine to apply `staggerEnter`, `pulse`, or `shake` animations to your own UI elements.
- **`NotifyX.stream_bridge`**: Access the `StreamBridge` utility. Use its `fromIterable` and `pipe` helpers to map arbitrary LLM data streams directly into DOM nodes.

---

## ⚙️ Global Configuration

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

<div align="center">
Engineered for the modern web — <a href="https://github.com/awalhadi/notifyx">awalhadi/notifyx</a>
</div>

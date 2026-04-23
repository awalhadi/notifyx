# NotifyX v4 Architecture

## Overview

NotifyX v4 has been completely re-architected from the ground up to serve as a high-performance, AI-native toast notification library. The system emphasizes modularity, professional-grade UX (Stack-based UI, Web Animations), and robust integration for Agentic/LLM workflows (Streaming, Priority Queuing). 

Despite this advanced feature set, it maintains **Zero Runtime Dependencies** and a bundle size of **< 7KB (gzipped)**.

## Core Architectural Pillars

### 1. Zero-Dependency Theming Engine
We have eliminated external CSS frameworks (e.g., Tailwind) in favor of a pure Vanilla CSS Custom Property architecture.
- **Themes**: `auto`, `light`, `dark`, `glass`, `minimal`, `brutal`.
- **Benefits**: Perfect encapsulation, zero build-step requirement for consumers, and massive bundle size reduction.

### 2. Stack-Based Notification UI
Unlike traditional list-based rendering, NotifyX v4 utilizes a 3D-effect stack-based rendering engine.
- Toasts are layered with dynamic `transform: scale()` and `translateY()` calculations.
- Implements `contain: content` to ensure layout isolation without clipping absolutely positioned interactive elements.

### 3. Modular Subsystems

The library is divided into specialized managers, orchestrated by the main `NotifyX` static facade:

- **QueueManager (Priority Queue)**
  Manages toast lifecycle, maximum simultaneous toasts (`maxToasts`), and handles overflow logic. It ensures critical alerts (e.g., errors) can bypass standard queues, while streaming toasts hold their position efficiently.

- **AnimationEngine (Web Animations API)**
  Leverages the native browser Web Animations API (WAAPI) for GPU-accelerated entrance and exit animations, falling back gracefully to CSS transitions if needed. Presets include `spring`, `slide`, `bloom`, `flip`, and `fade`.

- **StreamingBridge (AI/LLM Support)**
  A dedicated module for handling progressive token rendering from LLMs. It manages debounced DOM updates, blinking cursor injection (`▋`), and transition from streaming state to finalized state without UI jank.

## Project Structure

```text
src/
├── index.ts                # Main facade (NotifyX static class)
├── core/
│   ├── QueueManager.ts     # Priority queue & lifecycle
│   ├── AnimationEngine.ts  # WAAPI integration
│   ├── StreamingBridge.ts  # Token streaming handlers
│   └── DOMManager.ts       # Container & layout isolation
├── types/
│   └── index.ts            # Extensive TypeScript definitions
├── utils/
│   └── dom.ts              # Helpers and accessibility rules
└── styles/
    ├── base.css            # Stack layout & core variables
    ├── themes.css          # Glassmorphism, brutal, etc.
    └── animations.css      # Fallback CSS animations
```

## AI & MCP Integration (The "Agentic UX")

NotifyX treats AI interactions as first-class citizens:
- **`NotifyX.stream()`**: Returns a `StreamController` that maintains a persistent reference to a specific DOM node, allowing rapid `.update()` calls.
- **Metadata Rendering**: Designed to visually parse and format `ToastOptions.ai` (model names, tool calls, latency, tokens) into a dedicated sub-bar within the toast.

## Build & Distribution Strategy

- **Vite + Terser**: Optimized multi-pass compression.
- **Formats**: 
  - `ESM` (`notifyx.es.js`) - Tree-shakeable for modern React/Next.js/Vue apps.
  - `UMD` (`notifyx.min.js`) - robustly configured to attach directly to `globalThis` for legacy environments.
- **Side Effects**: Marked `sideEffects: false` for pure JS modules, ensuring aggressive tree-shaking in consumer bundlers.

## Design Philosophy
1. **Developer Experience (DX)**: Promise API (`NotifyX.promise()`) and static methods provide an intuitive surface area.
2. **User Experience (UX)**: Stack-based layout, native swipe-to-dismiss, and 60fps animations.
3. **Future-Proof**: Built explicitly to handle the asynchronous, streaming nature of modern AI agents.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2026-04-24

### Added
- **AI/LLM Streaming Bridge**: Native streaming API (`NotifyX.stream()`) for progressive token rendering.
- **Stack-Based UI Architecture**: Elegant, non-overlapping toast stacking with dynamic scaling and transforms.
- **Priority Queue Manager**: Intelligent queuing system to manage toast limits and display priorities.
- **Web Animations API Engine**: 5 premium, GPU-accelerated animation presets (`spring`, `slide`, `bloom`, `flip`, `fade`).
- **Advanced Theme Engine**: 6 zero-dependency CSS themes including `glass`, `brutal`, and `minimal`.
- **Promise API**: Robust asynchronous state management with `NotifyX.promise()`.
- **AI Metadata Support**: Custom UI for MCP tool calls, latency, and token metrics.
- **Swipe-to-Dismiss**: Native gestural interactions for touch devices.

### Changed
- **Zero-Dependency CSS**: Fully replaced Tailwind CSS with a scalable vanilla CSS custom property architecture.
- **API Modernization**: Transitioned legacy class-based implementations to streamlined static methods (`NotifyX.success()`).
- **Layout Robustness**: Re-architected DOM rendering, resolving clipping bugs by shifting from `contain: strict` to `contain: content`.
- **UMD Build Fixes**: Fixed global scope exports in UMD builds. Main API remains under 7KB gzipped.

### Removed
- Removed all external CSS framework dependencies (Tailwind).
- Removed legacy UI clipping rules.

## [3.0.0] - Previous Major Release
- Initial introduction of static methods and basic theming.

## [2.3.1] - Previous Minor Release
- Framework-agnostic toast notifications.
- TypeScript support with full type definitions.

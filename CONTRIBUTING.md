# Contributing to NotifyX v4

Welcome to the NotifyX repository! NotifyX v4 is an advanced, AI-native notification library. We value professional-grade architecture, pristine UI/UX, and rigorous performance optimizations.

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/awalhadi/notifyx.git
cd notifyx
```

2. Install dependencies (Bun preferred):
```bash
bun install
```

3. Run the development server (interactive playground):
```bash
bun run dev
```

4. Build the project:
```bash
bun run build:all
```

## Architectural Guidelines

When contributing to NotifyX, keep our core pillars in mind:
1. **Zero Dependencies**: Never introduce external runtime packages.
2. **Vanilla CSS**: We do not use Tailwind or CSS-in-JS. All styling must use vanilla CSS with Custom Properties in `src/styles/`.
3. **AI-Native First**: Ensure new features degrade gracefully but accommodate LLM streaming and dynamic metadata.
4. **Performance**: Keep the bundle size strictly under 7KB gzipped. Rely on native browser APIs (e.g., Web Animations API).

## Modifying Core Modules

NotifyX is highly modularized:
- **`QueueManager.ts`**: Handle toast limits and priorities here.
- **`AnimationEngine.ts`**: Modify Web Animations API (WAAPI) presets here.
- **`StreamingBridge.ts`**: Update LLM token stream handling here.
- **Styles (`src/styles/`)**: Implement new themes (glass, neon, etc.) or layout rules (Stack UI) here. Note: Toasts must support `contain: content` layout isolation.

## Code Style

### TypeScript Best Practices

- **Strict Typing**: Avoid `any`. Use generic types where applicable.
- **Immutability**: Prefer `readonly` arrays and objects. 
- **Method Signatures**: Use JSDoc heavily for public-facing methods.

```typescript
/**
 * Triggers a premium 3D flip entrance animation.
 * @param element - The DOM node to animate
 * @param config - Animation config overrides
 */
export const triggerFlipAnimation = (element: HTMLElement, config?: AnimationConfig) => { ... }
```

### CSS Guidelines

- Use CSS Variables for theming (`--nx-bg`, `--nx-text`, `--nx-border`).
- Ensure all animations use `transform` or `opacity` to guarantee GPU acceleration.
- Respect mobile gestures (touch/swipe-to-dismiss) in your styling.

## Testing & Bundle Verification

Before submitting a PR, verify the build outputs and bundle size:

```bash
bun run verify
```

Check the size of `dist/notifyx.min.js`. If your PR increases the bundle size significantly, provide a strong justification.

## Pull Request Process

1. **Create a branch**: `git checkout -b feature/your-awesome-feature`
2. **Commit conventional messages**: `feat: add neon theme variant` or `fix: resolve clipping on stack UI`
3. **Update Docs**: Ensure `README.md`, `CHANGELOG.md`, and `ARCHITECTURE.md` are updated if architectural or API changes occur.
4. **Submit PR**: Include screenshots/GIFs for any UI/UX changes!

Thank you for helping us build the best notification library for the AI era! 🚀

# NotifyX Architecture

## Overview

NotifyX is a lightweight, framework-agnostic toast notification library built with TypeScript. The architecture emphasizes simplicity, maintainability, and bundle size optimization.

## Design Principles

1. **Zero Runtime Dependencies** - No external dependencies in production
2. **Type Safety** - Full TypeScript support with comprehensive type definitions
3. **Tree-Shakeable** - ES modules with proper side-effect declarations
4. **Performance First** - DOM caching, minimal re-renders, efficient selectors
5. **Maintainable** - Clean separation of concerns, single responsibility principle

## Project Structure

```
src/
├── index.ts              # Main entry point and NotifyX class
├── constants/            # Static configuration values
│   ├── animations.ts     # Animation class constants
│   ├── defaults.ts       # Default configuration
│   ├── positions.ts      # Position type and constants
│   └── index.ts          # Barrel export
├── types/                # TypeScript type definitions
│   └── index.ts          # All type exports
├── utils/                # Utility functions
│   └── dom.ts            # DOM manipulation helpers
└── styles/               # CSS styles (not bundled in JS)
    ├── base.css
    ├── toast.css
    ├── animations.css
    └── themes/
```

## Core Architecture

### NotifyX Class

The main `NotifyX` class is a static class (singleton pattern) that provides:
- Public API methods: `show()`, `success()`, `error()`, `warning()`, `info()`, `clear()`
- Private helper methods for DOM manipulation and lifecycle management

Key design decisions:
- **Static methods** - No instantiation needed, simple API
- **Method extraction** - Each private method has a single responsibility
- **Immutable operations** - No shared mutable state beyond DOM

### Type System

```typescript
// Public types exported to consumers
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: Position;
  dismissible?: boolean;
  onClose?: () => void;
  maxToasts?: number;
}

// Internal normalized type
type NormalizedToastOptions = Required<ToastOptions>;
```

### DOM Utilities

The `utils/dom.ts` module handles:
- Container creation and retrieval
- Performance optimization via Map-based caching
- Accessibility attributes (ARIA labels)

**Caching Strategy:**
- Containers are cached by position to avoid repeated DOM queries
- Cache validation checks if element still exists in document
- Fallback to DOM query if cache is stale

### Constants

All magic strings and configuration values are centralized:
- `POSITIONS` - Valid position values (type-safe object)
- `ANIMATION_CLASSES` - CSS class names for animations
- `DEFAULT_OPTIONS` - Default configuration with `as const`

Benefits:
- Single source of truth
- Easy to update configuration
- Tree-shaking friendly (unused constants are removed)

## Build Configuration

### Vite + Terser

Production build uses Vite with Terser minification:
- **Multi-pass compression** - 2 passes for optimal size
- **Top-level mangling** - Renames top-level variables safely
- **Dead code elimination** - Removes unused code paths
- **Comment preservation** - Keeps `/*!` and `@license` comments

### Output Formats

- **ESM** (`notifyx.es.js`) - For modern bundlers, tree-shakeable
- **UMD** (`notifyx.min.js`) - For browser `<script>` tags and CommonJS

### CSS Strategy

CSS is built separately using Tailwind CLI:
- Not bundled in JS (prevents CSS-in-JS overhead)
- Minified and purged of unused styles
- Imported separately by consumers

## Performance Optimizations

1. **Container Caching** - Map-based cache for container lookups
2. **Event Delegation** - Minimal event listeners (one per toast)
3. **CSS Animations** - Hardware-accelerated transforms
4. **Small Bundle** - ~3.2KB minified, ~1.4KB gzipped (UMD)
5. **Tree-Shaking** - `sideEffects: false` in package.json

## Bundle Size Strategy

### What's Included

- Core NotifyX class with public API
- Type definitions (separate .d.ts files)
- Minified CSS (separate file)

### What's Excluded from npm Package

Using explicit file patterns in `package.json`:
```json
"files": [
  "dist/*.js",
  "dist/*.css",
  "dist/*.d.ts",
  "README.md",
  "LICENSE"
]
```

This excludes:
- Source maps (if generated)
- Build artifacts
- Development files
- Test files

## API Design Philosophy

### Simplicity First

```typescript
// Simple, intuitive API
NotifyX.success('Operation complete!');

// Progressive enhancement for advanced use
NotifyX.show({
  message: 'Custom notification',
  type: 'info',
  duration: 5000,
  position: 'bottom-right',
  onClose: () => console.log('closed')
});
```

### TypeScript-First

- Full IntelliSense support
- Type inference for options
- JSDoc comments for better IDE hints
- Exported types for consumer use

### Framework Agnostic

Works in:
- Vanilla JavaScript
- React, Vue, Angular, Svelte
- Server-rendered apps (SSR-safe with `typeof window` check)

## Testing Strategy (Recommended)

For a production-grade library, consider adding:

1. **Unit Tests** - Vitest for logic testing
2. **E2E Tests** - Playwright for DOM interactions
3. **Type Tests** - Ensure type safety
4. **Bundle Size Tests** - Size-limit for regression prevention

Example `package.json` additions:
```json
{
  "scripts": {
    "test": "vitest",
    "test:size": "size-limit"
  },
  "size-limit": [
    {
      "path": "dist/notifyx.min.js",
      "limit": "4 KB"
    }
  ]
}
```

## Versioning & Release

Follow semantic versioning:
- **Patch** (2.2.x) - Bug fixes, no API changes
- **Minor** (2.x.0) - New features, backwards compatible
- **Major** (x.0.0) - Breaking changes

## Future Enhancements (Without Over-Engineering)

Potential improvements that maintain simplicity:

1. **Progress Bar** - Visual countdown for auto-dismiss
2. **Action Buttons** - Optional buttons within toast
3. **Icon Support** - Customizable icons per type
4. **Sound Effects** - Optional audio notifications
5. **Queue Management** - Advanced toast queuing strategies

Key principle: Each enhancement should be opt-in and not increase base bundle size significantly.

## Maintenance Guidelines

### Code Style

- Use functional programming patterns where appropriate
- Prefer `const` over `let`, avoid `var`
- Use type inference when obvious, explicit types when clarity matters
- Keep functions small and focused (< 20 lines ideally)

### Adding New Features

1. Consider bundle size impact
2. Ensure TypeScript types are exported
3. Add JSDoc comments for public APIs
4. Update CHANGELOG and README
5. Add examples

### Refactoring Checklist

Before refactoring:
- ✅ All types are correct
- ✅ No breaking changes to public API
- ✅ Bundle size not increased significantly
- ✅ Build passes without warnings
- ✅ Examples still work

## Conclusion

NotifyX is designed to be a lean, maintainable, and developer-friendly toast library. The architecture prioritizes clarity over cleverness, with a focus on real-world usability and excellent TypeScript support.

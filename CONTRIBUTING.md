# Contributing to NotifyX

Thank you for considering contributing to NotifyX! This guide will help you maintain code quality and consistency.

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/awalhadi/notifyx.git
cd notifyx
```

2. Install dependencies:
```bash
bun install
```

3. Run the development server:
```bash
bun run dev
```

4. Build the project:
```bash
bun run build:all
```

## Project Structure

```
notifyx/
├── src/                  # Source code
│   ├── index.ts         # Main entry point
│   ├── constants/       # Static values
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   └── styles/          # CSS files
├── dist/                # Build output (generated)
├── example/             # Demo/testing page
└── ARCHITECTURE.md      # Architecture documentation
```

## Code Style Guidelines

### TypeScript Best Practices

1. **Use `const` by default**
   ```typescript
   // ✅ Good
   const message = 'Hello';
   
   // ❌ Avoid
   let message = 'Hello';
   ```

2. **Prefer type inference**
   ```typescript
   // ✅ Good - type is inferred
   const count = 5;
   
   // ❌ Unnecessary
   const count: number = 5;
   ```

3. **Use readonly for immutable data**
   ```typescript
   // ✅ Good
   export const CONFIG = {
     timeout: 3000
   } as const;
   ```

4. **Export types explicitly**
   ```typescript
   // ✅ Good
   export type { ToastOptions, ToastType };
   
   // ❌ Avoid mixed exports
   export { type ToastOptions };
   ```

### Function Guidelines

1. **Keep functions small** - Ideally under 20 lines
2. **Single responsibility** - Each function does one thing well
3. **Use descriptive names** - Name should explain what it does
4. **Add JSDoc for public APIs** - Help IDE IntelliSense

Example:
```typescript
/**
 * Creates a toast container for a specific position
 * @param position - The screen position
 * @returns The container element
 * @internal
 */
const createToastContainer = (position: Position): HTMLElement => {
  // Implementation
};
```

### Naming Conventions

- **Constants**: `UPPER_SNAKE_CASE`
- **Functions**: `camelCase`
- **Classes**: `PascalCase`
- **Types/Interfaces**: `PascalCase`
- **Private methods**: Prefix with `private static`

### Comment Guidelines

1. **Use JSDoc for public APIs**
   ```typescript
   /**
    * Display a success toast notification
    * @param message - The message to display
    * @param options - Optional configuration overrides
    * @public
    */
   public static success(message: string, options?: Partial<ToastOptions>): void
   ```

2. **Use inline comments sparingly** - Code should be self-documenting
   ```typescript
   // ✅ Good - explains WHY
   // Prevent memory leaks by removing empty containers
   if (container.childNodes.length === 0) {
     container.remove();
   }
   
   // ❌ Bad - explains WHAT (obvious from code)
   // Remove the container
   container.remove();
   ```

3. **Use license headers** - Preserved in minified output
   ```typescript
   /*!
    * @license MIT
    * NotifyX - A lightweight toast notification library
    * @preserve
    */
   ```

## Adding New Features

### 1. Plan First

- Does this feature belong in the core library?
- Will it increase bundle size significantly?
- Is it configurable/opt-in?
- Does it maintain backwards compatibility?

### 2. Update Types

Add or update types in `src/types/index.ts`:
```typescript
export interface ToastOptions {
  // ... existing options
  newOption?: boolean; // Add with ? for optional
}
```

### 3. Implement Feature

Keep changes isolated to relevant files:
- Core logic → `src/index.ts`
- DOM utilities → `src/utils/dom.ts`
- Constants → `src/constants/`
- Styles → `src/styles/`

### 4. Add JSDoc Comments

Document new public APIs:
```typescript
/**
 * Brief description of the method
 * @param paramName - Description
 * @returns Description of return value
 * @example
 * ```ts
 * NotifyX.newMethod('example');
 * ```
 */
```

### 5. Test Your Changes

```bash
# Build and check for errors
bun run build:all

# Check bundle sizes
ls -lh dist/

# Test in example page
bun run dev
# Open http://localhost:5173/example/
```

### 6. Update Documentation

- Update `README.md` with usage examples
- Add to `CHANGELOG.md` (following semantic versioning)
- Update `ARCHITECTURE.md` if architectural changes

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow code style guidelines
   - Add JSDoc comments
   - Keep commits atomic and well-described

3. **Test thoroughly**
   ```bash
   bun run build:all
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add progress bar support"
   ```

   Commit message format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `refactor:` - Code refactoring
   - `perf:` - Performance improvements
   - `test:` - Test additions
   - `chore:` - Build/tooling changes

5. **Create pull request**
   - Reference any related issues
   - Describe what changed and why
   - Include before/after bundle sizes if relevant

## Bundle Size Considerations

Always check bundle size impact:

```bash
# Before changes
bun run build:all
ls -lh dist/notifyx.min.js

# After changes
bun run build:all
ls -lh dist/notifyx.min.js
```

**Guidelines:**
- Keep UMD bundle under 4KB minified
- Avoid large dependencies
- Use tree-shakeable code
- Consider lazy loading for optional features

## Common Patterns

### Adding a New Toast Type

1. Update type definition:
```typescript
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'custom';
```

2. Add corresponding method:
```typescript
public static custom(message: string, options?: Partial<ToastOptions>): void {
  this.show({ ...options, message, type: 'custom' });
}
```

3. Add CSS styles in `src/styles/toast.css`

### Adding Configuration Options

1. Update `ToastOptions` interface
2. Update `DEFAULT_OPTIONS` if needed
3. Use the option in implementation
4. Document in README

### Performance Optimization

- Use `Map` for caching
- Minimize DOM queries
- Batch DOM updates
- Use event delegation
- Prefer CSS animations over JS

## Questions or Issues?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to NotifyX! 🚀

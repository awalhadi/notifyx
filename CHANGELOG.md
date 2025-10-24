# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive JSDoc comments for better IDE IntelliSense support
- DOM container caching for improved performance
- Type-safe exports with explicit Position type
- NormalizedToastOptions internal type for better type safety
- License header comment preservation in minified builds

### Changed
- Refactored NotifyX class with smaller, focused methods
- Improved code organization following single responsibility principle
- Enhanced TypeScript type definitions with better documentation
- Optimized package.json files array to reduce npm package size
- Updated build configuration for production-grade minification

### Performance
- Added Map-based caching for container lookups
- Reduced DOM queries through intelligent caching
- Optimized Terser configuration with multi-pass compression

### Documentation
- Added ARCHITECTURE.md with comprehensive design documentation
- Added CONTRIBUTING.md with development guidelines
- Added inline JSDoc for all public APIs

## [2.3.0] - Previous Release

### Features
- Framework-agnostic toast notifications
- TypeScript support with full type definitions
- Multiple toast types: success, error, warning, info
- Configurable positions: top-right, top-left, bottom-right, bottom-left
- Auto-dismiss with configurable duration
- Manual dismiss with close button
- Maximum toast limit
- Smooth CSS animations
- Dark mode support
- Accessibility features (ARIA attributes)
- UMD and ESM builds
- Separate CSS file for flexible styling

---

## Version Guidelines

### Types of Changes
- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes
- **Performance** - Performance improvements

### Semantic Versioning
- **MAJOR** (x.0.0) - Breaking changes
- **MINOR** (0.x.0) - New features, backwards compatible
- **PATCH** (0.0.x) - Bug fixes, no API changes

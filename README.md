# 🎉 NotifyX - Lightweight, Framework-Agnostic Toast Notifications  
*A simple, customizable toast library for JavaScript/TypeScript with zero dependencies.*  
[![npm](https://img.shields.io/npm/v/notifyx)](https://www.npmjs.com/package/notifyx) [![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)  

---
# NotifyX

A lightweight, framework-agnostic toast notification library with built-in Tailwind CSS styles. Optimized for Tailwind CSS v4 and Vite v7.

## Features

- 🚀 **Framework Agnostic** - Works with any JavaScript framework or vanilla JS
- 🎨 **Built-in Styles** - Includes optimized Tailwind CSS styles that work without Tailwind installation
- 🌙 **Dark Mode Support** - Automatic dark mode detection and styling
- ⚡ **Lightweight** - Minimal bundle size with tree-shaking support
- ♿ **Accessible** - ARIA attributes and keyboard navigation support
- 🎭 **Smooth Animations** - CSS-based animations with fallbacks
- 📱 **Responsive** - Works on all screen sizes
- 🔧 **TypeScript** - Full TypeScript support with type definitions

## Installation

## 🚀 Features  
✅ **Framework Agnostic**: Works with React, Vue, Angular, Svelte, or plain HTML/JS.  
✅ **TypeScript Support**: Built-in types for seamless integration.  
✅ **Customizable**: Adjust styles, positions, animations, and durations.  
✅ **Tailwind CSS Ready**: Pre-styled with utility classes (override-friendly).  
✅ **Lightweight**: ~2KB minified + gzipped.  

---

## 📦 Installation  
```bash
npm install notifyx
# or
yarn add notifyx
# or
bun add notifyx

# or via CDN
<script type="module">
import notifyx from 'https://cdn.jsdelivr.net/npm/notifyx@2.1.2/+esm'
</script>
```
## 🛠️ Usage 
### Basic Example

```html
<!-- Include CSS (if not using a bundler) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notifyx@2.1.1/dist/notifyx.min.css">

<!-- Show a success toast -->
<script>
  NotifyX.success("Task completed successfully!");
</script>
```

### Advanced Configuration
```typescript
// In a TypeScript/ESM project
import { NotifyX } from 'notifyx';
import 'notifyx/dist/notifyx.min.css';

NotifyX.show({
  message: "User logged in",
  type: "success",
  duration: 5000,
  position: "bottom-left",
  dismissible: true,
  onClose: () => console.log("Toast closed!")
});
```
## 🎨 Customization
### Positions
```typescript
NotifyX.info("Message", { position: "top-right" });  // Default
NotifyX.success("Message", { position: "top-left" });
NotifyX.warning("Message", { position: "bottom-right" });
NotifyX.error("Message", { position: "bottom-left" });
```
### CSS Variables
Override default styles globally:

```css
:root {
  --toast-bg-success: #d4edda;
  --toast-bg-error: #f8d7da;
  --toast-color-info: #0c5460;
  --toast-duration: 3s;
}
```


## Quick Start

### Basic Usage

```javascript
import NotifyX from 'notifyx';
// Import the built CSS
import 'notifyx/dist/notifyx.min.css';

// Show different types of notifications
NotifyX.success('Operation completed successfully!');
NotifyX.error('Something went wrong!');
NotifyX.warning('Please check your input.');
NotifyX.info('Here is some information.');
```

### Advanced Usage

```javascript
import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';

// Custom options
NotifyX.show({
  message: 'Custom notification with options',
  type: 'success',
  duration: 5000,
  position: 'bottom-right',
  dismissible: true,
  onClose: () => console.log('Notification closed')
});

// Clear all notifications
NotifyX.clear();
```

## API Reference

### Methods

#### `NotifyX.show(options: ToastOptions)`
Display a custom notification.

#### `NotifyX.success(message: string, options?: Partial<ToastOptions>)`
Display a success notification.

#### `NotifyX.error(message: string, options?: Partial<ToastOptions>)`
Display an error notification.

#### `NotifyX.warning(message: string, options?: Partial<ToastOptions>)`
Display a warning notification.

#### `NotifyX.info(message: string, options?: Partial<ToastOptions>)`
Display an info notification.

#### `NotifyX.clear()`
Clear all active notifications.

### Options

```typescript
interface ToastOptions {
  message: string;           // Required: The message to display
  type?: ToastType;         // Optional: 'success' | 'error' | 'warning' | 'info'
  duration?: number;        // Optional: Duration in milliseconds (0 = persistent)
  position?: Position;      // Optional: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  dismissible?: boolean;    // Optional: Whether the toast can be dismissed
  onClose?: () => void;     // Optional: Callback when toast is closed
  maxToasts?: number;       // Optional: Maximum number of toasts to show
}
```

### Constants

```typescript
import { POSITIONS, ANIMATION_CLASSES, DEFAULT_OPTIONS } from 'notifyx';

// Available positions
POSITIONS.TOP_RIGHT
POSITIONS.TOP_LEFT
POSITIONS.BOTTOM_RIGHT
POSITIONS.BOTTOM_LEFT

// Animation classes
ANIMATION_CLASSES.enter
ANIMATION_CLASSES.exit
ANIMATION_CLASSES.slideEnter
ANIMATION_CLASSES.slideExit

// Default options
DEFAULT_OPTIONS
```

## Styling

### Using Built-in CSS (Recommended)

The package includes optimized CSS that works without Tailwind CSS:

```javascript
import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';
```

### Custom Styling

You can override the default styles by targeting the CSS classes:

```css
.notifyx {
  /* Custom styles */
}

.notifyx-success {
  /* Custom success styles */
}

.notifyx-error {
  /* Custom error styles */
}
```

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+



### 📄 License
MIT License © 2024 [Md A Awal Hadi](https://github.com/awalhadi)

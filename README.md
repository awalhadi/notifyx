# 🚀 NotifyX

> **A modern, lightweight toast notification library with beautiful animations and zero dependencies**

[![npm](https://img.shields.io/npm/v/notifyx)](https://www.npmjs.com/package/notifyx)
[![bundle size](https://img.shields.io/bundlephobia/min/notifyx)](https://bundlephobia.com/package/notifyx)
[![license](https://img.shields.io/npm/l/notifyx)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## ✨ Features

- 🎯 **Framework Agnostic** - Works with React, Vue, Angular, Svelte, or vanilla JS
- 🎨 **Beautiful Design** - Modern UI with smooth animations and dark mode support
- ⚡ **Lightweight** - Only ~3KB minified + gzipped
- 🔧 **TypeScript Ready** - Full type definitions included
- ♿ **Accessible** - ARIA attributes and keyboard navigation
- 🌙 **Dark Mode** - Automatic dark mode detection
- 📱 **Responsive** - Perfect on all screen sizes
- 🎭 **Smooth Animations** - CSS-based animations with fallbacks
- 🎛️ **Highly Customizable** - Easy to style and configure

## 🎮 Live Demo

Try it out! Click the buttons below to see NotifyX in action:

<div align="center">
  <img src="https://img.shields.io/badge/Demo-Online-green?style=for-the-badge&logo=github" alt="Demo Online">
</div>

## 📦 Installation

```bash
# npm
npm install notifyx

# yarn
yarn add notifyx

# pnpm
pnpm add notifyx

# bun
bun add notifyx
```

## 🚀 Quick Start

### 1. Import and Setup

```javascript
import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';
```

### 2. Show Notifications

```javascript
// Success notification
NotifyX.success('Payment completed successfully! 🎉');

// Error notification
NotifyX.error('Something went wrong! Please try again.');

// Warning notification
NotifyX.warning('Please check your input before proceeding.');

// Info notification
NotifyX.info('Your session will expire in 5 minutes.');
```

### 3. Advanced Usage

```javascript
// Custom notification with options
NotifyX.show({
  message: 'User profile updated successfully!',
  type: 'success',
  duration: 5000,
  position: 'bottom-right',
  dismissible: true,
  onClose: () => console.log('Toast closed!')
});

// Clear all notifications
NotifyX.clear();
```

## 🎨 Examples & Use Cases

### Basic Notifications

```javascript
// Success messages
NotifyX.success('Order placed successfully!');
NotifyX.success('File uploaded successfully!');
NotifyX.success('Settings saved!');

// Error messages
NotifyX.error('Network connection failed');
NotifyX.error('Invalid email address');
NotifyX.error('Permission denied');

// Warning messages
NotifyX.warning('Your session expires soon');
NotifyX.warning('Please save your changes');
NotifyX.warning('Low disk space detected');

// Info messages
NotifyX.info('New message received');
NotifyX.info('System maintenance in 10 minutes');
NotifyX.info('Your data is being processed');
```

### Form Validation

```javascript
// Form submission
function handleSubmit() {
  if (!email) {
    NotifyX.error('Please enter your email address');
    return;
  }
  
  if (!password) {
    NotifyX.error('Password is required');
    return;
  }
  
  // Submit form
  NotifyX.success('Form submitted successfully!');
}
```

### API Responses

```javascript
// API success
async function fetchData() {
  try {
    const response = await api.get('/users');
    NotifyX.success(`Loaded ${response.data.length} users`);
  } catch (error) {
    NotifyX.error('Failed to load users');
  }
}
```

### User Actions

```javascript
// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    NotifyX.success('Copied to clipboard!');
  }).catch(() => {
    NotifyX.error('Failed to copy');
  });
}

// Delete confirmation
function deleteItem(id) {
  if (confirm('Are you sure?')) {
    NotifyX.success('Item deleted successfully');
  }
}
```

## 📚 API Reference

### Methods

| Method | Description | Example |
|--------|-------------|---------|
| `NotifyX.show(options)` | Display custom notification | `NotifyX.show({ message: 'Hello', type: 'info' })` |
| `NotifyX.success(message, options?)` | Success notification | `NotifyX.success('Success!')` |
| `NotifyX.error(message, options?)` | Error notification | `NotifyX.error('Error!')` |
| `NotifyX.warning(message, options?)` | Warning notification | `NotifyX.warning('Warning!')` |
| `NotifyX.info(message, options?)` | Info notification | `NotifyX.info('Info!')` |
| `NotifyX.clear()` | Clear all notifications | `NotifyX.clear()` |

### Options

```typescript
interface ToastOptions {
  message: string;           // Required: Message to display
  type?: ToastType;         // Optional: 'success' | 'error' | 'warning' | 'info'
  duration?: number;        // Optional: Duration in ms (0 = persistent)
  position?: Position;      // Optional: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  dismissible?: boolean;    // Optional: Whether toast can be dismissed
  onClose?: () => void;     // Optional: Callback when toast closes
  maxToasts?: number;       // Optional: Maximum number of toasts (default: 5)
}
```

### Positions

```javascript
// Available positions
NotifyX.info('Top Right', { position: 'top-right' });     // Default
NotifyX.info('Top Left', { position: 'top-left' });
NotifyX.info('Bottom Right', { position: 'bottom-right' });
NotifyX.info('Bottom Left', { position: 'bottom-left' });
```

### Constants

```javascript
import { POSITIONS, ANIMATION_CLASSES, DEFAULT_OPTIONS } from 'notifyx';

// Use constants for better code
NotifyX.show({
  message: 'Hello',
  position: POSITIONS.BOTTOM_RIGHT,
  duration: DEFAULT_OPTIONS.duration
});
```

## 🎨 Customization

### CSS Customization

```css
/* Override default styles */
.notifyx {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.notifyx-success {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.notifyx-error {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}
```

### Dark Mode Support

NotifyX automatically detects and adapts to dark mode:

```css
/* Custom dark mode styles */
@media (prefers-color-scheme: dark) {
  .notifyx {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
```

### Animation Customization

```css
/* Custom animations */
@keyframes slideInFromTop {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.notifyx-enter {
  animation: slideInFromTop 0.5s ease-out;
}
```

## 🔧 Advanced Usage

### Persistent Notifications

```javascript
// Notification that stays until manually dismissed
NotifyX.show({
  message: 'Please complete your profile setup',
  type: 'warning',
  duration: 0, // Persistent
  dismissible: true
});
```

### Custom Close Callbacks

```javascript
NotifyX.show({
  message: 'Processing your request...',
  type: 'info',
  duration: 3000,
  onClose: () => {
    console.log('Processing notification closed');
    // Perform cleanup or additional actions
  }
});
```

### Multiple Notifications

```javascript
// Show multiple notifications
NotifyX.success('Step 1 completed');
setTimeout(() => NotifyX.info('Step 2 in progress...'), 1000);
setTimeout(() => NotifyX.success('All steps completed!'), 2000);
```

### Integration with Frameworks

#### React Example

```jsx
import { useEffect } from 'react';
import NotifyX from 'notifyx';

function MyComponent() {
  useEffect(() => {
    NotifyX.success('Component mounted successfully!');
  }, []);

  const handleClick = () => {
    NotifyX.info('Button clicked!');
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

#### Vue Example

```vue
<template>
  <button @click="showNotification">Show Toast</button>
</template>

<script setup>
import NotifyX from 'notifyx';

const showNotification = () => {
  NotifyX.success('Vue component notification!');
};
</script>
```

## 🌐 Browser Support

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+
- ✅ Mobile browsers

## 📦 Bundle Size

- **Minified**: ~3KB
- **Minified + Gzipped**: ~1.2KB
- **Zero dependencies**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern toast libraries
- Built with ❤️ for the developer community

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/awalhadi">A Awal Hadi</a></p>
  <p>
    <a href="https://www.npmjs.com/package/notifyx">📦 npm</a> •
    <a href="https://github.com/awalhadi/notifyx">🐙 GitHub</a> •
    <a href="https://github.com/awalhadi/notifyx/issues">🐛 Issues</a>
  </p>
</div>

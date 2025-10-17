# 🚀 NotifyX

> **A modern, lightweight toast notification library with beautiful Tailwind CSS styles and zero runtime dependencies**

[![npm](https://img.shields.io/npm/v/notifyx)](https://www.npmjs.com/package/notifyx)

[![bundle size](https://img.shields.io/bundlephobia/min/notifyx)](https://bundlephobia.com/package/notifyx)

[![license](https://img.shields.io/npm/l/notifyx)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## ✨ Features

- 🎯 **Framework Agnostic** - Works with React, Vue, Angular, Svelte, or vanilla JS
- 🎨 **Beautiful Design** - Modern UI with Tailwind CSS styles and smooth animations
- 🌙 **Dark Mode Ready** - Automatic dark mode detection and styling
- ⚡ **Lightweight** - Minimal bundle size with no runtime dependencies
- 🔧 **TypeScript Ready** - Full type definitions included
- ♿ **Accessible** - ARIA attributes and keyboard navigation support
- 📱 **Responsive** - Perfect on all screen sizes
- 🎭 **Smooth Animations** - CSS-based animations with fallbacks
- 🎛️ **Highly Customizable** - Easy to style and configure

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
  onClose: () => console.log('Toast closed!'),
});

// Clear all notifications
NotifyX.clear();
```

## 📚 API Reference

### Methods

| Method                               | Description                 | Parameters                       |
| ------------------------------------ | --------------------------- | -------------------------------- |
| `NotifyX.show(options)`              | Display custom notification | `ToastOptions`                   |
| `NotifyX.success(message, options?)` | Success notification        | `string, Partial<ToastOptions>?` |
| `NotifyX.error(message, options?)`   | Error notification          | `string, Partial<ToastOptions>?` |
| `NotifyX.warning(message, options?)` | Warning notification        | `string, Partial<ToastOptions>?` |
| `NotifyX.info(message, options?)`    | Info notification           | `string, Partial<ToastOptions>?` |
| `NotifyX.clear()`                    | Clear all notifications     | None                             |

### Using TypeScript

NotifyX is written in TypeScript and includes full type definitions. You can import the `ToastOptions` and `ToastType` types for a better development experience.

```typescript
import NotifyX, { ToastOptionsType, ToastType } from 'notifyx';

// Define options with the ToastOptionsType type
const options: ToastOptionsType = {
  message: 'This is a typed notification!',
  type: 'success',
  position: 'bottom-right',
  duration: 5000,
  dismissible: true,
  onClose: () => console.log('Toast closed!'),
};

// Show the notification
NotifyX.show(options);

// You can also define the type for simpler notifications
const toastType: ToastType = 'info';

NotifyX.show({
  message: 'Just a simple info toast.',
  type: toastType,
});
```

### Default Options

```typescript
const DEFAULT_OPTIONS = {
  type: 'info',
  duration: 3000,
  position: 'top-right',
  dismissible: true,
  maxToasts: 5,
};
```

### Available Constants

```typescript
import { POSITIONS, ANIMATION_CLASSES, DEFAULT_OPTIONS } from 'notifyx';

// Position constants
POSITIONS.TOP_RIGHT; // 'top-right'
POSITIONS.TOP_LEFT; // 'top-left'
POSITIONS.BOTTOM_RIGHT; // 'bottom-right'
POSITIONS.BOTTOM_LEFT; // 'bottom-left'

// Animation classes
ANIMATION_CLASSES.enter; // 'notifyx-enter'
ANIMATION_CLASSES.exit; // 'notifyx-exit'
ANIMATION_CLASSES.slideEnter; // 'notifyx-slide-enter'
ANIMATION_CLASSES.slideExit; // 'notifyx-slide-exit'
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
// Form submission with validation
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
// API success/error handling
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
  navigator.clipboard
    .writeText(text)
    .then(() => {
      NotifyX.success('Copied to clipboard!');
    })
    .catch(() => {
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

## 🎨 Customization

### CSS Customization

The library uses Tailwind CSS classes, so you can easily customize the appearance:

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

/* Custom dark mode styles */
@media (prefers-color-scheme: dark) {
  .notifyx {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
```

### Position Examples

```javascript
// Available positions
NotifyX.info('Top Right', { position: 'top-right' }); // Default
NotifyX.info('Top Left', { position: 'top-left' });
NotifyX.info('Bottom Right', { position: 'bottom-right' });
NotifyX.info('Bottom Left', { position: 'bottom-left' });

// Using constants
import { POSITIONS } from 'notifyx';
NotifyX.success('Success!', { position: POSITIONS.BOTTOM_RIGHT });
```

### Duration Control

```javascript
// Auto-dismiss after 5 seconds
NotifyX.info('This will disappear in 5 seconds', { duration: 5000 });

// Persistent notification (no auto-dismiss)
NotifyX.warning('Important: Please save your work', { duration: 0 });

// Quick notification (1 second)
NotifyX.success('Copied!', { duration: 1000 });
```

## 🔧 HTML Integration
```jsx
<link rel="stylesheet" href="https://unpkg.com/notifyx@latest/dist/notifyx.min.css">

<script href="https://unpkg.com/notifyx@latest/dist/notifyx.min.js" />

<script>
  function showNotification(message) {
    NotifyX.info(message);
  }
</script>

```


## 🔧 Framework Integration

### React

```jsx
import { useEffect } from 'react';
import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';

function MyComponent() {
  const handleSuccess = () => {
    NotifyX.success('Operation completed!');
  };

  return <button onClick={handleSuccess}>Show Success Toast</button>;
}
```

### Vue

```vue
<template>
  <button @click="showToast">Show Toast</button>
</template>

<script setup>
import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';

const showToast = () => {
  NotifyX.success('Vue toast notification!');
};
</script>
```

### Angular

```typescript
import { Component } from '@angular/core';
import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';

@Component({
  selector: 'app-my-component',
  template: '<button (click)="showToast()">Show Toast</button>',
})
export class MyComponent {
  showToast() {
    NotifyX.success('Angular toast notification!');
  }
}
```

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Tailwind CSS](https://tailwindcss.com/) for beautiful styling
- Inspired by modern notification libraries
- Thanks to all contributors and users!

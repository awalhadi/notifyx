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

```bash
npm install notifyx
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



## License

MIT License - see LICENSE file for details.

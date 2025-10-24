<div align="center">

# 🚀 NotifyX

### Beautiful Toast Notifications for Modern Web Apps

**A lightweight, framework-agnostic notification library with zero dependencies**

[![npm version](https://img.shields.io/npm/v/notifyx?color=success&style=flat-square)](https://www.npmjs.com/package/notifyx)
[![npm downloads](https://img.shields.io/npm/dm/notifyx?style=flat-square)](https://www.npmjs.com/package/notifyx)
[![bundle size](https://img.shields.io/bundlephobia/minzip/notifyx?style=flat-square)](https://bundlephobia.com/package/notifyx)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/notifyx?style=flat-square)](LICENSE)

[Demo](https://github.com/awalhadi/notifyx) • [Installation](#-installation) • [Quick Start](#-quick-start) • [Examples](#-real-world-examples) • [API](#-complete-api-reference)

</div>

---

## ✨ Why NotifyX?

**NotifyX** is designed for developers who want beautiful, accessible toast notifications without the bloat. Here's what makes it special:

- 🎯 **Universal** - Works seamlessly with React, Next.js, Vue, Angular, Svelte, Laravel, or plain JavaScript
- ⚡ **Tiny Bundle** - Less than 3KB gzipped with zero runtime dependencies
- 🎨 **Beautiful by Default** - Gorgeous Tailwind CSS styles with smooth animations
- 🌙 **Dark Mode** - Automatic dark mode detection and beautiful theming
- 📘 **TypeScript First** - Built with TypeScript, includes complete type definitions
- ♿ **Accessible** - WCAG compliant with ARIA attributes and keyboard support
- 🎛️ **Flexible** - Four toast types, four positions, customizable duration, and easy styling
- 🚀 **Production Ready** - Battle-tested with comprehensive error handling

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

---

## 📦 Installation

Choose your favorite package manager:

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

**Or use via CDN** (for vanilla JavaScript projects):

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/notifyx@latest/dist/notifyx.min.css" />

<!-- JavaScript -->
<script src="https://unpkg.com/notifyx@latest/dist/notifyx.min.js"></script>
```

---

## 🚀 Quick Start

### Your First Notification in 30 Seconds

**Step 1:** Import NotifyX and its styles

```javascript
import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';
```

**Step 2:** Show your first notification

```javascript
NotifyX.success('Welcome to NotifyX! 🎉');
```

That's it! You now have beautiful toast notifications.

---

## 🎯 Four Types of Notifications

NotifyX provides four notification types for different scenarios:

```javascript
// ✅ Success - For positive outcomes
NotifyX.success('Payment completed successfully!');

// ❌ Error - For errors and failures
NotifyX.error('Failed to upload file. Please try again.');

// ⚠️ Warning - For important alerts
NotifyX.warning('Your session will expire in 5 minutes.');

// ℹ️ Info - For general information
NotifyX.info('New features are now available!');
```

### Visual Guide

| Type | When to Use | Example |
|------|-------------|---------|
| **Success** | Successful operations, confirmations | "Settings saved", "File uploaded" |
| **Error** | Errors, failures, validation issues | "Network error", "Invalid input" |
| **Warning** | Important warnings, cautions | "Low storage", "Unsaved changes" |
| **Info** | General information, updates | "New message", "System update" |

---

## 📍 Position Your Notifications

Place notifications in any corner of the screen:

```javascript
// Top positions (default: top-right)
NotifyX.info('Top Right Position', { position: 'top-right' });
NotifyX.info('Top Left Position', { position: 'top-left' });

// Bottom positions
NotifyX.info('Bottom Right Position', { position: 'bottom-right' });
NotifyX.info('Bottom Left Position', { position: 'bottom-left' });
```

**Pro Tip:** Use constants for better code maintainability:

```javascript
import NotifyX, { POSITIONS } from 'notifyx';

NotifyX.success('Saved!', { position: POSITIONS.BOTTOM_RIGHT });
NotifyX.error('Error!', { position: POSITIONS.TOP_LEFT });
```

---

## ⏱️ Control Duration

Customize how long notifications stay visible:

```javascript
// Quick notification (1 second)
NotifyX.success('Copied!', { duration: 1000 });

// Standard notification (3 seconds - default)
NotifyX.info('Processing your request...');

// Longer notification (10 seconds)
NotifyX.warning('Please read this carefully!', { duration: 10000 });

// Persistent notification (stays until manually dismissed)
NotifyX.error('Critical error - action required', { duration: 0 });
```

**Duration Quick Reference:**
- `duration: 1000` - 1 second (quick actions)
- `duration: 3000` - 3 seconds (default)
- `duration: 5000` - 5 seconds (important info)
- `duration: 0` - Persistent (manual dismiss only)

---

## 🎨 Advanced Configuration

For complete control, use the `show()` method with custom options:

```javascript
NotifyX.show({
  message: 'User profile updated successfully!',
  type: 'success',
  position: 'bottom-right',
  duration: 5000,
  dismissible: true,
  onClose: () => {
    console.log('Notification was closed');
    // Perform cleanup or tracking
  }
});
```

### All Available Options

```typescript
{
  message: string;       // The notification message (required)
  type: string;          // 'success' | 'error' | 'warning' | 'info'
  position: string;      // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  duration: number;      // Milliseconds (0 = persistent)
  dismissible: boolean;  // Show close button (default: true)
  onClose: () => void;   // Callback when notification closes
  maxToasts: number;     // Maximum simultaneous toasts (default: 5)
}
```

---

## 💼 Real-World Examples

### Example 1: Form Validation

```javascript
function handleFormSubmit(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Validate email
  if (!email || !email.includes('@')) {
    NotifyX.error('Please enter a valid email address');
    return;
  }
  
  // Validate password
  if (!password || password.length < 8) {
    NotifyX.error('Password must be at least 8 characters');
    return;
  }
  
  // Success
  NotifyX.success('Account created successfully! 🎉');
}
```

### Example 2: API Calls with Async/Await

```javascript
async function fetchUserData(userId) {
  try {
    // Show loading state
    NotifyX.info('Loading user data...', { duration: 0 });
    
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    const data = await response.json();
    
    // Clear loading and show success
    NotifyX.clear();
    NotifyX.success(`Welcome back, ${data.name}!`);
    
    return data;
  } catch (error) {
    NotifyX.clear();
    NotifyX.error('Unable to load user data. Please try again.');
    console.error(error);
  }
}
```

### Example 3: Copy to Clipboard

```javascript
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      NotifyX.success('Copied to clipboard!', { 
        duration: 2000,
        position: 'bottom-right' 
      });
    })
    .catch(() => {
      NotifyX.error('Failed to copy. Please try again.');
    });
}

// Usage
document.querySelector('#copy-btn').addEventListener('click', () => {
  copyToClipboard('Hello, NotifyX!');
});
```

### Example 4: File Upload Progress

```javascript
async function uploadFile(file) {
  // Show initial notification
  NotifyX.info('Uploading file...', { duration: 0 });
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      NotifyX.clear();
      NotifyX.success(`${file.name} uploaded successfully!`);
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    NotifyX.clear();
    NotifyX.error('Upload failed. Please try again.');
  }
}
```

### Example 5: Delete Confirmation with Callback

```javascript
function deleteItem(itemId, itemName) {
  if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
    NotifyX.info('Deleting...', { duration: 0 });
    
    fetch(`/api/items/${itemId}`, { method: 'DELETE' })
      .then(() => {
        NotifyX.clear();
        NotifyX.success('Item deleted successfully', {
          duration: 3000,
          onClose: () => {
            // Refresh the list after notification closes
            refreshItemList();
          }
        });
      })
      .catch(() => {
        NotifyX.clear();
        NotifyX.error('Failed to delete item');
      });
  }
}
```

### Example 6: Multiple Notifications Management

```javascript
function performBatchOperation(items) {
  let successCount = 0;
  let errorCount = 0;
  
  items.forEach(async (item, index) => {
    try {
      await processItem(item);
      successCount++;
      
      // Show progress
      NotifyX.info(`Processing: ${index + 1} of ${items.length}`);
    } catch (error) {
      errorCount++;
    }
  });
  
  // Show final summary
  setTimeout(() => {
    NotifyX.clear(); // Clear progress notifications
    
    if (errorCount === 0) {
      NotifyX.success(`All ${successCount} items processed successfully!`);
    } else {
      NotifyX.warning(`Completed with ${successCount} success, ${errorCount} errors`);
    }
  }, 2000);
}
```

---

## 🌐 Framework Integration Guide

### React Toast Notifications

#### Basic React Example

```jsx
import React from 'react';
import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';

function App() {
  const handleClick = () => {
    NotifyX.success('Button clicked!');
  };

  return (
    <div>
      <button onClick={handleClick}>Show Notification</button>
    </div>
  );
}

export default App;
```

#### React with Custom Hook

```jsx
import { useCallback } from 'react';
import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';

// Custom hook for notifications
function useNotification() {
  const showSuccess = useCallback((message) => {
    NotifyX.success(message);
  }, []);

  const showError = useCallback((message) => {
    NotifyX.error(message);
  }, []);

  const showWarning = useCallback((message) => {
    NotifyX.warning(message);
  }, []);

  const showInfo = useCallback((message) => {
    NotifyX.info(message);
  }, []);

  return { showSuccess, showError, showWarning, showInfo };
}

// Usage in component
function MyComponent() {
  const notify = useNotification();

  const handleSave = () => {
    notify.showSuccess('Changes saved!');
  };

  return <button onClick={handleSave}>Save</button>;
}
```

---

### Next.js Toast Notifications

#### Next.js 13+ App Router (Recommended)

**Step 1:** Create a client component for notifications

```tsx
// app/components/ToastButton.tsx
'use client';

import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';

export default function ToastButton() {
  return (
    <button 
      onClick={() => NotifyX.success('Hello from Next.js!')}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Show Notification
    </button>
  );
}
```

**Step 2:** Import styles in your root layout

```tsx
// app/layout.tsx
import 'notifyx/dist/notifyx.min.css';
import './globals.css';

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Step 3:** Use the component in your pages

```tsx
// app/page.tsx
import ToastButton from './components/ToastButton';

export default function Home() {
  return (
    <main>
      <h1>My Next.js App</h1>
      <ToastButton />
    </main>
  );
}
```

#### Next.js Pages Router

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import 'notifyx/dist/notifyx.min.css';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

```tsx
// pages/index.tsx
import NotifyX from 'notifyx';

export default function Home() {
  return (
    <button onClick={() => NotifyX.success('Next.js Pages Router!')}>
      Show Toast
    </button>
  );
}
```

#### Next.js API Route Integration

```typescript
// app/api/save/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Process data...
    
    return NextResponse.json({ 
      success: true, 
      message: 'Data saved successfully!' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to save data' 
    }, { status: 500 });
  }
}
```

```tsx
// Client component using the API
'use client';

import NotifyX from 'notifyx';

export default function SaveButton() {
  const handleSave = async () => {
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ data: 'example' })
      });
      
      const result = await response.json();
      
      if (result.success) {
        NotifyX.success(result.message);
      } else {
        NotifyX.error(result.message);
      }
    } catch (error) {
      NotifyX.error('Network error occurred');
    }
  };

  return <button onClick={handleSave}>Save Data</button>;
}
```

---

### Vue Toast Notifications

#### Vue 3 Composition API

```vue
<template>
  <div>
    <button @click="showSuccess">Success</button>
    <button @click="showError">Error</button>
    <button @click="showWarning">Warning</button>
    <button @click="showInfo">Info</button>
  </div>
</template>

<script setup>
import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';

const showSuccess = () => {
  NotifyX.success('Operation successful!');
};

const showError = () => {
  NotifyX.error('Something went wrong!');
};

const showWarning = () => {
  NotifyX.warning('Please be careful!');
};

const showInfo = () => {
  NotifyX.info('Here is some information.');
};
</script>
```

#### Vue 3 with Composable

```typescript
// composables/useNotify.ts
import NotifyX from 'notifyx';

export function useNotify() {
  const success = (message: string) => NotifyX.success(message);
  const error = (message: string) => NotifyX.error(message);
  const warning = (message: string) => NotifyX.warning(message);
  const info = (message: string) => NotifyX.info(message);

  return { success, error, warning, info };
}
```

```vue
<template>
  <button @click="notify.success('Saved successfully!')">Save</button>
</template>

<script setup>
import { useNotify } from '@/composables/useNotify';

const notify = useNotify();
</script>
```

---

### Angular Toast Notifications

#### Basic Angular Integration

```typescript
// app.component.ts
import { Component } from '@angular/core';
import NotifyX from 'notifyx';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="showNotification()">Show Toast</button>
  `,
  styles: []
})
export class AppComponent {
  showNotification() {
    NotifyX.success('Hello from Angular!');
  }
}
```

#### Import styles in angular.json

```json
{
  "styles": [
    "src/styles.css",
    "node_modules/notifyx/dist/notifyx.min.css"
  ]
}
```

#### Angular Service for Notifications

```typescript
// services/notification.service.ts
import { Injectable } from '@angular/core';
import NotifyX from 'notifyx';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  success(message: string) {
    NotifyX.success(message);
  }

  error(message: string) {
    NotifyX.error(message);
  }

  warning(message: string) {
    NotifyX.warning(message);
  }

  info(message: string) {
    NotifyX.info(message);
  }

  clear() {
    NotifyX.clear();
  }
}
```

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  template: `<button (click)="save()">Save</button>`
})
export class AppComponent {
  constructor(private notification: NotificationService) {}

  save() {
    this.notification.success('Saved successfully!');
  }
}
```

---

### Laravel Toast Notifications

#### Option 1: Laravel with Vite (Recommended)

**Step 1:** Install NotifyX

```bash
npm install notifyx
```

**Step 2:** Import in your main JavaScript file

```javascript
// resources/js/app.js
import NotifyX from 'notifyx';
import 'notifyx/dist/notifyx.min.css';

// Make NotifyX globally available
window.NotifyX = NotifyX;

// Example helper function
window.showToast = (message, type = 'info') => {
  NotifyX[type](message);
};
```

**Step 3:** Use in Blade templates

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>My Laravel App</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    @yield('content')
    
    {{-- Flash messages --}}
    @if(session('success'))
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                NotifyX.success('{{ session('success') }}');
            });
        </script>
    @endif
    
    @if(session('error'))
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                NotifyX.error('{{ session('error') }}');
            });
        </script>
    @endif
</body>
</html>
```

```blade
{{-- resources/views/posts/create.blade.php --}}
@extends('layouts.app')

@section('content')
<form action="/posts" method="POST" onsubmit="handleSubmit(event)">
    @csrf
    <input type="text" name="title" required>
    <button type="submit">Create Post</button>
</form>

<script>
function handleSubmit(event) {
    // Client-side notification
    showToast('Creating post...', 'info');
}
</script>
@endsection
```

#### Option 2: Laravel with CDN

```blade
{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>My Laravel App</title>
    <link rel="stylesheet" href="https://unpkg.com/notifyx@latest/dist/notifyx.min.css">
</head>
<body>
    @yield('content')
    
    <script src="https://unpkg.com/notifyx@latest/dist/notifyx.min.js"></script>
    
    {{-- Laravel flash messages --}}
    @if(session('success'))
        <script>NotifyX.success('{{ session('success') }}');</script>
    @endif
    
    @if(session('error'))
        <script>NotifyX.error('{{ session('error') }}');</script>
    @endif
</body>
</html>
```

#### Laravel Controller with Flash Messages

```php
// app/Http/Controllers/PostController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|max:255',
            'content' => 'required',
        ]);

        // Save post...
        
        return redirect('/posts')
            ->with('success', 'Post created successfully!');
    }

    public function destroy($id)
    {
        try {
            // Delete post...
            
            return redirect('/posts')
                ->with('success', 'Post deleted successfully!');
        } catch (\Exception $e) {
            return redirect('/posts')
                ->with('error', 'Failed to delete post.');
        }
    }
}
```

---

### Vanilla JavaScript / HTML (CDN)

Perfect for static sites, WordPress, or any HTML page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NotifyX Demo</title>
    
    <!-- NotifyX CSS -->
    <link rel="stylesheet" href="https://unpkg.com/notifyx@latest/dist/notifyx.min.css">
</head>
<body>
    <h1>NotifyX Vanilla JS Demo</h1>
    
    <button onclick="NotifyX.success('Success!')">Success</button>
    <button onclick="NotifyX.error('Error!')">Error</button>
    <button onclick="NotifyX.warning('Warning!')">Warning</button>
    <button onclick="NotifyX.info('Info!')">Info</button>
    <button onclick="NotifyX.clear()">Clear All</button>
    
    <!-- NotifyX JavaScript -->
    <script src="https://unpkg.com/notifyx@latest/dist/notifyx.min.js"></script>
    
    <script>
        // Show welcome message on page load
        window.addEventListener('DOMContentLoaded', () => {
            NotifyX.info('Welcome! Click any button to see notifications.', {
                duration: 5000,
                position: 'top-right'
            });
        });
        
        // Custom function with configuration
        function showCustomToast() {
            NotifyX.show({
                message: 'Custom notification with all options!',
                type: 'success',
                position: 'bottom-right',
                duration: 4000,
                dismissible: true,
                onClose: () => console.log('Toast closed!')
            });
        }
    </script>
</body>
</html>
```

---

## 📘 Complete API Reference

### Methods

#### `NotifyX.show(options)`

Display a notification with full configuration options.

**Parameters:**
- `options` (object) - Configuration object

**Example:**
```javascript
NotifyX.show({
  message: 'Profile updated!',
  type: 'success',
  position: 'bottom-right',
  duration: 5000,
  dismissible: true,
  onClose: () => console.log('Closed'),
  maxToasts: 5
});
```

---

#### `NotifyX.success(message, options?)`

Show a success notification.

**Parameters:**
- `message` (string) - Notification message
- `options` (object, optional) - Override default options

**Example:**
```javascript
NotifyX.success('File uploaded successfully!');
NotifyX.success('Saved!', { duration: 2000, position: 'bottom-right' });
```

---

#### `NotifyX.error(message, options?)`

Show an error notification.

**Parameters:**
- `message` (string) - Error message
- `options` (object, optional) - Override default options

**Example:**
```javascript
NotifyX.error('Failed to connect to server');
NotifyX.error('Invalid credentials', { duration: 5000 });
```

---

#### `NotifyX.warning(message, options?)`

Show a warning notification.

**Parameters:**
- `message` (string) - Warning message
- `options` (object, optional) - Override default options

**Example:**
```javascript
NotifyX.warning('Your session will expire soon');
NotifyX.warning('Unsaved changes', { duration: 0 }); // Persistent
```

---

#### `NotifyX.info(message, options?)`

Show an info notification.

**Parameters:**
- `message` (string) - Info message
- `options` (object, optional) - Override default options

**Example:**
```javascript
NotifyX.info('New features available!');
NotifyX.info('Loading...', { duration: 0 }); // Stays until cleared
```

---

#### `NotifyX.clear()`

Remove all active notifications immediately.

**Example:**
```javascript
NotifyX.clear(); // Removes all toasts
```

---

### TypeScript Support

NotifyX is built with TypeScript and exports comprehensive types:

```typescript
import NotifyX, { 
  ToastOptions, 
  ToastType, 
  Position,
  POSITIONS,
  DEFAULT_OPTIONS
} from 'notifyx';

// Type-safe notification
const options: ToastOptions = {
  message: 'Type-safe notification!',
  type: 'success',
  position: 'top-right',
  duration: 3000,
  dismissible: true,
  onClose: () => console.log('Closed')
};

NotifyX.show(options);

// Using type unions
const notificationType: ToastType = 'error';
const notificationPosition: Position = POSITIONS.BOTTOM_LEFT;

NotifyX.show({
  message: 'Using TypeScript types',
  type: notificationType,
  position: notificationPosition
});
```

#### Available Types

```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info';

type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: Position;
  dismissible?: boolean;
  onClose?: () => void;
  maxToasts?: number;
}
```

---

### Constants

#### `POSITIONS`

Predefined position constants for type safety:

```javascript
import { POSITIONS } from 'notifyx';

POSITIONS.TOP_RIGHT     // 'top-right'
POSITIONS.TOP_LEFT      // 'top-left'
POSITIONS.BOTTOM_RIGHT  // 'bottom-right'
POSITIONS.BOTTOM_LEFT   // 'bottom-left'
```

#### `DEFAULT_OPTIONS`

Default configuration values:

```javascript
import { DEFAULT_OPTIONS } from 'notifyx';

console.log(DEFAULT_OPTIONS);
// {
//   type: 'info',
//   duration: 3000,
//   position: 'top-right',
//   dismissible: true,
//   maxToasts: 5
// }
```

#### `ANIMATION_CLASSES`

CSS animation class names:

```javascript
import { ANIMATION_CLASSES } from 'notifyx';

ANIMATION_CLASSES.enter       // 'notifyx-enter'
ANIMATION_CLASSES.exit        // 'notifyx-exit'
ANIMATION_CLASSES.slideEnter  // 'notifyx-slide-enter'
ANIMATION_CLASSES.slideExit   // 'notifyx-slide-exit'
```

---

## 🎨 Customization & Theming

### Custom CSS Styling

Override default styles with your own CSS:

```css
/* Custom toast container positioning */
.notifyx-container[data-position="top-right"] {
  top: 20px;
  right: 20px;
}

/* Custom toast appearance */
.notifyx {
  border-radius: 12px;
  padding: 16px 20px;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

/* Success toast gradient */
.notifyx-success {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

/* Error toast gradient */
.notifyx-error {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
}

/* Warning toast */
.notifyx-warning {
  background: #fbbf24;
  color: #78350f;
  border: 2px solid #f59e0b;
}

/* Info toast */
.notifyx-info {
  background: #3b82f6;
  color: white;
  border: none;
}

/* Customize close button */
.notifyx-close {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
}

.notifyx-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Dark mode custom styles */
@media (prefers-color-scheme: dark) {
  .notifyx {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  
  .notifyx-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
}

/* Custom animations */
@keyframes customSlideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notifyx-enter {
  animation: customSlideIn 0.3s ease-out;
}
```

### Tailwind CSS Integration

Extend NotifyX styles with Tailwind classes:

```javascript
// After showing a toast, add Tailwind classes
const toast = document.querySelector('.notifyx:last-child');
toast.classList.add('backdrop-blur-md', 'shadow-2xl', 'ring-2', 'ring-blue-500');
```

Or create a wrapper function:

```javascript
function showStyledToast(message, type = 'info') {
  NotifyX[type](message);
  
  setTimeout(() => {
    const toast = document.querySelector('.notifyx:last-child');
    if (toast) {
      toast.classList.add('backdrop-blur-md', 'shadow-2xl');
    }
  }, 10);
}
```

---

## ⚡ Performance Tips

1. **Limit Maximum Toasts**: Control memory usage
   ```javascript
   NotifyX.show({ message: 'Hello', maxToasts: 3 });
   ```

2. **Clear Old Notifications**: Remove unnecessary toasts
   ```javascript
   NotifyX.clear(); // Clear all before showing new batch
   ```

3. **Use Appropriate Durations**: Don't keep toasts open unnecessarily
   ```javascript
   // Quick actions
   NotifyX.success('Copied!', { duration: 1000 });
   
   // Important info
   NotifyX.warning('Read carefully', { duration: 5000 });
   ```

4. **Batch Operations**: Clear between batches
   ```javascript
   function processBatch() {
     NotifyX.clear(); // Clear previous
     NotifyX.info('Processing batch...');
   }
   ```

---

## 🐛 Troubleshooting

### Styles Not Showing

**Problem**: Notifications appear but have no styles.

**Solution**: Make sure you've imported the CSS:
```javascript
import 'notifyx/dist/notifyx.min.css';
```

For CDN:
```html
<link rel="stylesheet" href="https://unpkg.com/notifyx@latest/dist/notifyx.min.css">
```

---

### NotifyX is Not Defined (Vanilla JS)

**Problem**: `ReferenceError: NotifyX is not defined`

**Solution**: Ensure the script is loaded before use:
```html
<script src="https://unpkg.com/notifyx@latest/dist/notifyx.min.js"></script>
<script>
  // Now you can use NotifyX
  NotifyX.success('Works!');
</script>
```

---

### Next.js "window is not defined"

**Problem**: Error during server-side rendering.

**Solution**: Use client components:
```tsx
'use client'; // Add this at the top

import NotifyX from 'notifyx';
```

---

### Multiple Instances in React

**Problem**: Multiple toasts appear on re-renders.

**Solution**: Use `useCallback` or `useMemo`:
```jsx
const showToast = useCallback(() => {
  NotifyX.success('Success!');
}, []);
```

---

## 📱 Browser Compatibility

NotifyX works on all modern browsers:

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 12+ |
| Edge | 79+ |
| Opera | 47+ |
| Samsung Internet | 8+ |

**Mobile Support**: ✅ iOS Safari 12+, Chrome Mobile, Firefox Mobile

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs**: [Open an issue](https://github.com/awalhadi/notifyx/issues)
2. **Suggest Features**: [Start a discussion](https://github.com/awalhadi/notifyx/discussions)
3. **Submit PRs**: Fork, create a branch, and submit a pull request
4. **Improve Docs**: Help us make this README even better!

### Development Setup

```bash
# Clone the repository
git clone https://github.com/awalhadi/notifyx.git
cd notifyx

# Install dependencies
npm install

# Build the project
npm run build

# Run development server
npm run dev
```

---

## 📄 License

MIT License - feel free to use NotifyX in your personal and commercial projects!

Copyright (c) 2025 A Awal Hadi

---

## 🙏 Acknowledgments

- Built with ❤️ using [TypeScript](https://www.typescriptlang.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Bundled with [Vite](https://vitejs.dev/)
- Inspired by modern notification libraries

---

## 📞 Support & Community

- **GitHub**: [github.com/awalhadi/notifyx](https://github.com/awalhadi/notifyx)
- **Issues**: [Report a bug](https://github.com/awalhadi/notifyx/issues)
- **npm**: [npmjs.com/package/notifyx](https://www.npmjs.com/package/notifyx)

---

<div align="center">

**Made with ❤️ by [A Awal Hadi](https://github.com/awalhadi)**

If NotifyX helped your project, consider giving it a ⭐ on GitHub!

[⬆ Back to Top](#-notifyx)

</div>

# 🎉 NotifyX - Lightweight, Framework-Agnostic Toast Notifications  
*A simple, customizable toast library for JavaScript/TypeScript with zero dependencies.*  
[![npm](https://img.shields.io/npm/v/notifyx)](https://www.npmjs.com/package/notifyx) [![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)  

---

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
import notifyx from 'https://cdn.jsdelivr.net/npm/notifyx@2.1.1/+esm'
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
### 📚 API Reference
Methods
| Prototype        | type           | Default value  | Description |
| ------------- |:-------------:| -----:| -----:|
| message      | string | (Required) | The text to display in the toast.|
| type      | `"success", "error", "warning", "info"` |  `info` | The type of toast (e.g., success, error, warning, info).|
| duration | number | 3000  |    Duration in milliseconds before the toast auto-dismisses.
 |
|position | "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-right" | Position of the toast on the screen.|
| dismissible | boolean | true | Whether the toast can be dismissed manually by the user.
|

### Options
```typescript
interface ToastOptions {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;    // Auto-dismiss timeout (ms)
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  dismissible?: boolean; // Show close button
  onClose?: () => void;  // Callback after dismissal
}
```

### 📄 License
MIT License © 2024 [Md A Awal Hadi](https://github.com/awalhadi)
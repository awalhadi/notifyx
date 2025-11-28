# 📊 Progress Bar Feature Documentation

## Overview

NotifyX now includes a **premium progress bar indicator** that displays the remaining time for auto-dismissing toasts. The progress bar features smooth animations, hover-to-pause functionality, and a modern eye-catching design.

---

## ✨ Key Features

### 🎯 **Proportional Timing**
- Progress bar width decreases **exactly proportional** to the remaining time
- Uses CSS transitions synchronized with JavaScript setTimeout
- Perfect 1:1 correlation between visual progress and actual dismissal time

### ⏸️ **Hover Pause/Resume**
- **Hover over any toast** to pause both the timer and progress bar
- Progress bar freezes at current position
- **Move mouse away** to resume from exactly where it left off
- Smooth transition when resuming animation

### 🎨 **Premium Design**
- Positioned absolutely at the bottom of each toast
- Gradient fill with shimmer effect
- Glowing shadow matching toast type color
- Rounded corners matching toast border-radius
- 3px height for optimal visibility

### 🔧 **Optional Display**
- Control via `showProgress: true/false` option
- Enabled by default (`DEFAULT_OPTIONS.showProgress = true`)
- Only shows when `duration > 0` (persistent toasts have no progress bar)

---

## 🚀 Usage Examples

### Basic Usage (Default - Progress Bar Enabled)

```javascript
import NotifyX from 'notifyx';

// Progress bar shows by default
NotifyX.success('File uploaded!', { duration: 3000 });
```

### Explicitly Enable Progress Bar

```javascript
NotifyX.show({
  message: 'Processing your request...',
  type: 'info',
  duration: 5000,
  showProgress: true  // ✅ Shows progress bar
});
```

### Disable Progress Bar

```javascript
NotifyX.show({
  message: 'Important notification',
  type: 'warning',
  duration: 4000,
  showProgress: false  // ❌ No progress bar
});
```

### Persistent Toast (No Progress Bar)

```javascript
// No progress bar when duration is 0 (persistent)
NotifyX.error('Critical error - requires action', {
  duration: 0,
  dismissible: true
});
```

### Long Duration with Progress Bar

```javascript
// Great for testing hover pause/resume
NotifyX.info('Hover over me to pause!', {
  duration: 10000,
  showProgress: true
});
```

---

## 🎨 Design Specifications

### Visual Design
- **Height**: 3px
- **Position**: Absolute bottom of toast
- **Width**: Animates from 100% → 0%
- **Border Radius**: Matches toast bottom corners (0.75rem)
- **Background**: Type-specific gradient with glow effect

### Color Scheme by Toast Type

```css
Success (Green):  linear-gradient(90deg, #10b981, #059669) + green glow
Error (Red):      linear-gradient(90deg, #ef4444, #dc2626) + red glow
Warning (Amber):  linear-gradient(90deg, #f59e0b, #f97316) + amber glow
Info (Blue):      linear-gradient(90deg, #3b82f6, #0ea5e9) + blue glow
```

### Animation Details
- **Transition**: `width Xms linear` (X = duration)
- **Transform Origin**: Left
- **Shimmer Effect**: Animated gradient overlay (2.5s cycle)
- **Paused State**: Opacity reduced to 0.7

---

## 🔧 Implementation Details

### How It Works

1. **Initialization**
   - Progress bar created as child element when `showProgress: true` and `duration > 0`
   - Initial width set to 100%
   - CSS transition configured with exact duration

2. **Animation Start**
   - Double `requestAnimationFrame` ensures smooth start
   - Width transitions from 100% to 0% over specified duration
   - JavaScript timeout runs in parallel with CSS animation

3. **Hover Pause**
   ```javascript
   mouseenter → pause timeout → calculate remaining time → freeze progress bar width
   ```

4. **Hover Resume**
   ```javascript
   mouseleave → restart timeout with remaining time → resume progress animation
   ```

5. **Cleanup**
   - Timeout cleared when toast removed
   - Event listeners removed to prevent memory leaks
   - Progress bar transition reset

### Technical Architecture

```typescript
interface TimeoutData {
  timeoutId: number | null;      // Active setTimeout ID
  startTime: number;             // When timer started/resumed
  remainingTime: number;         // Milliseconds remaining
  isPaused: boolean;             // Current pause state
}
```

**Stored on toast element:**
```javascript
(toastElement as any).__notifyxTimeout = timeoutData;
(toastElement as any).__notifyxPauseTimer = pauseFunction;
(toastElement as any).__notifyxResumeTimer = resumeFunction;
```

---

## 🎯 User Experience Benefits

### For End Users
- **Visual Feedback**: Clear indication of how long the notification will remain
- **Control**: Ability to pause and read longer messages
- **Premium Feel**: Smooth animations and modern design
- **Accessibility**: Works with screen readers (ARIA attributes on toast)

### For Developers
- **Simple API**: Single boolean flag to control
- **Type Safe**: Full TypeScript support
- **Customizable**: Easy to override CSS if needed
- **Reliable**: Exact timing synchronization guaranteed

---

## 📱 Responsive Behavior

### Mobile Devices
```css
@media (max-width: 640px) {
  .notifyx-progress {
    height: 2.5px;  /* Slightly thinner on mobile */
  }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* Progress bar disabled for accessibility */
  .notifyx-progress-bar {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## 🐛 Known Limitations

1. **Persistent Toasts**: Progress bar never shows when `duration: 0`
2. **Very Short Durations**: Progress bar may be less visible for durations < 500ms
3. **Multiple Rapid Hovers**: Rapid hover on/off maintains accuracy but may look jumpy

---

## 🔮 Future Enhancements (Potential)

- [ ] Custom progress bar colors via option
- [ ] Vertical progress bar option (left/right side)
- [ ] Stepped progress (discrete segments)
- [ ] Callback when progress reaches milestones (50%, 75%, etc.)
- [ ] Option to show remaining time as text
- [ ] Different animation easing functions

---

## 🧪 Testing Guide

### Manual Testing Checklist

```javascript
// 1. Test default behavior
NotifyX.success('Default test', { duration: 5000 });
// ✅ Progress bar should appear and animate smoothly

// 2. Test hover pause
NotifyX.info('Hover pause test', { duration: 8000 });
// ✅ Hover: bar freezes, timer pauses
// ✅ Leave: bar resumes from exact position

// 3. Test disabled
NotifyX.warning('No progress', { duration: 5000, showProgress: false });
// ✅ No progress bar visible

// 4. Test persistent
NotifyX.error('Persistent', { duration: 0 });
// ✅ No progress bar (expected for duration: 0)

// 5. Test multiple pauses
const toast = NotifyX.show({ 
  message: 'Multiple pause test', 
  duration: 10000,
  showProgress: true 
});
// ✅ Hover/leave multiple times - should maintain accuracy

// 6. Test manual close during pause
NotifyX.success('Close while paused', { duration: 8000 });
// ✅ Hover to pause, then click close button - should work
```

### Performance Testing

```javascript
// Stress test: Multiple toasts with progress bars
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    NotifyX.info(`Toast ${i + 1}`, { duration: 6000, showProgress: true });
  }, i * 500);
}
// ✅ All progress bars should animate independently
// ✅ No performance degradation
```

---

## 📚 API Reference

### Type Definition

```typescript
interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;           // Milliseconds (0 = persistent)
  position?: Position;
  dismissible?: boolean;
  showProgress?: boolean;      // 🆕 Show progress bar
  onClose?: () => void;
  maxToasts?: number;
}
```

### Default Value

```typescript
const DEFAULT_OPTIONS = {
  type: 'info',
  duration: 3000,
  showProgress: true,     // 🆕 Enabled by default
  position: 'top-right',
  dismissible: true,
  maxToasts: 5
};
```

---

## 🎨 Customization

### Override Progress Bar Styles

```css
/* Custom progress bar height */
.notifyx-progress-bar {
  height: 4px !important;
}

/* Custom color for success toasts */
.notifyx-success .notifyx-progress-bar {
  background: linear-gradient(90deg, #22c55e, #16a34a) !important;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.6) !important;
}

/* Remove shimmer effect */
.notifyx-progress-bar::before {
  display: none;
}

/* Custom pause opacity */
.notifyx-progress-bar[style*="paused"] {
  opacity: 0.5 !important;
}
```

---

## 🏆 Best Practices

### When to Use Progress Bar

✅ **Use when:**
- Duration is 3+ seconds (gives user time to see it)
- User needs to know how long notification will remain
- Creating a premium, polished user experience
- Notification contains important information worth pausing for

❌ **Consider disabling when:**
- Very short durations (< 1 second)
- Persistent notifications (duration: 0)
- Minimal/subtle design aesthetic preferred
- Performance-critical environments (though impact is negligible)

### Recommended Durations

```javascript
// Quick actions (with progress)
NotifyX.success('Copied!', { duration: 2000, showProgress: true });

// Standard notifications (with progress)
NotifyX.info('Processing...', { duration: 4000, showProgress: true });

// Important messages (with progress, longer duration)
NotifyX.warning('Review carefully', { duration: 8000, showProgress: true });

// Persistent (no progress)
NotifyX.error('Action required', { duration: 0 });
```

---

## 🎓 Learn More

- **Live Demo**: Open `/example/index.html` in your browser
- **Source Code**: Check `src/index.ts` (setupAutoDismiss method)
- **Styles**: See `src/styles/toast.css` (.notifyx-progress-bar)
- **Types**: Refer to `src/types/index.ts` (ToastOptions interface)

---

## 📝 Changelog

### Version 2.4.0 (Current)
- ✅ Added progress bar indicator feature
- ✅ Implemented hover pause/resume functionality
- ✅ Premium UI/UX redesign with gradients and glow effects
- ✅ Proportional timing synchronization
- ✅ Optional display via `showProgress` option
- ✅ Updated demo with progress bar examples

---

## 💡 Tips & Tricks

### Show Progress Only for Long Toasts

```javascript
function smartNotify(message, type, duration) {
  NotifyX[type](message, {
    duration,
    showProgress: duration >= 3000  // Only show for 3s+
  });
}
```

### Custom Pause Indicator

```javascript
NotifyX.show({
  message: '⏸️ Hover to pause timer',
  type: 'info',
  duration: 10000,
  showProgress: true
});
```

### Track Pause Events (Advanced)

```javascript
const toast = document.querySelector('.notifyx');
toast.addEventListener('mouseenter', () => {
  console.log('Toast paused');
});
toast.addEventListener('mouseleave', () => {
  console.log('Toast resumed');
});
```

---

**Built with ❤️ by the NotifyX team**

*For questions, issues, or feature requests, visit our [GitHub repository](https://github.com/awalhadi/notifyx)*

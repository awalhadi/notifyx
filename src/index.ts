import { ToastOptions, ToastType } from './types';
import { getContainer } from './utils/dom';
import { ANIMATION_CLASSES } from './constants/animations';
import { DEFAULT_OPTIONS } from './constants/defaults';
import { POSITIONS } from './constants/positions';

// Import CSS to ensure styles are included in the build
import './styles/toast.css';

export class NotifyX {
  private static generateToastElement(options: ToastOptions): HTMLElement {
    const toast = document.createElement('div');
    toast.className = `notifyx notifyx-${options.type} ${ANIMATION_CLASSES.enter} rounded-lg border shadow-md`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    const message = document.createElement('span');
    message.className = "notifyx-msg";
    message.textContent = options.message;
    toast.appendChild(message);

    if (options.dismissible) {
      const closeButton = document.createElement('button');
      closeButton.className = 'notifyx-close';
      closeButton.innerHTML = '✕';
      closeButton.setAttribute('aria-label', 'Close notification');
      closeButton.setAttribute('type', 'button');
      closeButton.onclick = () => this.removeToast(toast);
      toast.appendChild(closeButton);
    }

    return toast;
  }

  private static removeToast(toastElement: HTMLElement): void {
    toastElement.classList.remove(ANIMATION_CLASSES.enter);
    toastElement.classList.add(ANIMATION_CLASSES.exit);

    const handleAnimationEnd = () => {
      toastElement.remove();
      toastElement.removeEventListener('animationend', handleAnimationEnd);

      // Clean up container if empty
      const container = toastElement.parentElement;
      if (container && container.childNodes.length === 0) {
        container.remove();
      }
    };

    toastElement.addEventListener('animationend', handleAnimationEnd);
  }

  public static show(options: ToastOptions): void {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const container = getContainer(mergedOptions.position!);
    const toastElement = this.generateToastElement(mergedOptions);

    // Limit number of toasts
    const existingToasts = container.querySelectorAll('.notifyx');
    if (existingToasts.length >= DEFAULT_OPTIONS.maxToasts) {
      const oldestToast = existingToasts[0];
      this.removeToast(oldestToast as HTMLElement);
    }

    container.appendChild(toastElement);

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (mergedOptions.duration && mergedOptions.duration > 0) {
      timeoutId = setTimeout(() => {
        this.removeToast(toastElement);
        mergedOptions.onClose?.();
      }, mergedOptions.duration);
    }

    // Update close button handler to clear timeout
    if (mergedOptions.dismissible) {
      const closeButton = toastElement.querySelector('.notifyx-close') as HTMLButtonElement;
      if (closeButton) {
        const originalOnClick = closeButton.onclick;
        closeButton.onclick = (e) => {
          if (timeoutId) clearTimeout(timeoutId);
          mergedOptions.onClose?.();
          if (originalOnClick) originalOnClick.call(closeButton, e);
        };
      }
    }
  }

  public static success(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'success' });
  }

  public static error(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'error' });
  }

  public static warning(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'warning' });
  }

  public static info(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'info' });
  }

  public static clear(): void {
    const containers = document.querySelectorAll('.notifyx-container');
    containers.forEach(container => {
      const toasts = container.querySelectorAll('.notifyx');
      toasts.forEach(toast => {
        this.removeToast(toast as HTMLElement);
      });
    });
  }
}

// Export constants for external use
export { ANIMATION_CLASSES, DEFAULT_OPTIONS, POSITIONS } from './constants/index';

// Check window object to avoid conflicts
if (typeof window !== 'undefined' && !(window as any).NotifyX) {
  (window as any).NotifyX = NotifyX;
}
export type { ToastOptions as ToastOptionsType, ToastType } from './types';
export default NotifyX;
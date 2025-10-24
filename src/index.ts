import type { ToastOptions, NormalizedToastOptions } from './types';
import { getContainer } from './utils/dom';
import { ANIMATION_CLASSES } from './constants/animations';
import { DEFAULT_OPTIONS } from './constants/defaults';

/**
 * NotifyX - Modern toast notification library
 * @public
 */
export class NotifyX {
  /**
   * Creates the toast DOM element with proper structure and accessibility
   * @private
   */
  private static createToastElement(options: NormalizedToastOptions): HTMLElement {
    const toast = document.createElement('div');
    toast.className = `notifyx notifyx-${options.type} ${ANIMATION_CLASSES.enter} rounded-lg border shadow-md`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    const message = document.createElement('span');
    message.className = "notifyx-msg";
    message.textContent = options.message;
    toast.appendChild(message);

    if (options.dismissible) {
      toast.appendChild(this.createCloseButton(toast));
    }

    return toast;
  }

  /**
   * Creates a close button for dismissible toasts
   * @private
   */
  private static createCloseButton(toast: HTMLElement): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'notifyx-close';
    button.innerHTML = '✕';
    button.setAttribute('aria-label', 'Close notification');
    button.setAttribute('type', 'button');
    button.onclick = () => this.removeToast(toast);
    return button;
  }

  /**
   * Removes a toast with exit animation
   * @private
   */
  private static removeToast(toastElement: HTMLElement): void {
    toastElement.classList.remove(ANIMATION_CLASSES.enter);
    toastElement.classList.add(ANIMATION_CLASSES.exit);

    const handleAnimationEnd = () => {
      toastElement.remove();
      toastElement.removeEventListener('animationend', handleAnimationEnd);
      this.cleanupEmptyContainer(toastElement.parentElement);
    };

    toastElement.addEventListener('animationend', handleAnimationEnd);
  }

  /**
   * Removes container if it has no children
   * @private
   */
  private static cleanupEmptyContainer(container: HTMLElement | null): void {
    if (container && container.childNodes.length === 0) {
      container.remove();
    }
  }

  /**
   * Manages auto-dismiss timer for a toast
   * @private
   */
  private static setupAutoDismiss(
    toastElement: HTMLElement,
    options: NormalizedToastOptions
  ): number | null {
    if (!options.duration || options.duration <= 0) return null;

    return window.setTimeout(() => {
      this.removeToast(toastElement);
      options.onClose?.();
    }, options.duration);
  }

  /**
   * Updates close button to clear timeout on manual dismiss
   * @private
   */
  private static attachCloseHandler(
    toastElement: HTMLElement,
    timeoutId: number | null,
    onClose?: () => void
  ): void {
    const closeButton = toastElement.querySelector('.notifyx-close') as HTMLButtonElement;
    if (!closeButton) return;

    const originalOnClick = closeButton.onclick;
    closeButton.onclick = (e) => {
      if (timeoutId !== null) clearTimeout(timeoutId);
      onClose?.();
      originalOnClick?.call(closeButton, e);
    };
  }

  /**
   * Enforces maximum toast limit by removing oldest
   * @private
   */
  private static enforceMaxToasts(container: HTMLElement): void {
    const existingToasts = container.querySelectorAll('.notifyx');
    if (existingToasts.length >= DEFAULT_OPTIONS.maxToasts) {
      this.removeToast(existingToasts[0] as HTMLElement);
    }
  }

  /**
   * Display a toast notification
   * @param options - Configuration for the toast
   * @public
   * @example
   * ```ts
   * NotifyX.show({
   *   message: 'Success!',
   *   type: 'success',
   *   duration: 3000
   * });
   * ```
   */
  public static show(options: ToastOptions): void {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options } as NormalizedToastOptions;
    const container = getContainer(mergedOptions.position);
    
    this.enforceMaxToasts(container);
    
    const toastElement = this.createToastElement(mergedOptions);
    container.appendChild(toastElement);

    const timeoutId = this.setupAutoDismiss(toastElement, mergedOptions);
    
    if (mergedOptions.dismissible) {
      this.attachCloseHandler(toastElement, timeoutId, mergedOptions.onClose);
    }
  }

  /**
   * Display a success toast notification
   * @param message - The message to display
   * @param options - Optional configuration overrides
   * @public
   */
  public static success(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'success' });
  }

  /**
   * Display an error toast notification
   * @param message - The message to display
   * @param options - Optional configuration overrides
   * @public
   */
  public static error(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'error' });
  }

  /**
   * Display a warning toast notification
   * @param message - The message to display
   * @param options - Optional configuration overrides
   * @public
   */
  public static warning(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'warning' });
  }

  /**
   * Display an info toast notification
   * @param message - The message to display
   * @param options - Optional configuration overrides
   * @public
   */
  public static info(message: string, options?: Partial<ToastOptions>): void {
    this.show({ ...options, message, type: 'info' });
  }

  /**
   * Clear all active toast notifications
   * @public
   */
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
export { ANIMATION_CLASSES, DEFAULT_OPTIONS, POSITIONS } from './constants';
export type { ToastOptions, ToastType, Position } from './types';

// Attach to window for UMD builds
if (typeof window !== 'undefined') {
  (window as any).NotifyX = NotifyX;
}

export default NotifyX;